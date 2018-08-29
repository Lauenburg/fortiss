

var n = 1;
var firstRunLive = true;


/*************
 global varibales of the live graph
 *************/

var lineLiveL = null,
    lineLiveR = null,
    chartLive = null,
    xAxisLive = null,
    yAxisLiveLeft = null,
    yAxisLiveRight = null,
    seriesLive = null,
    legendOrdinal1 = null,
    legendOrdinal2 = null,
    legendOrdinal3 = null,
    transitionLive = null,
    domain = [],
counterTitel =0;
/*************
dummy data for first run
*************/

//für die Daten erstellen wir drei daten arrays
//hierbei besteht data1 aus drei Objekten welche selbst wieder jeweils einen daten array haben.
var dataLive = [
        {id:1000, messtellen:["one"],werte:[],zeit:0},
        {id:1000, messtellen:["two"],werte:[],zeit:0},
        {id:1000, messtellen:["three"],werte:[],zeit:0}
];


/*************
Layouting
 *************/

//wir defnieren die fläche auf welche der graph abgebildet wird
    var margin,
        width,
        height;

/*************
 Defining scales
 *************/


 // Hier erstellen wir den Graphen für den Verbrauch (Erster graph in der Visualiesierung)
var x1,
    yL,
    yR,
    z1 ;




function drawLiveChart() {

    margin = {top: 60, right: 0, bottom: 80, left: 200, pufferLeft: 80, legend: 100},
    width = 1500 - margin.right,
    height = 500 - margin.top - margin.bottom;

    /*************
     Defining scales
     *************/


        // Hier erstellen wir den Graphen für den Verbrauch (Erster graph in der Visualiesierung)
        x1 = d3.scaleTime().range([0, width]),
        yL = d3.scaleLinear().range([height, 0]),
            yR = d3.scaleLinear().range([height, 0]),
            z1 = d3.scaleOrdinal(d3.schemeCategory10);


    if (chartLive !== null) {
        chartLive.selectAll("g").remove();
        chartLive = d3.select("svg").append("g").attr("transform", "translate(" + (margin.pufferLeft) + ",20)");
        firstRunLive = true;
    } else {
        chartLive = d3.select("#panel1").append("p").append("svg")
            .attr("width", width + margin.left)
            .attr("height", height + margin.top + margin.bottom + margin.legend)
            .append("g")
            .attr("transform", "translate(" + (margin.pufferLeft) + ",20)");
    }

    d3.select("p").attr("align", "center");

//wir wollen mit dem path linen zeichnen. Daher übergeben wir ihm später diesen line generator

    lineLiveL = d3.line()
        .x(function (d) {
            return x1(d.x);
        })
        .y(function (d) {
            return yL(d.y);
        })
        .curve(d3.curveBasis);
    lineLiveR = d3.line()
        .x(function (d) {
            return x1(d.x);
        })
        .y(function (d) {
            return yR(d.y);
        })
        .curve(d3.curveBasis);


//Objects created inside a <defs> element are not rendered immediately; instead, think of them as templates
//or macros created for future use.

//clippath schneidet alles außerhalb ab
//Ein ClipPath schneidet alles außerhalb seines Definntionsbereiches ab
//er bewirkt somit, dass man nur den Teil des Path sieht der in "width" and "height liegt"
    chartLive.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

//hier fügen wir der chart1 eine xAxis1 bei. Diese verschieben wir um "hight" nach unten.
//The <g> SVG element is a container used to group other SVG elements. Transformations applied to the <g> element
//are performed on all of its child elements, and any of its attributes are inherited by its child elements.

//Die mulitformat funktion habe ich so angepasst. Muss checken ob das klappt

    xAxisLive = chartLive.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x1.axis = d3.axisBottom(x1).tickFormat(multiFormat));


    yAxisLiveRight = chartLive.append("g")
        .attr("class", "y_axis_rigth")
        .attr("transform", "translate(" + width + ",0)")
        .call(yR.axis = d3.axisRight(yR));


    yAxisLiveLeft = chartLive.append("g")
        .attr("class", "y_axis_left")
        .call(yL.axis = d3.axisLeft(yL));


//Im chart1 element welches noch keine .sereies Klassen Elemente defineirt ist, wird mit enter() für jeden Eintrag in data1
//.series element zugefügt mit dem verweis auf jeweils einen Eintrag im Array von Array data1

    seriesLive = chartLive.selectAll(".series")
        .data(dataLive)
        .enter().append("g")
        .attr("class", "series");


