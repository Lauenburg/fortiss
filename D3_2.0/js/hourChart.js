//Used to check if only the "g "elements have to be newly appended or also the the svg element created
var firstRunHour = true;
//Global variable for the svg element containing all the hour chart specific elements
var svgHour;
//Values displayed in dashboard \ref{calculate} historyValuesHour=[SUM,Price,Max,AVG]
var historyValuesHour =[];

//global variable for the string containing the date of the referenced hour
var hourString;

//global array for the labels of the bricks
var nameBricksHour = [];

// "main" of the daychart
function drawHourChart(timeHour) {
    showDashboardAggregated();
    hideDashboardDisaggregated();

    //receives the hour specified by "timeHour" and format it for the https request
    dateHour.add(timeHour, 'hours');
    hourString = dateHour.format("D-M-YYYYTH:mm");
    console.log(hourString);

    //Defining reference sizes for the outlaying
    marginHour = {top: 60, right: 50, bottom: 80, left: 100, pufferLeft: 80, legend: 240},
        widthHourSvg = 1900,
        heightHourSvg = 400,
        widthHourChart = 1500,
        heightHourChart = 500 - marginHour.top - marginHour.bottom;

    //entering the if-case if it is the first block chart to be displayed and not only a change of the hour to be displayed.
    //Selecting the container of the tap_jQuery hour and creating a svg element with an "p" element nested in it.
    if (firstRunHour) {
        svgHour = d3.select("#HourChart").append("p").append("svg").attr("width", widthHourSvg+100).attr("height", heightHourSvg+100)

        g = svgHour.append("g").attr("transform", "translate(" + (marginHour.right * 4+20) + "," + 10 + ")");
        d3.select("#HourChart").attr("align", "center");
        firstRunHour = false;

    } else {
        //if the chart is updated with data of an other hour only the "g" elements of the old chart are replaced
        svgHour.selectAll("g").remove();
        historyValuesHour = []

        g = svgHour.append("g").attr("transform", "translate(" + (marginHour.right * 4+20) + "," + 10 + ")");
        d3.select("#HourChart").attr("align", "center");

    }
 hourChart(aggregiertHour);
}

//this function draws the block chart displaying the hour.
//showThreePhase is set by the disaggregation button and used to switch between the aggregated and the disaggregated view
function hourChart(showThreePhase) {

    //json request to the back end, than starting the actual drawing via a call back. The call back insures that the data is first correctly loaded.
    d3.json("https://" + connection + ":"+port+"/get/" + filID +"/getHour/" + hourString  + "/").then(function (dataBrick) {

        var hourColor = color;
        /*
        This function checks if the array is empty. Setting SUM,MAX,AVG and            Cost to "/" and exiting drawDayChartBlock()
         */
        if (noData(dataBrick,"#HourChart",0)) {
            firstRunHour = true;
            svgHour.selectAll("g").remove();
            svgHour.selectAll("p").remove();
            return;
        }

        var filteredData = filterForPh(dataBrick);
        //in case there is no description with PH1, PH2 or PH3
        if (filteredData.length === 0) {
            return;
        }




        //Formating the time stamp
        var blockTimes = timeConversion(filteredData,"H:mm");
        //Extracting the names of the consumers
        nameBricksHour = labels(filteredData)

        /*
         This function does three things:
         1. Extracting the data from the json to arrays
         2. Taking the extracted arrays and converting them to one array with
         an appropriate structure fore d3.stack()
          by calling processingJson()

          returns: Array of objects of format{xValue , yValue_1,...,yValue_n, sumOfyValues}
       */
        var dataJson =  jsonToArrayProcessingData(filteredData, blockTimes,1);

        //setting the dashboard values
        SettingDashboardvalues(dataJson,0,pricePerWh)


        //handling the aggregation and disaggregation by creating a label for the aggregated representation and setting the y value
        //to the sum of the values of the three phases
        if (showThreePhase) {
            hourColor = colorAggregated
            for (var i = 0; i < dataJson.length; i++) {
                dataJson[i] = {
                    x: dataJson[i].x, y: dataJson[i]["sum"], sum:
                        dataJson[i]["sum"], key: "PH1+PH2+PH3"
                }
            }
                nameBricksHour = []
                nameBricksHour[0] = "PH1+PH2+PH3"
            }


            var x = d3.scaleBand()
                .rangeRound([0, widthHourChart])
                .paddingInner(0.1)
                .align(0.2);

            var y = d3.scaleLinear().range([heightHourChart, 0]);


            var z = d3.scaleOrdinal().domain(nameBricksHour).range(hourColor);

            x.domain(dataJson.map(function (d) {
                return d.x;
            }));
            y.domain([0, d3.max(dataJson, function (d) {
                return d.sum;
            })]);


            var stack = d3.stack()
                .keys(nameBricksHour)
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



            g.append("g")
                .attr("class", "axisHistory axis--x")
                .attr("transform", "translate(0," + heightHourChart + ")")
                .call(d3.axisBottom(x).ticks(20));

            var ticks = g.selectAll(".tick text");
            ticks.attr("class", function (d, i) {
                if (i % 3 != 0) {
                    d3.select(this).remove();
                    }
            });


            g.append("g").attr("class", "axisHistory axis--y").call(d3.axisLeft(y).ticks(10).tickFormat(function (d) {
                return d3.format(".1f")(d) + " Wh";
            }).tickSizeInner([-widthHourChart])).append("text")
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
                        return heightHourChart - y(d.y);
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
                        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition +")");
                        tooltip.select("text").text(d[1]-d[0]);
                    });
            }

// Prep the tooltip bits, initial display is hidden
            var tooltip = svgHour.append("g")
                .attr("class", "tooltip")
                .style("display", "none");


            tooltip.append("text")
                .attr("x", 150)
                .attr("y", -50)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");

            ordinalHour = d3.scaleOrdinal()
                .domain(nameBricksHour)
                .range(hourColor);

            svgHour.append("g")
                .attr("class", "legendOrdinal")
                .attr("transform", "translate(" + (widthHourChart + (marginHour.legend)) + "," + (marginHour.top / 2) + ")");

            legendOrdinal = d3.legendColor()
                .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
                .shapePadding(50)
                .cellFilter(function (d) {
                    return d.label !== "e"
                })
                .scale(ordinalHour);

            svgHour.select(".legendOrdinal")
                .call(legendOrdinal);
    })
}


