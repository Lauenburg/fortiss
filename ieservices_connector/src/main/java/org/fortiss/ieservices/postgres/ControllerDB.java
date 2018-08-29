package org.fortiss.ieservices.postgres;

import org.fortiss.ieservices.dto.ClampSetup;
import org.fortiss.ieservices.dto.Datenpunkt;
import org.fortiss.ieservices.json.Message;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

/*
 * This class implements the for the hibernate framework needed methods
 */
public class ControllerDB {

	//Hibernate SessionFactory is the factory class through which we get sessions 
	//and perform database operations.
	//Hibernate SessionFactory provides three methods through which we can get Session object 
	// getCurrentSession(), openSession() and openStatelessSession().
	public SessionFactory sessionFactoryFromConfiguration;

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
	public ControllerDB() {
		sessionFactoryFromConfiguration = new Configuration().configure("hibernateData.cfg.xml").buildSessionFactory();
	}

	//Method wich inserts the information from the bricks to the db 
	public void insertDatapunktArray(Datenpunkt[] datenpunkt) {		
		session = sessionFactoryFromConfiguration.openSession();
		if (session != null) {
			session.beginTransaction();
			for(Datenpunkt data : datenpunkt) {
				session.save(data);
			}
			session.getTransaction().commit();
			System.out.print(".");
		} else {
			System.out.println("Session: could not open session");
		}
		session.close();
	}
	
	/**
	 * Writes the setup of the clamps to the setup db at startup of the bricks.
	 * This could also be the place to start the statistical generator.
	 * @param clampSetup
	 */
	public void insertSetup(ClampSetup clampSetup ) {
		session = sessionFactoryFromConfiguration.openSession();
		if (session != null) {
			session.beginTransaction();
			session.save(clampSetup);			
			session.getTransaction().commit();			
		} else {
			System.out.println("Session: could not open session");
		}
		session.close();
	}

	public void insertData(Message[] messageArray) { 
		int sizeMessages = messageArray.length;
		Datenpunkt[][] datenpunkte = new Datenpunkt[sizeMessages][]; // Eigentlich ist es immer statisch. Aber zur besseren Wartbarkeit wir den Cast flexibel.
		if (sizeMessages > 0) {
			int sizeDatenpunkte = 0;
			for (int i = 0; i < datenpunkte.length; i++) {
				datenpunkte[i] = messageArray[i].toDatenpunktArray();
				sizeDatenpunkte += datenpunkte[i].length;
			}
			
			Datenpunkt[] dpToStore = new Datenpunkt[sizeDatenpunkte];
			int counter = 0;
			for (int i = 0; i < datenpunkte.length; i++) {
				for (int j = 0; j < datenpunkte[i].length; j++) {
					dpToStore[counter] = datenpunkte[i][j];
					counter++;
				}
			}
			
			insertDatapunktArray(dpToStore);
		}
		
	}	

}
