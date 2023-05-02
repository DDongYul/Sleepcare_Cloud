const {MongoClient} = require('mongodb');
const dbURL = 'mongodb://3.35.41.124:27017/';
const getLocalDate = require('../date_lib/get_local_date');


module.exports={
    selectLastDate: async (userId)=>{
        const dbClient = new MongoClient(dbURL);
        try{
            const iotDb = dbClient.db('cloud_iot');
            const userLastDateCollection = iotDb.collection('user_lastDate');

            const query = {
                user : userId
            }
            var userLastDateDocument =  await userLastDateCollection.findOne(query);
            return userLastDateDocument;
        }catch{

        }finally{
            await dbClient.close();
        }
    },
    updateLastDate: async (userId)=>{//update to now
        const dbClient = new MongoClient(dbURL);
        try{
            const iotDb = dbClient.db('cloud_iot');
            const userLastDateCollection = iotDb.collection('user_lastDate');

            var korDate = getLocalDate.now();
            korDate.setUTCHours(0,0,0,0);

            const filter = {user: userId};
            const options = {upsert:true};
            const updateQuery = {
                $set: {
                    lastDate : korDate
                }
            };

            const result = await userLastDateCollection.updateOne(filter, updateQuery, options);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
              );
        }catch{

        }finally{
            await dbClient.close();
        }
    },
    insertSleepData: async (userId, oneDaySleepDataByList)=>{//insert one day sleep data all
        const dbClient = new MongoClient(dbURL);
        try{
            const iotDb = dbClient.db('cloud_iot');
            const userSleepDateCollection = iotDb.collection('user_sleep_date');
            for(const oneSleep of oneDaySleepDataByList.sleep){
                var dateObj = getLocalDate.byFormat1(oneSleep.dateOfSleep);
                const document = {
                    user : userId,
                    sleep : oneSleep,
                    date : dateObj
                }
                const result = await userSleepDateCollection.insertOne(document);
                console.log(`A document was inserted with the _id: ${result.insertedId}`,);
            }
        }catch{

        }finally{
            await dbClient.close();
        }
    },
    selectSleepDataByList: async (userId, dateFormatString)=>{ //date format : '2023-05-02'
        const dbClient = new MongoClient(dbURL);
        try{
            const iotDb = dbClient.db('cloud_iot');
            const userSleepDateCollection = iotDb.collection('user_sleep_date');
            var start = getLocalDate.byFormat1(dateFormatString);
            const query = {
                user : userId,
                date : start
            }
            sleepDataList = await userSleepDateCollection.find(query).toArray();
            return sleepDataList;
        }catch{

        }finally{
            await dbClient.close();
        }
    }
}