package org.fortiss.ieservices.dataprocessing;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.TimeZone;

import org.fortiss.ieservices.dto.Datenpunkt;
import org.fortiss.ieservices.dto.HistoricalDayValue;
import org.fortiss.ieservices.dto.HistoricalHourValue;
import org.fortiss.ieservices.dto.HistoricalMinuteValue;
import org.fortiss.ieservices.util.LocalDateTimeToTimestamp;
import org.fortiss.ieservices.util.TimestampToLocalDateTime;

public class Integration {

	public static ArrayList<HistoricalMinuteValue> integrateMinutes(HashMap<String, ArrayList<Datenpunkt>> dpmap) {		
		ArrayList<HistoricalMinuteValue> result = new ArrayList<>();
		for (String key : dpmap.keySet()) {
			result.addAll(integrationHelperMinutes(dpmap.get(key)));
		}
		return result;		
	}

	private static ArrayList<HistoricalMinuteValue> integrationHelperMinutes(ArrayList<Datenpunkt> arrayList) {
		
		if (arrayList == null) return null;		
		if (arrayList.size() == 0) return null;
			
		ArrayList<HistoricalMinuteValue> result = new ArrayList<>();
		Datenpunkt dp = arrayList.get(0);
				
		LocalDateTime startTime = TimestampToLocalDateTime.convert(dp.getZeitstempel());				
		startTime = LocalDateTime.of(startTime.getYear(), startTime.getMonth(), startTime.getDayOfMonth(), startTime.getHour(), startTime.getMinute(), 0); // Jump back to the beginning of a minute
		
		long timestart = LocalDateTimeToTimestamp.convert(startTime);
		long timeend = timestart + 60*1000; // plus eine Minute
		double integral = 0;
		/**
		 * Berechnung des Integrals
		 */		
		for (int i = 0; i < arrayList.size()-1; i++) {
			double deltay = 0.5 * (arrayList.get(i).getMesswert() + arrayList.get(i+1).getMesswert());
			double deltat = arrayList.get(i+1).getZeitstempel() - arrayList.get(i).getZeitstempel();
			deltat = deltat / 1000 / 60 / 60; // um auf die Stunden zu kommen.
			integral += deltay * deltat ;			
			/**
			 * Sobald die Minute überschritten ist, wird ein neuer HistoryMinuteValue angelegt.
			 */
			if (timeend < arrayList.get(i+1).getZeitstempel()) {
				result.add( new HistoricalMinuteValue(dp.getId(), dp.getMessstellenid(), integral, timestart) );
				timestart = timeend;
				timeend = timestart + 60*1000;
				integral = 0;
			}
		}
		
		/**
		 * ganz zum Schluss wird noch ein Wert reingeschrieben, da der IF-CASE nicht eintritt.
		 */
		result.add( new HistoricalMinuteValue(dp.getId(), dp.getMessstellenid(), integral, timestart) );
		return result;		
	}

	public static ArrayList<HistoricalHourValue> integrateHours(
			HashMap<Integer, ArrayList<HistoricalMinuteValue>> hmvMap) {		
		ArrayList<HistoricalHourValue> result = new ArrayList<>();
		for (Integer key : hmvMap.keySet()) {
			result.addAll(integrationHelperHours(hmvMap.get(key)));
		}		
		return result;
	}

	private static ArrayList<HistoricalHourValue> integrationHelperHours(
			ArrayList<HistoricalMinuteValue> arrayList) {
		
		if (arrayList == null) return null;		
		if (arrayList.size() == 0) return null;
		
		ArrayList<HistoricalHourValue> result = new ArrayList<>();	
		double integral = 0;
		for (HistoricalMinuteValue hmv : arrayList) {
			integral += hmv.getIntegral();
		}
		
		HistoricalMinuteValue hmv = arrayList.get(0);
		LocalDateTime ldt = LocalDateTime.ofInstant(Instant.ofEpochMilli(hmv.getZeitstempel()), TimeZone.getDefault().toZoneId()); // timestamp to LocalDateTime
		ldt = LocalDateTime.of(ldt.getYear(), ldt.getMonth(), ldt.getDayOfMonth(), ldt.getHour(), 0, 0); // Jump back to the beginning of an hour
		long time = ldt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(); // LocalDateTime to long
		
		HistoricalHourValue hhv = new HistoricalHourValue(hmv.getId(), hmv.getMessstellenid(), integral, time);
		result.add(hhv);
		return result;
	}

	public static ArrayList<HistoricalDayValue> integrateDays(
			HashMap<Integer, ArrayList<HistoricalHourValue>> mapHourValues) {
		
		ArrayList<HistoricalDayValue> result = new ArrayList<>();
		
		for (Integer key : mapHourValues.keySet()) {
			result.addAll(integrationHelperDays(mapHourValues.get(key)));
		}		
		return result;
	}

	private static ArrayList<HistoricalDayValue> integrationHelperDays(
			ArrayList<HistoricalHourValue> arrayList) {
		
		if (arrayList == null) return null;		
		if (arrayList.size() == 0) return null;
		
		System.out.println("IntegrateDays. Anzahl der Stunden über die summiert wird: " + arrayList.size());
		
		ArrayList<HistoricalDayValue> result = new ArrayList<>();	
		double integral = 0;
		for (HistoricalHourValue hhv : arrayList) {
			integral += hhv.getIntegral();
		}
		
		HistoricalHourValue hhv = arrayList.get(0);
		LocalDateTime timestampToStore = LocalDateTime.ofInstant(Instant.ofEpochMilli(hhv.getZeitstempel()), TimeZone.getDefault().toZoneId()); // timestamp to LocalDateTime
		timestampToStore = LocalDateTime.of(timestampToStore.getYear(), timestampToStore.getMonth(), timestampToStore.getDayOfMonth(), 0, 0, 0); // Jump back to the beginning of a day
		long time = timestampToStore.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(); // LocalDateTime to long
		
		HistoricalDayValue hdv = new HistoricalDayValue(hhv.getId(), hhv.getMessstellenid(), integral, time);
		result.add(hdv);
		return result;
	}

}
