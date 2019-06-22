'use strict';


/**
 * retrieve options of activities of a city for a package
 * By passing in the appropriate options, you can search for available activities in the system 
 *
 * language String 
 * activitiesSearchRequest ActivitiesSearchRequest the client's choosen cities IATA codes
 * returns activityOffers
 **/
exports.activitiesSearchActivities = function(language,activitiesSearchRequest) {
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
 * language String 
 * accomomdationSearchRequest AccomomdationSearchRequest 
 * returns accomodationOffers
 **/
exports.searchAccomodations = function(language,accomomdationSearchRequest) {
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
 * language String 
 * citiesSearchRequest CitiesSearchRequest 
 * returns citiesList
 **/
exports.searchCities = function(language,citiesSearchRequest) {
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
 * Retrieve the recommended transportation options (flights or others) for a package, between the cities choosen by the client.
 *
 * language String 
 * transportationSearchRequest TransportationSearchRequest 
 * returns transportationLegOffers
 **/
exports.searchTransportation = function(language,transportationSearchRequest) {
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

