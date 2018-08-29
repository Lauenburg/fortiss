
//Used to check if only the "g "elements have to be newly appended or also the the svg element created
var firstRunDay = true;

//Global variable for the svg element containing all the day chart specific elements
var svgDay;

//Values displayed in dashboard \ref{calculate} historyValuesDay=[SUM,Price,Max,AVG]
var historyValuesDay = [];

//global variable for the string containing the date of the referenced day
var dayString;

//global array for the labels of the bricks
var nameBricksDay;

//old color scheme
//var color = ["#69D2E7","#A7DBD8","#E0E4CC","#F38630","#FA6900","#FE4365"];

//Checks if the user changed the typ of chart that is to be displayed
var oldChartypDay = document.getElementById("ChartSelectorDay").value;


// "main" of the daychart
function drawDayChart(timeDay, chartTypDay) {


    //At start the charts are always initialised with chartTyp = 0
    //document.getElementById("ChartSelectorDay").value checks with chart is selected and passes this value to chartTypDay
    if(chartTypDay === 0 || chartTypDay === undefined){
        chartTypDay = document.getElementById("ChartSelectorDay").value;
    }

    //on change of chart typ by user update chartTypDay and sets firstRunDay to false to delet all "g" elements of the other charts
    if(oldChartypDay != chartTypDay){
        oldChartypDay = chartTypDay;
        firstRunDay = false;
    }

    //receives the time of the day and formats it for the https request
    dateDay.add(timeDay, 'days');
    dayString = dateDay.format("D-M-YYYY");


    //Defining reference sizes for the outlaying
    marginDay = {top: 60, right: 50, bottom: 80, left: 100, pufferLeft: 80, legend: 240},
        widthDaySvg = 1900,
        heightDaySvg = 400,
        widthDayChart = 1500,
        heightDayChart = 500 - marginDay.top - marginDay.bottom;



    //checking which typ of chart has to be drawn
    //hiding and displaying the buttons in accordance to the charts displayed

    if(chartTypDay === "1")
    {
        if(!aggregiertDay){
            hideButtonDisaggregateConsumersDay()
        }else{
            showButtonDisaggregateConsumersDay()
        }
        hideConsumerSelectionDay();
        showButtonDay();
        drawDayChartPi(aggregiertDay);
    }else if(chartTypDay === "2") {
        hideConsumerSelectionDay();
        showButtonDay();
        showDashboardAggregated();
        hideDashboardDisaggregated();
        hideButtonDisaggregateConsumersDay()
        drawDayChartBlock(aggregiertDay)
    }else {
        showConsumerSelectionDay();
        hideButtonDay();
        showDashboardAggregated();
        hideDashboardDisaggregated();
        hideButtonDisaggregateConsumersDay()
        drawDayChartLine();
    }


}


