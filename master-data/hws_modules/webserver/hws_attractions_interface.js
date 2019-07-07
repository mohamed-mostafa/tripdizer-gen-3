
var business = require('../business/hws_attractions_business.js');

var getById = function(req, res) {
	try {
		// call the business function and give it a callback function
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(
			id,
			lang,
			function(attraction) {
				res.json(attraction);
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
		console.log('An error occurred in /attraction');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function(req, res) {
	try {
		// call the business function and give it a callback function
		var attraction = req.body.attraction;
		business.update(
			attraction,
			function(attraction) {
				res.json(attraction);
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
		console.log('An error occurred in /attraction');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function(req, res) {
	try {
		// call the business function and give it a callback function
		var attraction = req.body.attraction;
		business.create(
			attraction,
			function(attraction) {
				res.json(attraction);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occurred in /attraction');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAll = function(req, res) {
	try {
		// call the business function and give it a callback function
		var lang = req.query.lang;
		business.getAll(
			lang,
			function(attractions) {
				res.json(attractions);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occurred in /attractions');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllAttractionsByCity = function(req, res) {
	try {
		// call the business function and give it a callback function
		var cityId = req.params.cityId;
		var lang = req.query.lang;
		business.getAllAttractionsByCity(
			cityId,
			lang,
			function(attractions) {
				res.json(attractions);
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
		console.log('An error occurred in /attractions/city-id');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};


exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
exports.getAllAttractionsByCity = getAllAttractionsByCity;