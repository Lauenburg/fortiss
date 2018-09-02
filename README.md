# fortiss
## fortiss GmbH
fortiss GmbH is a public research institute for software-intensive systems and services which I work for since June 2017.

This repository  contains the following four building blocks of the research project iE-Services:

+ SPI_3U4I

+ ieservices_connector

+ D3_2.0

+ HighCharts

#### SPI_3U4I

For the research project iE-Services fortiss developed in active cooperation with other industry partners a high-resolution energy monitoring system.  

The system is comprised of a raspberry pi as master and up to five B-3U4I-400 bricks as slaves. 

SPI_3U4I incorporates an implementation of the SPI protocol using the pi4j library for the communication between the master and the slaves. Build on top of the B-3U4I-400 communication protocol the building block includes numerous hardware specific adaptions, including an extensive initialization procedure and error handling. The project builds around two significant threads, one handling the communication between the master and the slaves and the other processing the data, converting it to JSON and posting it to the backend via HTTP.

The development of this software included endless signal analyzation on byte level to identify bugs in hard- and software and due to so far insufficient documentation. 

#### ieservices_connector

ieservices_connector is the server site supplement to SPI_3U4I.

Using the Spring framework ieservices_connector implements a RESTful service and using the hibernate framework it maps incoming data to database tables of a Postgres database as well as handling the overall SQL queries.
Additionally, ieservices_connector calculates the historical data from the incoming input and provides access to the data visualization D3_2.0.


#### D3_2.0

D3_2.0 is a versatile data visualization for the data acquired by the deployed energy monitoring systems using the JavaScript framework D3. 



The data is presented in the wollowing formats: 
 + Live view
 + Hour
 + Day
 + Month

For the **live view** it is possible to switch between the different B-3U4I-400 bricks as well as select and deselect the depicted variables power, phase shift, voltage, current and total harmonic distortion.

The **hour view** depicts a bar chart of the chosen hour, allowing to show an aggregated and disaggregated view of the three phases.

The **day view** as well as the **month view** can depict the data of the chosen time frame as a pie chart, bar chart or line chart. The bar chart and pie chart allows to aggregate and disaggregates between the three phases. Additionally, the pie chart can disaggregate the aggregated consumption for the single consumers and not assignable power consumption.
The line charts depict the consumption of a single consumer chosen in a drop-down menu.

#### HighCharts

Highcharts is like D3_2.0 a data visualization for the data acquired by the deployed energy monitoring systems, but instead of D3, it uses the JavaScript Framework HighCharts.

Like D3_2.0 it provides a live view, an hour view, a day view and a month view. However, it misses the disaggregation capabilities.
