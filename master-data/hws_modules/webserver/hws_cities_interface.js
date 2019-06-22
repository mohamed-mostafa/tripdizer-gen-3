var business = require('../business/hws_cities_business.js');

var getById = function(req, res) {
	try {
		// call the business function and give it a callback function
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(
			id,
			lang,
			function(city) {
				res.json(city);
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
		console.log('An error occured in /city');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function(req, res) {
	try {
		// call the business function and give it a callback function
		var city = req.body.city;
		business.update(
			city,
			function(city) {
				res.json(city);
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
		console.log('An error occured in /city');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function(req, res) {
	try {
		// call the business function and give it a callback function
		var city = req.body.city;
		business.create(
			city,
			function(city) {
				res.json(city);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occured in /cities');
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
			function(cities) {
				res.json(cities);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occured in /cities');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllCitiesByCountry = function(req, res) {
	try {
		// call the business function and give it a callback function
		var countryId = req.params.countryId;
		var lang = req.query.lang;
		business.getAllCitiesByCountry(
			countryId,
			lang,
			function(cities) {
				res.json(cities);
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
		console.log('An error occured in /cities/country-id');
		console.log(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllCitiesInIternaries = function(req, res) {
	try {
		// call the business function and give it a callback function
		var lang = req.query.lang;
		business.getAllCitiesInIternaries(
			lang,
			function(cities) {
				res.json(cities);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.log('An error occured in /citiesInIternaries');
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
exports.getAllCitiesByCountry = getAllCitiesByCountry;
exports.getAllCitiesInIternaries = getAllCitiesInIternaries;
