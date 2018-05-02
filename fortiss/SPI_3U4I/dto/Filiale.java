package org.fortiss.ieservies.dto;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
public class Filiale implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/*
	 * Parameter
	 */
	@Id
	@Column(name="id")
	private long id;
	@Column(name="filialname")
	private String filialname;

	public Filiale() {
		
	}
	
	public Filiale(long id, String filialname) {
		this.id = id;
		this.filialname = filialname;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getFilialname() {
		return filialname;
	}

	public void setFilialname(String filialname) {
		this.filialname = filialname;
	}
	
	
}
