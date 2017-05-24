/**
 * Created by adrianjez on 23.05.2017.
 */
var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    name: {type:String, unique : true, required : true },
    category:{type: String, default:"NOT_DEFINED"},
    title: String,
    content: String,
    active: { type: Boolean, default: true }
});

var Articles = mongoose.model('article', ArticleSchema);

module.exports = Articles;