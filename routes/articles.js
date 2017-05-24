/**
 * Created by adrianjez on 23.05.2017.
 */
var express = require('express');
var router = express.Router();
var Articles = require('../mongoDB/article');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

router.get('/', checkAuthentication, function (req, res, next) {
    Articles.find({}, function (err, products) {
        req.produkty = products;
        req.title = "Artykuły";
        res.render('pages/article-list', req)
    });
});

router.get('/list', checkAuthentication, function (req, res, next) {
    Articles.find({}, function (err, articles) {
        res.send(articles);
    });
});
router.get('/add', checkAuthentication, function (req, res, next) {
    req.title = "Article Add";
    res.render('pages/article-add', req)
});

router.post('/add', function (req, res, next) {
    Articles.create(req.body, function (err, doc) {
        if (err) return next(err);
        else {
            req.title = "Article";
            req.message = "Article " + doc.name + " został dodant";
            res.render('error', req)
        }
    });
});

router.get('/detail/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Articles.findById(req.params.id, {
        category: true,
        name: true,
        title: "",
        content: "",
        active: true
    }, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
});
router.get('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Articles.findById(req.params.id, {
        category: true,
        name: true,
        title: "",
        content: "",
        active: true
    }, function (err, product) {
        if (err) return next(err);
        req.produkt = product;
        res.render('pages/article-update', req);
    })
});
router.post('/update/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Articles.findByIdAndUpdate(req.params.id, req.body, function (err, doc) {
        if (err) return next(err);
        req.title = "Article";
        req.message = doc.name + " został zaktualizowany";
        res.render('error', req)
    });
});
router.put('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Articles.findByIdAndUpdate(req.params.id, req.body, function (err, doc) {
        if (err) return next(err);
        req.title = "Article";
        req.message = doc.name + " został zaktualizowany";
        res.render('error', req)
    });
});

router.get('/delete/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    console.log("Test");
    Articles.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) return next(err);
        req.message = doc.name + " został usuniety";
        req.title = "Article";
        res.render('error', req)
    });
});
router.delete('/:id', checkAuthentication, urlencodedParser, function (req, res, next) {
    Articles.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) return next(err);
        req.message = doc.name + " został usuniety";
        req.title = "Article";
        res.render('error', req)
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
