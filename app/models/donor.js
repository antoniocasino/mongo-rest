
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DonorSchema   = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    contact: String,
    bloodGroup:String,
    latitude:String,
    longitude:String,
    ip:String
});

module.exports = mongoose.model('donor', DonorSchema);
