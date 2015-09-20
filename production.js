'use strict';

// Production specific configuration
// ==================================
module.exports = {
	servicebus: {
		uri: process.env.SERVICEBUS_URI || 'amqp://localhost:5672'
	},
	port: process.env.PORT || 8080
};
