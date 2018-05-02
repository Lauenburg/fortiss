package org.fortiss.ieservices.dto;



import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;



/*
 * serialization is the process of translating data structures or 
 * object state into a format that can be stored (for example, in a file or memory buffer) 
 * or transmitted (for example, across a network connection link) and reconstructed 
 * later (possibly in a different computer environment
 * 
 * Classes ObjectInputStream and ObjectOutputStream are high-level streams 
 * that contain the methods for serializing and deserializing an object.
 */
@Entity
public class ClampSetup implements Serializable {


	/*
	 * The serialization runtime associates with each serializable class a version number, 
	 * called a serialVersionUID, which is used during deserialization to verify 
	 * that the sender and receiver of a serialized object have loaded classes for that object 
	 * that are compatible with respect to serialization. 
	 */

	private static final long serialVersionUID = 2L;
	
	
	/*
	 * Creating the table:
	 * create table clampSetup (storeID int not null, id_Clip1 int not null, description_cp1 varchar(50),
	 	id_Clip2 int not null, description_cp2 varchar(50),id_Clip3 int not null,description_cp3 varchar(50),
	 	timeStamp bigint not null,Primary key(storeID, timeStamp));
	 */

	/*
	 * Parameter
	 */
	@Id
	@Column(name = "storeID")
	private int storeID; 
	@Id
	@Column(name = "id_Clip1")
	private int id_Clip1;
	@Column(name = "description_cp1")
	private String description_cp1; 
	@Id
	@Column(name = "id_Clip2")
	private int id_Clip2;
	@Column(name = "description_cp2")
	private String description_cp2; 
	@Id
	@Column(name = "id_Clip3")
	private int id_Clip3;
	@Column(name = "description_cp3")
	private String description_cp3; 
	@Id
	@Column(name = "timeStamp")
	private long timeStamp;

	//constructor initialising the paramter of the wrapper class datenpunkt
	public ClampSetup(int storeID, int id_Clip1, int id_Clip2, int id_Clip3 , 
			String description_cp1, String description_cp2, String description_cp3) {
		this.storeID = storeID;
		this.id_Clip1 = id_Clip1;
		this.id_Clip2 = id_Clip2;
		this.id_Clip3 = id_Clip3;
		this.description_cp1 = description_cp1;
		this.description_cp2 = description_cp2;
		this.description_cp3 = description_cp3;
		this.timeStamp = System.currentTimeMillis();
	}
	
	public ClampSetup() {};

	public int getStoreID() {
		return storeID;
	}

	public void setStoreID(int storeID) {
		this.storeID = storeID;
	}

	public int getId_Clip1() {
		return id_Clip1;
	}

	public void setId_Clip1(int id_Clip1) {
		this.id_Clip1 = id_Clip1;
	}

	public String getDescription_cp1() {
		return description_cp1;
	}

	public void setDescription_cp1(String description_cp1) {
		this.description_cp1 = description_cp1;
	}

	public int getId_Clip2() {
		return id_Clip2;
	}

	public void setId_Clip2(int id_Clip2) {
		this.id_Clip2 = id_Clip2;
	}

	public String getDescription_cp2() {
		return description_cp2;
	}

	public void setDescription_cp2(String description_cp2) {
		this.description_cp2 = description_cp2;
	}

	public int getId_Clip3() {
		return id_Clip3;
	}

	public void setId_Clip3(int id_Clip3) {
		this.id_Clip3 = id_Clip3;
	}

	public String getDescription_cp3() {
		return description_cp3;
	}

	public void setDescription_cp3(String description_cp3) {
		this.description_cp3 = description_cp3;
	}

	public long getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(long timeStamp) {
		this.timeStamp = timeStamp;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}		
}

