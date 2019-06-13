var recommendation = function(req, res) {
	try {
		var request = req.body.request;
		var lang = req.query.lang;
		// call the business function and give it a callback function
		requestsBusiness.recommendation(
			request,
			lang,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.log('An error occured in /request/recommendation');
		console.log(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};


exports.recommendation = recommendation;