//hier erstellen wir einen verweis auf die Transition elemente von allen d3 Elementen

    transitionLive = d3.select({}).transition()
        .duration(300)
        .ease(d3.easeLinear);

    (function update() {
        transitionLive = transitionLive.each(function () {
            //d3.json("https://" + connection + ":8443/get/" + filID + "/lastValue").then(function (values) {
           d3.json("/get/" + filID + "/lastValue").then(function (values) {

                if (boxesCheckedLive.length === 0) {
                    dataLive = [];
                    return;
                }


                if (values == null){
                    //Adds the number of bricks present to the "Brick" select
                    return;
                }
                includeNumberOfBricksLive(values.length);

                //values[0] da ich momentan noch info von zwei bricks bekomme
                values = [values[document.getElementById("BrickChoosen").value-1]];


                //nur die Daten welche ich in den kästchen ausgewählt habe
                var filtertData = filterData(values);


                //Überprüfung ob sich der gewünschte output verändert hat (mehr oder wengier Boxen angewählt wurden)
                //un neu schrreiben des Graphen
                if (filtertData.length !== dataLive.length) {

                    dataLive = [];
                    dataLive = filtertData;


                    drawLiveChart(filtertData);

                    //setting counterTitel back to zero to print new titel
                    counterTitel = 0;


                } else {
                    var now = new Date();
                    domain = []
                    for (var f = 0; f < dataLive.length; f++) {
                        dataLive[f].werte.push(filtertData[f].werte[0]);
                        dataLive[f].messtellen[0] = filtertData[f].messtellen[0];
                        domain.push(dataLive[f].messtellen[0])
                    }
                }


                if (firstRunLive) {
                    creatPathAndCallLegend(filtertData);
                    firstRunLive = false;
                }

                var leftSplice = [];
                for(var i = 0; i< 3;i++) {
                    leftSplice[i] = dataLive[i]
                }

                yL.domain([
                    0,
                    d3.max(leftSplice, function (d) {
                        return d3.max(d.werte, function (d) {
                            return d.y;
                        });
                    }) * 1.3
                ]);


                if(dataLive.length > 3){

                    yAxisLiveRight.selectAll("g").remove();
                    yAxisLiveRight = chartLive.append("g")
                        .attr("class", "y_axis_rigth")
                        .attr("transform", "translate(" + width + ",0)")
                        .call(yR.axis = d3.axisRight(yR));

                if(counterTitel<1) {
                    yAxisLiveRight.append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(90)")
                        .attr("x", 110)
                        .attr("y", 6)
                        .attr("dy", "0.81em")
                        .attr("text-anchor", "end")
                        .text(dataLive[4].messtellen[0]);
                }
                    var rightSplice = [];
                    for(var i = 3; i< 5;i++) {
                        rightSplice[i-3] = dataLive[i]
                    }
                    yR.domain([
                        0,
                        d3.max(rightSplice, function (d) {
                            return d3.max(d.werte, function (d) {
                                return d.y;
                            });
                        }) * 1.3
                    ])
                }else {
                    yAxisLiveRight.selectAll("g").remove();
                    yAxisLiveRight = chartLive.append("g")
                        .attr("class", "y_axis_rigth")
                        .attr("transform", "translate(" + width + ",0)")
                        .call(yR.axis = d3.axisRight(yR));

                    yR.domain([
                        0,
                        d3.max(dataLive, function (d) {
                            return d3.max(d.werte, function (d) {
                                return d.y;
                            });
                        }) * 1.3
                    ])
                }

                //update y axis
                // update axis
                if(counterTitel<2) {
                    yAxisLiveLeft.append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(90)")
                        .attr("x", 100)
                        .attr("y", -16)
                        .attr("dy", "0.81em")
                        .attr("text-anchor", "end")
                        .text(dataLive[0].messtellen[0])
                }

                yAxisLiveLeft.call(yL.axis);

                yAxisLiveRight.call(yR.axis);


                //domain and update x axis
                x1.domain(d3.extent(dataLive[0].werte, function (d) {
                    return d.x;
                }));

                xAxisLive.call(x1.axis);


                var counter = 0;
                // redrawLiveChart the line
                seriesLive.select(".line")
                //.attr("id",function(d){ return d.name; })
                    .attr("d", function (d) {
                        if(counter<3) {
                            counter++;
                            return lineLiveL(d.werte);
                        }else{
                            return lineLiveR(d.werte);
                        }
                    })
                    .style("stroke", function (d) {
                        return z1(d.messtellen[0]);
                    })
                    .style("fill", "none")
                    .attr("transform", null);


                // pop the old data point off the front
                if (dataLive[0].werte.length > n * 1000) {
                    for (var i = 0; i < dataLive.length; i++) {
                        dataLive[i].werte.shift();
                    }
                }
            });

            //updating counter to prevent the titel from beeing printed again and again
            counterTitel++;
        }).transition().on("start", update);
    })();


}


    function legend(colorLive, domain) {

        domain1 = domain.slice(0,6)
        colorLive1 = colorLive.slice(0,6)

        ordinalLive1 = d3.scaleOrdinal()
            .domain(domain1)
            .range(colorLive1);
        svgLive1 = d3.select("svg");
        svgLive1.append("g")
            .attr("class", "legendOrdinal1")
            .attr("transform", "translate(" + (100) + "," + (height+margin.top) + ")");
        legendOrdinal1 = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
            .shapePadding(250)
            .orient('horizontal')
            .cellFilter(function (d) {
                return d.label !== "e"
            })
            .scale(ordinalLive1);

        if(domain.length>3) {
            domain2 = domain.slice(6, 12)
            colorLive2 = colorLive.slice(6, 12)
            ordinalLive2 = d3.scaleOrdinal()
                .domain(domain2)
                .range(colorLive2);
            svgLive2 = d3.select("svg");
            svgLive2.append("g")
                .attr("class", "legendOrdinal2")
                .attr("transform", "translate(" + (100) + "," + (height+margin.top+margin.top) + ")");
            legendOrdinal2 = d3.legendColor()
                .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
                .shapePadding(250)
                .orient('horizontal')
                .cellFilter(function (d) {
                    return d.label !== "e"
                })
                .scale(ordinalLive2);

        }
        if(domain.length>6 ) {
            domain3 = domain.slice(12, domain.length)
            colorLive3 = colorLive.slice(12, colorLive.length)
            ordinalLive3 = d3.scaleOrdinal()
                .domain(domain3)
                .range(colorLive3);
            svgLive3 = d3.select("svg");
            svgLive3.append("g")
                .attr("class", "legendOrdinal3")
                .attr("transform", "translate(" + (100) + "," + (height+margin.top+margin.top+margin.top) + ")");
            legendOrdinal3 = d3.legendColor()
                .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
                .shapePadding(250)
                .orient('horizontal')
                .cellFilter(function (d) {
                    return d.label !== "e"
                })
                .scale(ordinalLive3);

        }


        chartLive.append("text")
            .attr("class", "title")
            .attr("font-size","25")
            .attr("x", ((width-margin.left) / 2))
            .attr("y", 0 + ((margin.top / 5)))
            .text("Verbrauch");
    }

