// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MeetingSchema   = new Schema({
    name: String,
    location: String,
    owner: String,
    address: String,
    startDate: Date,
    registrationStart: Date,
    registrationEnd: Date,
    endDate: Date
});

module.exports = mongoose.model('Meeting', MeetingSchema);
