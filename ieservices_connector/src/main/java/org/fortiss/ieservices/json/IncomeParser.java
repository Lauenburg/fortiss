
package org.fortiss.ieservices.json;


import org.fortiss.ieservices.dto.ClampSetup;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class IncomeParser {
	
	Gson gson = new GsonBuilder().create();
	
	public Message[] parseMessage(String jsonLine) {
		try {
			Message[] message = gson.fromJson(jsonLine, Message[].class);
			return message;
		} catch (Exception e) {
			Message message = gson.fromJson(jsonLine, Message.class);
			Message[] msg = new Message[1];
			msg[0] = message;
			return msg;
		}		
	}
	
	public ClampSetup parseMapping(String jsonLine) {		
		Mapping mapping = gson.fromJson(jsonLine, Mapping.class);
		ClampSetup clampSetup = createClampSetup(mapping);
		return clampSetup;
	}
	
	public ClampSetup createClampSetup(Mapping mapping){
		ClampSetup wrapper = new ClampSetup(
				mapping.getStoreID(), 
				mapping.getID_Clip1(), mapping.getID_Clip2(), mapping.getID_Clip3(),  
				mapping.getDescription_cp1(), mapping.getDescription_cp2(), mapping.getDescription_cp3());
		return wrapper;
		
	}
}
