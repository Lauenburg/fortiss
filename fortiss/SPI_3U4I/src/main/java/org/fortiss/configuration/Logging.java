package org.fortiss.configuration;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import org.fortiss.gson.JsonFileReader;

public class Logging {
	
	@SuppressWarnings("unused")
	public static Logger loggerinit() {
		Logger logger = Logger.getLogger("MyLog");
		logger.setUseParentHandlers(false);
		FileHandler fileHandler;  
		// This block configure the logger with handler and formatter  
		try {
			fileHandler = new FileHandler(JsonFileReader.LOGGINGFILE);
			SimpleFormatter formatter = new SimpleFormatter();
			fileHandler.setFormatter(formatter);
			logger.addHandler(fileHandler);
		} catch (SecurityException | IOException e) {
			System.out.println("FEHLER");
			e.printStackTrace();
		}  
		logger.setLevel(Level.WARNING);

		return logger;

	}

}
