const accessMongoDB = require('../access_mongodb');
const testObj = require('./test_obj');
const localDate = require('../../date_lib/get_local_date');

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
    accessMongoDB.insertUserSleepDataList('BB', testObj.oneDaySleepData0429);
}

//===============================================

//select sleep data
function selectSleepData(){
    var start = localDate.byFormat1('2023-04-29');
    var end = localDate.byFormat1('2023-05-01');
    //from 04/29:00:00 ~ 05/01:00:00
    accessMongoDB.selectUserSleepDataList('BB', start, end).then((sleepDataList) =>{
        for(sleepData of sleepDataList){
            console.log(sleepData);
        }
    });
   
}


// asyncSelectUserObjId();
// asyncSelectUserObjId();


// asyncSelectUpdate();
// selectUpdate();
// asyncInsertSleep();


// asyncSelectUpdate().then(()=>{asyncInsertSleep();})

selectSleepData();