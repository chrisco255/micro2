'use strict';
const express = require('express');
const router = express.Router();
const uuid = require('node-uuid');
const _ = require('underscore');
const config = require('../defaults');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CBBus = require('../lib/cbbus');

passport.use(new LocalStrategy(
	function(username, password, done) {
		let cmd = apiCmd.findOne('user', { username: username });
		bus.send(cmd.command, cmd.payload);
	}
));

const userQ = CBBus.createQueue({ queueName: 'user', expectResponse: true });

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

router.get('/user', function(req, res) {
	let response = res;
	userQ.send({ cmd: 'get' }, function(msg) {
		return response.status(msg.status).send(msg.payload);
	});
});

module.exports = router;
