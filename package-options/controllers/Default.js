'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService.js');
var TransportationService = require('../service/TransportationService.js');

module.exports.activitiesSearchActivities = function activitiesSearchActivities (req, res, next) {
  var language = req.swagger.params['language'].value;
  var cities = req.swagger.params['cities'].value;
  Default.activitiesSearchActivities(language,cities)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchAccomodations = function searchAccomodations (req, res, next) {
  var cities = req.swagger.params['cities'].value;
  var budgetCategory = req.swagger.params['budgetCategory'].value;
  var language = req.swagger.params['language'].value;
  Default.searchAccomodations(cities,budgetCategory,language)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchCities = function searchCities (req, res, next) {
  var countries = req.swagger.params['countries'].value;
  var interests = req.swagger.params['interests'].value;
  var language = req.swagger.params['language'].value;
  Default.searchCities(countries,interests,language)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchTransportation = function searchTransportation (req, res, next) {
  var departure = req.swagger.params['departure'].value;
  var citiesSequence = req.swagger.params['citiesSequence'].value;
  var numberOfAdults = req.swagger.params['numberOfAdults'].value;
  var language = req.swagger.params['language'].value;
  var _return = req.swagger.params['return'].value;
  var numberOfChildren = req.swagger.params['numberOfChildren'].value;
  var numberOfInfants = req.swagger.params['numberOfInfants'].value;
  TransportationService.searchTransportation(departure,citiesSequence,numberOfAdults,language,_return,numberOfChildren,numberOfInfants)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
