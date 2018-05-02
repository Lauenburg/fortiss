package org.fortiss.ieservies.dto;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;



@Entity
public class EnergyData implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="filialename")
	private String filialname;
	private Double p1_gesamt;
	private Double p2_gesamt;
	private Double p3_gesamt;
	@EmbeddedId
	@Column(name="timestamp")
	private Long time;
	
	
	public EnergyData() {
		
	}
	
	public EnergyData(String filialname, double p1_gesamt, double p2_gesamt, double p3_gesamt, long time) {
		this.filialname = filialname;
		this.p1_gesamt = p1_gesamt;
		this.p2_gesamt = p2_gesamt;
		this.p3_gesamt = p3_gesamt;
	}

	/*
	 * Getters n Setters
	 */
	
	public String getFilialname() {
		return filialname;
	}

	public void setFilialname(String filialname) {
		this.filialname = filialname;
	}

	public Double getP1_gesamt() {
		return p1_gesamt;
	}

	public void setP1_gesamt(Double p1_gesamt) {
		this.p1_gesamt = p1_gesamt;
	}

	public Double getP2_gesamt() {
		return p2_gesamt;
	}

	public void setP2_gesamt(Double p2_gesamt) {
		this.p2_gesamt = p2_gesamt;
	}

	public Double getP3_gesamt() {
		return p3_gesamt;
	}

	public void setP3_gesamt(Double p3_gesamt) {
		this.p3_gesamt = p3_gesamt;
	}
	
	public Long getTime() {
		return this.time;
	}
	
	public void setTime(long time) {
		this.time = time;
	}
	
	/*
	 * Functions
	 */
	
	public String toString() {
		return filialname + " Gesamtleistung: "+ summeGesamt() + "("+ p1_gesamt + ", " + p2_gesamt + ", " + p3_gesamt + ")"; 
	}
	
	private Double summeGesamt() {
		return p1_gesamt + p2_gesamt + p3_gesamt;
	}


	
	
}
