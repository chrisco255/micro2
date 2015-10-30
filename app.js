'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/*
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));
*/


/*passport.use(new LocalStrategy(
    function(username, password, done) {
      /!*let cmd = apiCmd.findOne('user', { username: username });
       bus.send(cmd.command, cmd.payload);*!/
      console.log('verifying');

      userQ.send({ cmd: 'get' }, function(msg) {
        //return response.status(msg.status).send(msg.payload);
        let user = _(msg.payload).findWhere({ name: username });

        return done(null, user);
      });
    }
));*/

passport.serializeUser(function(user, cb) {
	cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
	userQ.send({ cmd: 'get' }, function(msg) {
		//return response.status(msg.status).send(msg.payload);
		let user = _(msg.payload).findWhere({ _id: id });

		cb(null, user);
	});
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
