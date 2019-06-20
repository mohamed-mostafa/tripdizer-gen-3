const jwt = require('jwt-simple');

var httpRequest = require('request');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083';

const getToken = headers => {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split('JWT ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

const getDecodedToken = headers => {
	try {
		return jwt.decode(getToken(headers), process.env.SECRET || 'TRIPDIZER-JWT-SECRET');
	} catch (ex) {
		return null;
	}
};

const isAuthenticated = (req, res, next) => {
	const decodedData = getDecodedToken(req.headers);
	if (decodedData) {
		httpRequest.post({url: MASTER_DATA_ENDPOINT + "/user/login", json: true, body: {username: decodedData.username, password: decodedData.password, encrypted: false}}, function(error, response, body) {
			if (error || response.statusCode != 200) {
				res.send(401);
			} else {
				next();
			}
		});
	} else res.send(401);
};

const isAuthenticatedAsAdmin = (req, res, next) => {
	const decodedData = getDecodedToken(req.headers);
	if (decodedData) {
		httpRequest.post({url: MASTER_DATA_ENDPOINT + "/user/login", json: true, body: {username: decodedData.username, password: decodedData.password}}, function(error, response, user) {
			if (error || response.statusCode != 200) {
				res.send(401);
			} else {
				if (user.admin) {
					next();
				} else {
					res.send(401);
				}
			}
		});
	} else res.send(401);
};

exports.getToken = getToken;
exports.getDecodedToken = getDecodedToken;
exports.isAuthenticated = isAuthenticated;
exports.isAuthenticatedAsAdmin = isAuthenticatedAsAdmin;
