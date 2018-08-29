package org.fortiss.ieservies.dto;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
public class Messstelle implements Serializable {

	private static final long serialVersionUID = 1L;
	
	/*
	 * Parameter
	 */
	@Column(name="id")
	private long id;
	@Id
	@Column(name="messstellenid")
	private long messstellenid;
	@Column(name="name")
	private String name;
	@Column(name="einheit")
	private String einheit;
	
	public Messstelle() {
		
	}
	
	public Messstelle(long id, long messstellenid, String name, String einheit) {
		this.id = id;
		this.messstellenid = messstellenid;
		this.name = name;
		this.einheit = einheit;
	}

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEinheit() {
		return einheit;
	}

	public void setEinheit(String einheit) {
		this.einheit = einheit;
	}
	
	
	
}
