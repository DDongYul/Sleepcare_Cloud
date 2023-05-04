const mongoose = require('mongoose');
const {Schema} = mongoose;

const Indoor = new Schema({
    userObjId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    indoorData : {
        type: Object,
        required : true
    }
})

module.exports = mongoose.model();