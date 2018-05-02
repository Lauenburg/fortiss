package org.fortiss.ieservices.json;

import java.util.ArrayList;
import java.util.Arrays;

import org.fortiss.ieservices.dto.Datenpunkt;

public class Message {
	
	public int id = 1000;
	public ArrayList<Integer> messtellen = new ArrayList<Integer>();	
	public ArrayList<Integer> werte = new ArrayList<Integer>();	
	public long zeit = 0;
	
	public Datenpunkt[] toDatenpunktArray(){
		Datenpunkt wrapper[] = new Datenpunkt[messtellen.size()];		
		for (int i = 0; i < messtellen.size(); i++) {
			wrapper[i]= new Datenpunkt(id,messtellen.get(i), werte.get(i), zeit);
		}		
		return wrapper;	
	}
	
	public String toString() {
		String result = "";
		Integer[] m = messtellen.toArray(new Integer[messtellen.size()]);
		Integer[] w = werte.toArray(new Integer[werte.size()]);
		result = "{\"id\":"+id+",\"messtellen\":" + Arrays.toString(m) + ",\"werte\":" + Arrays.toString(w) + ",\"zeit\":" + zeit+"}";
		return result;
	}
}
