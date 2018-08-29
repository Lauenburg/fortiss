package org.fortiss.configuration;

import java.util.Arrays;
import java.util.ArrayList;

import org.fortiss.bricks.Brick_4_602;
import org.fortiss.gson.JsonFileReader;
import org.fortiss.gson.WrapperOperationMode;

public class Setup {

	//Wrapper class representing the connected bricks.
	//Used to transfer the information from the setupFile.json to the program
	public WrapperOperationMode  wrapperOperationMode;

	//Counter for the number of the slaves with different addresses
	//every entry in the array of the json represents an brick 
	int addressOfSlave;

	//stores the bricks created by the method seting() according to the information from the json
	public ArrayList<Brick_4_602> bricksList;


	/*
	 * stores the data packages for the initialization fitting to bricksList
	 */
	public ArrayList<short[]> init_DataHeaderAndBody = new ArrayList<short[]>();
	public ArrayList<short[]> init_DataBody = new ArrayList<short[]>();
	public ArrayList<short[]> select_Data = new ArrayList<short[]>();


	//constructor 
	public Setup() {
		bricksList = new ArrayList<Brick_4_602>();
		//setting addressOfSlave to one so that the first brick starts with this address 
		addressOfSlave = 1;
		//creating in instance of the class JasonFileReader to be able to read the setupFile.json
		JsonFileReader configurationFile = new JsonFileReader();
		//filling the array of wrapper instances according to the information from the the json
		wrapperOperationMode = configurationFile.readOperationMode();
		
		setting();

	}
	/*Creating instances of all classes involved in the communication between master and slaves to prohibit delays*/

	/*
	seting() goes through the array in the Json representing of wrapper classes.
	For every entry in this array the method will create an brick instance and add it to the list "bricksList".
	Which data package will be initialized for a unique brick depends on the json.
	*/
	public void setting(){
		for (int i = 0; i< wrapperOperationMode.getNumberOfBricks();i++) {	
				bricksList.add(new Brick_4_602(addressOfSlave));
				bricksList.get(addressOfSlave-1).addDataBody("res1");
				addressOfSlave++;
			}
		//The call to the following methods create the to the List bricksList fitting data packages for the initialization.
		init_DataHeaderAndBody = initData();
		select_Data = selectData();
	}

	/*
	 * This method is used to combine the initialize data body with the initialize data header to one array.
	 * This is done since obviously the sleep between header and body, as written in the documentation, isn't needed
	 * and sending these packages as one is way faster.
	 */
	public static short[] concatArrays(short[] header, short[] body) {
		//copys the array heder st the front of a new array result of the length of header+body
		short[] result = Arrays.copyOf(header, header.length + body.length);
		//copys the second array data in to the end of result
		System.arraycopy(body, 0, result, header.length, body.length);
		return result;
	}

	/*
	 * 
	 */
	public ArrayList<short[]> initData() {
		Data_Header init_header = new Data_Header();
		Data_Initialization init_Body = new Data_Initialization();
		ArrayList<short[]> initData = new ArrayList<short[]>();
		for(int j = 1; j< addressOfSlave;j++){
			//bei der initaliesierung ist der Adressbyte (der erste byte) immer null!
			short[] header = init_header.headerData(0, 2);
			short[] body = init_Body.initializationData(j);
			short[] data = concatArrays(header, body);
			initData.add(data);

		}
		return initData;
	}

	public ArrayList<short[]> selectData() {
		/*Creating instances of all classes involved in the communication between master and slaves to prohibit delays*/
		Data_Header select_header = new Data_Header();
		ArrayList<short[]> selectDataHeader = new ArrayList<short[]>();
		Data_SlaveSelect select_Data = new Data_SlaveSelect();
		/*for(int j = 1; j< adressOfSlave;j++){
			//bei der initaliesierung ist der Adressbyte (der erste byte) immer null!
			selectDataHeader.add(select_header.headerData(j, 3));
		}
		return selectDataHeader;
		 */
		for(int j = 1; j< addressOfSlave;j++){
			//bei der initaliesierung ist der Adressbyte (der erste byte) immer null!
			short[] header = select_header.headerData(j, 3);
			short[] body = select_Data.slaveSelectData(j);
			short[] data = concatArrays(header, body);
			selectDataHeader.add(data);
		}
		return selectDataHeader;
	}

}
