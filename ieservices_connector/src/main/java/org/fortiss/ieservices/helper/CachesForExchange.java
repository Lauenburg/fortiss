package org.fortiss.ieservices.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.fortiss.ieservices.dto.ClampSetup;
import org.fortiss.ieservices.json.Message;
import org.fortiss.ieservices.json.MessageWithString;
import org.fortiss.ieservices.postgres.ControllerDB;
import org.fortiss.ieservices.rest.DataControllerHelper;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class CachesForExchange {

	public static HashMap<String, Boolean> clampsAvailable = new HashMap<>();
	public static HashMap<String, HashMap<Integer, ClampSetup>> clampSettingHashMap = new HashMap<>();
	
	public static HashMap<String, Message[]> postCacheIn = new HashMap<>(); // hier sind nur die letzten post Werte drin gespeichert...
	public static HashMap<String, String> postCacheOut = new HashMap<>();
	
	public static boolean hasClamps = false;
	
	static Gson gson = new GsonBuilder().create();
	
	@SuppressWarnings("unchecked")
	public static void getClampSetup(String storeID, ControllerDB controllerDB) {
		
		// macht das aktuell nur einmalig
		
		if (!clampsAvailable.containsKey(storeID)){			
			List<ClampSetup> list = new ArrayList<>();
			Session session = controllerDB.sessionFactoryFromConfiguration.openSession();
			Transaction tx = session.beginTransaction();
			String hql = "FROM " + ClampSetup.class.getName() + " WHERE storeid = "+ storeID +" ORDER BY timestamp " + "DESC";
			list = session.createQuery(hql).setMaxResults(10).list();
			tx.commit();
			session.close();
			
			if (list.size() > 0) {
				clampsAvailable.put(storeID, true);				
				HashMap<Integer, ClampSetup> myMap = new HashMap<>();				
				clampSettingHashMap.put(storeID, myMap);				
				for (ClampSetup cS : list) {
					if (!myMap.containsKey(cS.getId_Clip1())) {
						myMap.put(cS.getId_Clip1(), cS);
					}
				}
			}	
		} // else, do nothing
	}

	public static void modifyPostCache(String storeID) {
		if(postCacheIn != null) {			
		
			Message[] input = postCacheIn.get(storeID);
			MessageWithString[] result = new MessageWithString[input.length];
			if (input!= null) {
				int counter = 0;
				for (Message message : input) {
					
					int withIdea = DataControllerHelper.calculateRightCSidForClampSetupHashMap(message.messtellen.get(0));				
					ClampSetup cs = clampSettingHashMap.get(storeID).get(withIdea);
					
					if(cs != null) {				
						MessageWithString mws = new MessageWithString();
						mws.id = message.id;
						mws.zeit = message.zeit;
						int counter2 = 0;
					
						for (Integer messtelleID : message.messtellen) {
							String name = someMagic(messtelleID, cs);
							mws.messtellen.add(name);						
							double wert = message.werte.get(counter2);
	
							if (messtelleID % 100 == 1) {
								wert = wert * 7.3354;
							}
							
							if (messtelleID % 100 == 3) {
								wert = wert * 4.1217 / 1000;
							}
							
							if (messtelleID % 100 == 4) {
								wert = wert * 13.6 / 1000;
							}
							
							if (messtelleID % 100 == 5) {
								wert = wert * 50 / 255;
							}
							
							mws.werte.add(wert);
							counter2++;
						}
						result[counter] = mws;
					}
					counter++;
				}
				
				String resultString = gson.toJson(result);			
				postCacheOut.put(storeID, resultString);
			}
		}
	}

	private static String someMagic(Integer messtelleID, ClampSetup cs) {

		String result = "";
		
		int csID = DataControllerHelper.calculateRightCSidForClampSeutp(messtelleID);
		if (csID == 1) result = cs.getDescription_cp1();
		if (csID == 2) result = cs.getDescription_cp2();
		if (csID == 3) result = cs.getDescription_cp3();		
		
		int lastInt = messtelleID % 100; // 1,2,3,4,5
		
		if (lastInt == 1) result = "Leistung | " + result + " | " + messtelleID;
		if (lastInt == 2) result = "Phasenwinkel | " + result + " | " + messtelleID;
		if (lastInt == 3) result = "Stromstärke | " + result + " | " + messtelleID;
		if (lastInt == 4) result = "Spannung | " + result + " | " + messtelleID;
		if (lastInt == 5) result = "THD-Strom | " + result + " | " + messtelleID;
				
		return result;
	}
}
