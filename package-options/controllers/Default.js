'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');
var transportationSearchService = require('../service/TransportationService');

module.exports.activitiesSearchActivities = function activitiesSearchActivities (req, res, next) {
  var language = req.swagger.params['language'].value;
  var activitiesSearchRequest = req.swagger.params['activitiesSearchRequest'].value;
  Default.activitiesSearchActivities(language,activitiesSearchRequest)
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
  Default.searchAccomodations(language,accomomdationSearchRequest)
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
  Default.searchCities(language,citiesSearchRequest)
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
