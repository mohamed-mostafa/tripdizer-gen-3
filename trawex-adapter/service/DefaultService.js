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
 * searches multi-city flights from origin to multiple destinations on specific dates for number of travelers
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


/**
 * searches one way flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * language String 
 * oneWayFlightsSearchRequest OneWayFlightsSearchRequest 
 * returns FlightOffers
 **/
exports.searchOneWayFlights = function(language,oneWayFlightsSearchRequest) {
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
 * searches return flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * language String 
 * returnFlightsSearchRequest ReturnFlightsSearchRequest 
 * returns FlightOffers
 **/
exports.searchReturnFlights = function(language,returnFlightsSearchRequest) {
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

