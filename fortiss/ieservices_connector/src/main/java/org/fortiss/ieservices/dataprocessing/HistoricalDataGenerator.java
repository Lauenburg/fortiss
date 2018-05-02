package org.fortiss.ieservices.dataprocessing;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.fortiss.ieservices.dto.Datenpunkt;
import org.fortiss.ieservices.dto.HistoricalDayValue;
import org.fortiss.ieservices.dto.HistoricalHourValue;
import org.fortiss.ieservices.dto.HistoricalMinuteValue;
import org.fortiss.ieservices.dto.IeserviceHistorical;
import org.fortiss.ieservices.util.LocalDateTimeToTimestamp;
import org.fortiss.ieservices.util.TimestampToLocalDateTime;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

public class HistoricalDataGenerator {

	CompleteHistory data = new CompleteHistory();

	public HistoricalDataGenerator(SessionFactory sessionFactoryFromConfiguration) {
		this.data.sessionFactory = sessionFactoryFromConfiguration;
	}

	public String generateCompleteMinuteHistory() {			
		List<Datenpunkt> datenpunkte = new ArrayList<Datenpunkt>();		
		datenpunkte = getRecords(Datenpunkt.class, "ASC");		
		long timestart = datenpunkte.get(0).getZeitstempel();	
		
		datenpunkte = getRecords(Datenpunkt.class, "DESC");		
		long timeend = datenpunkte.get(0).getZeitstempel();
		
		LocalDateTime variableStart = TimestampToLocalDateTime.convert(timestart);
		LocalDateTime endTime = TimestampToLocalDateTime.convert(timeend);

		variableStart = LocalDateTime.of(variableStart.getYear(), variableStart.getMonth(), variableStart.getDayOfMonth(), variableStart.getHour(), 0, 0); // Jump back to the beginning of an hour
		LocalDateTime variableEnd = variableStart.plusHours(1);		
		
		while (endTime.isAfter(variableStart)) {
			datenpunkte = readTimeIntervalFromDataBase(Datenpunkt.class,variableStart,variableEnd);
			datenpunkte.removeIf(p -> (p.getMessstellenid() % 100) != 3 ); // es werden nur die Stromwerte angeschaut!
			
			ArrayList<HistoricalMinuteValue> minuteList = calculateMinuteList(datenpunkte);			
			writeBatchMinuteValuesToDB(minuteList);
			
			System.out.println("Time performed: from " + variableStart + " to " + variableEnd + " datenpunkte: " +datenpunkte.size());
			variableStart = variableEnd;
			variableEnd = variableStart.plusHours(1);
		}
		return "done";
	}

	private ArrayList<HistoricalMinuteValue> calculateMinuteList(List<Datenpunkt> datenpunkte) {
		HashMap<String, ArrayList<Datenpunkt>> dpmap = new HashMap<>(); // "storeid,messagepunkt" 
		
		for (Datenpunkt dp : datenpunkte) {
			String key = dp.getId() +","+ dp.getMessstellenid();				
			if (!dpmap.containsKey(key)) {
				dpmap.put(key, new ArrayList<>());
			}
			dpmap.get(key).add(dp);
		}			
		ArrayList<HistoricalMinuteValue> minuteList = Integration.integrateMinutes(dpmap);
		return minuteList;
	}	
	
