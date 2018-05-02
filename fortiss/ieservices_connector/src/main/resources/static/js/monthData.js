var monthChart = [];
var yMonthValues =[];
var xMonthValues =[];

var monthString = "";
var monthCounter = 0; // can be removed later


function requestMonthData(num) {

    var $wrapperDay = $('.wrapperDay');
    var $wrapperHour = $('.wrapperHour');
    var $historyDataDay = $('.historyDataDay');
    var $historyDataHour = $('.historyDataHour');

    if($historyDataDay.length !== 0){
        $historyDataDay.each(function(i, e) {
            e.style.display = "none";
        });
        $wrapperDay.each(function(i, e){
            e.style.display = "none";
        });
    }

    if($historyDataHour.length !== 0){
        $historyDataHour.each(function(i, e){
            e.style.display = "none";
        });
        $wrapperHour.each(function(i, e){
            e.style.display = "none";
        });
    };



    date.add(num,'months');
    monthString = date.format('D-M-YYYY');

    var path = "/get/"+filID+"/getMonth/" + monthString  + "/";
    if (!testing) getData(path);

    document.getElementById("up").style="display: none;";

    if (testing) {
        // OLD - only there as a reference, will be removed later on.
        var s = document.createElement("script");
        s.src = "http://"+connection+":8090/get/"+filID+"/getMonth/" + monthString  + "/";
        s.id = "month"+monthCounter;
        monthCounter++;
        document.body.appendChild(s); // dadurch werden die Daten geladen und die Funktion updateMonthValue(result)
        console.log(s.src);
    }


}



function updateMonthValue(result){

    result = selectingBrickData(result); // Das ist noch wichtig, ansonsten gibt es zu viele Container
    //console.log(result);

    xMonthValues = [];
    yMonthValues = [];

    if(result.length > 0) {
        var historyDataMonths = $('.historyDataMonth');
        var wrapperMonths = $('.wrapperMonth');
        wrapperMonths.each(function (i, e) {
            e.style.display = "";
        });


        var j = 0
        //Array containing color
        var colors = ['#ffff00', '#003399', '#990033', '#33cc33', '#6600cc'];
        //setting alsways three charts to the same color
        var colourCounter = 0;

        //console.log("$historyDataMonth.length"+ $historyDataMonth.length);

        historyDataMonths.each(function (i, e) {
        if(j < result.length){
            //console.log("rotations"+ j);
            e.style.display = "";

        //Setzt die Parameter für die charts
        var set = createMonthChartSetup();
        //passt den paramter für den container der chart an
        set.chart.renderTo = e;

        //erstellt einen neuen chart
        if (monthChart.length !== result.length) {
            monthChart.push(new Highcharts.chart(set));
        };

        monthChart[j].exporting.sourceWidth = 1600;
        monthChart[j].exporting.sourceHeight = 400;

        //zufügen der daten in die gerade erstellte chart
        //monthChart[i].addSeries({data: []}, false);
        monthChart[j].setTitle({text: 'Nr.' + j + ' Verbrauch im ' + date.format('MMMM')});
        monthChart[j].series[0].update({name: result[j].name}, true);

        for (var counter = 0; counter < result[j].data.length; counter++) {
            var time = moment(result[j].data[counter].time).locale('de');
            xMonthValues[counter] = time.format('ll');
            //console.log("yMonthValues[counter]" + yMonthValues[counter]);
            yMonthValues[counter] = result[j].data[counter].value;
            //console.log("yMonthValues[counter]" + yMonthValues[counter]);
        }
        monthChart[j].xAxis[0].setCategories(xMonthValues);
        monthChart[j].series[0].setData(yMonthValues, true);
        monthChart[j].legend.update();
        if ((j % 3) === 0) {
            //console.log("the j" + j);
            colourCounter = colourCounter + 1;
        }
        monthChart[j].series[0].color.stops[0] = [0, colors[colourCounter]];
        monthChart[j].series[0].color.stops[1] = [1, colors[colourCounter]];
        j = j + 1;
        }
    });
    } else {
        $(".MonthButton").notify(
            "No data", "info",
            { position:"bottom" }
        );
        }
    }


function createMonthChartSetup() {
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
            text: 'Verbrauch'
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
                    pointFormat: '{point.percentage:.2f}%',
                    events: {
                        click: function () {
                            loadCorrectDayData(this.category);
                        }
                    }
                }
            },        pointFormat: '{point.percentage:.2f}%',
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