const SeoulTimeOffset = 9;

module.exports={
    now: () => {//return dateObj with now time
        var date = new Date();
        date.setUTCHours(date.getUTCHours() + SeoulTimeOffset);
        return date;
    },
    byFormat1: (dateFormatString) => {//format : 2023-04-09, return dateObj with 2023-04-09:00:00:00
        var date = new Date(dateFormatString);
        return date;
    } ,
    byFormat2: (dateFormatString) => {//format : 2023-04-29T11:01:30.000, return dateObj with 2023-04-29 11:01:30.000
        var date = new Date(dateFormatString);
        date.setUTCHours(date.getUTCHours() + SeoulTimeOffset);
        return date;
    }
}