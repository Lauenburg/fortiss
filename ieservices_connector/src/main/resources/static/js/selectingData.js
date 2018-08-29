function selectingBrickData(result) {
    brickNr = document.getElementById("BrickSelector").value;
    var selectedResult = [];

/*
Die Anahme
 */
    switch (brickNr) {
        case "1":
            for (var l = 0; l < result.length; l++) {

                if (result[l].name.includes(" 10") || result[l].name.includes(" 20") || result[l].name.includes(" 30")) {
                    selectedResult.push(result[l]);
                    if(result[l].name.includes(" 100")){
                        selectedResult.pop(l);
                    }
                }

            }
            break;
        case "2":
            for (var l = 0; l < result.length; l++) {

                if (result[l].name.includes(" 40") || result[l].name.includes(" 50") || result[l].name.includes(" 60")) {
                    selectedResult.push(result[l]);
                }

            }
            break;

        case "3":
            for (var l = 0; l < result.length; l++) {

                if (result[l].name.includes(" 70") || result[l].name.includes(" 80") || result[l].name.includes(" 90")) {
                    selectedResult.push(result[l]);
                }

            }
            break;
        case "4":
            for (var l = 0; l < result.length; l++) {

                if (result[l].name.includes(" 100") || result[l].name.includes(" 110") || result[l].name.includes(" 120")) {
                    selectedResult.push(result[l]);
                }

            }
            break;
        case "5":
            for (var l = 0; l < result.length; l++) {

                if (result[l].name.includes(" 130") || result[l].name.includes(" 140") || result[l].name.includes(" 150")) {
                    selectedResult.push(result[l]);
                }

            }
            break;
    }
return selectedResult;

}



