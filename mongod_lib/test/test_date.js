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

function newDate(){
    var date = new Date('2023-04-09');
    console.log(date);
}

newDate();

// 23 05 02 13:00:00를 저장하면 -9을 하여 23 05 02 04:00:00을 UTC로 계산하고 이 UTC time이 date object의 출력이된다.