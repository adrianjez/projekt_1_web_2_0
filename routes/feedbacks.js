/**
 * Created by adrianjez on 23.05.2017.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var Messages = require('../mongoDB/feedback');
var CustomMailer = require('./../mailer/mailer');
router.get('/', function (req, res, next) {
    var body = req;
    body.title = "Feedback";
    res.render('pages/feedback', body)
});
router.post('/', urlencodedParser, function (req, res) {
    var data = req.body;
    data.date = new Date();
    console.log(data);
    Messages.create(data, function (err, doc) {
        if (err) return next(err);
        var mailOptions = CustomMailer.mailOptions;
        mailOptions.subject = data.subject;
        mailOptions.text = data.message;
        mailOptions.from = data.email;
        mailOptions.to = 'j.czest92@gmail.com';
        CustomMailer.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            res.send('Wiadomość ' + info.messageId + ' wysłana: ' + info.response);
        });
        res.render('error', {message: "Wiadomość została wysłana", user: req.user});
    });
});
module.exports = router;