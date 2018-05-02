package org.fortiss.http;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

public class Post {
	
	CloseableHttpClient client;
	HttpPost httpPostData;
	HttpPost httpPostMapping;
	
	public Post(String server, String data, String mapping) { 
		httpPostData = new HttpPost(server + data);
		httpPostMapping = new HttpPost(server + mapping);		
	}
	
	public void postJsonUsingHttpClientData(String json) throws ClientProtocolException, IOException {		
		client = HttpClients.createDefault();
		StringEntity entity = new StringEntity(json);
		httpPostData.setEntity(entity);
		client.execute(httpPostData);
		//System.out.println(response.toString());
		client.close();
		/*
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		*/
	}
	
	public void postJsonUsingHttpClientMapping(String json) throws ClientProtocolException, IOException{		
		client = HttpClients.createDefault();
		StringEntity entity = new StringEntity(json);
		httpPostMapping.setEntity(entity);
		client.execute(httpPostMapping);
		//CloseableHttpResponse response = client.execute(httpPostMapping);
		//System.out.println(response.toString());
		client.close();
	}
}