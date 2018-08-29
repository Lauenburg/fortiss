var aggregiertDay = 1;
var aggregiertMonth = 1;
var aggregiertHour = 1;

var disaggreConsumersDay =0;
var disaggreConsumersMonth=0;

/*
These methods effect the "charttyp" dropdown menu, the "consumer" dropdown menu the aggregation buttons of the historical charts.
Additionally it scans which brick are present and depicts the appropriate choice in the "Bricks" drop down menu
 */



/*
Live Chart
 */
//scans which brick are present and depicts the appropriate choice in the "Bricks" drop down menu
function includeNumberOfBricksLive(numberOfBricks) {
    counter = 1;
    while (counter<= numberOfBricks) {
        if (document.getElementById("BrickChoosen").getElementsByTagName('option')[counter-1] == null) {
            var opt = document.createElement('option');
            opt.value = counter;
            opt.innerHTML = "Brick Nr."+counter;
            document.getElementById("BrickChoosen").appendChild(opt);
        }
            counter++;
    }
}

/*
Month and Daychart
 */

function hideDashboardAggregated() {
    for (var i = 0; i < 3; i++) {
        var w = document.getElementsByClassName("valueMoney")[i];
        w.style.display = "none";
        var x = document.getElementsByClassName("valueMAX")[i];
        x.style.display = "none";
        var y = document.getElementsByClassName("valueAVG")[i];
        y.style.display = "none";
        var z = document.getElementsByClassName("valueSUM")[i];
        z.style.display = "none";
    }

}
function showDashboardAggregated() {
    for (var i = 0; i < 3; i++) {
        var w = document.getElementsByClassName("valueMoney")[i];
        w.style.display = "block";
        var x = document.getElementsByClassName("valueMAX")[i];
        x.style.display = "block";
        var y = document.getElementsByClassName("valueAVG")[i];
        y.style.display = "block";
        var z = document.getElementsByClassName("valueSUM")[i];
        z.style.display = "block";
    }
}

function hideDashboardDisaggregated() {
    for (var i = 0; i < 8; i++) {
        var v = document.getElementsByClassName("containerDisaggregatedValues")[i];
        v.style.display = "none";
    }
}
function showDashboardDisaggregated() {
    for (var i = 0; i < 8; i++) {
        var v = document.getElementsByClassName("containerDisaggregatedValues")[i];
        v.style.display = "block";
    }
}

/*
Day CHart
 */

//Hide/Show aggregateDivDay
function hideButtonDay() {
    var x = document.getElementById("aggregateDivDay");
        x.style.display = "none";
}

function showButtonDay() {
    var x = document.getElementById("aggregateDivDay");
    x.style.display = "block";
}

function hideButtonDisaggregateConsumersDay() {
    var x = document.getElementById("disaggregateConsumersDay");
    x.style.display = "none";
}

function showButtonDisaggregateConsumersDay() {
    var x = document.getElementById("disaggregateConsumersDay");
    x.style.display = "block";
}


//Hide/Show consumer selection
function hideConsumerSelectionDay() {
    var x = document.getElementById("consumerSelectionDay");
    x.style.display = "none";

}

function showConsumerSelectionDay() {
    var x = document.getElementById("consumerSelectionDay");
    x.style.display = "block";
}

//aggregation/disaggregation
function aggregateDisaggregateDay() {
    if(aggregiertDay === 1){
        aggregiertDay = 0;
        disaggreConsumersDay = 0;
        document.getElementById('aggregateButtonDay').innerText = "Aggregieren Phase";
    }else{

        aggregiertDay = 1;
        disaggreConsumersDay = 0;
        document.getElementById('aggregateButtonDay').innerText = "Disaggregieren Phase";

    }
    drawDayChart(0, 0)

}

//Change consumers and add options
function changeConsumerDay(consumer, counter) {
    if(document.getElementById("ConsumerSelectorDay").getElementsByTagName('option')[counter] == null){
        daySelect = document.getElementById('ConsumerSelectorDay');
        daySelect.options[daySelect.options.length] = new Option(consumer, counter);
    }
    document.getElementById("ConsumerSelectorDay").getElementsByTagName('option')[counter].innerText = consumer;
}

function deleteUnnecessaryOptionsDay(counter) {
    var toDelet = true;

    while (toDelet) {

        if (document.getElementById("ConsumerSelectorDay")[counter] == null) {
            toDelet = false;
        } else {
            document.getElementById("ConsumerSelectorDay")[counter].remove();
        }
        counter++;
    }
}

