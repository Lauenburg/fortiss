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

public class HistoricalDayValue implements Serializable, IeserviceHistorical {

	
	/*
	 * The serialization runtime associates with each serializable class a version number, 
	 * called a serialVersionUID, which is used during deserialization to verify 
	 * that the sender and receiver of a serialized object have loaded classes for that object 
	 * that are compatible with respect to serialization. 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Class Parameters
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
	public HistoricalDayValue() {}

	//Constructor initializing the parameters
	public HistoricalDayValue(int id, int messstellenid, double integral, long zeitstempel) {
		this.id = id;
		this.messstellenid = messstellenid;
		this.integral = integral;
		this.zeitstempel = zeitstempel;
	}
	
	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#getId()
	 */
	@Override
	public int getId() {
		return id;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#setId(int)
	 */
	@Override
	public void setId(int id) {
		this.id = id;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#getMessstellenid()
	 */
	@Override
	public int getMessstellenid() {
		return messstellenid;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#setMessstellenid(int)
	 */
	@Override
	public void setMessstellenid(int messstellenid) {
		this.messstellenid = messstellenid;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#getIntegral()
	 */
	@Override
	public double getIntegral() {
		return integral;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#setIntegral(double)
	 */
	@Override
	public void setIntegral(double integral) {
		this.integral = integral;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#getZeitstempel()
	 */
	@Override
	public long getZeitstempel() {
		return zeitstempel;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#setZeitstempel(long)
	 */
	@Override
	public void setZeitstempel(long zeitstempel) {
		this.zeitstempel = zeitstempel;
	}

	/* (non-Javadoc)
	 * @see org.fortiss.ieservies.dto.IeserviceHistorical#toString()
	 */
	@Override
	public String toString() {
		return "HistoricalDayValue " + this.id + " Messstelle " + this.messstellenid + " IntegralWert " +  this.integral + " Zeitstempel " + this.zeitstempel;
	}
	
}
