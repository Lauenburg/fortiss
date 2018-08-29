/*
$(".tab-panels").one('click', function() {
    drawMonthChart()
});
*/
var firstRunMonth = true;
var svgMonth;
var historyValuesMonth =[];
var monthString;
var nameBricksMonth;
//var color = ["#FC9D9A","#F9CDAD","#C8C8A9","#83AF9B","#ECD078","#D95B43"];

var oldChartTypMonth = document.getElementById("ChartSelectorMonth").value;

function drawMonthChart(timeMonth, chartTypMonth) {
    //0 is an argument of the function and therefore should not be with quotation
    if (chartTypMonth === 0) {
        chartTypMonth = document.getElementById("ChartSelectorMonth").value;
    }

    //1 has to be in quotation since it is received from the html file
    /*if(chartTypDay === "1"){
        hideButtonDay()
    }else{
        showButtonDay()
    }
    */

    if (oldChartTypMonth != chartTypMonth) {
        oldChartTypMonth = chartTypMonth;
        firstRunMonth = false;
    }

    dateMonth.add(timeMonth, 'months');
    monthString = dateMonth.format('D-M-YYYY');


    marginMonth = {top: 60, right: 50, bottom: 80, left: 100, pufferLeft: 80, legend: 240},
        widthMonthSvg = 1900,
        heightMonthSvg = 400,
        widthMonthChart = 1500,
        heightMonthChart = 500 - marginMonth.top - marginMonth.bottom;

    if(chartTypMonth === "1")
    {
        hideConsumerSelectionMonth();
        showButtonMonth();
        drawMonthChartPi(aggregiertMonth);
    }else if(chartTypMonth === "2") {
        hideConsumerSelectionMonth();
        hideDashboardDisaggregated();
        showDashboardAggregated();
        showButtonMonth();
        drawMonthChartBlock(aggregiertMonth)
    }else {
        showConsumerSelectionMonth();
        hideButtonMonth();
        hideDashboardDisaggregated();
        showDashboardAggregated();
        drawMonthChartLine();
    }
}

