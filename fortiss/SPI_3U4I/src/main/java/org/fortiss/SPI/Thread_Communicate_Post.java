package org.fortiss.SPI;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.logging.Logger;

import org.apache.http.client.ClientProtocolException;
import org.fortiss.gson.JsonFileReader;
import org.fortiss.gson.WrapperMapping;
import org.fortiss.gson.WrapperOperationMode;
import org.fortiss.http.Post;
import org.fortiss.push.Message;

import com.google.gson.Gson;

public class Thread_Communicate_Post extends Thread {
	
	private long sleepingTime = 500;

	//Message is a wrapper class which is used by a gson to write the collected data from the communication of one Brick (for all the dtatbodys of this brick)
	//in to a format which can be used to push the data via http to the backend server
	Message message;
	//at the moment the device Id is static. Later it should be set to be unique and according to its place of deployment
	static int storeID = 1000;

	//Gson which is being used create a Jason-File from the received data to be transfered via http push to an external server
	Gson gson;
	
	//Class which implemnts the http post method to push the data to an external server.
	Post httpPost;
	static String output = null; // the buffer for console output

	//creating the LinkedBlockingQueues for the communication between the threads
	ArrayList<ArrayBlockingQueue<DataStruct>> dataQueues;
	DataStruct[] dsArray = null;
	ArrayList<Message> messageList = new ArrayList<>();

	/**
	 * Value mapping for the identification with in the data base
	 */
	final static int power = 1;
	final static int phase = 2;
	final static int current = 3;
	final static int voltage = 4;
	final static int distortionI = 5;
	final static int distortionU = 6;
	ArrayList<int[]> clip;  // repräsentiert die Phasen aus dem mapping File
	private Logger logger;
	private boolean communicationPossible = true;

	public Thread_Communicate_Post(ArrayList<ArrayBlockingQueue<DataStruct>> dataQueues, WrapperOperationMode operationMode, Logger logger, DataStruct[] dsArray) {
		this.logger = logger;
		this.dataQueues = dataQueues;
		this.dsArray = dsArray;
		this.httpPost = new Post(operationMode.getServer(), operationMode.getDatapath(), operationMode.getMappingpath());
		this.message = new Message();
		boolean tryPosting = true;
		while (tryPosting) { // Passiert einmalig am Anfang
			try {
				//zuweisung der bezeichnungen so wie im mapping file vermerkt
				this.clip = updatingSettings();
				System.out.println("Server connection established, mapping pushed to server");
				tryPosting = false;
			} catch (Exception e) {
				tryPosting = true;
				System.out.println("Update of Clampsetting failed. Retry in 10sec.");
				System.out.println("Time: " + System.currentTimeMillis() + " Server side could not be reached. Please restart ie-service-connector!");
				logger.severe("Server side could not be reached. Please restart ie-service-connector!");
				try {
					Thread.sleep(10000);
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}
			}	
		}		
	}

