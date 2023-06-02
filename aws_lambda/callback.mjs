import fitbit from '/opt/nodejs/fitbit_lib/fitbitApiClient.js'
import db from '/opt/nodejs/mongodb_lib/access_mongodb.js'
import LocalDate from '/opt/nodejs/date_lib/get_local_date.js'

var url = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com'
var redirectUrl = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com/callback'
var apiClient = fitbit.getFitbitApiClient()

export const handler = async(event) => {
    console.log('connect /callback')
    var code = event.queryStringParameters.code
    var response = 'async'
    var result;

    result = await apiClient.getAccessToken(code, redirectUrl);
    var beforeDate = dateFormat(LocalDate.now());
    var lastModified = await db.selectUserPullDate(result.user_id);
    console.log('lastModified:', lastModified);
    var sleepQuery = '';
    if(lastModified == null){
        sleepQuery = "/sleep/list.json?beforeDate=" + beforeDate + "&sort=asc&offset=0&limit=10"
    }else{
        sleepQuery = "/sleep/date/" + dateFormat(lastModified) + "/" + beforeDate + ".json" + "?sort=asc&offset=0&limit=10"
    }
    console.log('sleepQuery : ', sleepQuery);
    var sleepData =  await apiClient.get(sleepQuery, result.access_token);
    var nextUrl = '';
    var response = 'async';
    if(sleepData[0].sleep == null){
        nextUrl = url + '/user/' + result.user_id;
    }else{
        var flag = await db.upsertUserPullDateNow(result.user_id)
        if(flag){
            var flag2 =  await db.insertUserSleepDataList(result.user_id, sleepData[0].sleep);
            nextUrl = url + '/user/' + result.user_id;
        }
    }
    response = {
        statusCode : 302,
        headers : {Location : nextUrl}
    }
    return response;  
};

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}
