function processingJson(dataBrick, xValues,yValues) {
    var data = [];

    switch (dataBrick.length) {
        case 1:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    sum: yValues[0][i]
                })
            }
            break;
        case 2:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    [dataBrick[1].name]: yValues[1][i],
                    sum: yValues[0][i] + yValues[1][i]
                })
            }
            break;

        case 3:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    [dataBrick[1].name]: yValues[1][i],
                    [dataBrick[2].name]: yValues[2][i],
                    sum: yValues[0][i] + yValues[1][i] + yValues[2][i]
                })
            }
            break;

        case 4:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    [dataBrick[1].name]: yValues[1][i],
                    [dataBrick[2].name]: yValues[2][i],
                    [dataBrick[3].name]: yValues[3][i],
                    sum: yValues[0][i] + yValues[1][i] + yValues[2][i] + yValues[3][i]
                })
            }
            break;

        case 5:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    [dataBrick[1].name]: yValues[1][i],
                    [dataBrick[2].name]: yValues[2][i],
                    [dataBrick[3].name]: yValues[3][i],
                    [dataBrick[4].name]: yValues[4][i],
                    sum: yValues[0][i] + yValues[1][i] + yValues[2][i] + yValues[3][i] + yValues[4][i]
                })
            }

        case 6:
            for (var i = 0; i < xValues[0].length; i++) {
                data.push({
                    x: xValues[0][i],
                    [dataBrick[0].name]: yValues[0][i],
                    [dataBrick[1].name]: yValues[1][i],
                    [dataBrick[2].name]: yValues[2][i],
                    [dataBrick[3].name]: yValues[3][i],
                    [dataBrick[4].name]: yValues[4][i],
                    [dataBrick[5].name]: yValues[5][i],
                    sum: yValues[0][i] + yValues[1][i] + yValues[2][i] + yValues[3][i] + yValues[4][i] + yValues[5][i]
                })
            }
            break;

        default:

    }
    return data;
}