const httpRequest = require('request');
const USERS_ENDPOINT = process.env.USERS_ENDPOINT || 'http://localhost:8080';

let isPublicUserAuthenticated = (req, res, next) => {
	httpRequest.get(
		{
			url: USERS_ENDPOINT + '/users/info',
			headers: { authorization: (req.headers || {}).authorization },
		},
		function(error, response, body) {
			if (error || response.statusCode != 200) {
				res.sendStatus(401);
			} else {
				req.user = body;
				next();
			}
		}
	);
};

module.exports = {
	isPublicUserAuthenticated,
};
