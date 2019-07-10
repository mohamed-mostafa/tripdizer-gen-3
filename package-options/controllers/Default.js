'use strict';

var utils = require('../utils/writer.js');
var transportationSearchService = require('../service/TransportationService');
var citiesSearchService = require('../service/CitiesService');
var accomodationSearchService = require('../service/AccomodationService');
var attractionsSearchService = require('../service/AttractionsService');

module.exports.searchAttractions = function searchAttractions (req, res, next) {
  var language = req.swagger.params['language'].value;
  var attractionsSearchRequest = req.swagger.params['attractionsSearchRequest'].value;
  attractionsSearchService.searchAttractions(language,attractionsSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchAccomodations = function searchAccomodations (req, res, next) {
  var language = req.swagger.params['language'].value;
  var accomomdationSearchRequest = req.swagger.params['accomomdationSearchRequest'].value;
  accomodationSearchService.searchAccomodations(language,accomomdationSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchCities = function searchCities (req, res, next) {
  var language = req.swagger.params['language'].value;
  var citiesSearchRequest = req.swagger.params['citiesSearchRequest'].value;
  citiesSearchService.searchCities(language,citiesSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchTransportation = function searchTransportation (req, res, next) {
  var language = req.swagger.params['language'].value;
  var transportationSearchRequest = req.swagger.params['transportationSearchRequest'].value;
  transportationSearchService.searchTransportation(language,transportationSearchRequest)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
