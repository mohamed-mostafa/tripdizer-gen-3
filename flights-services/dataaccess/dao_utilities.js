/**
 * The dataaccess methods of hws
 */
'use strict';

const mysql = require('mysql');

const options = {
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: 'hws',
  multipleStatements: true
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

exports.createConnection = createConnection;