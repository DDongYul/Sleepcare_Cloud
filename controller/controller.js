const ejs = require('ejs')
const LocalDate = require('../date_lib/get_local_date.js');

var db = require('../mongodb_lib/access_mongodb');

const fitbit = require('../fitbit_lib/fitbitApiClient.js')
var apiClient = fitbit.getFitbitApiClient()
var url = fitbit.getUrl()
var scope = fitbit.getScope()
var redirectUrl = fitbit.getRedirectUrl()

const index = function(req, res){
    console.log('connect /')
    ejs.renderFile('views/index.ejs',{url:url}, function(err,html){
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.send(html)
        }
    });
}

const authorize = function(req, res){
    console.log('connect /authorize')
    res.redirect(apiClient.getAuthorizeUrl(scope, redirectUrl));
}

const callback = function(req, res){
    console.log('connect /callback')

    apiClient.getAccessToken(req.query.code, redirectUrl).then(result => {
        var beforeDate = dateFormat(LocalDate.now())
        db.selectUserPullDate(result.user_id).then(lastModified =>{
            console.log("lastModified:",lastModified)
            if (lastModified == null){
                var sleepQuery = "/sleep/list.json?beforeDate=" + beforeDate + "&sort=asc&offset=0&limit=10"
            }
            else{
                var sleepQuery = "/sleep/date/" + dateFormat(lastModified) + "/" + beforeDate + ".json" + "?sort=asc&offset=0&limit=10"
            }
            console.log("sleepQuery:",sleepQuery)

            apiClient.get(sleepQuery, result.access_token).then(sleepData => {
                // DB에 데이터 저장
                if(sleepData[0].sleep == null){
                    res.redirect(url + "/user/" + result.user_id);
                }
                else{
                db.upsertUserPullDateNow(result.user_id).then(flag=>{
                    if(flag){
                        db.insertUserSleepDataList(result.user_id, sleepData[0].sleep).then(flag2=>{
                            res.redirect(url + "/user/" + result.user_id);
                        })
                    }
            })
        }
            }).catch(err => {
                 console.log("get sleep data error")
            });
        }).catch(err => {
            console.log("get accesstoken error")
        });
        });
}

const postUser = function(req, res){
    const id = req.params.id
    // DB에서 데이터 조회에서 data 객체에 담아서 post 전달
    db.selectUserSleepDataList(id,req.body.startDate,req.body.endDate).then(sleepDataList =>{
        db.selectUserIndoorDataList(id,req.body.startDate,req.body.endDate).then(indoorDataList=>{
            const datas=[]
            for(let i =0;i<sleepDataList.length; i++){
                var s = sleepDataList[i].sleepData;
                for(let j = 0; j<indoorDataList.length; j++){
                    var e = indoorDataList[j].indoorData
                    if (s.dateOfSleep==dateFormat(new Date(e.datetime))){
                        const data = {
                            url: url,
                            id: id,
                            dateOfSleep: s.dateOfSleep,
                            sleepScore: s.efficiency,
                            endTime: s.endTime,
                            env: {temparature:e.temperature, humidity:e.humidity, illuminance:e.illuminance}
                        }
                        datas[i] = data
                        break
                    }
                }
            }
            ejs.renderFile('views/data.ejs',{datas:datas}, function(err,html){
                if (err) {
                    console.log(err)
                } else {
                    res.send(html)
                }
            });
        })
    })
}

const getUser = function(req, res){
    const id = req.params.id
    console.log('connect /user/'+id)
    const data= {
        url: url,
        id: id
    };
    ejs.renderFile('views/user.ejs',data, function(err,html){
    if (err) {
        console.log(err)
    } else {
        res.send(html)
    }
});
}

const getBestSleep = function(req, res){
    const id = req.params.id
    console.log('connect /user/'+id+'/sleep')
    /**
     * 1.sleepData와 indoorData를 모두 가져와서 날짜에 맞게 합침 
     * 2.efficency 순으로 정렬해서 상위 5개 뽑음
     * 3.5개의 indoor 데이터 평균내서 렌더링
     */
    db.selectMaxEfficiencySleepData(id).then(maxEfficiencySleep =>{
        db.selectUserIndoorDataList(id,LocalDate.byFormat1("2023-01-01"),LocalDate.now()).then(indoorDataList=>{
            const datas = []
            for(let i = 0; i<indoorDataList.length; i++){
                var e = indoorDataList[i].indoorData
                if (maxEfficiencySleep.dateOfSleep == dateFormat(new Date(e.datetime))){
                    const data = {
                        id:id,
                        url:url,
                        temperature:e.temperature,
                        humidity:e.humidity,
                        illuminance:e.illuminance  
                    }
                    datas[0] = data
                    break
                }
            }
            ejs.renderFile('views/sleep.ejs', {data:datas[0]}, function(err,html){
                if (err) {
                    console.log(err)
                } else {
                    res.send(html)
                }
            });
    })
})
}

module.exports = {
    index,authorize,callback,getUser,postUser,getBestSleep
}

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}