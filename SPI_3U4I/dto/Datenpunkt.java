package org.fortiss.ieservies.dto;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
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
	@Id @GeneratedValue
	@Column(name = "id")
	private long id;
	@Id @GeneratedValue
	@Column(name = "messstellenid")
	private long messstellenid;
	@Column(name = "messwert")
	private double messwert;
	@Id @GeneratedValue
	@Column(name = "zeitstempel")
	private long zeitstempel;

	//Default constucotr 
	public Datenpunkt() {
	}

	//constructor initialising the paramter of the wrapper class datenpunkt
	public Datenpunkt(long id, long messstellenid, double messwert, long zeitstempel) {

		this.id = id;
		this.messstellenid = messstellenid;
		this.messwert = messwert;
		this.zeitstempel = zeitstempel;

	}

	/*
	 * geter and setter classes for all atributes of the class Datenpunkte
	 */
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getMessstellenid() {
		return messstellenid;
	}

	public void setMessstellenid(long messstellenid) {
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
