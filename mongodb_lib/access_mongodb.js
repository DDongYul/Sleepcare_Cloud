const conn = require('./connection/connection');
const user_lastdate = require('./schema/user_lastdate');
const getLocalDate = require('../date_lib/get_local_date');

module.exports = {
    selectUserLastDate : async (userId) => {
        await conn.connect('selectUserLastDate');
        try{
            var userLastDate = await user_lastdate.findOne({ user : userId});
            return userLastDate;
        }catch(err){
            console.log('err at selectUserLastDate');
            console.log(err);
        }finally{
            await conn.disconnect('selectUserLastDate');
        }
    },
    updateUserLastDateNow : async (userId) => {
        await conn.connect('updateUserLastDateNow');
        try{
            var now = getLocalDate.now();
            await user_lastdate.findOneAndUpdate({user : userId}, {user : userId, lastdate : now}, {upsert : true});
        }catch(err){
            console.log('err at updateUserLastDateNow');
            console.log(err);
        }finally{
            await conn.disconnect('updateUserLastDateNow');
        }
    }
}