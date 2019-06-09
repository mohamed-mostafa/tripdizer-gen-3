'use strict';


/**
 * searches flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * origin String The IATA code of the origin city or airport
 * destination String The IATA code of the destination city or airport
 * departure date The desired departure date
 * numberOfAdults BigDecimal 
 * _return date The desired return date - if not provided, then it a one-way flight (optional)
 * numberOfChildren BigDecimal  (optional)
 * numberOfInfants BigDecimal  (optional)
 * returns flightOffers
 **/
exports.searchFlights = function(origin,destination,departure,numberOfAdults,_return,numberOfChildren,numberOfInfants) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

