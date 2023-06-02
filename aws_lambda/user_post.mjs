import db from '/opt/nodejs/mongodb_lib/access_mongodb.js'
import fs from 'fs'
import ejs from 'ejs'

var url = 'https://dx8fa94um8.execute-api.ap-northeast-2.amazonaws.com'

//post user
export const handler = async (event)=>{
    const id = event.pathParameters.id;//TODO

    console.log(event)
    
    const encodeStr = event.body;
    const decodeStr = Buffer.from(encodeStr, 'base64').toString('utf-8');
    
    console.log(decodeStr)
    
    var startDate = decodeStr.split('&')[0].split('=')[1];
    var endDate = decodeStr.split('&')[1].split('=')[1];
    
    const sleepDataList = await db.selectUserSleepDataList(id, startDate, endDate);//CHECK
    const indoorDataList = await db.selectUserIndoorDataList(id, startDate, endDate);//CHECK
    
    console.log(sleepDataList + indoorDataList)
    
    const datas = [];
    for (let i = 0; i < sleepDataList.length; i++) {
        const s = sleepDataList[i].sleepData;
        for (let j = 0; j < indoorDataList.length; j++) {
            const e = indoorDataList[j].indoorData;
            if (s.dateOfSleep == dateFormat(new Date(e.datetime))) {
                const data = {
                url: url,
                id: id,
                dateOfSleep: s.dateOfSleep,
                sleepScore: s.efficiency,
                endTime: s.endTime,
                env: {
                    temparature: e.temperature,
                    humidity: e.humidity,
                    illuminance: e.illuminance
                }
                };
                datas[i] = data;
                break;
            }
        }
    }
    console.log(datas);
    // EJS 템플릿 파일 경로
    const templateFile = '/opt/nodejs/views/data.ejs';

    // EJS 템플릿 파일 로드
    const templateString = fs.readFileSync(templateFile, 'utf-8');

    // EJS 템플릿 렌더링
    const renderedHtml = await ejs.render(templateString, {datas:datas});

    const response = {
        statusCode : 200,
        headers: {
        'Content-Type': 'text/html'
        },
        body: renderedHtml
    };
    return response;
};

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;

    return date.getFullYear() + '-' + month + '-' + day;
}
