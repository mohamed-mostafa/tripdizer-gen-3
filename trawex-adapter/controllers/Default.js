'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');
var flightsService = require('../service/FlightsService');

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
  flightsService.searchMultiCityFlights(language, multiCityFlightsSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchOneWayFlights = function searchOneWayFlights(req, res, next) {
  var language = req.swagger.params['language'].value;
  var oneWayFlightsSearchRequest = req.swagger.params['oneWayFlightsSearchRequest'].value;
  flightsService.searchOneWayFlights(language, oneWayFlightsSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchReturnFlights = function searchReturnFlights(req, res, next) {
  var language = req.swagger.params['language'].value;
  var returnFlightsSearchRequest = req.swagger.params['returnFlightsSearchRequest'].value;
  flightsService.searchReturnFlights(language, returnFlightsSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
