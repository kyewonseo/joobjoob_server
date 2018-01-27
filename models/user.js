
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name : String,
    email : String,
    hashed_password : String,
    created_at : String,
    temp_password : String,
    temp_password_time : String
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://strutive07:database_password_strutive07@ds115768.mlab.com:15768/uniton6team6');

module.exports = mongoose.model('user', UserSchema);
