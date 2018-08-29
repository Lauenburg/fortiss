var dayChart = [];
var yDayValues =[];
var xDayValues =[];
var dayChartAvail = false;
var dayString = "";
var dayCounter = 0;

function requestDayData(num) {


    var $wrapperMonth = $('.wrapperMonth');
    var $wrapperHour = $('.wrapperHour');
    var $historyDataMonth = $('.historyDataMonth');
    var $historyDataHour = $('.historyDataHour');


    if($historyDataMonth.length !== 0){
        $historyDataMonth.each(function(i, e) {
            e.style.display = "none";
        });
        $wrapperMonth.each(function(i, e) {
            e.style.display = "none";
        });
    }

    if($historyDataHour.length !== 0){
        $historyDataHour.each(function(i, e){
                e.style.display = "none";
            });
            $wrapperHour.each(function(i, e) {
                e.style.display = "none";
            });
    };



    date.add(num,'days');
    dayString = date.format('D-M-YYYY');


    var s = document.createElement("script");
    s.src = "http://"+connection+":8090/get/"+filID+"/getDay/" + dayString  + "/";
    s.id = "day"+dayCounter;
    dayCounter++;
    document.body.appendChild(s); // dadurch werden die Daten geladen und die Funktion updateDayValue(result)
    if (dayCounter >= 2){
        document.getElementById("day"+(dayCounter -2)).remove();
    }
    document.getElementById("up").style="";
    console.log(s.src);

}


function updateDayValue(result){

    result = selectingBrickData(result);
    console.log(result);

    xDayValues = [];
    yDayValues = [];


    if(result.length >0) {
        var $historyDataDay = $('.historyDataDay');


        var $wrapperDay = $('.wrapperDay')
        $wrapperDay.each(function (i, e) {
            //durch "" wird der im CSS file angegebene style übernommen
            e.style.display = "";
        });

        $historyDataDay = $('.historyDataDay');

        var i = 0;

        //Array containing color
        var colors = ['#ffff00', '#003399', '#990033', '#33cc33', '#6600cc'];
        //setting alsways three charts to the same color
        var colourCounter = 0;

        $historyDataDay.each(function (i, e) {
            if(i < result.length) {

                e.style.display = "";
                //Setzt die Parameter für die charts
                var set = createDayChartSetup();
                //passt den paramter für den container der chart an
                set.chart.renderTo = e;

                //erstellt einen neuen chart
                if (dayChart.length !== result.length) {
                    dayChart.push(new Highcharts.chart(set))
                }
                ;


                //zufügen der daten in die gerade erstellte chart
                //dayChart[i].addSeries({data: []}, false);
                console.log(result[i]);
                dayChart[i].setTitle({text: 'Stündlicher Verbrauch am ' + date.format('ll')});
                dayChart[i].series[0].update({name: result[i].name}, true);

                for (var counter = 0; counter < result[i].data.length; counter++) {
                    var time = moment(result[i].data[counter].time).locale('de');
                    xDayValues[counter] = time.format("H:mm");
                    yDayValues[counter] = result[i].data[counter].value;
                }
                dayChart[i].xAxis[0].setCategories(xDayValues);
                dayChart[i].series[0].setData(yDayValues, true);
                dayChart[i].legend.update();


                if ((i % 3) === 0) {
                    console.log("the i" + i);
                    colourCounter = colourCounter + 1;
                }
                dayChart[i].series[0].color.stops[0] = [0, colors[colourCounter]];
                dayChart[i].series[0].color.stops[1] = [1, colors[colourCounter]];
                i++;
            }
        });
    }else{
        jQuery.notify("No data", "info");
    }
}


function createDayChartSetup() {
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
                text: 'Verbrauch'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} Wh</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            loadCorrectHourData(this.category);
                        }
                    }
                }
            },
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
            }
        ]
    };
 return setup;
}

function loadCorrectDayData(desiredDay){
    console.log(desiredDay);
    date = moment(desiredDay, "D MMMM YYYY", 'de');
    requestDayData(0);
}

