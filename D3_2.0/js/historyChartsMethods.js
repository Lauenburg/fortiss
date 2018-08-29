/*
Methods used by all three history charts (hourChart, dayChart, monthChart)
 */

/*
Checks if the array returned by the server is empty.
If it is a notification is send and the dashboard values are set to "/".
The method returns true for the the drawing functions to exit.
 */
function noData(dataBrick, container, tapNR) {
    if(dataBrick.length === 0 || dataBrick[0].data.length <= 1){
            d3.select(container).select("p").remove();


        jQuery.notify("No data", "info");

        document.getElementsByClassName("valueSUM")[tapNR].innerHTML = "/";
        document.getElementsByClassName("valueMoney")[tapNR].innerHTML = "/";
        document.getElementsByClassName("valueMAX")[tapNR].innerHTML = "/";
        document.getElementsByClassName("valueAVG")[tapNR].innerHTML = "/";

        var chartTyps = ["Month","Day"];
        for(var l = 0; l <chartTyps.length;l++){

            var chartType = chartTyps[l]
            document.getElementsByClassName("valueSUMDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML = "/";
            document.getElementsByClassName("valueMoneyDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML = "/";
            document.getElementsByClassName("valueMAXDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML = "/";
            document.getElementsByClassName("valueAVGDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML = "/";

            for(var phaseNr = 0; phaseNr<2;phaseNr++) {
                console.log(phaseNr)
                console.log(chartType)
                document.getElementsByClassName("valueSUMDisaggreagted" + chartType + phaseNr)[0].innerHTML = "/";
                document.getElementsByClassName("valueMoneyDisaggreagted" + chartType + phaseNr)[0].innerHTML = "/";
                document.getElementsByClassName("valueMAXDisaggreagted" + chartType + phaseNr)[0].innerHTML = "/";
                document.getElementsByClassName("valueAVGDisaggreagted" + chartType + phaseNr)[0].innerHTML = "/";
            }
        }

        return true;
    }

}

/*
The bar- and the picharts are supposed to only display the consumption of the single phases and not for every consumer.
This method filters the consumers according to the phases.
 */
function filterForPh(dataBrick) {
    var filteredData=[];
    for(var l = 0; l < dataBrick.length;l++) {
        if (!dataBrick[l].name.search("PH1") || !dataBrick[l].name.search("PH2") || !dataBrick[l].name.search("PH3")) {
            filteredData.push(dataBrick[l]);
        }
    }
    return filteredData;

}

function filterForAllConsumers(dataBrick) {
    var filteredData=[];
    console.log(dataBrick)

    for(var l = 0; l < dataBrick.length;l++) {
        if (dataBrick[l].name.search("PH1") && dataBrick[l].name.search("PH2") && dataBrick[l].name.search("PH3")){
            filteredData.push(dataBrick[l]);
        }
    }
    return filteredData;

}

function filterForSinglePh(dataBrick, phase) {
    var filteredData=[];
    for(var l = 0; l < dataBrick.length;l++) {
        if (!dataBrick[l].name.search(phase) ){

            filteredData.push(dataBrick[l]);
        }
    }
    return filteredData;

}


/*
The line charts are used to display the consumption of the single consumers.
This method filters therefore the array returned by the server after the different consumers.
 */
function filterForConsumer(dataBrick,consumer) {
    var filteredData=[];
    for(var l = 0; l < dataBrick.length;l++) {
        if (!dataBrick[l].name.search(consumer)) {
            filteredData.push(dataBrick[l]);
            break;
        }
    }
    return filteredData;

}


/*
converts the timestamps returned by the backend to a format d3 can use
 */
function timeConversion(dataBrick,format) {
    //Converting time stamps to correct format for the x axis
    var blockTimes = dataBrick[0].data.map(function (d) {
        return  moment(d.time).locale('de').format(format)
    });

    return blockTimes
}

/*
filters out the names of the consumers from the array returned by the server
 */
function labels(dataBrick) {
    //Collecting the labels of the different metering points
    var labels = [];
    for (var i = 0; i < dataBrick.length; i++) {
        if (dataBrick[i].name !== null) {
            labels.push(dataBrick[i].name)
        }
    }
    return labels;
}


/*
        For the block and pi charts this function does two things:
       1. Converting the data from the json to arrays
       2. Taking the extracted arrays and converting them to one array with an appropriate structure fore d3.stack()
           by calling processingJson()

             returns: Array of objects of format{xValue , yValue_1,...,yValue_n, sumOfyValues}

       The linechart needs a different format than the block and pi chart:
       1. Converting the data from the json to arrays
*/
function jsonToArrayProcessingData(filteredData, blockTimes, chartType) {
   var xValues = [];
   var yValues = [];
   var yValuesBrickNr = [];

   //for loop for the number of bricks
   for(var j = 0; j < filteredData.length;j++) {
       //for loop for the number of values per brick
       for (var counter = 0; counter < filteredData[j].data.length; counter++) {
           if(filteredData[j].data[counter].value !== null){
               if(filteredData[j].data[counter].value <=0){
                   yValuesBrickNr[counter] = 0;
               }else {
                   yValuesBrickNr[counter] = (filteredData[j].data[counter].value) ;

               }
           }
       }

       //pushes the time values in to the array 'xValues' once for each brick
       xValues.push(blockTimes);
       yValues.push(yValuesBrickNr);
       yValuesBrickNr = [];

   }


   var dataJson = [];
   if(chartType){
       dataJson = processingJson(filteredData,xValues,yValues);
   }else{

       dataJson = [];

       for (var i = 0; i < xValues[0].length; i++) {
           dataJson.push({
               "x": (xValues[0][i]),
               "y": parseInt(yValues[0][i]),
               sum:parseInt(yValues[0][i])
           })
       }


       var format = d3.timeParse("%Y-%m-%d %H:");
       dataJson.forEach(function(d) {
           d.time = new Date(+format(moment(d.x).locale('de').format('YYYY-M-D H:')));
           d.value = + parseInt( d.y);
       });
       console.log(dataJson)
   }

   return dataJson
}


/*
This method calls calculatedValues to calculate the dashboard values and parses them to the appropriate dashboard containers
 */
function SettingDashboardvalues(dataJson,tapNR,pricePerWh){
   var historyValues = (calculatedValues(dataJson,pricePerWh));
   document.getElementsByClassName("valueSUM")[tapNR].innerHTML = parseInt(historyValues[0] )+" Wh";
   document.getElementsByClassName("valueMoney")[tapNR].innerHTML = parseInt(historyValues[1]);
   document.getElementsByClassName("valueMAX")[tapNR].innerHTML = parseInt(historyValues[2]) +" Wh";
   document.getElementsByClassName("valueAVG")[tapNR].innerHTML = parseInt(historyValues[3] )+" Wh";

}

function SettingDashboardvaluesDisaggregated(dataJson,phaseNr,chartType,pricePerWh){
    var historyValues = (calculatedValues(dataJson,pricePerWh));
    console.log(historyValues)
    console.log(phaseNr)

    if( parseInt(phaseNr) <= parseInt(1)){
        document.getElementsByClassName("valueSUMDisaggreagted"+chartType+phaseNr)[0].innerHTML = "PH"+phaseNr+": "+parseInt(historyValues[0]) + " Wh";
        document.getElementsByClassName("valueMoneyDisaggreagted"+chartType+phaseNr)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[1]);
        document.getElementsByClassName("valueMAXDisaggreagted"+chartType+phaseNr)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[2]) + " Wh";
        document.getElementsByClassName("valueAVGDisaggreagted"+chartType+phaseNr)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[3]) + " Wh";
        }else{
        document.getElementsByClassName("valueSUMDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[0]) + " Wh";
        document.getElementsByClassName("valueMoneyDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[1]);
        document.getElementsByClassName("valueMAXDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[2]) + " Wh";
        document.getElementsByClassName("valueAVGDisaggreagtedWithoutBottomLine"+chartType)[0].innerHTML ="PH"+phaseNr+": "+ parseInt(historyValues[3]) + " Wh";

    }

}

function disaggregatedPhaseIDs(phaseID){

    var consumerPhaseID = "";

    switch (phaseID) {
        case "PH1":
            consumerPhaseID = "PH_1";
            break;
        case "PH2":
            consumerPhaseID = "PH_2";
            break;
        case "PH3":
            consumerPhaseID = "PH_3";
            break;
        default:
                return;
    }
    return consumerPhaseID;
}