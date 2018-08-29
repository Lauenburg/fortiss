package org.fortiss.configuration;

//Class representing the data body for the slave select sequence.
//For the select sequence only the header is important. Before a brick has been initialized it dosn't has a address.
//Therefore the header of the select sequence is used to carry the command that the next brick which hasn't been initialized jet should be selected.
//This data body only consist of two bytes since a valid communication always must have a header and a body where the body must always include the status byte and the checksum byte.
public class Data_SlaveSelect {

	public short[] slaveSelectData(int slaveAdress){

		short data[] = new short[] {
						//Data
						~0x0,							// Status byte slave
						~0x55							// Checksum byte slave
						};				
			
		return data;
	}

}