function drawMonthChartBlock(showThreePhase) {

    if(firstRunMonth) {
        svgMonth = d3.select("#monthChart").append("p").append("svg").attr("width", widthMonthSvg+100).attr("height", heightMonthSvg+100)

        g = svgMonth.append("g").attr("transform", "translate(" + (marginMonth.right *4+20)+ "," + 10 + ")");

        d3.select("#monthChart").attr("align", "center");
        firstRunMonth = false;
    }else{
        svgMonth.selectAll("g").remove();
        g = svgMonth.append("g").attr("transform", "translate(" + (marginMonth.right *4+20)+ "," + 10 + ")");
        d3.select("#monthChart").attr("align", "center");

    }

    /*
    dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-02-12T00:00","value":425.1789655555556},{"time":"2018-02-13T00:00","value":1051.7479225},{"time":"2018-02-14T00:00","value":1121.7008183333335},{"time":"2018-02-15T00:00","value":1155.193198611111},{"time":"2018-02-16T00:00","value":527.3012877777779},{"time":"2018-02-17T00:00","value":0.3619897222222222},{"time":"2018-02-18T00:00","value":0.30641555555555555},{"time":"2018-02-19T00:00","value":0.2996758333333333},{"time":"2018-02-20T00:00","value":0.3277013888888889},{"time":"2018-02-21T00:00","value":0.17464416666666668}]},{"name":"ofen1 | 103","data":[{"time":"2018-02-12T00:00","value":389.6484902777778},{"time":"2018-02-13T00:00","value":1181.2258744444443},{"time":"2018-02-14T00:00","value":1157.5023144444444},{"time":"2018-02-15T00:00","value":1139.6935283333335},{"time":"2018-02-16T00:00","value":725.9044747222224},{"time":"2018-02-17T00:00","value":387.8653481944443},{"time":"2018-02-18T00:00","value":389.66873291666667},{"time":"2018-02-19T00:00","value":397.76317430555576},{"time":"2018-02-20T00:00","value":400.97095069444464},{"time":"2018-02-21T00:00","value":204.93697486111122}]},{"name":"ofen5 | 503","data":[{"time":"2018-02-12T00:00","value":100.0},{"time":"2018-02-13T00:00","value":100.0},{"time":"2018-02-14T00:00","value":100.0},{"time":"2018-02-15T00:00","value":100.0},{"time":"2018-02-16T00:00","value":100.0},{"time":"2018-02-17T00:00","value":100.0},{"time":"2018-02-18T00:00","value":100.0},{"time":"2018-02-19T00:00","value":100.0},{"time":"2018-02-20T00:00","value":100.0},{"time":"2018-02-21T00:00","value":100.0}]},{"name":"ofen2 | 203","data":[{"time":"2018-02-12T00:00","value":100.0},{"time":"2018-02-13T00:00","value":100.0},{"time":"2018-02-14T00:00","value":100.0},{"time":"2018-02-15T00:00","value":100.0},{"time":"2018-02-16T00:00","value":524.707269444444},{"time":"2018-02-17T00:00","value":931.6335198611102},{"time":"2018-02-18T00:00","value":930.2694193055548},{"time":"2018-02-19T00:00","value":2059.77312486111},{"time":"2018-02-20T00:00","value":1330.2130862499996},{"time":"2018-02-21T00:00","value":974.2653183333333}]},{"name":"ofen6 | 603","data":[{"time":"2018-02-12T00:00","value":499.4807740277778},{"time":"2018-02-13T00:00","value":1463.1080101388889},{"time":"2018-02-14T00:00","value":2082.279709305555},{"time":"2018-02-15T00:00","value":2147.3354886111106},{"time":"2018-02-16T00:00","value":1988.122727777777},{"time":"2018-02-17T00:00","value":934.7592438888876},{"time":"2018-02-18T00:00","value":935.2439658333323},{"time":"2018-02-19T00:00","value":2074.7552184722217},{"time":"2018-02-20T00:00","value":1335.6365823611106},{"time":"2018-02-21T00:00","value":977.3915408333328}]},{"name":"ofen3 | 303","data":[{"time":"2018-02-12T00:00","value":100.08874041666666668},{"time":"2018-02-13T00:00","value":100.0},{"time":"2018-02-14T00:00","value":100.0},{"time":"2018-02-15T00:00","value":100.0},{"time":"2018-02-16T00:00","value":517.6880670833332},{"time":"2018-02-17T00:00","value":928.3986512499991},{"time":"2018-02-18T00:00","value":925.6969970833327},{"time":"2018-02-19T00:00","value":2054.621259027778},{"time":"2018-02-20T00:00","value":1327.9370126388887},{"time":"2018-02-21T00:00","value":972.5392924999996}]}]
*/
    d3.json("http://" + connection + ":8090/get/" + filID + "/getMonth/" + monthString  + "/").then(function (dataBrick) {


        if (noData(dataBrick,"#monthChart",2))
            return;

        var filteredData = filterForPh(dataBrick);
        //in case there is no description with PH1, PH2 or PH3
        if (filteredData.length === 0) {
            return;
        }

        //Formating the time stamp
        var blockTimes = timeConversion(filteredData,"D-M-YYYY");
        //Important: nameBricksDay is global
        nameBricksMonth = labels(filteredData)

        /*
   This function does three things:
   1. Extracting the data from the json to arrays
   2. Taking the extracted arrays and converting them to one array with an appropriate structure fore d3.stack()
       by calling processingJson()
   3. Calling calculatedValues() to set the dashboard values

   returns: Array of objects of format{xValue , yValue_1,...,yValue_n, sumOfyValues}
    */
        var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,1);
        //setting the dashboard values
        SettingDashboardvalues(dataJson,2,pricePerWh)

        if (!showThreePhase) {
            for (var i = 0; i < dataJson.length; i++) {
                dataJson[i] = {
                    x: dataJson[i].x, y: dataJson[i]["sum"], sum: dataJson[i]["sum"], key: "PH1 + PH2 + PH3"
                }
            }
            nameBricksMonth = []
            nameBricksMonth[0] = "PH1 + PH2 + PH3"
        }


        var x = d3.scaleBand()
            .rangeRound([1, widthMonthChart])
            .paddingInner(0.1)
            .align(0.2);

        var y = d3.scaleLinear().range([heightMonthChart, 0]);

        var z = d3.scaleOrdinal().domain(nameBricksMonth).range(color)

        x.domain(dataJson.map(function (d) {
            return d.x;
        }));

        y.domain([0, d3.max(dataJson, function (d) {
            return d.sum;
        })]);


        var stack = d3.stack()
            .keys(nameBricksMonth)
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
        //.data(stack.keys(["leftMonths","satisfied"])(data))


        g.append("g")
            .attr("class", "axisHistory axis--x")
            .attr("transform", "translate(0," + heightMonthChart + ")")
            .call(d3.axisBottom(x).ticks(5));


        g.append("g").attr("class", "axisHistory axis--y").call(d3.axisLeft(y).ticks(10).tickFormat(function (d) {
            return parseInt(d) + " Wh";
        }).tickSizeInner([-widthMonthChart])).append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")


        if (!showThreePhase) {
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
                    return heightMonthChart - y(d.y);
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
    var tooltip = svgMonth.append("g")
        .attr("class", "tooltip")
        .style("display", "none");


    tooltip.append("text")
        .attr("x", 150)
        .attr("y",-50)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");


        ordinalMonth = d3.scaleOrdinal()
            .domain(nameBricksMonth)
            .range(color);

        svgMonth.append("g")
            .attr("class", "legendOrdinalMonth")
            .attr("transform", "translate(" + (widthMonthChart+(marginMonth.legend)) + "," + (marginMonth.top/2) + ")");
        legendOrdinalMonth = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
            .shapePadding(50)
            .cellFilter(function (d) {
                return d.label !== "e"
            })
            .scale(ordinalMonth);

        svgMonth.select(".legendOrdinalMonth")
            .call(legendOrdinalMonth);
})
}
function drawMonthChartPi(aggregiert){
    if(aggregiert) {
        if (firstRunMonth) {
            svgMonth = d3.select("#MonthChart").append("p").append("svg").attr("width", widthMonthSvg + 100).attr("height", heightMonthSvg + 100)

            width = +svgMonth.attr("width"),
                height = +svgMonth.attr("height"),
                radius = Math.min(widthMonthSvg - 100, heightMonthSvg) / 2;
            var g1 = svgMonth.append("g").attr("transform", "translate(" + width * 0.30 + "," + height / 2 + ")");
            var g2 = svgMonth.append("g").attr("transform", "translate(" + width * 0.5 + "," + height / 2 + ")");
            var g3 = svgMonth.append("g").attr("transform", "translate(" + (width * 0.70) + "," + height / 2 + ")");

            d3.select("#MonthChart").attr("align", "center");
            firstRunMonth = false;
        } else {
            svgMonth.selectAll("g").remove();
            historyValuesMonth = []
            width = +svgMonth.attr("width"),
                height = +svgMonth.attr("height"),
                radius = Math.min(widthMonthSvg - 100, heightMonthSvg) / 2;
            var g1 = svgMonth.append("g").attr("transform", "translate(" + width * 0.30 + "," + height / 2 + ")");
            var g2 = svgMonth.append("g").attr("transform", "translate(" + width * 0.5 + "," + height / 2 + ")");
            var g3 = svgMonth.append("g").attr("transform", "translate(" + (width * 0.70) + "," + height / 2 + ")");
            d3.select("#MonthChart").attr("align", "center");

        }
        /*
        dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
        */
        legendMonth = svgMonth.append("svg").attr("width", width).attr("height", height)
        getDataMonthAndDrawPiChart(g1, (widthMonthSvg * 0.2 +150 - radius), height / 5, "legendOrdinal1", "PH1", colorPerPhase[0]);
        getDataMonthAndDrawPiChart(g2, (width / 2 - 210), 10, "legendOrdinal2", "PH2",colorPerPhase[1]);
        getDataMonthAndDrawPiChart(g3, (widthMonthSvg * 0.75 + radius), height / 5, "legendOrdinal3", "PH3",colorPerPhase[2]);

        hideDashboardAggregated();
        showDashboardDisaggregated();

    }else{
        if (firstRunMonth) {
            svgMonth = d3.select("#MonthChart").append("p").append("svg").attr("width", widthMonthSvg + 100).attr("height", heightMonthSvg + 100)

            width = +svgMonth.attr("width"),
                height = +svgMonth.attr("height"),
                radius = Math.min(widthMonthSvg - 100, heightMonthSvg) / 2;
            var g1 = svgMonth.append("g").attr("transform", "translate(" + width /2 + "," + height / 2 + ")");
            d3.select("#MonthChart").attr("align", "center");
            firstRunMonth = false;
        } else {
            svgMonth.selectAll("g").remove();
            width = +svgMonth.attr("width"),
                height = +svgMonth.attr("height"),
                radius = Math.min(widthMonthSvg+100, heightMonthSvg+100) / 2;
            var g1 = svgMonth.append("g").attr("transform", "translate(" + width /2 + "," + height / 2 + ")");
            d3.select("#MonthChart").attr("align", "center");

        }
        /*
        dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
        */
        legendMonth = svgMonth.append("svg").attr("width", width).attr("height", height)
        getDataMonthAndDrawPiChart(g1, (widthMonthSvg /2 + 1.5* radius), (height / 5), "legendOrdinal1", null, color);

        hideDashboardDisaggregated();
        showDashboardAggregated();
    }
}

