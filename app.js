const express = require('express')
const app = express()
const path = require('path')

var FitbitApiClient = require("fitbit-node");

var apiClient = new FitbitApiClient({
    clientId: "23QZ6N", clientSecret: "979668d8630396d867bbaae539b658c3", apiVersion: "1.2"
})  //API클라이언트 생성

var scope = "profile activity sleep nutrition weight"
var redirectUrl = "https://3.35.41.124:3000/callback"

var authorizerUrl = apiClient.getAuthorizeUrl(scope, redirectUrl)
console.log(authorizerUrl)

app.get('/', function (req, res) {
    console.log('connect /')
    const filePath = path.join(__dirname, 'views', 'index.html')
    res.sendFile(filePath);
})

app.get('/authorize', function (req, res) {
    console.log('connect /authorize')
    res.redirect(apiClient.getAuthorizeUrl(scope, redirectUrl));
})


app.get('/callback', function (req, res) {
    console.log('connect /callback')
    // exchange the authorization code we just received for an access token
    apiClient.getAccessToken(req.query.code, redirectUrl).then(result => {
        // use the access token to fetch the user's profile information
        console.log(result)
        apiClient.get("/sleep/list.json?afterDate=2020-05-01&sort=asc&offset=0&limit=1", result.access_token).then(results => {
            //sendData() -> DB로 데이터 보내기
            res.redirect('https://3.35.41.124:3000/user/' + result.user_id);
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
})

app.get('/user/:id', function(req, res){
    //두가지 버튼 1.유저 DATA 조회 2.최적환경 대시보드
    const id = req.params.id
    console.log('connect /user/'+id)
    const filePath = path.join(__dirname, 'views', 'user.html')
    res.sendFile(filePath);
    //getData() 데이터 베이스에서 필요한 데이터 가져오기
})

app.get('/user/:id/data', function(req, res){
    const id = req.params.id
    console.log('connect /user/',id,'/data')
    res.send("user data")
})

app.get('/user/:id/sleep', function(req, res){
    const id = req.params.id
    console.log('connect /user/',id,'/sleep')
    res.send("user best sleep")
})

app.listen(3000, function () {
    console.log('3000 port listen !!')
})


