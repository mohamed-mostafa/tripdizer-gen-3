/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var dao = require('../dataaccess/hws_hotels_dao.js');
var cloudStorageAdapter = require('../business/google_storage_adapter');

exports.getById = dao.getById;
exports.create = function(hotel, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.create(hotel, function(hotel) {
        cloudStorageAdapter.upload(hotel.id, hotel.thumbnail, 'hotels', function() {
            onSuccess(hotel);
        }, onFailure);
    }, onFailure);
};
exports.update = function(hotel, onSuccess, onFailure) {
    // save the data to the database first, then save the thumbnail to the cloud storage
    dao.update(hotel, function(hotel) {
        cloudStorageAdapter.upload(hotel.id, hotel.thumbnail, 'hotels', function() {
            onSuccess(hotel);
        }, onFailure);
    }, onFailure);
};
exports.getAllByCity = dao.getAllByCity;
exports.toggleActivation = dao.toggleActivation;