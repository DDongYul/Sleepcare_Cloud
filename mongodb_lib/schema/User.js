const mongoose = require('mongoose');
const {Schema} = mongoose;

const User = new Schema({
    userId : {
        type : String,
        unique : true,
        required : true
    },
    pullDate : {
        type : Date,
        required : true
    }
});

module.exports = mongoose.model('User', User);