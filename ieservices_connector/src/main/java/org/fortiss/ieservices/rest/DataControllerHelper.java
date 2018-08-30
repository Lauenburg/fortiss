package org.fortiss.ieservices.rest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.fortiss.ieservices.dataprocessing.HistoricalDataGenerator;
import org.fortiss.ieservices.dto.ClampSetup;
import org.fortiss.ieservices.dto.HistoricalDayValue;
import org.fortiss.ieservices.dto.HistoricalHourValue;
import org.fortiss.ieservices.dto.HistoricalMinuteValue;
import org.fortiss.ieservices.dto.IeserviceHistorical;
import org.fortiss.ieservices.helper.CachesForExchange;
import org.fortiss.ieservices.helper.MyHistoryGraphData;
import org.fortiss.ieservices.helper.MyHistoryGraphDataset;
import org.fortiss.ieservices.util.TimestampToLocalDateTime;

import com.google.gson.Gson;

/**
 * Diese Klasse hilft dem Controller die Anfragen zu bedienenen.
 * Es liest die Daten, vor allem historische, aus der Datenbank.
 * Zudem leistet es eine Vorverarbeitung für die Visualisierung.
 * 
 * @author bytschkow
 *
 */
public class DataControllerHelper {
	
	public static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("d-M-yyyy");
	
	public static String generateRepresentationForMyDayGraph(String storeID, String day, HistoricalDataGenerator historicalDataGenerator) {
		
		LocalDate date = LocalDate.parse(day, dateFormatter);
		LocalDateTime startTime = LocalDateTime.of(date, LocalTime.MIDNIGHT);
		LocalDateTime endTime = startTime.plusDays(1);
		
		List<HistoricalHourValue> hours = historicalDataGenerator.readTimeIntervalFromDataBaseWithStoreID(HistoricalHourValue.class, storeID, startTime, endTime);
				
		List<IeserviceHistorical> parsed = new ArrayList<>();
		for (IeserviceHistorical ieserviceHistorical : hours) {
			parsed.add(ieserviceHistorical);
		}
				
		MyHistoryGraphDataset[] myDayGraph = parseHistorical(parsed);
		String answer = generateAnswer(myDayGraph);		
		return answer;		
	}

	public static String generateRepresentationForMyWeekGraph(String storeID, String day, HistoricalDataGenerator historicalDataGenerator) {	
		
		LocalDate date = LocalDate.parse(day, dateFormatter);
		int dayOfWeek = date.getDayOfWeek().getValue();
		LocalDate beginningOfWeek = date.minusDays(dayOfWeek - 1);
		LocalDateTime startTime = LocalDateTime.of(beginningOfWeek, LocalTime.MIDNIGHT);
		LocalDateTime endTime = startTime.plusDays(7);
		
		List<HistoricalDayValue> days = historicalDataGenerator.readTimeIntervalFromDataBaseWithStoreID(HistoricalDayValue.class, storeID, startTime, endTime);
		
		List<IeserviceHistorical> parsed = new ArrayList<>();
		for (IeserviceHistorical ieserviceHistorical : days) {
			parsed.add(ieserviceHistorical);
		}
				
		MyHistoryGraphDataset[] myDayGraph = parseHistorical(parsed);					
		return generateAnswer(myDayGraph);
	}
	
	public static String generateRepresentationForMyMonthGraph(String storeID, String day, 
			HistoricalDataGenerator historicalDataGenerator) {
		
		LocalDate date = LocalDate.parse(day, dateFormatter);
		LocalDate beginingOfMonth = LocalDate.of(date.getYear(), date.getMonth(), 1);
		LocalDateTime startTime = LocalDateTime.of(beginingOfMonth, LocalTime.MIDNIGHT);
		LocalDateTime endTime = startTime.plusMonths(1);
		
		List<HistoricalDayValue> days = historicalDataGenerator.readTimeIntervalFromDataBaseWithStoreID(HistoricalDayValue.class, storeID, startTime, endTime);
		
		List<IeserviceHistorical> parsed = new ArrayList<>();
		for (IeserviceHistorical ieserviceHistorical : days) {
			parsed.add(ieserviceHistorical);
		}
				
		MyHistoryGraphDataset[] myDayGraph = parseHistorical(parsed);		
		return generateAnswer(myDayGraph);
	}

