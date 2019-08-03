var business = require('../business/hws_hotels_business.js');

var getById = function(req, res) {
	try {
		// call the business function and give it a callback function
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(
			id,
			lang,
			function(hotel) {
				res.json(hotel);
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
		console.error('An error occurred in /hotel');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function(req, res) {
	try {
		// call the business function and give it a callback function
		var hotel = req.body.hotel;
		business.update(
			hotel,
			function(hotel) {
				res.json(hotel);
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
		console.error('An error occurred in /hotel');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function(req, res) {
	try {
		// call the business function and give it a callback function
		var hotel = req.body.hotel;
		business.create(
			hotel,
			function(hotel) {
				res.json(hotel);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /hotels');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllByCity = function(req, res) {
	try {
		// call the business function and give it a callback function
		var lang = req.query.lang;
		var cityId = req.params.cityId;
		var includeInactive = req.query.includeInactive;
		business.getAllByCity(
			lang,
			cityId,
			function(hotels) {
				if (!includeInactive) {
					hotels = hotels.filter(hotel => hotel.active == 1);
				}
				res.json(hotels);
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
		console.error('An error occurred in /hotels/city-id');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};
var toggleActivation = function(req, res) {
	try {
		// call the business function and give it a callback function
		var id = req.params.id;
		var active = req.params.active == 'activate' ? 1 : 0;
		business.toggleActivation(
			id, active,
			function() {
				res.send('success');
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
		console.error('An error occurred in /attraction');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};
exports.toggleActivation = toggleActivation;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAllByCity = getAllByCity;
