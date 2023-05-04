const accessMongoDB = require('../access_mongodb');
const testObj = require('./test_obj');

//select userObjId deprecated
// async function asyncSelectUserObjId(){
//     var userObjId = await accessMongoDB.selectUserObjId('CC');
//     console.log(userObjId);
//     console.log(userObjId.valueOf());
// }
// deprecated


//select user_lastdate then update user_lastdate now
async function asyncSelectUpdate(){
    var pullDate = await accessMongoDB.selectUserPullDate('BB');
    console.log(pullDate);
    await accessMongoDB.upsertUserPullDateNow('BB');
}
//or
function selectUpdate(){
    accessMongoDB.selectUserPullDate('BB').then((userLastDate)=>{
        console.log(userLastDate);
        accessMongoDB.upsertUserPullDateNow('BB');
    })
}
//=====================================================

//insert sleep data
async function asyncInsertSleep(){
    accessMongoDB.insertUserSleepDatas('BB', testObj.oneDaySleepData0429);
}

// asyncSelectUserObjId();
// asyncSelectUserObjId();


// asyncSelectUpdate();
// selectUpdate();
// asyncInsertSleep();


asyncSelectUpdate().then(()=>{asyncInsertSleep();})