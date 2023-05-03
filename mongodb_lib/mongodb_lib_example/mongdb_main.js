const accessMongoDB = require('../access_mongodb');
const testObj = require('./test_obj');

//select userObjId
async function asyncSelectUserObjId(){
    var userObjId = await accessMongoDB.selectUserObjId('CC');
    console.log(userObjId);
    console.log(userObjId.valueOf());
}


//select user_lastdate then update user_lastdate now
async function asyncSelectUpdate(){
    var pullDate = await accessMongoDB.selectUserPullDate('AA');
    console.log(pullDate);
    await accessMongoDB.upsertUserPullDateNow('AA');
}
//or
function selectUpdate(){
    accessMongoDB.selectUserPullDate('BB').then((userLastDate)=>{
        console.log(userLastDate);
        accessMongoDB.upsertUserPullDateNow('BB');
    })
}
//=====================================================

//insert sleepDatas(sleepDataArray)
async function asyncInsertSleep(){
    accessMongoDB.insertUserSleepDatas('AA', testObj.oneDaySleepData0429);
}

// asyncSelectUserObjId();
// asyncSelectUserObjId();
// asyncSelectUpdate();
// selectUpdate();
asyncInsertSleep();