//Function for drawing the block chart represenation of the day data
function drawDayChartBlock(showThreePhase) {
    var y = document.getElementById("aggregateButtonDay");
    y.style.display = "block";

    //entering the if-case if it is the first block chart to be displayed and not only one for an other day.
    //Selecting the container of the tap_jQuery Tag and creating a svg element with an "p" element nested in it.
    if (firstRunDay) {
        svgDay = d3.select("#DayChart").append("p").append("svg").attr("width", widthDaySvg+100).attr("height", heightDaySvg+100)
        g = svgDay.append("g").attr("transform", "translate(" + (marginDay.right * 4+20) + "," + 50 + ")");
        d3.select("#DayChart").attr("align", "center");
        firstRunDay = false;
    } else {
        //if the chart is updated with data of an other day only the "g" elements of the old chart are replaced
        svgDay.selectAll("g").remove();
        historyValuesDay = []
        g = svgDay.append("g").attr("transform", "translate(" + (marginDay.right * 4+20) + "," + 50 + ")");
        d3.select("#DayChart").attr("align", "center");

    }
    /*
    dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
    */

    //first https-json-request with the actual drawDayChart function as callback to insure that the json is totally loaded and not only promised
    d3.json("https://" + connection + ":"+port+"/get/" + filID + "/getDay/" + dayString + "/").then(function (dataBrick) {

        var dayBlockcolor = color;

        //checks if the array is empty. Setting SUM,MAX,AVG and Cost to "/" and exiting drawDayChartBlock()
        if(noData(dataBrick, "#DayChart",1)) {
            firstRunDay = true;
            svgDay.selectAll("g").remove();
            svgDay.selectAll("p").remove();
            return;
        }
        //filtering the data after the three phases
        var filteredData = filterForPh(dataBrick);

        //in case there is no description with PH1, PH2 or PH3 exiting drawDayChartBlock()
        if (filteredData.length === 0) {
            return;
        }


        //Formating the time stamp
        var blockTimes = timeConversion(filteredData,"H:mm");
        //Extracting the names of the consumers
        nameBricksDay = labels(filteredData)

        /*
        This function does three things:
        1. Extracting the data from the json to arrays
        2. Taking the extracted arrays and converting them to one array with an appropriate structure fore d3.stack()
            by calling processingJson()

        returns: Array of objects of format{x:xValue,labelBrick1:yValue_1,...,labelBrickn:yValue_n,sum:sumOfyValues}
         */
        var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,1);

        //setting the dashboard values
        SettingDashboardvalues(dataJson,1, pricePerWh)


        //handling the aggregation and disaggregation by creating a label for the aggregated representation and setting the y value
        //to the sum of the values of the three phases
        if (showThreePhase) {
            dayBlockcolor = colorAggregated;
            for (var i = 0; i < dataJson.length; i++) {
                dataJson[i] = {
                    x: dataJson[i].x, y: dataJson[i]["sum"], sum: dataJson[i]["sum"], key: "PH1+PH2+PH3"
                }
            }
            nameBricksDay = []
            nameBricksDay[0] = "PH1+PH2+PH3"
        }
        //mapped die namen auf die x achse
        //x.domain(data.map(function(d) { return d.name; }));
        //mapped die beschreibungen auf die z achse
        //z.domain(["leftDays", "satisfied"]);

        var x = d3.scaleBand()
            .rangeRound([1, widthDayChart])
            .paddingInner(0.1)
            .align(0.2);

        var y = d3.scaleLinear().range([heightDayChart, 0]);

        var z = d3.scaleOrdinal().domain(nameBricksDay).range(dayBlockcolor);

        x.domain(dataJson.map(function (d) {
            return d.x;
        }));
        y.domain([0, d3.max(dataJson, function (d) {
            return d.sum;
        })]);


        var stack = d3.stack()
            .keys(nameBricksDay)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var series = stack(dataJson);
        //erstellt die series mit den Beschreibungen
        var serie = g.selectAll(".serie")
            .data(series)
            .enter().append("g").attr("class", "serie")
            .attr("fill", function (d) {
                return z(d.key);
            });
        //.data(stack.keys(["leftDays","satisfied"])(data))


        g.append("g")
            .attr("class", "axisHistory axis--x")
            .attr("transform", "translate(0," + heightDayChart + ")")
            .call(d3.axisBottom(x).ticks(5));


        //Restoring the x axis of the live cahrt


        g.append("g").attr("class", "axisHistory axis--y").call(d3.axisLeft(y).ticks(10).tickFormat(function (d) {
            return parseInt(d) + " Wh";
        }).tickSizeInner([-widthDayChart])).append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")


        if (showThreePhase) {
            g.selectAll(".bar")
                .data(dataJson)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", function (d) {
                    return z(d.key);
                })
                .attr("x", function (d) {
                    return x(d.x);
                })
                .attr("y", function (d) {
                    return y(d.y);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return heightDayChart - y(d.y);
                })
                .on("mouseover", function () {
                    tooltip.style("display", null);
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                });
        } else {
            serie.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
            //fügt der x achse den namen zu
                .attr("x", function (d) {
                    return x(d.data.x);
                })
                //fügt der y achse den wert zu
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })
                .attr("width", x.bandwidth())
                .on("mouseover", function () {
                    tooltip.style("display", null);
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                })
                .on("mousemove", function (d) {
                    var xPosition = (d3.mouse(this)[0] + 40);
                    var yPosition = (d3.mouse(this)[1] + 40);
                    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    tooltip.select("text").text(d[1]-d[0]);
                });
        }