function getDataMonthAndDrawPiChart(g,positionX,positionY,legendID,phaseID, colorScheme) {

    d3.json("http://" + connection + ":8090/get/" + filID + "/getMonth/" + monthString  + "/").then(function (dataBrick) {
        /*
         This function checks if the array is empty. Setting SUM,MAX,AVG and Cost to "/" and exiting drawDayChartBlock()
         */
        if(noData(dataBrick,"#monthChart",2))
            return;

        var filteredData = [];
        var filteredDataSinglePH = []

        sumOfPhaseData = [];
        sumOfPhaseDataSingleConsumer = [];
        var value = 0;
        var sumOfConsumptionOfTheMonitoredConsumers = 0
        var next = 0;



        if(phaseID == null){
            filteredData = filterForPh(dataBrick)
            //Exiting function in case of no data assigned to the phases is present
            if (filteredData.length === 0) {
                return;
            }
            phaseID = "Aggregiert";

            //calculating the sums of the consumpiton per phase
            for(var i = 0; i < filteredData.length; i++){
                for(var j = 0; j < filteredData[i].data.length; j++){
                    value = value + filteredData[i].data[j].value;
                    console.log("what is happening?")
                    console.log(value);
                }

                if(value > 0) {
                    sumOfPhaseData[next] = ({"name": filteredData[i].name, "value": value});
                    next++;
                    value = 0;
                }
            }

            /*
               In case of the Pi chart the following set of function is only used for the dahsboard
                */

            //Formating the time stamp
        var blockTimes = timeConversion(filteredData,"D-M-YYYY");
            /*
                   This function does three things:
                   1. Extracting the data from the json to arrays
                   2. Taking the extracted arrays and converting them to one array with an appropriate structure
                       by calling processingJson()
                   3. Calling calculatedValues() to set the dashboard values
                   */
            var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,1);


            SettingDashboardvalues(dataJson,2,pricePerWh)


        }else {


            //filters for the aggregated value of the single phase

            filteredData =  filterForSinglePh(dataBrick,phaseID);
            //Exiting function in case of no data assigned to the phases is present
            if (filteredData.length > 0) {
                for (var i = 0; i < filteredData[0].data.length; i++) {
                    value = value + filteredData[0].data[i].value;
                }


                /*
                In case of the Pi chart the following set of function is only used for the dahsboard
                 */

                //Formating the time stamp
                var blockTimes = timeConversion(filteredData, "D-M-YYYY");

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
                    SettingDashboardvaluesDisaggregated(dataJson, 0, "Month", pricePerWh)
                } else if (phaseID.localeCompare("PH2") == 0) {
                    SettingDashboardvaluesDisaggregated(dataJson, 1, "Month", pricePerWh)
                } else if (phaseID.localeCompare("PH3") == 0) {
                    SettingDashboardvaluesDisaggregated(dataJson, 2, "Month", pricePerWh)
                }

            }

            if (value > 0) {

                sumOfPhaseData[0] = ({"name": filteredData[0].name, "value": value});


                //get phaseID of single consumers
                var consumerPhaseID = disaggregatedPhaseIDs(phaseID);
                //filter for the single consumers of the specified phase
                filteredDataSinglePH = filterForSinglePh(dataBrick, consumerPhaseID);
                next = 0;
                for (var i = 0; i < filteredDataSinglePH.length; i++) {
                    for (var j = 0; j < filteredDataSinglePH[i].data.length; j++) {
                        value = value + filteredDataSinglePH[i].data[j].value;
                    }

                    if (value > 0) {
                        sumOfPhaseDataSingleConsumer[next] = ({"name": filteredDataSinglePH[i].name, "value": value});
                        sumOfConsumptionOfTheMonitoredConsumers = sumOfConsumptionOfTheMonitoredConsumers + value;
                        next++;
                        value = 0;
                    }
                }

                //combine consumption of single consumers and the consumption of the phase - the sum of the consumption of single consumers
                sumOfPhaseData[0].value = sumOfPhaseData[0].value - sumOfConsumptionOfTheMonitoredConsumers
                if( sumOfPhaseData[0].value <0){
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
            }else{
                sumOfPhaseData[0] = ({"name": "No_Data", "value": 1});
            }
        }

        //filters for every consumer drawing from this phase

        //Important: nameBricksDay is global
        nameBricksMonth = labels(sumOfPhaseData)


        if(!sumOfPhaseData[0].name.localeCompare("No_Data")) {
            var color = d3.scaleOrdinal(colorGrey);
            ordinalDay = d3.scaleOrdinal().domain(["Sum = 0"]).range(colorGrey);
            var label = d3.arc()
                .outerRadius(0)
                .innerRadius(0);

        }else{
            var color = d3.scaleOrdinal(colorScheme);
            ordinalMonth = d3.scaleOrdinal().domain(nameBricksMonth).range(colorScheme);
            var label = d3.arc()
                .outerRadius(radius - 70)
                .innerRadius(radius - 70);


        }
                /*
                PI-Chart
                 */


        sumOfBrickData = [];
        value = 0;
        var next = 0;

        for(var i = 0; i < filteredData.length; i++){
            for(var j = 0; j < filteredData[i].data.length; j++){
                value = value + filteredData[i].data[j].value;
            }

            if(value > 0) {
                sumOfBrickData[next] = ({"label": filteredData[i].name, "value": value});
                next++;
                value = 0;
            }
        }

        var color = d3.scaleOrdinal(colorScheme);



        var pie = d3.pie()
            .sort(null)
            .value(function(data) { return data.value; });

        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);



        var arc = g.selectAll(".arc")
            .data(pie(sumOfBrickData))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.name); });

        arc.append("text")
            .attr("transform", function(d) { return "translate(" + label.centroid(d)+ ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { if(!d.data.name.localeCompare("No_Data")){return "Clamps attached but SUM = 0"};
                return Math.round(d.data.value * 100) / 100; });

// Prep the tooltip bits, initial display is hidden
        var tooltip = svgMonth.append("g")
            .attr("class", "tooltip")
            .style("display", "none");


        tooltip.append("text")
            .attr("x", 50)
            .attr("y",-50)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");





        if(positionY <100){

            legendMonth.append("g").attr("id", legendID).attr("transform", "translate(" + (positionX) + "," + positionY+")");
            legendOrdinalMonth = d3.legendColor().shape("path", d3.symbol()
                .type(d3.symbolTriangle).size(150)())
                .shapePadding(200).
                cellFilter(function (d) {
                    return d.label !== "e"
                })
                .scale(ordinalMonth)
                .orient('horizontal');

            legendMonth.append("g").append('text')
                .attr('x', positionX-110)
                .attr('y', positionY+5)
                .text(phaseID);
        }else {
            legendMonth.append("g").attr("id", legendID).attr("transform", "translate(" + (positionX) + "," + positionY+")");
            legendOrdinalMonth = d3.legendColor().shape("path", d3.symbol()
                .type(d3.symbolTriangle).size(150)())
                .shapePadding(50).cellFilter(function (d) {
                    return d.label !== "e"
                })
                .scale(ordinalMonth);

            legendMonth.append("g").append('text')
                .attr('x', positionX)
                .attr('y', positionY-25)
                .text(phaseID);
        }

        legendMonth.select("#"+legendID)
            .call(legendOrdinalMonth);



    })

}

