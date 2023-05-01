function getLocalDate(timeOffset){//if UTC+9 then 9
    var utcVal = Date.now();
    return new Date(utcVal + 3600 * 1000 * timeOffset);//3600 * 1000 = 1hour
}

function getLocalDateZero(timeOffset){
    var utcVal = Date.now();
    var localVal = utcVal + 3600 * 1000 * timeOffset;
    var localZeroVal = localVal - localVal % 86400000;// 86400000 = 1000 * 3600 * 24 = 1 day
    return new Date(localZeroVal);
}

var old_date = getLocalDateObject(9);
var new_date = new Date(old_date.getFullYear(), old_date.getMonth(), old_date.getDay() + 1, 0, 0, 0, 0);
console.log(new_date);

var utcVal = Date.now();
console.log(utcVal);
var utcVal = utcVal + 3600 * 1000 * 9;
var utcVal = utcVal - utcVal % 86400000;
console.log(utcVal);
var date = new Date(utcVal);
console.log(date);

// var locale_string = new Date().toLocaleString('en-US');
// console.log(locale_string);
// var date_list = locale_string.split(',')[0].split('/');//month day year
// var time_list = locale_string.split(' ')[1].split(':');//hour minute sec
// console.log(date_list);
// console.log(time_list);
// var locale_date = new Date(Date.UTC(date_list[2], date_list[0], date_list[1], time_list[0], time_list[1], time_list[2]));
// console.log(locale_date);