// Prep the tooltip bits, initial display is hidden
        var tooltip = svgDay.append("g")
            .attr("class", "tooltip")
            .style("display", "none");


        tooltip.append("text")
            .attr("x", 150)
            .attr("y", -50)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "15px")
            .attr("font-weight", "bold");


        ordinalDay = d3.scaleOrdinal()
            .domain(nameBricksDay)
            .range(dayBlockcolor);

        svgDay.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(" + (widthDayChart+(marginDay.legend)) + "," + ((marginDay.top / 2) +30) + ")");
        legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
            .shapePadding(50)
            .cellFilter(function (d) {
                return d.label !== "e"
            })
            .scale(ordinalDay);

        svgDay.select(".legendOrdinal")
            .call(legendOrdinal);
    })
}

function drawDayChartLine() {

    if (firstRunDay) {
        svgDay = d3.select("#DayChart").append("p").append("svg").attr("width", widthDaySvg+100).attr("height", heightDaySvg+100)

        g = svgDay.append("g").attr("transform", "translate(" + (marginDay.right * 4) + "," + 50 + ")");

        d3.select("#DayChart").attr("align", "center");
        firstRunDay = false;
    } else {
        svgDay.selectAll("g").remove();
        historyValuesDay = []

        g = svgDay.append("g").attr("transform", "translate(" + (marginDay.right * 4) + "," + 50 + ")");
        d3.select("#DayChart").attr("align", "center");

    }
    /*
    dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
    */

    d3.json("https://" + connection + ":"+port+"/get/" + filID + "/getDay/" + dayString + "/").then(function (dataBrick) {



        /*
        This function checks if the array is empty. Setting SUM,MAX,AVG and Cost to "/" and exiting drawDayChartBlock()
         */
        if(noData(dataBrick, "#DayChart",1)) {
            firstRunDay = true;
            svgDay.selectAll("g").remove();
            svgDay.selectAll("p").remove();
            deleteUnnecessaryOptionsDay(0);
            return;
        }

        for(var j = 0; j < dataBrick.length;j++) {


            var name = dataBrick[j].name;
            changeConsumerDay(name, j);
        }

        deleteUnnecessaryOptionsDay(dataBrick.length);

        var filteredData = filterForConsumer(dataBrick,$( "#consumerSelectionDay option:selected" ).text());

        if (filteredData.length === 0) {
            return;
        }


        //Important: nameBricksDay is global
        //Formating the time stamp
        var blockTimes =[];
        for(var i =0; i<filteredData[0].data.length;i++) {
            blockTimes.push(filteredData[0].data[i].time);
        }

        var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,0);

        //setting the dashboard values
        SettingDashboardvalues(dataJson,1, pricePerWh)


        var x = d3.scaleTime()
            .rangeRound([0, widthDayChart]);

        var y = d3.scaleLinear()
            .rangeRound([heightDayChart, 0]);


        var line1 = d3.line()
            .x(function(dataJson) { return x(dataJson.time); })
            .y(function(dataJson) { return y(dataJson.value); });


        x.domain(d3.extent(dataJson, function(d) { return d.time; }));
        y.domain([0, d3.max(dataJson, function (d) {
            return d.sum})]);

        g.append("path")
            .datum(dataJson)
            .attr("fill", "none")
            .attr("stroke", "#FF3C3C")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line1);

        g.append("g")
            .attr("transform", "translate(0," + heightDayChart + ")")
            .call(d3.axisBottom(x).ticks(20))
            .select(".domain")
            .remove();


        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Ampere");

    });
}
function drawDayChartPi(aggregiert){
    if(!aggregiert) {
        if (firstRunDay) {
            svgDay = d3.select("#DayChart").append("p").append("svg").attr("width", widthDaySvg + 100).attr("height", heightDaySvg + 100)
            width = +svgDay.attr("width"),
            height = +svgDay.attr("height"),
                radius = Math.min(widthDaySvg - 100, heightDaySvg) / 2;
            var g1 = svgDay.append("g").attr("transform", "translate(" + width * 0.30 + "," + height / 2 + ")");
            var g2 = svgDay.append("g").attr("transform", "translate(" + width * 0.5 + "," + height / 2 + ")");
            var g3 = svgDay.append("g").attr("transform", "translate(" + (width * 0.70) + "," + height / 2 + ")");

            d3.select("#DayChart").attr("align", "center");
            firstRunDay = false;
        } else {

            svgDay.selectAll("g").remove();
            historyDayMonth = []

            width = +svgDay.attr("width"),
                height = +svgDay.attr("height"),
            radius = Math.min(widthDaySvg - 100, heightDaySvg) / 2;
            var g1 = svgDay.append("g").attr("transform", "translate(" + width * 0.30 + "," + height / 2 + ")");
            var g2 = svgDay.append("g").attr("transform", "translate(" + width * 0.5 + "," + height / 2 + ")");
            var g3 = svgDay.append("g").attr("transform", "translate(" + (width * 0.70) + "," + height / 2 + ")");
            d3.select("#DayChart").attr("align", "center");

        }
        /*
        dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
        */
        legendDay = svgDay.append("svg").attr("width", width).attr("height", height)
        getDataDayAndDrawPiChart(g1, (widthDaySvg * 0.2 +100 - radius), height / 5, "legendOrdinal1","PH1", colorPerPhase[0]);
        getDataDayAndDrawPiChart(g2, (width / 2 -210), 10, "legendOrdinal2","PH2", colorPerPhase[1]);
        getDataDayAndDrawPiChart(g3, (widthDaySvg * 0.75 + radius), height / 5,"legendOrdinal3", "PH3", colorPerPhase[2]);

        showDashboardDisaggregated();
        hideDashboardAggregated();

    }else{

        if (firstRunDay) {
            svgDay = d3.select("#DayChart").append("p").append("svg").attr("width", widthDaySvg + 100).attr("height", heightDaySvg + 100)

            width = +svgDay.attr("width"),
                height = +svgDay.attr("height"),
                radius = Math.min(widthDaySvg - 100, heightDaySvg) / 2;
            var g1 = svgDay.append("g").attr("transform", "translate(" + width /2 + "," + height / 2 + ")");
            d3.select("#DayChart").attr("align", "center");
            firstRunDay = false;
        } else {
            svgDay.selectAll("g").remove();
            width = +svgDay.attr("width"),
                height = +svgDay.attr("height"),
                radius = Math.min(widthDaySvg+100, heightDaySvg+100) / 2;
            var g1 = svgDay.append("g").attr("transform", "translate(" + width /2 + "," + height / 2 + ")");
            d3.select("#DayChart").attr("align", "center");

        }
        /*
        dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
        */
        legendDay = svgDay.append("svg").attr("width", width).attr("height", height)
        getDataDayAndDrawPiChart(g1, (widthDaySvg /2 + 1.5* radius), (height / 5), "legendOrdinal1",null, color);
        showDashboardAggregated();
        hideDashboardDisaggregated();
        }

}

