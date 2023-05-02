const accessMongoDB = require('../access_mongodb');


//select user_lastdate then update user_lastdate now
async function asyncSelectUpdate(){
    var userLastDate = await accessMongoDB.selectUserLastDate('AA');
    console.log(userLastDate);
    await accessMongoDB.updateUserLastDateNow('AA');
}
//or
function selectUpdate(){
    accessMongoDB.selectUserLastDate('BB').then((userLastDate)=>{
        console.log(userLastDate);
        accessMongoDB.updateUserLastDateNow('BB');
    })
}
//=====================================================




// asyncSelectUpdate();
// selectUpdate();