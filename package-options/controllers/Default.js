const utils = require("../utils/writer.js");
const transportationSearchService = require("../service/TransportationService");
const citiesSearchService = require("../service/CitiesService");
const accomodationSearchService = require("../service/AccomodationService");
const attractionsSearchService = require("../service/AttractionsService");

let searchAttractions = function searchAttractions(req, res, next) {
  var language = req.swagger.params["language"].value;
  var attractionsSearchRequest =
    req.swagger.params["attractionsSearchRequest"].value;
  attractionsSearchService
    .searchAttractions(language, attractionsSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

let searchAccomodations = function searchAccomodations(req, res, next) {
  var language = req.swagger.params["language"].value;
  var accomomdationSearchRequest =
    req.swagger.params["accomomdationSearchRequest"].value;
  accomodationSearchService
    .searchAccomodations(language, accomomdationSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

let searchCities = function searchCities(req, res, next) {
  var language = req.swagger.params["language"].value;
  var citiesSearchRequest = req.swagger.params["citiesSearchRequest"].value;
  citiesSearchService
    .searchCities(language, citiesSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

let searchTransportation = function searchTransportation(req, res, next) {
  var language = req.swagger.params["language"].value;
  var transportationSearchRequest =
    req.swagger.params["transportationSearchRequest"].value;
  transportationSearchService
    .searchTransportation(language, transportationSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports = {
  searchAttractions,
  searchAccomodations,
  searchCities,
  searchTransportation
};
