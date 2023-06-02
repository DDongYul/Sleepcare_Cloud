import fs from 'fs';
import ejs from 'ejs';
import fitbit from '/opt/nodejs/fitbit_lib/fitbitApiClient.js'

var url = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com'

export const handler = async(event) => {
    console.log(event)
    const id = event.pathParameters.id
    console.log('connect /user/'+ id)
    
    const data= {
        url: url,
        id: id
    };
    
    // EJS 템플릿 파일 경로
    const templateFile = '/opt/nodejs/views/user.ejs';

    // EJS 템플릿 파일 로드
    const templateString = fs.readFileSync(templateFile, 'utf-8');

    // EJS 템플릿 렌더링
    const renderedHtml = await ejs.render(templateString, data);
    
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: renderedHtml
    };
    return response;
};