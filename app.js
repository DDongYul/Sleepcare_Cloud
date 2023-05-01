const express = require('express')
const app = express()
const path = require('path')

var FitbitApiClient = require("fitbit-node");

var apiClient = new FitbitApiClient({
    clientId: "23QZHL", clientSecret: "d54e56a48c6cad62a74e3a70e76c8c8a", apiVersion: "1.2"
})  //API클라이언트 생성

var scope = "profile activity sleep nutrition weight"
var redirectUrl = "http://127.0.0.1:3000/callback"

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
			res.send(results[0]);
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
})

app.listen(3000, function () {
    console.log('3000 port listen !!')
})

