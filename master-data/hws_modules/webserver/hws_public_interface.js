var business = require('../business/hws_public_business.js');

var getVideos = function(req, res) {
	try {
		// call the business function and give it a callback function
		var lang = req.query.lang;
		business.getVideos(
			lang,
			function(videos) {
				res.json(videos);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /public/videos');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function(req, res) {
	try {
		// call the business function and give it a callback function
		var video = req.body.video;
		business.create(
			video,
			function(video) {
				res.json(video);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /video');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function(req, res) {
	try {
		// call the business function and give it a callback function
		var video = req.body.video;
		business.update(
			video,
			function(video) {
				res.json(video);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(businessError) {
				res.status(500).send(businessError);
			}
		);
	} catch (error) {
		console.error('An error occurred in /video');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var createCountryRequest = function(req, res) {
	try {
		// call the business function and give it a callback function
		var countryRequest = req.body.countryRequest;
		business.createCountryRequest(countryRequest, function() {
			res.end();
		});
	} catch (error) {
		console.error('An error occurred in /country-request');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var updateCountryRequest = function(req, res) {
	try {
		// call the business function and give it a callback function
		var countryRequest = req.body.countryRequest;
		business.updateCountryRequest(countryRequest, function(updatedCountryRequest) {
			res.send(updatedCountryRequest);
		});
	} catch (error) {
		console.error('An error occurred in /country-request');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getCountryRequests = function(req, res) {
	try {
		// call the business function and give it a callback function
		business.getCountryRequests(
			function(countryRequests) {
				res.json(countryRequests);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /public/country-requests');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.create = create;
exports.update = update;
exports.getVideos = getVideos;

exports.getCountryRequests = getCountryRequests;
exports.createCountryRequest = createCountryRequest;
exports.updateCountryRequest = updateCountryRequest;
