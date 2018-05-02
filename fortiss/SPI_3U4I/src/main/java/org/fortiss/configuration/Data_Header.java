package org.fortiss.configuration;

/**
 * The class Data_Header is at the moment only used by the setup class.
 * Within the setup class the method headerData() gets called to create the headers for the initialize sequence and the select sequence.
 * (The headers for the data packages are being created with in the Brick-Classes themself)
 * @author leander
 *
 */ 
public class Data_Header {
	
	public short[] headerData(int slaveAdress,int command){
		short data[] = new short[] {
				(short) 
				~(byte)slaveAdress, 							 //Byte 0:   Addresbyte	=> gets set via the "setAddressOfSlave" method
				(short) 
				~(byte)command,									 //Byte 1:   Commandbyte	
				(short) 
				(~(0b01010101-(byte)slaveAdress-(byte)command)), //Byte 2:   Checksumbyte => calculated to equal 85
		};
		return data;
	}

}