var hourChart = [];
var yHourValues =[];
var xHourValues =[];
var hourChartAvail = false;
var hourString = "";
var hourCounter = 0;


function requestHourData(num) {
    var $wrapperDay = $('.wrapperDay');
    var $wrapperMonth = $('.wrapperMonth');
    var $historyDataDay = $('.historyDataDay');
    var $historyDataMonth = $('.historyDataMonth');

    if($historyDataDay.length !== 0){
        $historyDataDay.each(function(i, e){
            e.style.display = "none";
        });
        $wrapperDay.each(function(i, e){
            e.style.display = "none";
        });
    };

    if($historyDataMonth.length !== 0){
        $historyDataMonth.each(function(i, e){
            e.style.display = "none";
        });
        $wrapperMonth.each(function(i, e){
            e.style.display = "none";
        });
    };

    $historyDataDay = $('.historyDataDay');

    date.add(num,'hours');
    hourString = date.format("D-M-YYYYTH:mm");

    var path = "/get/"+filID+"/getHour/" + hourString  + "/";
    if (!testing) getData(path);
    document.getElementById("up").style="";

    if(testing) {
        var s = document.createElement("script");
        s.src = "http://" + connection + ":8090/get/" + filID + "/getHour/" + hourString + "/";
        s.id = "hour" + hourCounter;
        hourCounter++;
        document.body.appendChild(s); // dadurch werden die Daten geladen und die Funktion updateHourValue(result)
        if (hourCounter >= 2) {
            document.getElementById("hour" + (hourCounter - 2)).remove();
        }
        document.getElementById("up").style = "";
        console.log(s.src);
    }
}


function updateHourValue(result){

    result = selectingBrickData(result);
    console.log(result);

    xHourValues = [];
    yHourValues = [];


    if(result.length > 0){
    date.minute(0);
    date.locale('de');

    var $historyDataHour = $('.historyDataHour');


    var $wrapperHour = $('.wrapperHour');
    $wrapperHour.each(function (i,e) {
        e.style.display = "";
    });

    $historyDataHour = $('.historyDataHour');

    var i = 0;

    //Array containing color
    var colors = ['#ffff00','#003399','#990033','#33cc33','#6600cc'];
    //setting alsways three charts to the same color
    var colourCounter = 0;

    $historyDataHour.each(function(i, e){
        if(i< result.length) {
            e.style.display = "";
            //console.log("how many times" + i);
            //Setzt die Parameter für die charts
            var set = createHourChartSetup();
            //passt den paramter für den container der chart an
            set.chart.renderTo = e;


            //erstellt einen neuen chart
            if (hourChart.length !== result.length) {
                hourChart.push(new Highcharts.chart(set));
            }
            ;

            //zufügen der daten in die gerade erstellte chart
            //hourChart[i].addSeries({data: []}, false);
            console.log(result[i]);
            hourChart[i].setTitle({text: 'Verbrauch um ' + date.format('HH:mm')});
            hourChart[i].series[0].update({name: result[i].name}, true);

            for (var counter = 0; counter < result[i].data.length; counter++) {
                var time = moment(result[i].data[counter].time).locale('de');
                xHourValues[counter] = time.format("H:mm");
                yHourValues[counter] = result[i].data[counter].value;
            }
            hourChart[i].xAxis[0].setCategories(xHourValues);
            hourChart[i].series[0].setData(yHourValues, true);
            hourChart[i].legend.update();
            if ((i % 3) === 0) {
                //console.log("the j" + i);
                colourCounter = colourCounter + 1;
            }
            hourChart[i].series[0].color.stops[0] = [0, colors[colourCounter]];
            hourChart[i].series[0].color.stops[1] = [1, colors[colourCounter]];
            i++;
        }
    });
}else{
        $(".HourButton").notify(
            "No data", "info",
            { position:"bottom" }
        );
}

}

function createHourChartSetup() {
    var setup = {
        chart: {
            zoomType: 'x'
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
            text: ''
        },
        subtitle: {
            text: ('Filiale ' + filID)
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Messung basierend auf Stromstärke'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            line: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [
            {
                data: [],
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#003399'],
                        [1, '#3366AA']
                    ]
                }
            }            ]
    };
    return setup;
}

function loadCorrectHourData(desiredDay){
    var string = desiredDay.split(':');
    date.hour(string[0]);
    requestHourData(0);
}