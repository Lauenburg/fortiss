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

public class HistoricalMinuteValue implements Serializable, IeserviceHistorical {

	
	/*
	 * The serialization runtime associates with each serializable class a version number, 
	 * called a serialVersionUID, which is used during deserialization to verify 
	 * that the sender and receiver of a serialized object have loaded classes for that object 
	 * that are compatible with respect to serialization. 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Class Parameter
	 */ 
	@Column(name = "id")
	private int id;
	
	@Id
	@Column(name = "messstellenid")
	private int messstellenid;
	
	@Column(name = "integral")
	private double integral;
	
	@Id
	@Column(name = "zeitstempel")
	private long zeitstempel;

	//Default constructor 
	public HistoricalMinuteValue() {}

	//constructor initializing the parameters
	public HistoricalMinuteValue(int id, int messstellenid, double messwert, long zeitstempel) {
		this.id = id;
		this.messstellenid = messstellenid;
		this.integral = messwert;
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

	public double getIntegral() {
		return integral;
	}

	public void setIntegral(double integral) {
		this.integral = integral;
	}

	public long getZeitstempel() {
		return zeitstempel;
	}

	public void setZeitstempel(long zeitstempel) {
		this.zeitstempel = zeitstempel;
	}

	public String toString() {
		return "HistoricalMinuteValue " + this.id + " Messstelle " + this.messstellenid + " IntegralWert " +  this.integral + " Zeitstempel " + this.zeitstempel;
	}
	
}
