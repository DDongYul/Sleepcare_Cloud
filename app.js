const express = require('express')
const app = express()
const ejs = require('ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

var FitbitApiClient = require("fitbit-node");

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


app.get('/callback', function (req, res) {
    console.log('connect /callback')
    // exchange the authorization code we just received for an access token
    apiClient.getAccessToken(req.query.code, redirectUrl).then(result => {
        // callback에서는 DB 업데이트 과정을 처리
        //selectUserPullDate로 최종 업데이트 날짜 가져오고 현재시간에서 빼고 뺀 시간만큼 apiClientget sleep 데이터를 가져오고 디비에 insert (result.sleep for문)
        //upsertDate로 날짜 업데이트 해줌 (DB업데이트 끝)
        apiClient.get("/sleep/list.json?afterDate=2020-05-01&sort=asc&offset=0&limit=1", result.access_token).then(results => {
            // res.send(results[0].sleep)
            res.redirect(url + "/user/" + result.user_id);
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
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


