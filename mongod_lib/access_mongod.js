const {MongoClient} = require('mongodb');
const dbURL = 'mongodb://3.35.41.124:27017/';
const SeoulTimeOffset = 9;

function getLocalDate(timeOffset){//if UTC+9 then 9
    var utcVal = Date.now();
    return new Date(utcVal + 3600 * 1000 * timeOffset);//3600 * 1000 = 1hour
}

function getLocalDateZero(timeOffset){
    var utcVal = Date.now();
    var localVal = utcVal + 3600 * 1000 * timeOffset;
    var localZeroVal = localVal - localVal % 86400000;// 86400000 = 1000 * 3600 * 24 = 1 day
    return new Date(localZeroVal);
}

module.exports={
    updateUserLastDate:async (user_id)=>{
        const dbClient = new MongoClient(dbURL);
        try{
            const iotDb = dbClient.db('cloud_iot');
            const userLastDateCollection = iotDb.collection('user_lastDate');

            var korDateZero = getLocalDateZero(SeoulTimeOffset);

            const filter = {user: user_id};
            const options = {upsert:true};
            const updateQuery = {
                $set: {
                    lastDate : korDateZero
                }
            };

            const result = await userLastDateCollection.updateOne(filter, updateQuery, options);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
              );
        }catch{

        }finally{
            dbClient.close();
        }
    }
}