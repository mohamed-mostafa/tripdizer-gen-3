'use strict';


/**
 * retrieve options of hotels for a city
 * By passing in the appropriate options, you can search for available hotels in the system
 *
 * language String 
 * hotelSearchRequest HotelsSearchRequest 
 * returns HotelOffers
 **/
exports.searchHotels = function(language,hotelSearchRequest) {
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


/**
 * searches flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * language String 
 * multiCityFlightsSearchRequest MultiCityFlightsSearchRequest 
 * returns FlightOffers
 **/
exports.searchMultiCityFlights = function(language,multiCityFlightsSearchRequest) {
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

