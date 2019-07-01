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
		console.log('An error occurred in /public/videos');
		console.log(error);
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
		console.log('An error occurred in /video');
		console.log(error);
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
		console.log('An error occurred in /video');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var createPhone = function(req, res) {
	try {
		// call the business function and give it a callback function
		var phoneNumber = req.body.phoneNumber;
		business.createPhone(phoneNumber, function() {
			res.end();
		});
	} catch (error) {
		console.log('An error occurred in /phone');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var updatePhone = function(req, res) {
	try {
		// call the business function and give it a callback function
		var phone = req.body.phone;
		business.updatePhone(phone, function(updatedPhone) {
			res.send(updatedPhone);
		});
	} catch (error) {
		console.log('An error occurred in /phone');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getPhones = function(req, res) {
	try {
		// call the business function and give it a callback function
		business.getPhones(
			function(phones) {
				res.json(phones);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occurred in /public/phones');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.create = create;
exports.update = update;
exports.getVideos = getVideos;
exports.getPhones = getPhones;
exports.createPhone = createPhone;
exports.updatePhone = updatePhone;
