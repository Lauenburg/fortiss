//This js combines the function for the data filtering of the live data
//It includes logic necessary for the DOM elements checkboxes

/*
boxesCheckedLive holds the identifiers of the checkedboxes
0: Leistung
1: Spannung
2: Phasenwinkel
3: Strom
4: THD-Strom
 */
var boxesCheckedLive = [];

//At start pushing "0" in to boxesCheckedLive do show power
boxesCheckedLive.push(0);


//Checks which boxes are checked and updates "boxesCheckedLive"
//Disables and enables the checkboxes if more or less than two ar checked
function checkBoxClick(outputType) {
    console.log(boxesCheckedLive.includes(outputType));
    if(!boxesCheckedLive.includes(outputType)){
        boxesCheckedLive.push(outputType);
    }else{
        for(var k = 0; k<boxesCheckedLive.length;k++) {
            if (boxesCheckedLive[k] === outputType) {
                boxesCheckedLive.splice(k,1);
            }
        }

    }

    if(boxesCheckedLive.length ===2){
        if(!check("Leistung")){
            disable("Leistung");
        }
        if(!check("Strom")){
            disable("Strom");
        }
        if(!check("THD-Strom")){
            disable("THD-Strom");
        }
        if(!check("Spannung")){
            disable("Spannung");
        }
        if(!check("Spannung")){
            disable("Spannung");
        }
        if(!check("Phasenwinkel")){
            disable("Phasenwinkel");
        }
    }else{
        enable("Leistung");
        enable("Strom");
        enable("THD-Strom");
        enable("Phasenwinkel");
        enable("Spannung");
    }


}

//Check if the checkbox with "id" is checked
function check(id) {
    return document.getElementById(id).checked;
}



//enables the checkbox with "id" and sets it opacity to 100%
function enable(id) {
    document.getElementById(id).disabled= false;
    id = '#containerCheckBox'+id
    $(id).css('opacity',1);

}

//disables the checkbox with "id" and sets it opacity to 100%
function disable(id) {
    document.getElementById(id).disabled= true;
    id = '#containerCheckBox'+id
    $(id).css('opacity',0.5);

}





/**
 * This method filters the data received with "http://192.168.21.240:8090/get/1000/lastValue"
 * in accordance to the boxes checked or rather the values contained in "boxesCheckedLive"
 */

function filterData(result) {

    var selectedResult = [];

    //number of bricks
    for (var i = 0; i < result.length; i++) {

        var innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]

        var now = new Date();

        //choosen boxesCheckedLive (like spannung and phase)



        for(var f = 0; f< boxesCheckedLive.length; f++) {

            switch (boxesCheckedLive[f]) {
                case 0:


                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        var avail = result[i].messtellen[j].search("Leistung");
                        if (avail !==  -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[0] = result[i].messtellen[j];
                            innerResult[0].werte.push({x:now, y:(greaterZero(result[i].werte[j]))});
                            innerResult[0].zeit = result[i].zeit;
                            selectedResult.push(innerResult[0]);
                            innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]
                        }

                    }

                    break;
                case 1:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        var avail = result[i].messtellen[j].search("Spannung");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[0] = result[i].messtellen[j];
                            innerResult[0].werte.push({x:now, y:(greaterZero(result[i].werte[j]))});
                            innerResult[0].zeit = result[i].zeit;
                            selectedResult.push(innerResult[0]);
                            innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]
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
                            innerResult[0].messtellen[0] = result[i].messtellen[j];
                            innerResult[0].werte.push({x:now, y:(result[i].werte[j])});
                            innerResult[0].zeit = result[i].zeit;
                            selectedResult.push(innerResult[0]);
                            innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]
                        }

                    }
                    break;
                case 3:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("Stromstärke");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[0] = result[i].messtellen[j];
                            innerResult[0].werte.push({x:now, y:(result[i].werte[j])});
                            innerResult[0].zeit = result[i].zeit;
                            selectedResult.push(innerResult[0]);
                            innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]
                        }

                    }
                    break;
                case 4:
                    for (var j = 0; j < result[i].messtellen.length; j++) {
                        // Alle Werte für Spannung nicht anzeigen!
                        var avail = result[i].messtellen[j].search("THD");
                        if (avail != -1) {
                            innerResult[0].id = result[i].id;
                            innerResult[0].messtellen[0] = result[i].messtellen[j];
                            innerResult[0].werte.push({x:now, y:(result[i].werte[j])});
                            innerResult[0].zeit = result[i].zeit;
                            selectedResult.push(innerResult[0]);
                            innerResult = [{id:1000,messtellen:[],werte:[],zeit:0}]
                        }

                    }
                    break;
                default:
                    break;
            }
        }
    }
    return selectedResult;

}

function greaterZero(value) {
    if(value <= 0){
        return 0;
    }else{
        return value;
    }

}
