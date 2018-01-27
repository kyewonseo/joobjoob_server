var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  area_id: String
});

module.exports = userSchema;