function creatPathAndCallLegend(filtertData) {
    colorLive = [];
    var counter = 0;
    seriesLive.append("path")
        .attr("class", "line")
        .attr("id", function (d) {
            return d.messtellen[0];
        })
        .attr("d", function (d) {
            if(counter<3) {
                counter++;
                return lineLiveL(d.werte);
            }else{
                return lineLiveR(d.werte);
            }
        })
        .style("stroke", function (d) {
            colorLive.push(z1(d.messtellen[0]));
            return z1(d.messtellen[0]);
        })
        .style("fill", "none");

    domain = [];
    for (var i = 0; i < filtertData.length; i++) {
        domain.push(filtertData[i].messtellen[0]);
    }

        d3.selectAll(".legendOrdinal1").remove()

        d3.selectAll(".legendOrdinal2").remove()

        d3.selectAll(".legendOrdinal3").remove()



    legend(colorLive, domain);
    svgLive1.select(".legendOrdinal1")
        .call(legendOrdinal1);
    if(domain.length>3)
        svgLive2.select(".legendOrdinal2")
            .call(legendOrdinal2);
    if(domain.length>6)
        svgLive3.select(".legendOrdinal3")
            .call(legendOrdinal3);

}

function handleVisibilityChange() {
    if (document.visibilityState == "hidden") {
        chartLive.selectAll("g").remove();
    } else {
        dataLive = {}
    }
}