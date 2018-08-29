package org.fortiss.SPI;



import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioPinDigitalOutput;

//Class which is used to correctly terminate the Programm when it is forcefully shut down via "cmd+c" over the Terminal
public class ShutdownHook extends Thread{

	GpioController gpio;
	static GpioPinDigitalOutput selectPin06;
	ArrayList<ArrayBlockingQueue<DataStruct>> dataQueues;

	public  ShutdownHook(GpioController gpio, GpioPinDigitalOutput selectPin06, ArrayList<ArrayBlockingQueue<DataStruct>> dataQueues) {
		this.gpio = gpio;
		ShutdownHook.selectPin06 = selectPin06;
		this.dataQueues = dataQueues;
	}

	@Override
	public void run() {
		System.out.println("Gpio Shutdown");
		gpio.shutdown();
		selectPin06.low();
		System.out.println("The state of the slvae selectPin06 = "+ selectPin06.getState());
		for (ArrayBlockingQueue<DataStruct> arrayBlockingQueue : dataQueues) {
			arrayBlockingQueue.clear();
		}			
		//SPI_MasterSimple_Jason.communicationService.shutdown();

	}


}
