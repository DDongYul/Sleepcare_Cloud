import fitbit from '/opt/nodejs/fitbit_lib/fitbitApiClient.js'

var scope = fitbit.getScope()
var redirectUrl = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com/callback'
var apiClient = fitbit.getFitbitApiClient()

export const handler = async(event) => {
    console.log('authorize')
    // TODO implement
    var authorizeUrl = apiClient.getAuthorizeUrl(scope, redirectUrl)
    const response = {
        statusCode: 302,
        headers: {Location: authorizeUrl}
    };
    return response;
};
