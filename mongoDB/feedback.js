/**
 * Created by adrianjez on 23.05.2017.
 */

var mongoose = require('mongoose');

var FeedBacksSchema = new mongoose.Schema({
    subject: String,
    email: {type: String, required: true},
    message: String,
    date: Date,
    readed: Boolean
});
var FeedBack = mongoose.model('msg', FeedBacksSchema);

module.exports = FeedBack;