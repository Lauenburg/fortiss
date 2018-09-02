#### SPI_3U4I

For the research project iE-Services fortiss developed in active cooperation with other industry partners a high-resolution energy monitoring system.  

The system is comprised of a raspberry pi as master and up to five B-3U4I-400 bricks as slaves. 

SPI_3U4I incorporates an implementation of the SPI protocol using the pi4j library for the communication between the master and the slaves. Build on top of the B-3U4I-400 communication protocol the building block includes numerous hardware specific adaptions, including an extensive initialization procedure and error handling. The project builds around two significant threads, one handling the communication between the master and the slaves and the other processing the data, converting it to JSON and posting it to the backend via HTTP.

The development of this software included endless signal analyzation on byte level to identify bugs in hard- and software and due to so far insufficient documentation. 
