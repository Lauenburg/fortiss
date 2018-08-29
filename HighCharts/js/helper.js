function goOneUp(){

    if(dayChartAvail){
        requestMonthData(0);
        return;
    }

    if(hourChartAvail){
        requestDayData(0);
        return;
    }
}

function requestJetzt() {
    date = moment().locale('de');
    requestHourData(0);
}