var liveChart; // global
var liveCounter = 0;
var chartWithDataCreated = false;
var  oldResult = [0];
var output = []; //wält den output der livechart
output.push(0);
var waitForRandering = false;


function checkBoxClick(outputType) {
    console.log(output.includes(outputType));
    if(!output.includes(outputType)){
        output.push(outputType);
    }else{
        for(var k = 0; k<output.length;k++) {
            if (output[k] === outputType) {
                output.splice(k,1);
            }
        }

    }

    console.log("Output:");
    console.log(output);


}


/**
 * Request data from the server, add it to the graph and set a timeout
 * to request again
 */
function requestData() {

    //var path = "/get/"+filID+"/lastValue";
    //getData(path);

    if(!this.waitForRandering) {

        var s = document.createElement("script");
        s.src = "http://" + connection + ":8090/get/" + filID + "/lastValue"; // achtung noch hard gecoded
        s.id = "live" + liveCounter;
        liveCounter++;
        document.body.appendChild(s); // dadurch werden die Daten geladen und die Funktion updateLastValue(result) aufgerufen.
        if (liveCounter >= 2) {
            document.getElementById("live" + (liveCounter - 2)).remove();
        }

        console.log(s.src);
    }
    //
}

function establishLiveGraphWithData(receivedData) {
    //console.log("creating a new live chart!!!");
    //
    this.waitForRandering = true;
    $('#containerLiveChart').highcharts().destroy();
    document.getElementById("containerLiveChart").innerHTML = "";
    createLiveChart();
    setTimeout(50000);
    //liveChart.redraw();
    var counter = 0;
    for (var i = 0; i < receivedData.length; i++) {
        for (var j = 0; j < receivedData[i].messtellen.length; j++) {
            if (liveChart.series.length <= counter) {
                liveChart.addSeries({
                    name: ""+receivedData[i].messtellen[j],
                    data: []
                });
            }
            counter++;
        }
    }
    this.waitForRandering = false;

    chartWithDataCreated = true;
}

function filterData(result) {

    var selectedResult = [];




        //number of bricks
        for (var i = 0; i < result.length; i++) {
            var l = 0;
            var innerResult = [{"id":1000,"messtellen":[],"werte":[],"zeit":0}];
            //choosen output (like spannung and phase)



            for(var f = 0; f< output.length; f++) {

                switch (output[f]) {
                case 0:


                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("Leistung");
                        if (avail !==  -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[l] = result[i].messtellen[j];
                            innerResult[0].werte[l] = result[i].werte[j];
                            innerResult[0].zeit = result[i].zeit;

                            l++;

                        }
                    }

                    break;
                case 1:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("Spannung");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[l] = result[i].messtellen[j];
                            innerResult[0].werte[l] = result[i].werte[j];
                            innerResult[0].zeit = result[i].zeit;
                            l++;
                        }
                    }
                    /*
                    for (var i = 0; i < result.length; i++) {

                        var selectedResult = [];
                        for (var j = 0; j < result[i].messtellen.length; j++) {
                            var receivedString = result[i].messtellen[j];
                            // Alle Werte für Spannung nicht anzeigen!
                            var avail = receivedString.search("Spannung");
                            if (avail != -1) selectedResult.push(j);
                        }
                        for (var j = selectedResult.length - 1; j >= 0; j--) {
                            result[i].messtellen.splice(selectedResult[j], 1);
                            result[i].werte.splice(selectedResult[j], 1);
                        }
                    }
                      */
                    break;
                case 2:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("Phase");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[l] = result[i].messtellen[j];
                            innerResult[0].werte[l] = result[i].werte[j];
                            innerResult[0].zeit = result[i].zeit;
                            l++;
                        }
                    }
                    break;
                case 3:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("Stromstärke");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[l] = result[i].messtellen[j];
                            innerResult[0].werte[l] = result[i].werte[j];
                            innerResult[0].zeit = result[i].zeit;
                            l++;
                        }
                    }
                    break;
                case 4:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("THD");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[l] = result[i].messtellen[j];
                            innerResult[0].werte[l] = result[i].werte[j];
                            innerResult[0].zeit = result[i].zeit;
                            l++;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        selectedResult.push(innerResult[0]);
    }
    return selectedResult;

}

function updateLastValue(result) {
    if(!this.waitForRandering) {
        result = filterData(result);
        if (oldResult !== result[0].messtellen.length) {
            chartWithDataCreated = false;
        }
        if (!chartWithDataCreated) establishLiveGraphWithData(result);
        var numberOfModules = result.length;
        // Erste Schleife über die Module
        for (var aussen = 0; aussen < numberOfModules; aussen++) {
            var numberOfMessstellen = result[aussen].messtellen.length;

            for (var innen = 0; innen < numberOfMessstellen; innen++) {
                var series = liveChart.series[numberOfMessstellen * aussen + innen];

                var shift = series.data.length > 300; // shift if the series if longer than X

                var x = result[aussen].zeit;
                var y = result[aussen].werte[innen];
                var data = [x, y];
                series.addPoint(data, true, shift, false);
            }
        }
        oldResult = result[0].messtellen.length;
        // call it again after X ms
        setTimeout(requestData, 500);
    }
}

function createLiveChart() {
    liveChart = new Highcharts.Chart({
        chart: {
            renderTo: 'containerLiveChart',
            defaultSeriesType: 'line',
            events: {
                load: requestData // Am Anfang, damit sich das wiederholt...
            }
        },
        legend: {
            align: 'right',
            backgroundColor: '#F0F0F0',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 0,
            y: 40 // der Abstand nach oben.
        },
        title: {
            text: ('Live Daten der Sensoren: Filiale ' + filID)
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 100,
            tickPosition: 'inside'
        },
        yAxis: {
            minPadding: 0.1,
            maxPadding: 0.1,
            lineColor: '#ccd6eb',
            lineWidth: 1,
            title: {
                text: 'Strom Messung',
                margin: 10
            }
        },
        series: [],
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        },
    });
    liveChart.exporting.sourceWidth = 1600;
    liveChart.exporting.sourceHeight = 400;
}
