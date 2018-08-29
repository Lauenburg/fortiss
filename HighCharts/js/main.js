// Highcharts Script
Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: {noData: "No data"}
});

// Connection
//var connection = "10.10.10.1";
var connection = "192.168.21.240";


var filID; // das wählt die ID der Filiale

/*
Globale varibale for all methods
 */
var brickNr = 1;  // Wählt den Brick aus dessen Daten in den history charts angezeigt werden soll

var date; // datum, am anfang das von heute


// Das einzige mal, wo jquery notwendig ist...
$(document).ready(function() {
    main();
});


function main(){
    filID = document.getElementById("FilialeSelector").value;
    setTimeout(requestData, 2000);

    date = moment().locale('de');
    chartWithDataCreated = false;

    //creat containers
    creatMonthContainer();
    link('.historyDataMonth');
    creatDayContainer();
    creatHourContainer();


    //creat live chart
    createLiveChart();

    //load data in to history Charts
    requestMonthData(0);
}

/*

function getData(path) {	
    var xhttp = new XMLHttpRequest();

	console.log(path);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {        	
            eval(this.responseText); // hier wird die Funktion aufgerufen           
        }
    };

    //alte Implementierung
    //xhttp.open("GET", "getInternal.php?path="+path, true);

    xhttp.open("GET", path, true);
    xhttp.send();



}
*/
