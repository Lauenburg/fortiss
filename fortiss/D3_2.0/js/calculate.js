//This method calculates the values depicted with in the dashboard
//values = [SUM,Price,Max,AVG]

function calculatedValues(data,price) {
    var sum = 0;
    var values=[]


    for(var i = 0; i < data.length; i++){
        sum = sum+data[i].sum
    }

    values.push(sum);
    values.push(sum*price);

    values.push(d3.max(data, function (d) {
        return d.sum;}));

    values.push(sum/data.length)
    return values;
}

