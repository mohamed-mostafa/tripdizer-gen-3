/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_countries_dao.js');
var cloudStorageAdapter = require('../business/google_storage_adapter');
const mediaBaseUrl = process.env.MEDIA_STORAGE_BASE_URL || 'https://storage.cloud.google.com/tripdizer-dev.appspot.com';

exports.getById = dao.getById;
exports.create = function (country, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.create(country, function (country) {
        cloudStorageAdapter.upload(country.ISOCode, country.thumbnail, 'countries', function () {
            onSuccess(country);
        }, onFailure);
    }, onFailure);
};
exports.update = function (country, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.update(country, function (country) {
        cloudStorageAdapter.upload(country.ISOCode, country.thumbnail, 'countries', function () {
            onSuccess(country);
        }, onFailure);
    }, onFailure);
};
exports.getAll = function (lang, onSuccess, onFailure) {
    dao.getAll(lang, function (countries) {
        var fixedCountries = countries.map(country => ({ ...country, thumbnail: mediaBaseUrl + "/countries/" + (country.ISOCode ? country.ISOCode : "unknown") + ".png" }))
        onSuccess(fixedCountries);
    }, onFailure);
};

exports.toggleActivation = dao.toggleActivation;