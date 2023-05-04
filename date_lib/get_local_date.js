const SeoulTimeOffset = 9;

module.exports={
    now: () => {//return dateObj with now time
        var date = new Date();
        date.setUTCHours(date.getUTCHours() + SeoulTimeOffset);
        return date;
    },
    /**
     * 
     * @param {*} dateFormatString 2023-04-09
     * @returns dateObj with value 2023-04-09T00:00:00.000Z
     */
    byFormat1: (dateFormatString) => {
        var date = new Date(dateFormatString);
        return date;
    } ,
    /**
     * 
     * @param {*} dateFormatString 2023-04-29T11:01:30.000
     * @returns dateObj with value 2023-04-29T11:01:30.000Z
     */
    byFormat2: (dateFormatString) => {
        var date = new Date(dateFormatString);
        date.setUTCHours(date.getUTCHours() + SeoulTimeOffset);
        return date;
    }
}