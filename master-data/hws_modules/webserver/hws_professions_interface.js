var business = require('../business/hws_professions_business.js');

var getById = function(req, res) {
	try {
		// call the business function and give it a callback function
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(
			id,
			lang,
			function(profession) {
				res.json(profession);
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
		console.error('An error occurred in /profession');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function(req, res) {
	try {
		// call the business function and give it a callback function
		var profession = req.body.profession;
		business.update(
			profession,
			function(profession) {
				res.json(profession);
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
		console.error('An error occurred in /profession');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function(req, res) {
	try {
		// call the business function and give it a callback function
		var profession = req.body.profession;
		business.create(
			profession,
			function(profession) {
				res.json(profession);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /profession');
		console.error(error);
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
			function(professions) {
				res.json(professions);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /professions');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
