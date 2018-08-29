package org.fortiss.gson;


import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.fortiss.http.Post;

import com.google.gson.Gson;

public class JsonFileReader {


	public static WrapperOperationMode operationMode;
	public static WrapperMapping[] map;

	public static final String OPERATIONFILE = "/etc/iEservices/operationFile.json";
	public static final String SETUPFILE = "/etc/iEservices/setupFile.json";
	public static final String MAPPINGFILE = "/etc/iEservices/mapping.json";
	public static final String LOGGINGFILE = "/etc/iEservices/ieServiceLogging.log";


	public static WrapperOperationMode readOperationMode(){
		Gson gson = new Gson();
		FileReader reader;
		try {
			reader = new FileReader(OPERATIONFILE);
			operationMode = gson.fromJson(reader, WrapperOperationMode.class);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

		return operationMode;
	}


	

	public static WrapperMapping[] mapping() {

		Gson gson = new Gson();

		try {
			FileReader reader =	new FileReader(MAPPINGFILE);
			// Einfügen der Information des Jsonfiles in einrae Array aus Wrapperinstanzen
			map = gson.fromJson(reader, WrapperMapping[].class);

		} catch (IOException e) {
			e.printStackTrace();
		}
		return map;

	}

	public static int updatingClampConfiguartion (WrapperMapping[] map) throws ClientProtocolException, IOException{
		//Creating Gson to convert the mapping class in to a string for httpPsot
		Gson gson = new Gson();
		//Transforming the wrapper class in to a string
		for (WrapperMapping wrapperMapping : map) {
			String textJson = gson.toJson(wrapperMapping);			
			//creating a new instance of the HttpPost class (server, data and mapping paths)
			Post httpPost = new Post(operationMode.getServer(), operationMode.getDatapath(), operationMode.getMappingpath());
			//Posting the information to target server
			httpPost.postJsonUsingHttpClientMapping(textJson);
		}
		return 0;
	} 




}
