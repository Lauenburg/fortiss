function link(type){

    $(type).bind('mousemove touchmove touchstart', function (e) {

        var chart,
        point,
        i,
        event;
        console.log("Highcharts.charts.length");
        console.log(Highcharts.charts.length);
        for (i = 1; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            //When a chart is destroyed, the array item becomes undefined but is not removed!
            if (typeof chart != 'undefined') {
                // Find coordinates within the chart
                event = chart.pointer.normalize(e.originalEvent);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.highlight(e);
                }
            }
    }
});



/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
 Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
 Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    //this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};
};

function liveLink() {
    var $historyDataMonth = $('.historyDataMonth');
    var $historyDataDay = $('.historyDataDay');
    var $historyDataHour = $('.historyDataHour');


    if($('.historyDataMonth').is(':visible')){
        link('.historyDataMonth');
    }else if($('.historyDataDay').is(':visible')){
        link('.historyDataDay');
    }else if($('.historyDataHour').is(':visible')){
        link('.historyDataHour');
    };
}

function unlink() {
    $('#containerLiveChart').unbind();
    $('.historyDataMonth').unbind();
    $('.historyDataDay').unbind();
    $('.historyDataHour').unbind();
}

