#include "project.h"
#include <stdio.h>

#define WATERING_TIME_IN_SEC 1
#define STARTING_HOUR 10
#define ENDING_HOUR 20
#define NUMBER_OF_MEASUREMENTS 10
#define TIME_BETWEEN_MEASUREMENTS_IN_MILSEC 100
#define BUFFER_SIZE 256
#define OFF 1
#define ON 0

char buffer[BUFFER_SIZE];

void checkLight()
{
    sprintf(buffer, "Checking light\r\n");
    UART_UartPutString(buffer);
    /* Get current hour for clock */
    int hour = RTC_GetHours(RTC_GetTime());
    sprintf(buffer, "Current hour: %d\r\n", hour);
    UART_UartPutString(buffer);
    
    /* Check whether hour is outside of designated time frame - if so, turn it off */
    if(hour < STARTING_HOUR || hour > ENDING_HOUR){
        sprintf(buffer, "Outside of timeframe\r\n");
        UART_UartPutString(buffer);
        
        Pin_LED_blue_Write(OFF);
    }
    else {
        int positive_measurements = NUMBER_OF_MEASUREMENTS;
        /* Make several measurements of the light sensor */
        for(int i = 0; i < NUMBER_OF_MEASUREMENTS; i++){
            positive_measurements -= Pin_Light_Sensor_Read();
            CyDelay(TIME_BETWEEN_MEASUREMENTS_IN_MILSEC);
        }
        sprintf(buffer, "Number of total measurements: %d\t Number of positive measurements: %d\r\n", NUMBER_OF_MEASUREMENTS, positive_measurements);
        UART_UartPutString(buffer);
        
        /* If the light sensor catches not enough light, turn on the LED's */
        if (positive_measurements < NUMBER_OF_MEASUREMENTS/2)
        {
            sprintf(buffer, "Turning LEDs on\r\n");
            UART_UartPutString(buffer);

            Pin_LED_blue_Write(ON);   
        } 
        /* Else turn them off */
        else 
        {
            sprintf(buffer, "Turning LEDs off\r\n");
            UART_UartPutString(buffer);
            
            Pin_LED_blue_Write(OFF);
        }
    }
}

void checkMoisture()
{
    sprintf(buffer, "Checking moisture\r\n");
    UART_UartPutString(buffer);
    int positive_measurements = NUMBER_OF_MEASUREMENTS;
    /* Make several measurements of the moisture sensor */
    for(int i = 0; i < NUMBER_OF_MEASUREMENTS; i++){
        positive_measurements -= Pin_Moisture_Sensor_Read();
        CyDelay(TIME_BETWEEN_MEASUREMENTS_IN_MILSEC);
    }
    sprintf(buffer, "Number of total measurements: %d\t Number of positive measurements: %d\r\n", NUMBER_OF_MEASUREMENTS, positive_measurements);
    UART_UartPutString(buffer);

    /* If the ground isn't wet enough, water the plant for a specified amount of time */
    if (positive_measurements < NUMBER_OF_MEASUREMENTS/2)
    {
        /* Turn pump on */
        sprintf(buffer, "Turning pump on\r\n");
        UART_UartPutString(buffer);
        Pin_pump_Write(ON);
        /* Wait for specified amount of watering time */
        CyDelay(WATERING_TIME_IN_SEC * 1000);
        /* Turn pump off */
        sprintf(buffer, "Turning pump off\r\n");
        UART_UartPutString(buffer);
        Pin_pump_Write(OFF);
    }
}

CY_ISR(Pin_Light_Sensor_Handler)
{
    sprintf(buffer, "Waking up again\r\n");
    UART_UartPutString(buffer);
    
    checkLight();
    
    Pin_Light_Sensor_ClearInterrupt();
}

CY_ISR(Pin_Moisture_Sensor_Handler)
{
    sprintf(buffer, "Waking up again\r\n");
    UART_UartPutString(buffer);
    
    checkMoisture();
    
    Pin_Moisture_Sensor_ClearInterrupt();
}

int main(void)
{
    /* Enable global interrupts. */   
    CyGlobalIntEnable; 

    /* Place your initialization/startup code here (e.g. MyInst_Start()) */
    UART_Start();
    RTC_Start();
    Pin_Light_Sensor_int_StartEx(Pin_Light_Sensor_Handler);
    Pin_Moisture_Sensor_int_StartEx(Pin_Moisture_Sensor_Handler);
    
    sprintf(buffer, "Let's go\r\n");
    UART_UartPutString(buffer);
    
    Pin_LED_blue_Write(OFF);
    Pin_pump_Write(OFF);
    
    for(;;)
    {
        sprintf(buffer, "Going to sleep until interrupt\r\n");
        UART_UartPutString(buffer);
        
        CySysPmSleep();
    }
}

/* [] END OF FILE */
