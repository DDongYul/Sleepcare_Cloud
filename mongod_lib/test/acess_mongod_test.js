const access_mongod = require('../access_mongod.js');
const test_obj = require('./test_obj.js');

async function select(){
    access_mongod.selectLastDate('FF');
}

async function insert_select(){
    await access_mongod.updateLastDate('FF');
    await access_mongod.selectLastDate('FF').then((userLastDateDocument)=>{console.log(userLastDateDocument);})
}

async function insertUSD(){
    access_mongod.insertSleepData('B', test_obj.oneDaySleepData);
}

function selectSleepData(){
    access_mongod.selectSleepDataByList('B', '2023-04-29').then((list)=>{
        console.log(list);
        for(element of list){
            console.log(element);
            console.log(element.sleep.levels.data[0]);
        }
    })
}

// select();
insert_select();
// insertUSD();
// selectSleepData();