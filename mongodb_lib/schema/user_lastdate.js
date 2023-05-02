const mongoose = require('mongoose');
const {Schema} = mongoose;

const user_lastDate = new Schema({
    user : {
        type : String
    },
    lastdate : {
        type : Date
    }
});

module.exports = mongoose.model('user_lastdate', user_lastDate);