	public static String generateRepresentationForMyHourGraph(String storeID, String hour, HistoricalDataGenerator historicalDataGenerator) {
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d-M-yyyy'T'H:mm");
		LocalDateTime date = LocalDateTime.parse(hour,formatter);
		LocalDateTime startTime = LocalDateTime.of(date.toLocalDate(), LocalTime.of(date.getHour(), 0));
		LocalDateTime endTime = startTime.plusHours(1);
		
		List<HistoricalMinuteValue> minutes = historicalDataGenerator.readTimeIntervalFromDataBaseWithStoreID(HistoricalMinuteValue.class, storeID, startTime, endTime);
				
		List<IeserviceHistorical> minutesParsed = new ArrayList<>();
		for (IeserviceHistorical ieserviceHistorical : minutes) {
			minutesParsed.add(ieserviceHistorical);
		}
		
		MyHistoryGraphDataset[] myDayGraph = parseHistorical(minutesParsed);			
		return generateAnswer(myDayGraph);
	}

	private static String generateAnswer(MyHistoryGraphDataset[] myDayGraph) {
		Gson gson = new Gson();
		String answer = "";
		answer = "[";
		int counter = 0;
		for (MyHistoryGraphDataset value : myDayGraph) {
			if(counter != 0) {
				answer += ",";
			}
			answer += gson.toJson(value);
			counter++;
		}
		answer += "]";		
		return answer;
	}

	private static MyHistoryGraphDataset[] parseHistorical(List<IeserviceHistorical> historicalValues) {		
		HashMap<Integer, ArrayList<IeserviceHistorical> > mapOfHistoricalValues;
		mapOfHistoricalValues = splitToIDs(historicalValues);
		
		MyHistoryGraphDataset[] result = new MyHistoryGraphDataset[mapOfHistoricalValues.keySet().size()];
		int counter = 0;
		
		// für jede ID eigene Historie anlegen und hinzufügen
		for (ArrayList<IeserviceHistorical> valueList : mapOfHistoricalValues.values()) {
			MyHistoryGraphDataset dataset = new MyHistoryGraphDataset();
			
			
			/**
			 * Ab hier dient alles dem Mapping - etwas zu Komplex
			 */
		
			int storeID = valueList.get(0).getId();
			int messID = valueList.get(0).getMessstellenid();
			
			HashMap<Integer, ClampSetup> csMap = CachesForExchange.clampSettingHashMap.get("" + storeID);
			
			int csMapping = calculateRightCSidForClampSetupHashMap(messID);
			ClampSetup cs = csMap.get(csMapping);
			
			String nameCS = "";
			
			if (cs != null) {
				int csID = calculateRightCSidForClampSeutp(messID);
				if (csID == 1) nameCS = cs.getDescription_cp1();
				if (csID == 2) nameCS = cs.getDescription_cp2();
				if (csID == 3) nameCS = cs.getDescription_cp3();
			}
			
			nameCS += " | " + messID;
						
			/**
			 * Namen rausgesucht
			 */
			
			//dataset.name = "" + valueList.get(0).getMessstellenid(); // TODO hier noch das Mapping nutzen um den richigen Namen zu zeigen.
			dataset.name = nameCS; 
			dataset.data = new MyHistoryGraphData[valueList.size()];
			for (int i = 0; i < dataset.data.length; i++) {
				MyHistoryGraphData data = new MyHistoryGraphData();				
				long timestamp = valueList.get(i).getZeitstempel();				
				data.value = valueList.get(i).getIntegral();
				data.time = ""+TimestampToLocalDateTime.convert(timestamp);
				dataset.data[i] = data;
			}
			result[counter] = dataset;
			counter++;
		}
		
		return result;
	}

	public static int calculateRightCSidForClampSeutp(int messID) {
		int result = messID / 100;
		result = (result-1) % 3;
		result++;
		return result; // Ausgabe sollte von 1..3 sein.
	}

	public static int calculateRightCSidForClampSetupHashMap(int messID) {		
		int counter = 1;
		while ( (messID - 300*counter-100) > 0) {
			counter = counter + 1;
		}
		return counter * 300 - 200;
	}

	private static HashMap<Integer, ArrayList<IeserviceHistorical> > splitToIDs(List<IeserviceHistorical> minutes) {		
		HashMap<Integer, ArrayList<IeserviceHistorical> > result = new HashMap<>();		
		for (IeserviceHistorical historicalValue : minutes) {
			int key = historicalValue.getMessstellenid();
			if(!result.containsKey(key) )  {
				result.put(historicalValue.getMessstellenid(), new ArrayList<>());
				result.get(key).add(historicalValue);
			} else {
				result.get(key).add(historicalValue);
			}
		}
		return result;
	}
}
