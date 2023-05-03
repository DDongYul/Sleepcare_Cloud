const mongoose = require('mongoose');
const dbURL = 'mongodb://cloudjs:cloudjs@3.35.41.124:27017/cloud_iot';

module.exports = {
    connect : async (funcName) => {
        await mongoose.connect(dbURL, {
            dbName : 'cloud_iot',
            useNewUrlParser: true
        });
        console.log('DB connect by [' + funcName + ']');
    },
    disconnect : async (funcName) => {
        await mongoose.disconnect();
        console.log('DB disconnect by [' +  funcName +']');
    }
}