package org.fortiss.ieservices.rest;

import java.util.HashMap;

import org.fortiss.ieservices.json.IncomeParser;
import org.fortiss.ieservices.json.Message;

public class ExtraWimmer {
	
	public static HashMap<String, String> postMaps = new HashMap<>();
	private static IncomeParser incomeParser = new IncomeParser();	
	
	public static String createPost(String post) {		
		Message[] messageArray = incomeParser.parseMessage(post);	
		postMaps.put(""+messageArray[0].messtellen.get(0), post);				
		String result = "[";
		for (String msg : postMaps.values()) {
			result += msg + ",";
		}
		result = result.substring(0,result.length()-1);
		result += "]";
		return result;
	}

}