function drawMonthChartLine() {

    if(firstRunMonth) {
        svgMonth = d3.select("#monthChart").append("p").append("svg").attr("width", widthMonthSvg).attr("height", heightMonthSvg)

        g = svgMonth.append("g").attr("transform", "translate(" + (marginMonth.right *4)+ "," + 10 + ")");

        d3.select("#monthChart").attr("align", "center");
        firstRunMonth = false;
    }else{
        svgMonth.selectAll("g").remove();
        g = svgMonth.append("g").attr("transform", "translate(" + (marginMonth.right *4)+ "," + 10 + ")");
        d3.select("#monthChart").attr("align", "center");

    }
    /*
    dataBrick = [{"name":"ofen4 | 403","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen1 | 103","data":[{"time":"2018-04-10T00:00","value":1.8044000000000002},{"time":"2018-04-10T01:00","value":1.8633333333333333},{"time":"2018-04-10T02:00","value":3.66608},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":3.6541333333333332},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":0.6467106944444443},{"time":"2018-04-10T12:00","value":0.9548865277777756}]},{"name":"ofen5 | 503","data":[{"time":"2018-04-10T00:00","value":0.9997188888888892},{"time":"2018-04-10T01:00","value":0.9994558333333333},{"time":"2018-04-10T02:00","value":0.9997387500000005},{"time":"2018-04-10T03:00","value":0.9996170833333332},{"time":"2018-04-10T04:00","value":0.9997668055555559},{"time":"2018-04-10T05:00","value":0.9997329166666667},{"time":"2018-04-10T06:00","value":0.999546111111111},{"time":"2018-04-10T07:00","value":0.9993225000000004},{"time":"2018-04-10T08:00","value":0.9995423611111109},{"time":"2018-04-10T09:00","value":0.9996719444444446},{"time":"2018-04-10T10:00","value":0.9997972222222221},{"time":"2018-04-10T11:00","value":5.981017222222222}]},{"name":"ofen2 | 203","data":[{"time":"2018-04-10T00:00","value":1.000013611111111},{"time":"2018-04-10T01:00","value":0.9998977777777779},{"time":"2018-04-10T02:00","value":1.0000313888888892},{"time":"2018-04-10T03:00","value":1.0000499999999999},{"time":"2018-04-10T04:00","value":0.9999113888888892},{"time":"2018-04-10T05:00","value":1.0000258333333334},{"time":"2018-04-10T06:00","value":0.9999822222222221},{"time":"2018-04-10T07:00","value":1.0000511111111112},{"time":"2018-04-10T08:00","value":0.9999888888888888},{"time":"2018-04-10T09:00","value":0.999958888888889},{"time":"2018-04-10T10:00","value":1.0000891666666667},{"time":"2018-04-10T11:00","value":12.013740694444438},{"time":"2018-04-10T12:00","value":17.18904}]},{"name":"ofen6 | 603","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0}]},{"name":"ofen3 | 303","data":[{"time":"2018-04-10T00:00","value":5.0},{"time":"2018-04-10T01:00","value":5.0},{"time":"2018-04-10T02:00","value":5.0},{"time":"2018-04-10T03:00","value":5.0},{"time":"2018-04-10T04:00","value":5.0},{"time":"2018-04-10T05:00","value":5.0},{"time":"2018-04-10T06:00","value":5.0},{"time":"2018-04-10T07:00","value":5.0},{"time":"2018-04-10T08:00","value":5.0},{"time":"2018-04-10T09:00","value":5.0},{"time":"2018-04-10T10:00","value":5.0},{"time":"2018-04-10T11:00","value":5.0},{"time":"2018-04-10T12:00","value":5.0}]}]
    */

    d3.json("http://" + connection + ":8090/get/" + filID + "/getMonth/" + monthString + "/").then(function (dataBrick) {


        /*
        This function checks if the array is empty. Setting SUM,MAX,AVG and Cost to "/" and exiting drawDayChartBlock()
         */
        if(noData(dataBrick,"#MonthChart",2)) {
            deleteUnnecessaryOptionsMonth(0);
            return;
        }

        for(var j = 0; j < dataBrick.length;j++) {
            console.log( dataBrick[j].name)
            var name = dataBrick[j].name;
            changeConsumerMonth(name, j);
        }

        deleteUnnecessaryOptionsMonth(dataBrick.length);

        var filteredData = filterForConsumer(dataBrick,$( "#consumerSelectionMonth option:selected" ).text());

        if (filteredData.length === 0) {
            return;
        }


        //Important: nameBricksDay is global
        //Formating the time stamp
        var blockTimes =[];
        console.log(filteredData);
        for(var i =0; i<filteredData[0].data.length;i++) {
            blockTimes.push(filteredData[0].data[i].time);
        }
        console.log(blockTimes)

        var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,0);
        //setting the dashboard values
       SettingDashboardvalues(dataJson,2,pricePerWh)


        var x = d3.scaleTime()
            .rangeRound([0, widthMonthChart]);

        var y = d3.scaleLinear()
            .rangeRound([heightMonthChart, 0]);


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
            .attr("transform", "translate(0," + heightMonthChart + ")")
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
