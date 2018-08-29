
function createHourContainer(){

        var wrapper = 'wrapperHour';
        var wrapperDot = '.wrapperHour';
        var innerChart = 'historyDataHour';
        var innerChartDot = '.historyDataHour';

        var iDiv = document.createElement('div');
        iDiv.className = wrapper;
        document.getElementsByTagName('body')[0].appendChild(iDiv);

        for (var i = 0; i < 3; i++) {
            var innerDiv = document.createElement('div');
            innerDiv.className = innerChart;
            iDiv.appendChild(innerDiv);
        }

        var $wrapper = $(wrapperDot)
        $wrapper.each(function (i, e) {
                e.style.display = "none";
            });

        var $innerChart = $(innerChartDot);
        $innerChart.each(function (i, e) {
            e.style.display = "none";
        });

    return true;
}

function createMonthContainer(){

    var wrapper = 'wrapperMonth';
    var wrapperDot = '.wrapperMonth';
    var innerChart = 'historyDataMonth';
    var innerChartDot = '.historyDataMonth';

    var iDiv = document.createElement('div');
    iDiv.className = wrapper;
    document.getElementsByTagName('body')[0].appendChild(iDiv);

    for (var i = 0; i < 3; i++) {
        var innerDiv = document.createElement('div');
        innerDiv.className = innerChart;
        iDiv.appendChild(innerDiv);
    }

    var wrappers = $(wrapperDot)
    wrappers.each(function (i, e) {
        e.style.display = "none";
    });

    var $innerChart = $(innerChartDot);
    $innerChart.each(function (i, e) {
        e.style.display = "none";
    });

    return true;
}


function createDayContainer(){

        var wrapper = 'wrapperDay';
        var wrapperDot = '.wrapperDay';
        var innerChart = 'historyDataDay';
        var innerChartDot = '.historyDataDay';

        var iDiv = document.createElement('div');
        //iDiv.className = 'wrapperDay';
        iDiv.className = wrapper;
        document.getElementsByTagName('body')[0].appendChild(iDiv);

        for (var i = 0; i < 3; i++) {
            var innerDiv = document.createElement('div');
            //innerDiv.className = 'historyDataDay';
            innerDiv.className = innerChart;
            iDiv.appendChild(innerDiv);

        }

    var $wrapper = $(wrapperDot)
    $wrapper.each(function (i, e) {
        e.style.display = "none";
    });

    var $innerChart = $(innerChartDot);
    $innerChart.each(function (i, e) {
        e.style.display = "none";
    });

    return true;
}