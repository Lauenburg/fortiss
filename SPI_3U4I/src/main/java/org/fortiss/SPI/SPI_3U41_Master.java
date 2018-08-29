package org.fortiss.SPI;



import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

import org.fortiss.configuration.Logging;
import org.fortiss.gson.JsonFileReader;
import org.fortiss.gson.WrapperOperationMode;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.PinState;
import com.pi4j.io.gpio.RaspiPin;
import com.pi4j.io.spi.SpiChannel;
import com.pi4j.io.spi.SpiDevice;
import com.pi4j.io.spi.SpiFactory;
import com.pi4j.io.spi.SpiMode;
import com.pi4j.util.Console;

public class SPI_3U41_Master{


	//Instance of the class SpiDevice
	public static SpiDevice spi = null;

	//Instance of the class Console used manly to be able to exit a running process via "ctrl + c"
	protected static final Console console = new Console();

	//executerservice for the communication
	public static ExecutorService communicationGetData;
	public static ExecutorService communicationPostData;


	public static void main(String[] arg) throws Exception{
		
		console.title("<-- fortiss -->", "SPI communication program using emBricks");

		// allow for user to exit program using CTRL-C
		console.promptForExit();

		// create gpio controller to be able to use the slave select lines
		GpioController gpio = GpioFactory.getInstance();

		/*
		 * GPIO Pins:
		 * Pin06: Slave select Pin
		 * 
		 * Warning:
		 * The pi4j libary remaps the gpio pins.
		 * As a result the arguments of the spi device concerning the slave select lines are not correct.
		 * Therefore the slave select lines have to be set manualy.
		 * 
		 */

		//make pin6 an output pin and set it to low by default ->mandatory for starting new initialization sequence
		final  GpioPinDigitalOutput slaveSelect06 =  gpio.provisionDigitalOutputPin(RaspiPin.GPIO_06, "CS0", PinState.LOW);
		@SuppressWarnings("unused")
		final  GpioPinDigitalOutput slaveSelect05 =  gpio.provisionDigitalOutputPin(RaspiPin.GPIO_04, "CS0", PinState.LOW);
		@SuppressWarnings("unused")
		final  GpioPinDigitalOutput slaveSelect04 =  gpio.provisionDigitalOutputPin(RaspiPin.GPIO_05, "CS0", PinState.LOW);
		//slaveSelect04.high();
		//slaveSelect05.high();
		//initializing the SpiDevice
		//Node worthy: CS0 has no effect on the bricks since a different slave select line is used
		spi = SpiFactory.getInstance(SpiChannel.CS0, 	// CS0 is setting the first of the two slave select lines to high
				400000, 								// setting the spi speed to value-Hz
				SpiMode.MODE_1); 						// Setting the Clock Polarity to '0' and Clock Phase to '1'


		//initialisation of the executerservice
		communicationGetData = Executors.newSingleThreadExecutor();
		communicationPostData = Executors.newSingleThreadExecutor();

		//creating the LinkedBlockingQueues for the communication between the threads
		ArrayList<ArrayBlockingQueue<DataStruct>> dataQueues = new ArrayList<>(); // muss im Clips erstellt werden		
		
		//ArrayBlockingQueue<DataStruct> queueData = new ArrayBlockingQueue<>(10);
		
		//Creating instance of the class shutdown hook which oversees a correct shutdown of the threads and gpios
		ShutdownHook myHook = new ShutdownHook(gpio,slaveSelect06,dataQueues);

		WrapperOperationMode operationMode = JsonFileReader.readOperationMode();
		
		Logger logger = Logging.loggerinit();
		DataStruct[] dsArray = new DataStruct[5];
		
		Thread_Communicate_SPI spiCommunicator = new Thread_Communicate_SPI(operationMode.getOutputStyle(), logger, spi, slaveSelect06, dataQueues, dsArray);
		communicationGetData.submit(spiCommunicator);
		
		Thread.sleep(20);		
		Thread_Communicate_Post postCommunicator = new Thread_Communicate_Post(dataQueues, operationMode, logger, dsArray);
		communicationPostData.submit(postCommunicator);

		Runtime.getRuntime().addShutdownHook(myHook);
	}




}
