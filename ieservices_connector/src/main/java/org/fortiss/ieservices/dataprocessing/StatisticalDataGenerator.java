package org.fortiss.ieservices.dataprocessing;

import java.util.List;

import org.fortiss.ieservices.dto.HistoricalDayValue;
import org.fortiss.ieservices.dto.HistoricalHourValue;
import org.fortiss.ieservices.dto.HistoricalMinuteValue;
import org.fortiss.ieservices.json.Message;

public class StatisticalDataGenerator extends Thread {

	private long lastTimestampReceived = 0L;
	private long lastHistoricalMinuteTimestamp = 0L;
	private long lastHistoricalHourTimestamp = 0L;
	private long lastHistoricalDayTimestamp = 0L;
	private HistoricalDataGenerator historicalDataGenerator;
	
	public StatisticalDataGenerator(HistoricalDataGenerator historicalDataGenerator) {
		this.historicalDataGenerator = historicalDataGenerator;
	}
	
	public void run(){
		while(true){			
			try {
				decideOnStaticicalTrigger(lastTimestampReceived);
				Thread.sleep(5000);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private void decideOnStaticicalTrigger(long receivedTimestamp) {
		// MINUTEN
		if(lastHistoricalMinuteTimestamp == 0) { // wichtig für Restart	
			List<HistoricalMinuteValue> minunteList = historicalDataGenerator.getRecords(HistoricalMinuteValue.class, "DESC");
			if (minunteList.size() != 0) {
				lastHistoricalMinuteTimestamp = minunteList.get(0).getZeitstempel();
			} else historicalDataGenerator.generateCompleteMinuteHistory();
		}
		
		if (receivedTimestamp > (lastHistoricalMinuteTimestamp+2*60*1000)) {
			historicalDataGenerator.calculateIntermediateMinuteValues(receivedTimestamp, lastHistoricalMinuteTimestamp);
			List<HistoricalMinuteValue> minunteList = historicalDataGenerator.getRecords(HistoricalMinuteValue.class, "DESC");
			lastHistoricalMinuteTimestamp = minunteList.get(0).getZeitstempel();
		}
		
		// STUNDEN
		if(lastHistoricalHourTimestamp == 0) { // wichtig für Restart
			List<HistoricalHourValue> hourList = historicalDataGenerator.getRecords(HistoricalHourValue.class, "DESC");			
			if (hourList.size() != 0) {
				lastHistoricalHourTimestamp = hourList.get(0).getZeitstempel();
			} else specialCaseHours();
		}
		
		if (receivedTimestamp > (lastHistoricalHourTimestamp+2*60*60*1000)) {		
			historicalDataGenerator.calculateIntermediateHourValues(receivedTimestamp, lastHistoricalHourTimestamp);			
			List<HistoricalHourValue> hourList = historicalDataGenerator.getRecords(HistoricalHourValue.class, "DESC");
			lastHistoricalHourTimestamp = hourList.get(0).getZeitstempel();
		}
		
		// TAGE
		if(lastHistoricalDayTimestamp == 0) { // wichtig für Restart
			List<HistoricalDayValue> dayList = historicalDataGenerator.getRecords(HistoricalDayValue.class, "DESC");			
			if (dayList.size() != 0) {
				lastHistoricalDayTimestamp = dayList.get(0).getZeitstempel();
			}
			else specialCaseDays();
		}		
			
		if (receivedTimestamp > (lastHistoricalDayTimestamp+2*24*60*60*1000)) {
			historicalDataGenerator.calculateIntermediateDayValues(receivedTimestamp, lastHistoricalDayTimestamp);
			List<HistoricalDayValue> dayList = historicalDataGenerator.getRecords(HistoricalDayValue.class, "DESC");
			lastHistoricalDayTimestamp = dayList.get(0).getZeitstempel();
		}
	}

	private void specialCaseHours() {
		// Wenn gar keine Stunden in der DB sind, dann wird der erste Minuten Eintrag gecheckt. Das ist ein Spezialfall.
		List<HistoricalMinuteValue> minuteList = historicalDataGenerator.getRecords(HistoricalMinuteValue.class, "ASC");
		lastHistoricalHourTimestamp = minuteList.get(0).getZeitstempel();
	}

	private void specialCaseDays() {
		// Wenn gar keine Tage in der DB sind, dann wird der erste Minuten Eintrag gecheckt. Das ist ein Spezialfall.
		List<HistoricalHourValue> hourList = historicalDataGenerator.getRecords(HistoricalHourValue.class, "ASC");
		if (!hourList.isEmpty()) {
			lastHistoricalDayTimestamp = hourList.get(0).getZeitstempel();
		} else lastHistoricalDayTimestamp = lastHistoricalHourTimestamp;
	}

	
	// Speichern der letzten Zeit, die erhalten wurde.
	public void setNewValue(Message[] messageArray) {
		if (messageArray != null && messageArray.length > 0) {
			for (int i = 0; i < messageArray.length; i++) {
				if (messageArray[i].zeit > lastTimestampReceived) lastTimestampReceived = messageArray[i].zeit;
			}
		}
	}
}
