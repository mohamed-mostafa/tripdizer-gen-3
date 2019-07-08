/**
 * The dataaccess methods of hws
 */
'use strict';

const mysql = require('mysql');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore({ projectId: 'tripdizer-dev', keyFilename: './tripdizer-dev-da0d594753eb.json'});

const options = {
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || 'root',
	database: 'hws',
	multipleStatements: true,
};

if (process.env.INSTANCE_CONNECTION_NAME) {
	options.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
	options.host = 'localhost';
	options.port = 3306;
}

// creates a new connection
var createConnection = function() {
	var connection = mysql.createConnection(options);
	return connection;
};

var getFireStoreClient = function() {
	return firestore;
}
exports.createConnection = createConnection;
exports.getFireStoreClient = getFireStoreClient;