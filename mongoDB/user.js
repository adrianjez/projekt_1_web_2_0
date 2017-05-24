/**
 * Created by adrianjez on 23.05.2017.
 */
var mongoose = require('mongoose');
var sha1 = require('sha1');
var UsersSchema = new mongoose.Schema({
    username: {type:String, unique : true, required : true },
    password:{type: String},
    email: String,
    admin: { type: Boolean, default: false },
    active: { type: Boolean, default: false }
});

UsersSchema.methods.validPassword = function (pass, callback) {
    // console.log('Passowrd ' + pass);
    // console.log('This Pass ' + this.password);
    return sha1(pass) === this.password;
};

var Users = mongoose.model('user', UsersSchema);

module.exports = Users;