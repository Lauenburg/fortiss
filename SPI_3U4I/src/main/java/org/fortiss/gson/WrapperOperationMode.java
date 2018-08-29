package org.fortiss.gson;

/**
 * OutputStyle choose 1(debug) | 2(operation with DBpush)
 */
public class WrapperOperationMode {

	private int numberOfBricks;
	private int outputStyle;
	private String server;
	private String datapath;
	private String mappingpath;

	public int getNumberOfBricks() {
		return numberOfBricks;
	}
	public int getOutputStyle() {
		return outputStyle;
	}
	
	public String getServer() {
		return server;
	}
	
	public String getDatapath() {
		return datapath;
	}
	
	public String getMappingpath() {
		return mappingpath;
	}
	
}
