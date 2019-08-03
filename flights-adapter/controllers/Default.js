'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/AmadeusFlightLowFareSearchService.js');

module.exports.searchFlights = function searchFlights (req, res, next) {
  var origin = req.swagger.params['origin'].value;
  var destination = req.swagger.params['destination'].value;
  var departure = req.swagger.params['departure'].value;
  var numberOfAdults = req.swagger.params['numberOfAdults'].value;
  var _return = req.swagger.params['return'].value;
  var numberOfChildren = req.swagger.params['numberOfChildren'].value;
  var numberOfInfants = req.swagger.params['numberOfInfants'].value;
  Default.searchFlights(origin,destination,departure,numberOfAdults,_return,numberOfChildren,numberOfInfants)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 500);
    });
};
