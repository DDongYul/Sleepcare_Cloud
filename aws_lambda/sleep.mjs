import db from '/opt/nodejs/mongodb_lib/access_mongodb.js'
import fs from 'fs'
import ejs from 'ejs'
import LocalDate from '/opt/nodejs/date_lib/get_local_date.js'
var url = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com'

export const handler = async (event) => {
    const id = event.pathParameters.id;//TODO
    console.log('connect /user/' + id + '/sleep');
  
    
    const maxEfficiencySleep = await db.selectMaxEfficiencySleepData(id);
    const indoorDataList = await db.selectUserIndoorDataList(id, LocalDate.byFormat1("2023-01-01"), LocalDate.now());

    const datas = [];
    for (let i = 0; i < indoorDataList.length; i++) {
        const e = indoorDataList[i].indoorData;
        if (maxEfficiencySleep.dateOfSleep == dateFormat(new Date(e.datetime))) {
            const data = {
            id: id,
            url: url,
            temperature: e.temperature,
            humidity: e.humidity,
            illuminance: e.illuminance
            };
            datas[0] = data;
            break;
        }
    }

    // EJS 템플릿 파일 경로
    const templateFile = '/opt/nodejs/views/sleep.ejs';

    // EJS 템플릿 파일 로드
    const templateString = fs.readFileSync(templateFile, 'utf-8');

    // EJS 템플릿 렌더링
    const renderedHtml = ejs.render(templateString, {data:datas[0]});

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: renderedHtml
    };
    console.log(response)
    return response;
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