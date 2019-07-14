/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_attractions_dao.js');

var getAllAttractionsByCity = function(cityId, lang, onSuccess, onFailure) {
	dao.getAll(
		lang,
		function(attractions) {
			var filteredAttractions = attractions.filter(attraction => attraction.cityId == cityId || attraction.cityIata == cityId);
			onSuccess(filteredAttractions);
		},
		onFailure
	);
};

exports.getById = dao.getById;
exports.create = dao.create;
exports.update = dao.update;
exports.getAll = dao.getAll;
exports.toggleActivation = dao.toggleActivation;
exports.getAllAttractionsByCity = getAllAttractionsByCity;
