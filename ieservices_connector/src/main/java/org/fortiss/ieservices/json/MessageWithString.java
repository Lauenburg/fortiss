package org.fortiss.ieservices.json;

import java.util.ArrayList;
import java.util.Arrays;

public class MessageWithString {
	
	public int id = 1000;
	public ArrayList<String> messtellen = new ArrayList<String>();	
	public ArrayList<Double> werte = new ArrayList<Double>();
	public long zeit = 0;
	
	public String toString() {
		String result = "";
		Integer[] m = messtellen.toArray(new Integer[messtellen.size()]);
		Integer[] w = werte.toArray(new Integer[werte.size()]);
		result = "{\"id\":"+id+",\"messtellen\":" + Arrays.toString(m) + ",\"werte\":" + Arrays.toString(w) + ",\"zeit\":" + zeit+"}";
		return result;
	}
}