	private void writeBatchMinuteValuesToDB(ArrayList<HistoricalMinuteValue> hmvList) {				
		Session session = data.sessionFactory.openSession();
		Transaction tx = null;					
		try {
			int counter = 0;
			tx = session.beginTransaction();
			for (HistoricalMinuteValue historicalMinuteValue : hmvList) {		            
	            session.save(historicalMinuteValue);
	         	if( counter % 50 == 0 ) {
	               session.flush();
	               session.clear();
	            }
	        	counter++;
	        }
        tx.commit();				
	        } catch (HibernateException e) {
	         if (tx!=null) tx.rollback();
	      } finally {
	         session.close(); 
	      }
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> readTimeIntervalFromDataBase(Class<T> cl, 
			LocalDateTime start, LocalDateTime end) {

		List<T> result = new ArrayList<T>();
		long timestart = LocalDateTimeToTimestamp.convert(start);
		long timeend = LocalDateTimeToTimestamp.convert(end);
		
        Session session = data.sessionFactory.openSession();        
        session.beginTransaction();
        String hql = "FROM " + cl.getName() + " WHERE zeitstempel >= " + timestart + " AND zeitstempel < " + timeend  + " ORDER BY zeitstempel ASC";
        //System.out.println("\n" + hql + " start: " + start + " end: " + end);
        result = session.createQuery(hql).list();
        
        session.getTransaction().commit();
        session.close();        
        return result;
	}
	
	@SuppressWarnings("unchecked")
	public <T> List<T> readTimeIntervalFromDataBaseWithStoreID(Class<T> cl, String storeID, 
			LocalDateTime start, LocalDateTime end) {

		List<T> result = new ArrayList<T>();
		long timestart = LocalDateTimeToTimestamp.convert(start);
		long timeend = LocalDateTimeToTimestamp.convert(end);
		
        Session session = data.sessionFactory.openSession();        
        session.beginTransaction();
        String hql = "FROM " + cl.getName() + " WHERE zeitstempel >= " + timestart + " AND zeitstempel < " + timeend  +
        		" AND id=" + storeID + " ORDER BY zeitstempel ASC";
        //System.out.println("\n" + hql + " start: " + start + " end: " + end);
        result = session.createQuery(hql).list();
        
        session.getTransaction().commit();
        session.close();        
        return result;
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> getRecords(Class<T> cl, String order) {
        List<T> list = new ArrayList<T>();        
    	Session session = data.sessionFactory.openSession();
    	Transaction tx = session.beginTransaction();        	                
        String hql = "FROM " + cl.getName() + " ORDER BY zeitstempel " + order;
        list = session.createQuery(hql).setMaxResults(2).list();
        tx.commit();
		session.close();
        return list;
    }
	


	private void writeBatchHourValuesToDB(ArrayList<HistoricalHourValue> hhvList) {
		Session session = data.sessionFactory.openSession();
		Transaction tx = null;					
		try {
			int counter = 0;
			tx = session.beginTransaction();
			for (HistoricalHourValue hhv : hhvList) {		            
	            session.save(hhv);
	         	if( counter % 50 == 0 ) {
	               session.flush();
	               session.clear();
	            }
	        	counter++;
	        }
        tx.commit();				
	        } catch (HibernateException e) {
	         if (tx!=null) tx.rollback();
	      } finally {
	         session.close(); 
	      }		
	}

	public void calculateIntermediateMinuteValues(long currentTimestamp, long dbLastTimestamp) {
		System.out.println("\n---Start Minute Calculation---");
				
		List<Datenpunkt> datenpunkte = new ArrayList<Datenpunkt>();
		LocalDateTime startTime = TimestampToLocalDateTime.convert(dbLastTimestamp);
		startTime = LocalDateTime.of(startTime.getYear(),startTime.getMonth(), startTime.getDayOfMonth(), startTime.getHour(), startTime.getMinute(), 0 );
		
		LocalDateTime variableStart = startTime.plusMinutes(1);  // to calculate the next value
		LocalDateTime variableEnd = variableStart.plusHours(1);
		
		LocalDateTime endTime = TimestampToLocalDateTime.convert(currentTimestamp);
		
		while (endTime.minusMinutes(1).isAfter(variableStart)) {
			datenpunkte = readTimeIntervalFromDataBase(Datenpunkt.class,variableStart,variableEnd);
			datenpunkte.removeIf(p -> (p.getMessstellenid() % 100) != 3 );

			ArrayList<HistoricalMinuteValue> hmvList = calculateMinuteList(datenpunkte);			
			ArrayList<HistoricalMinuteValue> storeList = new ArrayList<>();
			
			for (HistoricalMinuteValue historicalMinuteValue : hmvList) {
				if(historicalMinuteValue.getZeitstempel() < currentTimestamp - 60*1000) { // entspicht endTime.minusMinutes(1)					
					//System.out.println(historicalMinuteValue + "   -- currentTimestamp: " + (currentTimestamp - 60*1000));
					storeList.add(historicalMinuteValue);
				}
			}
			
			writeBatchMinuteValuesToDB(storeList);
			
			if (datenpunkte.size() == 0) {
				System.out.println("Daten fehlen noch: from " + variableStart + " to " + variableEnd);
			} else System.out.println("DONE: Generated Minute Values from " + variableStart + " to " + endTime + " datenpunkte: " +datenpunkte.size()); 
						
			variableStart = variableEnd;
			variableEnd = variableStart.plusHours(1);
		}
		return;		
	}
	

	public void calculateIntermediateHourValues(long currentTimestamp, long lastDBTimestamp) {
				
		List<HistoricalMinuteValue> minuteValues = new ArrayList<HistoricalMinuteValue>();				
		
		LocalDateTime startTime = TimestampToLocalDateTime.convert(lastDBTimestamp);
		startTime = LocalDateTime.of(startTime.toLocalDate(), LocalTime.of(startTime.getHour(),0)); // make sure that time starts at hours 
		LocalDateTime variableStart = startTime.plusHours(1);  // to calculate the next value
		LocalDateTime variableEnd = variableStart.plusHours(1);
		
		LocalDateTime endTime = TimestampToLocalDateTime.convert(currentTimestamp);			
		
		System.out.println("---Start Hour Calculation---");
		System.out.println("HOUR - startTime: " + variableStart);
		System.out.println("HOUR - endTime: " + endTime);
		
		while (endTime.isAfter(variableEnd)) {
			minuteValues = readTimeIntervalFromDataBase(HistoricalMinuteValue.class, variableStart, variableEnd);
			HashMap<Integer, ArrayList<HistoricalMinuteValue>> mapMinuteValues = new HashMap<>();
			
			for (HistoricalMinuteValue mv : minuteValues) {						
				if (!mapMinuteValues.containsKey(mv.getMessstellenid())) {
					mapMinuteValues.put(mv.getMessstellenid(), new ArrayList<>());			
				}			
				mapMinuteValues.get(mv.getMessstellenid()).add(mv);
			}
			
			ArrayList<HistoricalHourValue> hourList = Integration.integrateHours(mapMinuteValues);
			writeBatchHourValuesToDB(hourList);
			
			System.out.println("DONE: Generated Hour Values from " + variableStart + " to " + variableEnd + " minuteValues.size(): " +minuteValues.size());
			variableStart = variableEnd;
			variableEnd = variableStart.plusHours(1);
		}
		return;		
	}

	public void calculateIntermediateDayValues(long currentTimestamp, long lastDBTimestamp) {		
		List<HistoricalHourValue> hourValues = new ArrayList<HistoricalHourValue>();		

		LocalDateTime endTime = TimestampToLocalDateTime.convert(currentTimestamp);
		LocalDateTime startTime = TimestampToLocalDateTime.convert(lastDBTimestamp);		
		
		System.out.println("---Start Day Calculation---");
		System.out.println("DAY - startTime: " + startTime);
		System.out.println("DAY - endTime: " + endTime);
		
		startTime = LocalDateTime.of(startTime.toLocalDate(), LocalTime.of(0,0)); // Beginning of the Day
		
		LocalDateTime variableStart = startTime.plusDays(1);  // to calculate the next value
		LocalDateTime variableEnd = variableStart.plusDays(1);
		
		while (endTime.minusDays(1).isAfter(variableStart)) {
			hourValues = readTimeIntervalFromDataBase(HistoricalHourValue.class, variableStart, variableEnd);
			System.out.println("Day Calculation. HourValues.size()=" +  hourValues.size()); // Leere Tage sollten eigentlich nicht sein...
			HashMap<Integer, ArrayList<HistoricalHourValue>> mapHourValues = new HashMap<>();
			
			for (HistoricalHourValue hh : hourValues) {
				if (!mapHourValues.containsKey(hh.getMessstellenid())) {
					 mapHourValues.put(hh.getMessstellenid(), new ArrayList<>());			
				}
				mapHourValues.get(hh.getMessstellenid()).add(hh);
			}
			
			ArrayList<HistoricalDayValue> dayList = Integration.integrateDays(mapHourValues);
			writeBatchDayValuesToDB(dayList);
			System.out.println("DONE: Generated Day Values from " + variableStart + " to " + variableEnd + " hourValues.size(): " + hourValues.size());
			
			variableStart = variableEnd;
			variableEnd = variableStart.plusDays(1);
		}
		return;
		
	}

	private void writeBatchDayValuesToDB(ArrayList<HistoricalDayValue> hdList) {
		Session session = data.sessionFactory.openSession();
		Transaction tx = null;					
		try {
			int counter = 0;
			tx = session.beginTransaction();
			for (IeserviceHistorical hhv : hdList) {		            
	            session.save(hhv);
	         	if( counter % 50 == 0 ) {
	               session.flush();
	               session.clear();
	            }
	        	counter++;
	        }
        tx.commit();				
	        } catch (HibernateException e) {
	         if (tx!=null) tx.rollback();
	      } finally {
	         session.close(); 
	      }		
	}

}
