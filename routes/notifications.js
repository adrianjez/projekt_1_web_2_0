/**
 * Created by adrianjez on 23.05.2017.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var FeedbacksMD = require('../mongoDB/feedback');

router.get('/', checkAuthentication, function (req, res, next) {
    FeedbacksMD.find({}, function (err, msgs) {
        if (err) return next(err);
        req.title = "Wiadomości";
        req.wiadomosci = msgs;
        res.render('pages/message-list', req);
    });

});
router.get('/list', checkAuthentication, function (req, res, next) {
    FeedbacksMD.find({}, function (err, msgs) {
        if (err) return next(err);
        res.send(msgs);
    });

});

router.get('/readed/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    FeedbacksMD.findById(req.params.id, function (err, msg) {
        if (err) return next(err);
        msg.readed = !msg.readed;
        msg.save(function (err) {
            if (err)
                console.log(err);
            res.redirect('/messages');
        });

    });

});
router.get('/detail/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    FeedbacksMD.findById(req.params.id, function (err, msg) {
        if (err) return next(err);
        res.send(msg);
    });

});
router.get('/delete/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    FeedbacksMD.findByIdAndRemove(req.params.id, function (err, msg) {
        if (err) return next(err);
        res.redirect('/messages');

    });

});
router.delete('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    FeedbacksMD.findByIdAndRemove(req.params.id, function (err, msg) {
        if (err) return next(err);
        res.send("Message was deleted succesfull");
    });

});


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("../users/login");
    }
}
module.exports = router;