function getDataDayAndDrawPiChart(g,positionX,positionY,legendID,phaseID, colorScheme) {

    d3.json("https://" + connection + ":"+port+"/get/" + filID + "/getDay/" + dayString + "/").then(function (dataBrick) {
        /*
         This function checks if the array is empty. Setting SUM,MAX,AVG and Cost to "/" and exiting drawDayChartBlock()
         */



        if (noData(dataBrick, "#DayChart", 1)) {
            firstRunDay = true;
            svgDay.selectAll("g").remove();
            svgDay.selectAll("p").remove();
            return;
        }

        var filteredData = [];
        var filteredDataSinglePH = []

        sumOfPhaseData = [];
        sumOfPhaseDataSingleConsumer = [];
        var value = 0;
        var sumOfConsumptionOfTheMonitoredConsumers = 0
        var next = 0;


        if (phaseID == null) {
            if (disaggreConsumersDay) {

                filteredData = filterForAllConsumers(dataBrick);
                //filters for the aggregated value of the single phase
                if (filteredData.length === 0) {
                        return
                    }


                //calculating the sums of the consumpiton per phase
                for (var i = 0; i < filteredData.length; i++) {
                    for (var j = 0; j < filteredData[i].data.length; j++) {
                        value = value + filteredData[i].data[j].value;

                    }

                    if (value > 0) {
                        sumOfPhaseData[next] = ({"name": filteredData[i].name, "value": value});
                        next++;
                        value = 0;
                    }
                }
                    /*
                    In case of the Pi chart the following set of function is only used for the dahsboard
                     */

                    //Formating the time stamp
                    var blockTimes = timeConversion(filteredData, "H:mm");
                    /*
                    This function does three things:
                    1. Extracting the data from the json to arrays
                    2. Taking the extracted arrays and converting them to one array with an appropriate structure
                        by calling processingJson()
                    3. Calling calculatedValues() to set the dashboard values
                    */
                    var dataJson = jsonToArrayProcessingData(filteredData, blockTimes, 1);
                    SettingDashboardvalues(dataJson, 1, pricePerWh);
                    console.log(filteredData)
                } else {
                    filteredData = filterForPh(dataBrick)
                    //Exiting function in case of no data assigned to the phases is present
                    if (filteredData.length === 0) {
                        return;
                    }
                    phaseID = "Aggregiert";

                    //calculating the sums of the consumpiton per phase
                    for (var i = 0; i < filteredData.length; i++) {
                        for (var j = 0; j < filteredData[i].data.length; j++) {
                            value = value + filteredData[i].data[j].value;

                        }

                        if (value > 0) {
                            sumOfPhaseData[next] = ({"name": filteredData[i].name, "value": value});
                            next++;
                            value = 0;
                        }
                    }

                    /*
                       In case of the Pi chart the following set of function is only used for the dahsboard
                        */

                    //Formating the time stamp
                    var blockTimes = timeConversion(filteredData, "H:mm");
                    /*
                    This function does three things:
                    1. Extracting the data from the json to arrays
                    2. Taking the extracted arrays and converting them to one array with an appropriate structure
                        by calling processingJson()
                    3. Calling calculatedValues() to set the dashboard values
                    */
                    var dataJson = jsonToArrayProcessingData(filteredData, blockTimes, 1);


                    SettingDashboardvalues(dataJson, 1, pricePerWh)

                }}else {


                //filters for the aggregated value of the single phase

                filteredData = filterForSinglePh(dataBrick, phaseID);
                if (filteredData.length > 0) {
                    for (var i = 0; i < filteredData[0].data.length; i++) {
                        value = value + filteredData[0].data[i].value;
                    }


                    /*
                    In case of the Pi chart the following set of function is only used for the dahsboard
                     */

                    //Formating the time stamp
                    var blockTimes = timeConversion(filteredData, "H:mm");
                    /*
                    This function does three things:
                    1. Extracting the data from the json to arrays
                    2. Taking the extracted arrays and converting them to one array with an appropriate structure
                        by calling processingJson()
                    3. Calling calculatedValues() to set the dashboard values
                    */
                    var dataJson = jsonToArrayProcessingData(filteredData, blockTimes, 1);

                    //setting the dashboard values
                    if (phaseID.localeCompare("PH1") == 0) {
                        SettingDashboardvaluesDisaggregated(dataJson, 0, "Day", pricePerWh)
                    } else if (phaseID.localeCompare("PH2") == 0) {
                        SettingDashboardvaluesDisaggregated(dataJson, 1, "Day", pricePerWh)
                    } else if (phaseID.localeCompare("PH3") == 0) {
                        SettingDashboardvaluesDisaggregated(dataJson, 2, "Day", pricePerWh)
                    }


                    /*

                     */


                }

                if (value > 0) {

                    //the sum of the consumption of the whole phase over the duration of the day
                    sumOfPhaseData[0] = ({"name": filteredData[0].name, "value": value});


                    //get phaseID of single consumers
                    var consumerPhaseID = disaggregatedPhaseIDs(phaseID);
                    //filter for the single consumers of the specified phase
                    filteredDataSinglePH = filterForSinglePh(dataBrick, consumerPhaseID);
                    var valueConsumer = 0;
                    for (var i = 0; i < filteredDataSinglePH.length; i++) {
                        for (var j = 0; j < filteredDataSinglePH[i].data.length; j++) {
                            valueConsumer = valueConsumer + filteredDataSinglePH[i].data[j].value;
                        }

                        if (value > 0) {
                            sumOfPhaseDataSingleConsumer[i] = ({
                                "name": filteredDataSinglePH[i].name,
                                "value": valueConsumer
                            });

                            sumOfConsumptionOfTheMonitoredConsumers = sumOfConsumptionOfTheMonitoredConsumers + valueConsumer;

                            valueConsumer = 0;
                        }
                    }

                    //combine consumption of single consumers and the consumption of the phase - the sum of the consumption of single consumers
                    sumOfPhaseData[0].value = sumOfPhaseData[0].value - sumOfConsumptionOfTheMonitoredConsumers
                    if (sumOfPhaseData[0].value < 0) {
                        console.log("The numbers do not add up!")
                        console.log("Phase n has to be marked as PHn and consumers of ")
                        console.log("Consumers of PHn has to be marked as PH_n")
                        console.log("---------------------------------------------")
                        console.log("According to the labels the sum of the consumption of the consumers of phase n")
                        console.log("is higher than the overall consumption of phase n ")


                        sumOfPhaseData[0].value = sumOfPhaseData[0].value * -1;

                    }
                    for (var i = 0; i < sumOfPhaseDataSingleConsumer.length; i++) {
                        sumOfPhaseData.push(sumOfPhaseDataSingleConsumer[i])
                    }
                } else {
                    sumOfPhaseData[0] = ({"name": "No_Data", "value": 1});
                }
        }

            //filters for every consumer drawing from this phase

            //Important: nameBricksDay is global
            nameBricksDay = labels(sumOfPhaseData)


        if(disaggreConsumersDay){
            var pie = d3.pie()
                .padAngle(.02)
                .sort(null)
                .value(function (data) {
                    return data.value;
                });
            var color = d3.scaleOrdinal(colorGreyBlue);
            ordinalDay = d3.scaleOrdinal().domain(nameBricksDay).range(colorGreyBlue);
            var label = d3.arc()
                .outerRadius(radius - 70)
                .innerRadius(radius - 70);
        }else {


            if (!sumOfPhaseData[0].name.localeCompare("No_Data")) {
                var color = d3.scaleOrdinal(colorGrey);
                ordinalDay = d3.scaleOrdinal().domain(["Sum = 0"]).range(colorGrey);
                var label = d3.arc()
                    .outerRadius(0)
                    .innerRadius(0);

            } else {
                var color = d3.scaleOrdinal(colorScheme);
                ordinalDay = d3.scaleOrdinal().domain(nameBricksDay).range(colorScheme);
                var label = d3.arc()
                    .outerRadius(radius - 70)
                    .innerRadius(radius - 70);


            }
            var pie = d3.pie()
                .sort(null)
                .value(function (data) {
                    return data.value;
                });
        }



            var path = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);


            var arc = g.selectAll(".arc")
                .data(pie(sumOfPhaseData))
                .enter().append("g")
                .attr("class", "arc");

            arc.append("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    return color(d.data.name);
                });

            arc.append("text").style("font-size","15px")
                .attr("transform", function (d) {
                    return "translate(" + label.centroid(d) + ")";
                })
                .attr("dy", "0.35em")
                .text(function (d) {
                    if (!d.data.name.localeCompare("No_Data")) {
                        return "Clamps attached but SUM = 0"
                    }
                    ;
                    return Math.round(d.data.value * 100) / 100;
                });


// Prep the tooltip bits, initial display is hidden
            var tooltip = svgDay.append("g")
                .attr("class", "tooltip")
                .style("display", "none");


            tooltip.append("text")
                .attr("x", 50)
                .attr("y", -50)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");


            if (positionY < 100) {
                legendDay.append("g").attr("id", legendID).attr("transform", "translate(" + (positionX) + "," + positionY + ")");
                legendOrdinal = d3.legendColor().shape("path", d3.symbol()
                    .type(d3.symbolTriangle).size(150)())
                    .shapePadding(200).cellFilter(function (d) {
                        return d.name !== "e"
                    })
                    .scale(ordinalDay)
                    .orient('horizontal');

                legendDay.append("g").append('text').style("font-size","15px")
                    .style("text-decoration", "underline")
                    .attr('x', positionX - 110)
                    .attr('y', positionY + 5)
                    .text(phaseID+":");
            } else {
                legendDay.append("g").attr("id", legendID).attr("transform", "translate(" + (positionX) + "," + positionY + ")");
                legendOrdinal = d3.legendColor().shape("path", d3.symbol()
                    .type(d3.symbolTriangle).size(150)())
                    .shapePadding(50).cellFilter(function (d) {
                        return d.name !== "e"
                    })
                    .scale(ordinalDay);
                legendDay.append("g").append('text')
                    .style("text-decoration", "underline")
                    .style("font-size","15px")
                    .attr('x', positionX)
                    .attr('y', positionY - 25)
                    .text(phaseID+":");
            }

            legendDay.select("#" + legendID)
                .call(legendOrdinal);



    });
}






