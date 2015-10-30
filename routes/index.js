'use strict';
const express = require('express');
const router = express.Router();
const uuid = require('node-uuid');
const _ = require('underscore');
const config = require('../defaults');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CBBus = require('../lib/cbbus');

const userQ = CBBus.createQueue({ queueName: 'user', expectResponse: true });

const jwt = require('express-jwt');

const jwtCheck = jwt({
	secret: new Buffer('OWPX_FtTRQCdnkSXUABWLCFZwAmlOCnHbOrPpFLQkss2v87oLyR82A2G5ZLgvKcU', 'base64'),
	audience: 'wEFaW9dlhQb5NlEkjgbMaqJM0LtQJ6vk'
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		/*let cmd = apiCmd.findOne('user', { username: username });
		bus.send(cmd.command, cmd.payload);*/
		console.log('verifying');

		userQ.send({ cmd: 'get' }, function(msg) {
			//return response.status(msg.status).send(msg.payload);
			let user = _(msg.payload).findWhere({ name: username });

			return done(null, user);
		});
	}
));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res) {
	let response = res;
	userQ.send({ cmd: 'post', payload: req.body }, function(msg) {
		return response.status(msg.status).send(msg.payload);
	});
});

router.get('/user', jwtCheck, function(req, res) {
	let response = res;
	userQ.send({ cmd: 'get' }, function(msg) {
		return response.status(msg.status).send(msg.payload);
	});
});

module.exports = router;
