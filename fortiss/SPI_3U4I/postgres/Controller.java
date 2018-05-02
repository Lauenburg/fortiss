package org.fortiss.ieservies.postgres;

import org.fortiss.ieservies.dto.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

/*
 * This class implements the for the hibernate framework needed methods
 */

public class Controller {

	//Hibernate SessionFactory is the factory class through which we get sessions 
	//and perform database operations.
	//Hibernate SessionFactory provides three methods through which we can get Session object 
	// getCurrentSession(), openSession() and openStatelessSession().
	private SessionFactory sessionFactory;
	
	//A Session is used to get a physical connection with a database. Which gets handelt by the SessionFactory
	private Session session;

	@SuppressWarnings("deprecation")
	//configurierung der sessionFactory siehe hibernate.cfg.xml file
/*
 * Jede hibernate Anwendung benötigt ein Mapping file und ein configurationfile pro Datenbank.
 * Das Mapping file stimmt die Struktur des Tabel der DB mit der Struktur der hochzuladenen Daten ab.
 * Wir verwenden hier kein Mapping file sondern Mapping klassen. Spezifischer: Datenpunkt, EnergyData, Filiale und Messstelle
 * Das Configurationfile ist zuständig für die tastsächliche Verbindung zu DB (url, user, passwort...).
 * Es handhabt die Connection Properties, Hibernate Properties,Mapping file name(s).
 * Da wir kein Mappingfile haben müssen wir hier die Mappingklassen auflisten.
 */
	public Controller() {
		sessionFactory = new Configuration().configure("hibernate.cfg.xml").buildSessionFactory();
		
	}

	//Method welche die Daten in die DB schreibt.
	public void insert(Datenpunkt data) {
		
		session = sessionFactory.openSession();
		if (session != null) {
			session.beginTransaction();

			session.save(data);
			System.out.println("Controller: saved data: " + data);

			session.getTransaction().commit();
			session.close();
		} else {
			System.out.println("Session: could not open session");
		}

	}

}
