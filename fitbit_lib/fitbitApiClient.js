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