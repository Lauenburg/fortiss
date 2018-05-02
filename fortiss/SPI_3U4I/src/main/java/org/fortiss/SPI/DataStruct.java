package org.fortiss.SPI;

public class DataStruct {
	
	int[] buffer;
	String bodyTyp;
	Integer slave;
	
	public DataStruct(String bodyTyp, int slave, int[] bufBody) {
		this.bodyTyp = bodyTyp;
		this.slave = slave;
		this.buffer = bufBody;
	}	
	
	public int[] getBuffer(){
		return buffer;
	}
	public String getBodyTyp(){
		return bodyTyp;
	}
	public int getSlave(){
		return slave;
	}
}
