'use strict';
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var _ = require('underscore');
var config = require('../defaults');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
