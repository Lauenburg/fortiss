package org.fortiss.ieservices.rest;


import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.fortiss.ieservices.dataprocessing.HistoricalDataGenerator;
import org.fortiss.ieservices.dataprocessing.StatisticalDataGenerator;
import org.fortiss.ieservices.helper.CachesForExchange;
import org.fortiss.ieservices.json.IncomeParser;
import org.fortiss.ieservices.json.Message;
import org.fortiss.ieservices.postgres.ControllerDB;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * Klasse welche den tatsächlichen Datentransfer handhabt.
 * Vorallem ruft sie die Methode insert() der klasse Controller auf.
 */
@RestController
@RequestMapping("/")
public class InputController {
	public InputController() {
		controllerDB = new ControllerDB();
		historicalDataGenerator = new HistoricalDataGenerator(controllerDB.sessionFactoryFromConfiguration); // kann auch umgeschrieben werden, weil es aktuell mehrere Aufgaben erledigt.
		statisticGenerator = new StatisticalDataGenerator(historicalDataGenerator);
		statisticalDataExecuter.execute(statisticGenerator);
	}
	
	private ControllerDB controllerDB;
	private StatisticalDataGenerator statisticGenerator;
	private HistoricalDataGenerator historicalDataGenerator;
	private ExecutorService statisticalDataExecuter = Executors.newSingleThreadExecutor();		
	private IncomeParser incomeParser = new IncomeParser();
	
	@RequestMapping(method = RequestMethod.POST, value = "/submitdata", produces = "application/json")
	public String submitData(@RequestBody String post) {
		/**
		 * When DataPackage is submitted via submit and json POST
		 * the content will be inserted in the PostgeSQL Database
		 */
		Message[] messageArray = incomeParser.parseMessage(post);
		controllerDB.insertData(messageArray);
		
		//if (messageArray.length == 1) post = ExtraWimmer.createPost(post);
		
		String storeID = "" + messageArray[0].id;
		CachesForExchange.postCacheIn.put(storeID, messageArray);

		statisticGenerator.setNewValue(messageArray);
		
	    return "200";
	  }	

	@RequestMapping(method = RequestMethod.POST, value = "/submitmapping", produces = "application/json")
	public String submitMapping(@RequestBody String post) {
		controllerDB.insertSetup(incomeParser.parseMapping(post));
	    return "200";
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/hello", produces = "text/plain")
	public String hello() {
		
		String output = LocalDateTime.now().toString();
		
		
	    return "iE-Service running " + output;
	}
}