//adjust Dashboard
/*
function adjustDashboard(consumer, counter) {
    if(document.getElementById("ConsumerSelectorDay").getElementsByTagName('option')[counter] == null){
        daySelect = document.getElementById('ConsumerSelectorDay');
        daySelect.options[daySelect.options.length] = new Option(consumer, counter);
    }
    document.getElementById("ConsumerSelectorDay").getElementsByTagName('option')[counter].innerText = consumer;
}
*/
function deleteUnnecessaryOptionsDay(counter) {
    var toDelet = true;

    while (toDelet) {

        if (document.getElementById("ConsumerSelectorDay")[counter] == null) {
            toDelet = false;
        } else {
            document.getElementById("ConsumerSelectorDay")[counter].remove();
        }
        counter++;
    }
}

function disaggregateConsumersDay() {
    if(disaggreConsumersDay === 0){

        //hide disaggregate button
        var x = document.getElementById("aggregateButtonDay");
        x.style.display = "none";

        disaggreConsumersDay = 1;
        aggregiertDay = 1;
        document.getElementById('disaggregateConsumersDay').innerText = "Aggregieren Phase";
    }else{
        //show disaggregate button
        var x = document.getElementById("aggregateButtonDay");
        x.style.display = "block";

        disaggreConsumersDay = 0;
        aggregiertDay = 1;
        document.getElementById('disaggregateConsumersDay').innerText = "Disaggregieren Consumers";

    }
    drawDayChart(0)

}

/*
Month Chart
 */



//Hide/Show consumer selection
function hideButtonMonth() {
    var x = document.getElementById("aggregateDivMonth");
    x.style.display = "none";


    //$("#selectChartDayAggregatButton").attr("id", "selectChartDay").removeAttr("selectChartDayAggregatButton");

}

function showButtonMonth() {
    var x = document.getElementById("aggregateDivMonth");
    x.style.display = "block";
    //$("#selectChartDay").attr("id", "selectChartDayAggregatButton").removeAttr("selectChartDay")
}

function hideButtonDisaggregateConsumersMonth() {
    var x = document.getElementById("disaggregateConsumersMonth");
    x.style.display = "none";
}

function showButtonDisaggregateConsumersMonth() {
    var x = document.getElementById("disaggregateConsumersMonth");
    x.style.display = "block";
}

//Hide/Show consumer selection

function hideConsumerSelectionMonth() {
    var x = document.getElementById("consumerSelectionMonth");
    x.style.display = "none";

}

function showConsumerSelectionMonth() {
    var x = document.getElementById("consumerSelectionMonth");
    x.style.display = "block";
}

//aggregation/disaggregation

function aggregateDisaggregateMonth() {
    if(aggregiertMonth === 1){
        aggregiertMonth = 0;
        disaggreConsumersMonth = 0;

        document.getElementById('aggregateButtonMonth').innerText = "Aggregieren Phase";
    }else{
        aggregiertMonth = 1;
        disaggreConsumersMonth = 0;

        document.getElementById('aggregateButtonMonth').innerText = "Disaggregieren Phase";

    }
    drawMonthChart(0,0)
}

//Change consumers and add options
function changeConsumerMonth(consumer, counter) {
    if(document.getElementById("ConsumerSelectorMonth").getElementsByTagName('option')[counter] == null){
        daySelect = document.getElementById('ConsumerSelectorMonth');
        daySelect.options[daySelect.options.length] = new Option(consumer, counter);
    }
    document.getElementById("ConsumerSelectorMonth").getElementsByTagName('option')[counter].innerText = consumer;
}

function deleteUnnecessaryOptionsMonth(counter) {
    var toDelet = true;

    while (toDelet) {

        if (document.getElementById("ConsumerSelectorMonth")[counter] == null) {
            toDelet = false;
        } else {
            document.getElementById("ConsumerSelectorMonth").remove(counter);
        }
        counter++;
    }
}

function disaggregateConsumersMonth() {
    if(disaggreConsumersMonth === 0){

        //hide disaggregate button
        var x = document.getElementById("aggregateButtonMonth");
        x.style.display = "none";

        disaggreConsumersMonth = 1;
        aggregiersMonth = 1;
        document.getElementById('disaggregateConsumersMonth').innerText = "Aggregieren Phase";
    }else{
        //show disaggregate button
        var x = document.getElementById("aggregateButtonMonth");
        x.style.display = "block";

        disaggreConsumersMonth = 0;
        aggregiersMonth = 1;
        document.getElementById('disaggregateConsumersMonth').innerText = "Disaggregieren Consumers";

    }
    drawMonthChart(0)

}




/*
Hour Chart
 */

//aggregation/disaggregation
function aggregateDisaggregateHour() {
    if(aggregiertHour === 1){
        aggregiertHour = 0;
        document.getElementById('aggregateButtonHour').innerText = "Disaggregieren";
    }else{
        aggregiertHour = 1;
        document.getElementById('aggregateButtonHour').innerText = "Aggregieren";

    }
    drawHourChart(0)

}




