const express = require('express')
const app = express()
const ejs = require('ejs')
const LocalDate = require('./date_lib/get_local_date.js');

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

var FitbitApiClient = require("fitbit-node");
var db = require('./mongodb_lib/access_mongodb');

// var apiClient = new FitbitApiClient({
//     clientId: "23QZ6N", clientSecret: "979668d8630396d867bbaae539b658c3", apiVersion: "1.2"
// })  //EC2 전용 API클라이언트 생성 redirectUrl:https://3.35.41.124:3000/callback 

var apiClient = new FitbitApiClient({
    clientId: "23QZHL", clientSecret: "d54e56a48c6cad62a74e3a70e76c8c8a", apiVersion: "1.2"
})  //local 환경 API클라이언트 생성 redirectUrl: "http://127.0.0.1:3000/callback"

var url = "http://127.0.0.1:3000"   //base url for RestAPI
var scope = "profile activity sleep nutrition weight"
var redirectUrl = "http://127.0.0.1:3000/callback"

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

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}

app.get('/callback', function (req, res) {
    console.log('connect /callback')
    // exchange the authorization code we just received for an access token
    console.log(req);
    apiClient.getAccessToken(req.query.code, redirectUrl).then(result => {
        var beforeDate = dateFormat(LocalDate.now())
        console.log("beforeDate:",beforeDate)
        db.selectUserPullDate(result.user_id).then(lastModified =>{
            console.log("lastModified:",lastModified)
            if (lastModified == null){
                var sleepQuery = "/sleep/list.json?beforeDate=" + beforeDate + "&sort=asc&offset=0&limit=10"
            }
            else{
                var sleepQuery = "/sleep/list.json?afterDate=" + dateFormat(lastModified) + "beforeDate=" + beforeDate + "&sort=asc&offset=0&limit=10"
            }
            console.log("sleepQuery:",sleepQuery)

            apiClient.get(sleepQuery, result.access_token).then(sleepData => {
                // DB에 데이터 저장
                if(sleepData.sleep == null){
                    res.redirect(url + "/user/" + result.user_id);
                }
                else{
                console.log(sleepData[0].sleep)
                db.upsertUserPullDateNow(result.user_id).then(flag=>{
                    if(flag){
                        db.insertUserSleepDatas(result.user_id, sleepData[0].sleep).then(flag2=>{
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
    //DB에서 데이터 조회에서 data 객체에 담아서 post 전달
    const dummyData= {
        url: url,
        id: id,
        startDate: req.body.startDate, 
        endDate: req.body.endDate,
        sleepScore: 60,
        env: {temparature:18, humidity:28, illuminance:8}
    };
    const data = {
        //db 데이터 
    };
    //post 하면서 data.ejs 화면 렌더링 url은 계속 /user/:id -> 경로 2개로 줘서 sleep도 처리 가능할듯?
    ejs.renderFile('views/data.ejs',dummyData, function(err,html){
        if (err) {
            console.log(err)
        } else {
            res.send(html)
        }
    });
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
    //getData() 데이터 베이스에서 필요한 데이터 가져오기
})

// app.get('/user/:id/data', function(req, res){
//     const id = req.params.id
//     console.log('connect /user/'+id+'/data')
//     // data = {
//     //     user: '동열',
//     //     date: '2023-05-02',
//     //     sleepScore: 70,
//     //     env: {temparature:20, humidity:50, illuminance:10}
//     // }
//     ejs.renderFile('views/data.ejs', function(err,html){
//         if (err) {
//             console.log(err)
//         } else {
//             res.send(html)
//         }
//     });
// })

app.get('/user/:id/sleep', function(req, res){
    const id = req.params.id
    console.log('connect /user/'+id+'/sleep')
    //DB에서 데이타 조회, 가공
    data = {
        id:id,
        user: '동열',
        bestEnv: {temparature:21, humidity:60, illuminance:5}
    }
    ejs.renderFile('views/sleep.ejs',data, function(err,html){
        if (err) {
            console.log(err)
        } else {
            res.send(html)
        }
    });
})

app.listen(3000, function () {
    console.log('3000 port listen !!')
})