const httpRequest = require('request');
const USERS_ENDPOINT = process.env.USERS_ENDPOINT || 'http://localhost:8080';

let isPublicUserAuthenticated = (req, res, next) => {
	httpRequest.get(
		{
			url: USERS_ENDPOINT + '/users/info',
			headers: req.headers,
		},
		function(error, response, body) {
			if (error || response.statusCode != 200) {
				res.sendStatus(401);
			} else {
				next();
			}
		}
	);
};

module.exports = {
	isPublicUserAuthenticated,
};
