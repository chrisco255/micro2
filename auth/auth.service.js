'use strict';

var passport = require('passport');
var config = require('../config/environment');
var compose = require('composable-middleware');

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
	return compose()
		//validate jwt
		.use(function(req, res, next) {
			//allow access_token to be passed through query parameter as well
			if(req.query && req.query.hasOwnProperty('access_token')) {
				req.headers.authorization = 'Bearer ' + req.query.access_token;
			}
			validateJwt(req, res, next);
		})
		//Attach user ot request
		.use(function(req, res, next) {
			//call user service getting id
		})
}