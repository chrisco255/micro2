'use strict';
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var _ = require('underscore');
var config = require('../defaults');

const bus = require('servicebus').bus({
  url: config.servicebus.uri + "?heartbeat=60"
});

/* Maintains response references while asynchronous operations are processing */
const responseCallbacks = [];
responseCallbacks.pushRcb = function(res, commandId) {
	this.push({ res, commandId });
};

function createResponseCallback(response) {
	return {
		response,
		responseId: uuid.v4()
	};
}

const apiCmd = {
	create: function(resource, data) {
		let command = resource + '.create';
		let payload = {
			data,
			commandId: uuid.v4()
		};

		return {
			command,
			payload
		};
	}
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

bus.listen('user.create.response', function(data, o) {
	let rcbIndex = _.findIndex(responseCallbacks, { commandId: data.commandId });
	if(rcbIndex !== undefined) {
		let rcb = responseCallbacks[rcbIndex];
		responseCallbacks.splice(rcbIndex, 1);
		rcb.res.status(data.status).send(data.payload);
	}
});

router.post('/user', function(req, res) {
	let cmd = apiCmd.create('user', req.body);
	responseCallbacks.pushRcb(res, cmd.payload.commandId);
	bus.send(cmd.command, cmd.payload);
});

module.exports = router;
