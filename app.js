var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbUrl = "mongodb://testuser:test@ds117189.mlab.com:17189/adrian_db";

var index = require('./routes/index');
var users = require('./routes/users');
var Users = require('./mongoDB/user');
var articles = require('./routes/articles');
var notifications = require('./routes/notifications');
var feedbacks = require('./routes/feedbacks');


var app = express();

var session = require('express-session');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

mongoose.connect(dbUrl, function (err) {
    if (err) {
        console.log('błąd połączenia', err);
    } else {
        console.log('połączenie udane');
    }
});

var hour = 3600000;

app.use(session({
    secret: "secret", cookie: {maxAge: hour, expires: new Date(Date.now() + hour)},
    resave: false, saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    // console.log(JSON.stringify(user));
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
        done(err, user);
        // console.log(user);
        // console.log(err);
    });
});

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
        // , passReqToCallback : false
    },
    function (username, password, done) {
        // console.log('LocalStrategy, przed findOne...')
        // console.log('||||username: '+username+', password: '+password+'||||');
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.', link: "login"});
            }
            if (!user.validPassword(password)) {
                // console.log("Not Password");
                return done(null, false, {message: 'Incorrect password.', link: "login"});
            }
            if (!user.active) {
                // console.log("Not Active");
                return done(null, false, {message: 'User inactive!', link: "login"});
            }
            return done(null, user);
        });
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);
app.use('/notifications', notifications);
app.use('/feedback', feedbacks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 5000, function() {
    console.log('Node app is running on port', 5000);
});

module.exports = app;
