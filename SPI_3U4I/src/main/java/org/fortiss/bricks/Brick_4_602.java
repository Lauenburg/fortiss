package org.fortiss.bricks;

import java.util.*;



public class Brick_4_602{

	//used to check and safe/transfer the choice of the initialize command from the jason-file
	private String initCommand;
	
	//used to safe the address of the slave 
	//assigned through the position in of the the bricks array entry in the jason-file
	private int addressOfSlave = 0;

	//if a brick has more than one data package (more than one command) "nextDataPackage" is used to iterate
	//through these. 
	private int nextDataPackage =  0;

	
	//collection of the dataPackges of the brick in accordants to the jason-file
	ArrayList<short[]> dataPackage;

	//collection of the identifiers/commands fitting the arraylist data package (same order)
	ArrayList<String> commandList;

	//Constructor initialising the slaves address and the initialising-command according to the jasonfile
	public Brick_4_602(int addressOfSlave) {
		dataHeader = creatDataHeader();
		dataPackage = new ArrayList<>();
		commandList = new ArrayList<String>();
		this.addressOfSlave = addressOfSlave;
		//adjusting the data package to the assigned slave address
		setAddressOfSlave(addressOfSlave);
	}

	

	//Initializing the res data package according to the jason-file
	//adding the appropriate command identifier to the list
	public void addDataBody(String command) {
		if(command.equals("res1")){
			dataPackage.add(res1);
			commandList.add("res1");
		}
	}

	//get method for dataPackage
	public ArrayList<short[]> getDataPackage() {
		return dataPackage;
	}
	//get method for commandList
	public ArrayList<String> getCommandList() {
		return commandList;
	}
	//get method for addressOfSlave
	public int getAddressOfSlave() {
		return addressOfSlave;
	}
	//get method for initCommand
	public String getInitCommand(){
		return initCommand;
	}
	
	public int getNextDataPackage(){
		nextDataPackage++;
		if(dataPackage.size()<= nextDataPackage){
			nextDataPackage = 0;
		}
		return nextDataPackage;
	}


	public void setAddressOfSlave (int addressOfSlave){
		dataHeader[0] = (short)((byte)~ (0b00000000 + (byte) addressOfSlave)); // new adress
		dataHeader[2] = (short)((byte)~ (0b01010101 - (byte) addressOfSlave -(byte)(0b00001010))); // new checksum
	}

	//get method for the dataHeader used by the communication thread
	public short[] getDataHeader() {
		return dataHeader;
	}
	
	//get methods for the different data bodys used only in the class Brick_4_602 
	public static short[] getRes1() {
		return res1;
	}


	/**
	 * Set of methods used to increment the communication counter 
	 */
	private short commuCounter = 0;
	//get method for the communication counter
	public short getCommuCounter(){
		return commuCounter;
	}
	
	//get method for the communication counter
	public void setCommuCounter(int outputCounter){
		commuCounter = (short) outputCounter;		
	}
	
	//increment method for the communication counter
	public short incrementCommunicationCounter(){
		commuCounter++;
		commuCounter = (short) (commuCounter%256); 
		return commuCounter;
	}

	/**
	 * Method used to adjust the communication counter as well as the checksumbyte of the datapackage.
	 * This can lead to errors, however, we tested it a lot.
	 */
	public void adjustBrickCommunicationCounter(short[] data) {
		//data[1] = (short)(~commuCounter);
		//System.out.println(~dataPackage.get(nextDataPackage)[0]);
		//System.out.println("commuCounter = " + commuCounter);
		//int x = commuCounter + (~dataPackage.get(nextDataPackage)[0]);
		//int res = 85 - (x % 256);

		//System.out.println("x = " + x);
		//System.out.println("res = " + res);
		//data[30] = (short)(~res);
	}
	
	//The Header is rather simple since only command and adressbyte have to be adjusted
	
	short[] dataHeader;

	//creating dataHeader package
	private short[] creatDataHeader() {
		short[] header = new short[] {
				(short) 
				(byte)~0b00000000,					//Byte 0:   Addresbyte	=> gets set via the "setAddressOfSlave" method 
				(short) 
				(byte)~0b00001010,					//Byte 1:   Commandbyte	=> equals ten for "communication"
				(short) 
				(~(0b01010101-(byte)(0b00001010))),	//Byte 2:   Checksumbyte => calculated to equal 85
		};
		return header;
	}
	//Databodys for resource command 1-3

	//Status byte, Communic counter,Result counter,Power PA1,Power PA2,Power PB1,Power PB2,Power PC1,Power PC2,
	//Phase IA1,Phase IA2,Phase IB1,Phase IB2,Phase IC1,Phase IC2, reserved (Byte 14-18),Checksumbyte
	private static short res1[] = new short[] {~1,~1,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~0,~83,~0};

}