	public void run() {
		while(true){
			try {
				
				Thread.sleep(sleepingTime);
				/** OLD Code with queues
				DataStruct dataStruct = null;
				for (ArrayBlockingQueue<DataStruct> queue : dataQueues) {
					if (queue.size() > 0) {
						dataStruct = queue.poll();
						if (dataStruct != null) {
							System.out.println(Arrays.toString(dataStruct.buffer));		
							message = processData(dataStruct, clip);
							messageList.add(message);
						}
					}
				}
				*/				
				
				for (DataStruct ds : dsArray) {
					if (ds != null) {
						message = processData(ds, clip);
						messageList.add(message);
					}
					ds = null;
				}
				
				long start = System.currentTimeMillis();	

				output = dataQueues.size() + " Bricks.";

				postData(messageList, gson, httpPost);
				messageList.clear();
				
				if (communicationPossible) {
					System.out.print("\033[H\033[2J");  
				    System.out.flush();
				    System.out.println(output);
					System.out.println("Zeit Kommunikationszyklus: " + (System.currentTimeMillis() - start));
				}
				
				communicationPossible = true;				
			} catch (IOException | InterruptedException e) {	
				System.out.println("\nTime: " + System.currentTimeMillis() + " Server side could not be reached. Please restart ie-service-connector! Waiting 1s");
				logger.severe("Server side could not be reached. Please restart ie-service-connector!");
				communicationPossible = false;
				messageList.clear();
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}
			}
		}
	}

	public ArrayList<int[]> updatingSettings() throws ClientProtocolException, IOException{		
		this.gson = new Gson();
		ArrayList<int[]> clip = new ArrayList<>();
		/**
		 * Value mapping for the identification with in the data base
		 */
		WrapperMapping[] map = JsonFileReader.mapping();
		storeID = map[1].getStoreID();
		for(WrapperMapping mapit: map){
			int[] clipArray = {mapit.getID_Clip1(), mapit.getID_Clip2(), mapit.getID_Clip3()};
			clip.add(clipArray);
		}
		
		JsonFileReader.updatingClampConfiguartion(map);		
		return clip;
	}

	public static Message processData(DataStruct dataStruct, ArrayList<int[]> clip  ) throws ClientProtocolException, IOException{
		int klemme1 = clip.get(dataStruct.getSlave())[0];
		int klemme2 = clip.get(dataStruct.getSlave())[1];
		int klemme3 = clip.get(dataStruct.getSlave())[2];
		//Switch which for the different datapackages a brick can have 
		
		Message message = new Message();
		
		/*
		//rausfitern der peaks
		int value = 256*dataStruct.getBuffer()[3]+dataStruct.getBuffer()[4];
		if (value > 25000) value = 0;
		message.werte.add(value);
		message.messtellen.add(klemme1+current);

		value = 256*dataStruct.getBuffer()[5]+dataStruct.getBuffer()[6];
		if (value > 25000) value = 0;
		message.werte.add((value));
		message.messtellen.add(klemme2+current);

		value = 256*dataStruct.getBuffer()[7]+dataStruct.getBuffer()[8];
		if (value > 25000) value = 0;
		message.werte.add((value));
		message.messtellen.add(klemme3+current);
		 */

		//First byte is reserved for the statusbyte of the brick ("documented" in  eB_Developer_Markus_Duchon.pdf Page 20 )

		message.werte.add((256*dataStruct.getBuffer()[3]+dataStruct.getBuffer()[4]));
		message.messtellen.add(klemme1 + power); // +ph1
		message.werte.add((256*dataStruct.getBuffer()[5]+dataStruct.getBuffer()[6]));
		message.messtellen.add(klemme2 +power); // ph2
		message.werte.add((256*dataStruct.getBuffer()[7]+dataStruct.getBuffer()[8]));
		message.messtellen.add(klemme3+power); // ph3

		message.werte.add((256*dataStruct.getBuffer()[9]+dataStruct.getBuffer()[10]));
		message.messtellen.add(klemme1+phase);  // ph1 +1
		message.werte.add((256*dataStruct.getBuffer()[11]+dataStruct.getBuffer()[12]));
		message.messtellen.add(klemme2+phase);
		message.werte.add((256*dataStruct.getBuffer()[13]+dataStruct.getBuffer()[14]));
		message.messtellen.add(klemme3+phase);
		

		message.werte.add((256*dataStruct.getBuffer()[15]+dataStruct.getBuffer()[16]));
		message.messtellen.add(klemme1+current);  // ph1 +1
		message.werte.add((256*dataStruct.getBuffer()[17]+dataStruct.getBuffer()[18]));
		message.messtellen.add(klemme2+current);
		message.werte.add((256*dataStruct.getBuffer()[19]+dataStruct.getBuffer()[20]));
		message.messtellen.add(klemme3+current);
				

		message.werte.add((256*dataStruct.getBuffer()[21]+dataStruct.getBuffer()[22]));
		message.messtellen.add(klemme1+voltage);
		message.werte.add((256*dataStruct.getBuffer()[23]+dataStruct.getBuffer()[24]));
		message.messtellen.add(klemme2+voltage);
		message.werte.add((256*dataStruct.getBuffer()[25]+dataStruct.getBuffer()[26]));
		message.messtellen.add(klemme3+voltage);					
		
		message.werte.add((int) dataStruct.getBuffer()[27]);
		message.messtellen.add(klemme1+distortionI);
		message.werte.add((int) dataStruct.getBuffer()[28]);
		message.messtellen.add(klemme2+distortionI);
		message.werte.add((int) dataStruct.getBuffer()[29]);
		message.messtellen.add(klemme3+distortionI);

		return message;
	}

	public static void postData(ArrayList<Message> messageList, Gson gson, Post httpPost) throws ClientProtocolException, IOException, InterruptedException{		

		if (messageList.size()>0){
			String text = "[";
			for (Message message : messageList) {
				message.zeit = System.currentTimeMillis();
				message.id = storeID;
				if(message.messtellen.size() != 0){
					text += gson.toJson(message) + ",";
				}
			}
			text = text.substring(0, text.length()-1) + "]";
			httpPost.postJsonUsingHttpClientData(text);
			output += " Send Data: \n";
			
			
			for (Message message : messageList) {
				output += gson.toJson(message) + "\n";
			}
		}
	}
}
