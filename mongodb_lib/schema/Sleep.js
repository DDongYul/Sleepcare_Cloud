const mongoose = require('mongoose');
const {Schema} = mongoose;

const Sleep = new Schema({
    userObjId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    sleepData : {
        type : Object,
        required : true
    }
})

module.exports = mongoose.model('Sleep', Sleep);