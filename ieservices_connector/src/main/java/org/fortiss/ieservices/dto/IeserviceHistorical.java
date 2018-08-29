package org.fortiss.ieservices.dto;

public interface IeserviceHistorical {

	int getId();

	void setId(int id);

	int getMessstellenid();

	void setMessstellenid(int messstellenid);

	double getIntegral();

	void setIntegral(double integral);

	long getZeitstempel();

	void setZeitstempel(long zeitstempel);

	String toString();

}