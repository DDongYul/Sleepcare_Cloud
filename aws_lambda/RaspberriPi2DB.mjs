import db from "/opt/nodejs/mongodb_lib/access_mongodb.js";

export const handler = async (event) => {
  try {
    console.log(event);
    const message = event;
    //이벤트 데이터 추출 및 처리
    var userId = message.userId;
    var data = {
      datetime: message.datetime,
      temperature: message.temperature,
      humidity: message.humidity,
      illuminance: message.illuminance,
    };

    var result = await db.insertUserIndoorData(userId, data);
    console.log(result);
    if (result) {
      console.log("DB성공");
    } else {
      console.log("DB 실패");
    }

    return {
      statusCode: 200,
      body: "JSON 데이터가 성공적으로 읽혔습니다.",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "JSON 데이터 읽기 중 오류가 발생했습니다.",
    };
  }
};
