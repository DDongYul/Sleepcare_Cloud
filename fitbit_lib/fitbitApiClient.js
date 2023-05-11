// =====================================at EC2
/* 
const https = require('https'); 
const fs = require('fs');
*/

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

var FitbitApiClient = require("fitbit-node");
var apiClient = new FitbitApiClient({
    clientId: "23QZHL", clientSecret: "d54e56a48c6cad62a74e3a70e76c8c8a", apiVersion: "1.2"
})
var url = "http://127.0.0.1:3000"   //base url for RestAPI
var scope = "profile activity sleep nutrition"
var redirectUrl = "http://127.0.0.1:3000/callback"

module.exports={
    getFitbitApiClient: ()=>{   //return fitbitApiClient
        return apiClient;
    },
    getUrl: ()=>{
        return url;
    },
    getScope: ()=>{
        return scope;
    },
    getRedirectUrl: ()=>{
        return redirectUrl;
    }
}