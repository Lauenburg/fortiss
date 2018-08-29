$(document).ready(function() {
    main()
});

var pricePerWh = 1.3;


var color = ['#DED700', '#31AE03', '#FF0000','#d73027', '#f46d43', '#fdae61'];
var colorGrey = ['#ebebe0'];
var colorAggregated = ['#FAB302'];
var colorPerPhase = [['#DED700', '#FFF700', '#FFFA52','#FFFC98', '#FFFDC8', '#E7E5C0'],
    ['#31AE03', '#47FF03', '#90FF67','#B5FF9A', '#D6FFC7', '#C9EABD'],
    ['#FF0000', '#FF3C3C', '#FF6B6B','#FFA2A2', '#FFC0C0', '#FFE0E0']];

var colorGreyBlue = ['#d1e0e0','#b3cbcb','#95b7b7','#76a2a2','#5d8989','#486a6a','#344c4c','#1f2e2e','#0a0f0f']


var port = 8443;
var connection = "192.168.21.240";
var filID = 1000;
var dateHour;
var dateDay;
var dateMonth;

function main() {
    filID = document.getElementById("FilialeSelector").value;
    if (document.visibilityState == "visible") {
        drawLiveChart()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
}



function handleVisibilityChange() {
    if (document.visibilityState == "hidden") {
        chartLive.selectAll("g").remove();
    } else {
        //setting dataLive to null lets the update function enter the if-case
        //if (filtertData.length !== dataLive.length) {...}
        dataLive = {}
    }


}