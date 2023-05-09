const express = require('express')
const app = express()
const ejs = require('ejs')
const LocalDate = require('./date_lib/get_local_date.js');
// =====================================at EC2
/* 
const https = require('https'); 
const fs = require('fs;);
*/

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

var FitbitApiClient = require("fitbit-node");
var db = require('./mongodb_lib/access_mongodb');

// var apiClient = new FitbitApiClient({
//     clientId: "23QZ6N", clientSecret: "979668d8630396d867bbaae539b658c3", apiVersion: "1.2"
// })  //EC2 전용 API클라이언트 생성 redirectUrl:https://3.35.41.124:3000/callback 

//===================================================================== at EC2
/* 
var apiClient = new FitbitApiClient({
    clientId: "23QSQT", clientSecret: "f9ec93bc405536e9655d9938ffa7e547", apiVersion: "1.2"
})  //local 환경 API클라이언트 생성 redirectUrl: "http://127.0.0.1:3000/callback"

var url = "https://a.sleepcarecloud.click"   //base url for RestAPI
var scope = "profile activity sleep nutrition weight"
var redirectUrl = "https://a.sleepcarecloud.click/callback"
*/
//========================================================================== at EC2

//======================================================================= at local host
var apiClient = new FitbitApiClient({
    clientId: "23QZHL", clientSecret: "d54e56a48c6cad62a74e3a70e76c8c8a", apiVersion: "1.2"
})  //local 환경 API클라이언트 생성 redirectUrl: "http://127.0.0.1:3000/callback"

var url = "http://127.0.0.1:3000"   //base url for RestAPI
var scope = "profile activity sleep nutrition weight"
var redirectUrl = "http://127.0.0.1:3000/callback"
//======================================================================= at local host

var authorizerUrl = apiClient.getAuthorizeUrl(scope, redirectUrl)
console.log(authorizerUrl)

app.get('/', function (req, res) {
    console.log('connect /')
    ejs.renderFile('views/index.ejs',{url:url}, function(err,html){
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.send(html)
        }
    });
})

app.get('/authorize', function (req, res) {
    console.log('connect /authorize')
    res.redirect(apiClient.getAuthorizeUrl(scope, redirectUrl));
})

app.get('/callback', function (req, res) {
    console.log('connect /callback')
    // exchange the authorization code we just received for an access token
    apiClient.getAccessToken(req.query.code, redirectUrl).then(result => {
        var beforeDate = dateFormat(LocalDate.now())
        console.log("beforeDate:",beforeDate)
        db.selectUserPullDate(result.user_id).then(lastModified =>{
            console.log("lastModified:",lastModified)
            if (lastModified == null){
                var sleepQuery = "/sleep/list.json?beforeDate=" + beforeDate + "&sort=asc&offset=0&limit=10"
            }
            //dateFormat(lastmodified)와 beforeDate 같으면 굳이 조회 안하는 방향으로 refactoring 하는게 나을듯
            else{
                // res.redirect(url + "/user/" + result.user_id);
                var sleepQuery = "/sleep/date/" + dateFormat(lastModified) + "/" + beforeDate + ".json" + "?sort=asc&offset=0&limit=10"
            }
            console.log("sleepQuery:",sleepQuery)

            apiClient.get(sleepQuery, result.access_token).then(sleepData => {
                // console.log("sleedata",sleepData[0])
                // DB에 데이터 저장
                if(sleepData[0].sleep == null){
                    res.redirect(url + "/user/" + result.user_id);
                }
                else{
                // console.log(sleepData[0].sleep)
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
})

//app.post('user/:id) form 형식으로 날짜정보 받아서 데이터 DB조회
app.post('/user/:id', function(req, res){
    const id = req.params.id
    // DB에서 데이터 조회에서 data 객체에 담아서 post 전달
    db.selectUserSleepDataList(id,req.body.startDate,req.body.endDate).then(sleepDataList =>{
        db.selectUserIndoorDataList(id,req.body.startDate,req.body.endDate).then(indoorDataList=>{
            const datas=[]
            console.log(sleepDataList)
            console.log(indoorDataList)
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
            console.log(datas)
                // console.log(s)
                // console.log(s.levels.summary)
                // console.log(s.levels.data)
                // console.log(s.levels.shortData)
            }
            datas.sort((a,b)=> a.dateOfSleep-b.dateOfSleep)
            ejs.renderFile('views/data.ejs',{datas:datas}, function(err,html){
                if (err) {
                    console.log(err)
                } else {
                    res.send(html)
                }
            });
        })
    })
});

app.get('/user/:id', function(req, res){
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
})

app.get('/user/:id/sleep', function(req, res){
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
})

app.listen(3000, function () {
    console.log('3000 port listen !!')
})

//======================== atEC2
/* 
options = {
    key: fs.readFileSync('./rootca.key'),
    cert: fs.readFileSync('./rootca.crt')
};
const server = https.createServer(options, app);
server.listen(443, () => {
    console.log('HTTPS, port = ' + 443);
})
*/
//======================== at EC2

//date -> YY-MM-DD(String)
function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}
