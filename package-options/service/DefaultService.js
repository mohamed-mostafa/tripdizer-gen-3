'use strict';


/**
 * retrieve options of activities of a city for a package
 * By passing in the appropriate options, you can search for available activities in the system 
 *
 * language String  (optional)
 * cities List the client's choosen cities (optional)
 * returns activityOffers
 **/
exports.activitiesSearchActivities = function(language,cities) {
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
 * retrieve options of accomodations for a package
 * By passing in the appropriate options, you can search for available hotels in the system 
 *
 * cities List the client's chosen cities
 * budgetCategory String the client's chosen budget category
 * language String  (optional)
 * returns accomodationOffers
 **/
exports.searchAccomodations = function(cities,budgetCategory,language) {
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
 * retrieve options of cities for a package
 * retrieve the recommended options of cities in the countries choosen by the client, based on the client's interests 
 *
 * countries List The list of countries ISO codes chosen by the client (e.g. FRA, ITA, EGY, ... etc)
 * interests List The list of interest names chosen by the client
 * language String  (optional)
 * returns citiesList
 **/
exports.searchCities = function(countries,interests,language) {
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
 * retrieve options of transportation between cities and countries for a package
 * Retrieve the recommended transportation options (flights or others) for a package, between the cities choosen by the client. If multiple cities are provided, the days between the departure and return will be distributed evenly among them 
 *
 * departure date 
 * citiesSequence List 
 * numberOfAdults BigDecimal 
 * language String  (optional)
 * _return date  (optional)
 * numberOfChildren BigDecimal  (optional)
 * numberOfInfants BigDecimal  (optional)
 * returns transportationLegOffers
 **/
exports.searchTransportation = function(departure,citiesSequence,numberOfAdults,language,_return,numberOfChildren,numberOfInfants) {
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

