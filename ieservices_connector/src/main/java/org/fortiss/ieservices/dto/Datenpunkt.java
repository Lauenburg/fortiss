package org.fortiss.ieservices.dto;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
/*
 * serialization is the process of translating data structures or 
 * object state into a format that can be stored (for example, in a file or memory buffer) 
 * or transmitted (for example, across a network connection link) and reconstructed 
 * later (possibly in a different computer environment
 * 
 * Classes ObjectInputStream and ObjectOutputStream are high-level streams 
 * that contain the methods for serializing and deserializing an object.
 */

public class Datenpunkt implements Serializable {

	
	/*
	 * The serialization runtime associates with each serializable class a version number, 
	 * called a serialVersionUID, which is used during deserialization to verify 
	 * that the sender and receiver of a serialized object have loaded classes for that object 
	 * that are compatible with respect to serialization. 
	 */
	private static final long serialVersionUID = 1L;

	/*
	 * Parameter
	 */ 
	@Column(name = "id")
	private int id;
	@Id
	@Column(name = "messstellenid")
	private int messstellenid;
	@Column(name = "messwert")
	private double messwert; 
	@Id
	@Column(name = "zeitstempel")
	private long zeitstempel;

	//Default constructor 
	public Datenpunkt() {}

	//constructor initializing the parameters
	public Datenpunkt(int id, int messstellenid, double messwert, long zeitstempel) {
		this.id = id;
		this.messstellenid = messstellenid;
		this.messwert = messwert;
		this.zeitstempel = zeitstempel;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getMessstellenid() {
		return messstellenid;
	}

	public void setMessstellenid(int messstellenid) {
		this.messstellenid = messstellenid;
	}

	public double getMesswert() {
		return messwert;
	}

	public void setMesswert(double messwert) {
		this.messwert = messwert;
	}

	public long getZeitstempel() {
		return zeitstempel;
	}

	public void setZeitstempel(long zeitstempel) {
		this.zeitstempel = zeitstempel;
	}

	public String toString() {
		return "Datenpunkt " + this.id + " Messstelle " + this.messstellenid + " Wert " +  this.messwert + " Zeitstempel " + this.zeitstempel;
	}
	
}
