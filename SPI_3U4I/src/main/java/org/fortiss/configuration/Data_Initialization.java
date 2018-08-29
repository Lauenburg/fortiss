package org.fortiss.configuration;


/**
 * Class representing the data body for the initialization sequence. 
 * For more information see Configutaration_read_me.
 * @author leander
 *
 */
public class Data_Initialization {

	//The only variable attribute is the slaves address. 
	//The address of a slave will be set through the initialization process. 
	public short[] initializationData(int slaveAdress){
		short data[] = new short[] {
				(short) 
				~(byte)slaveAdress, // Value: 		Description: Address assignment -> giving the first brick the address '1'
				~0x0,				// Value: 	 	Description: multiplier for the calculation of the SyncGap (MSB)
									// Important: 	The developer manual proposes to set this value (SyncGap) to seven. This dosn't work and the value has to be set to zero to avoid timing problems.
				~0x37,				// Value: 	 	Description: multiplier for the calculation of the SyncGap (LSB)
				~0x0, 
				~0x0, 
				~0x0, 
				~0x0, 
				~0x0, 
				(short) (~(0x55-slaveAdress-0x37)), //Value: 	Description: Checksum byte	 -> Has to equal 85: 216+124 = 85 (overflow)
				~0x0							
		};
		return data;
	}
}
