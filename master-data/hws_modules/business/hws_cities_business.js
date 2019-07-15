/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_cities_dao.js');
var cloudStorageAdapter = require('../business/google_storage_adapter');

var getAllCitiesByCountry = function(countryId, lang, onSuccess, onFailure) {
	dao.getAll(
		lang,
		function(cities) {
			var cities = cities.filter(city => city.countryId == countryId || city.countryIsoCode == countryId);
			onSuccess(cities);
		},
		onFailure
	);
};

exports.getById = dao.getById;
exports.create = function(city, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.create(city, function(city) {
        cloudStorageAdapter.upload(city.iataCode, city.thumbnail, 'cities', function() {
            onSuccess(city);
        }, onFailure);
    }, onFailure);
};
exports.update = function(city, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.update(city, function(city) {
        cloudStorageAdapter.upload(city.iataCode, city.thumbnail, 'cities', function() {
            onSuccess(city);
        }, onFailure);
    }, onFailure);
};
exports.getAll = dao.getAll;
exports.toggleActivation = dao.toggleActivation;
exports.getAllCitiesByCountry = getAllCitiesByCountry;
exports.getAllCitiesInIternaries = dao.getAllCitiesInIternaries;
