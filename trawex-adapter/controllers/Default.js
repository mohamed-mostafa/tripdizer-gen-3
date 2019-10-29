'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');
var FlightService = require('../service/FlightsService');

module.exports.searchHotels = function searchHotels(req, res, next) {
  var language = req.swagger.params['language'].value;
  var hotelSearchRequest = req.swagger.params['HotelSearchRequest'].value;
  Default.searchHotels(language, hotelSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchMultiCityFlights = function searchMultiCityFlights(req, res, next) {
  var language = req.swagger.params['language'].value;
  var multiCityFlightsSearchRequest = req.swagger.params['multiCityFlightsSearchRequest'].value;
  FlightService.searchMultiCityFlights(language, multiCityFlightsSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
