package org.fortiss.ieservices.rest;

import org.fortiss.ieservices.dataprocessing.HistoricalDataGenerator;
import org.fortiss.ieservices.helper.CachesForExchange;
import org.fortiss.ieservices.postgres.ControllerDB;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * Klasse welche den tatsächlichen Datentransfer handhabt.
 * Vorallem ruft sie die Methode insert() der klasse Controller auf.
 */
@RestController
@RequestMapping("/get")
public class OutputController {	
	public OutputController() {
		controllerDB = new ControllerDB();
		historicalDataGenerator = new HistoricalDataGenerator(controllerDB.sessionFactoryFromConfiguration); // kann auch umgeschrieben werden, weil es aktuell mehrere Aufgaben erledigt.
	}
	
	private ControllerDB controllerDB;
	private HistoricalDataGenerator historicalDataGenerator;
	
	/**
	 * HASHES FOR THE LAST VALUES
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/{storeID}/lastValue", produces = "application/json")	
	public String getData(@PathVariable String storeID) {
		// ClampSetup is required to see the names of the system.
		CachesForExchange.getClampSetup(storeID, controllerDB);
		CachesForExchange.modifyPostCache(storeID);
		
		String data = " ";
		data += CachesForExchange.postCacheOut.get(storeID);
		
		//System.out.println(data);
		
		String answer = "updateLastValue(" + data + ");";
	    return answer;
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/{storeID}/getHour/{hour}/", produces = "application/json")	
	public String getHourHistory(@PathVariable String storeID,
			@PathVariable String hour) {
		CachesForExchange.getClampSetup(storeID, controllerDB);
		
		String auswertung = DataControllerHelper.generateRepresentationForMyHourGraph(storeID, hour, historicalDataGenerator);
		String answer = "updateHourValue( " + auswertung + ");";
	    return answer;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/{storeID}/getDay/{day}/", produces = "application/json")	
	public String getDayHistory(@PathVariable String storeID,
			@PathVariable String day) {
		CachesForExchange.getClampSetup(storeID, controllerDB);
		
		String auswertung = DataControllerHelper.generateRepresentationForMyDayGraph(storeID, day, historicalDataGenerator);  
		String answer = "updateDayValue( " + auswertung + ");";
	    return answer;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/{storeID}/getWeek/{day}/", produces = "application/json")	
	public String getWeekHistory(@PathVariable String storeID,
			@PathVariable String day) {
		CachesForExchange.getClampSetup(storeID, controllerDB);
		
		String auswertung = DataControllerHelper.generateRepresentationForMyWeekGraph(storeID, day, historicalDataGenerator);  
		String answer = "updateWeekValue( " + auswertung + ");"; 
	    return answer;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/{storeID}/getMonth/{day}/", produces = "application/json")	
	public String getMonthHistory(@PathVariable String storeID,
			@PathVariable String day) {
		CachesForExchange.getClampSetup(storeID, controllerDB);		
		
		String auswertung = DataControllerHelper.generateRepresentationForMyMonthGraph(storeID, day, historicalDataGenerator);
		String answer = "updateMonthValue( " + auswertung + ");";
	    return answer;
	}
}
