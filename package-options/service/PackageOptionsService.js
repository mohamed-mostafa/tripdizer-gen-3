'use strict';

var transportationService = require('./TransportationService');

/**
 * retrieve options of accomodations for a package
 * By passing in the appropriate options, you can search for available hotels in the system 
 *
 * language String  (optional)
 * cities List the client's choosen cities and budget category (optional)
 * budgetCategory String  (optional)
 * returns inline_response_200_2
 **/
exports.searchAccomodations = function(language,accommodationSearchCriteria) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accomodationOffers" : [ {
    "checkin" : "2000-01-23",
    "city" : {
      "country" : "Egypt",
      "thumbnail" : "https://static.tripdizer.com/cairo.png",
      "iataCode" : "CAI",
      "displayName" : "ألقاهرة",
      "name" : "Cairo",
      "coordinates" : "30.06263, 31.24967",
      "countryIataCode" : "EGY",
      "interests" : [ {
        "displayName" : "التسوق",
        "name" : "Shopping"
      }, {
        "displayName" : "التسوق",
        "name" : "Shopping"
      } ],
      "countryDisplayName" : "مصر"
    },
    "rate" : 1000.0,
    "price" : 2000.0,
    "numberOfNights" : 2.0,
    "hotel" : {
      "thumbnail" : "https://static.tripdizer.com/hilton-capetown-hotel.png",
      "name" : "Hilton Capetown Hotel",
      "displaName" : "هيلتون كيب تاون",
      "description" : "One of the best hotels in Cape Town",
      "stars" : 5.0
    },
    "currency" : "EGP",
    "checkout" : "2000-01-23"
  }, {
    "checkin" : "2000-01-23",
    "city" : {
      "country" : "Egypt",
      "thumbnail" : "https://static.tripdizer.com/cairo.png",
      "iataCode" : "CAI",
      "displayName" : "ألقاهرة",
      "name" : "Cairo",
      "coordinates" : "30.06263, 31.24967",
      "countryIataCode" : "EGY",
      "interests" : [ {
        "displayName" : "التسوق",
        "name" : "Shopping"
      }, {
        "displayName" : "التسوق",
        "name" : "Shopping"
      } ],
      "countryDisplayName" : "مصر"
    },
    "rate" : 1000.0,
    "price" : 2000.0,
    "numberOfNights" : 2.0,
    "hotel" : {
      "thumbnail" : "https://static.tripdizer.com/hilton-capetown-hotel.png",
      "name" : "Hilton Capetown Hotel",
      "displaName" : "هيلتون كيب تاون",
      "description" : "One of the best hotels in Cape Town",
      "stars" : 5.0
    },
    "currency" : "EGP",
    "checkout" : "2000-01-23"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * retrieve options of activities of a city for a package
 * By passing in the appropriate options, you can search for available activities in the system 
 *
 * language String  (optional)
 * cities Cities the client's choosen cities (optional)
 * returns inline_response_200_3
 **/
exports.searchActivities = function(language,activitiesSearchCriteria) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "activityOffers" : [ {
    "date" : "2000-01-23",
    "activity" : {
      "thumbnail" : "https://static.tripdizer.com/waterboom.png",
      "city" : {
        "country" : "Egypt",
        "thumbnail" : "https://static.tripdizer.com/cairo.png",
        "iataCode" : "CAI",
        "displayName" : "ألقاهرة",
        "name" : "Cairo",
        "coordinates" : "30.06263, 31.24967",
        "countryIataCode" : "EGY",
        "interests" : [ {
          "displayName" : "التسوق",
          "name" : "Shopping"
        }, {
          "displayName" : "التسوق",
          "name" : "Shopping"
        } ],
        "countryDisplayName" : "مصر"
      },
      "name" : "Spend a day in the waterboom park",
      "description" : "One of the best water activities in Bali",
      "category" : "Water activity"
    }
  }, {
    "date" : "2000-01-23",
    "activity" : {
      "thumbnail" : "https://static.tripdizer.com/waterboom.png",
      "city" : {
        "country" : "Egypt",
        "thumbnail" : "https://static.tripdizer.com/cairo.png",
        "iataCode" : "CAI",
        "displayName" : "ألقاهرة",
        "name" : "Cairo",
        "coordinates" : "30.06263, 31.24967",
        "countryIataCode" : "EGY",
        "interests" : [ {
          "displayName" : "التسوق",
          "name" : "Shopping"
        }, {
          "displayName" : "التسوق",
          "name" : "Shopping"
        } ],
        "countryDisplayName" : "مصر"
      },
      "name" : "Spend a day in the waterboom park",
      "description" : "One of the best water activities in Bali",
      "category" : "Water activity"
    }
  } ]
};
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
 * language String  (optional)
 * countries List The list of countries IATA codes chosen by the client (optional)
 * interests List The list of interests chosen by the client (optional)
 * returns inline_response_200
 **/
exports.searchCities = function(language,citiesSearchCriteria) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "cities" : [ {
    "country" : "Egypt",
    "thumbnail" : "https://static.tripdizer.com/cairo.png",
    "iataCode" : "CAI",
    "displayName" : "ألقاهرة",
    "name" : "Cairo",
    "coordinates" : "30.06263, 31.24967",
    "countryIataCode" : "EGY",
    "interests" : [ {
      "displayName" : "التسوق",
      "name" : "Shopping"
    }, {
      "displayName" : "التسوق",
      "name" : "Shopping"
    } ],
    "countryDisplayName" : "مصر"
  }, {
    "country" : "Egypt",
    "thumbnail" : "https://static.tripdizer.com/cairo.png",
    "iataCode" : "CAI",
    "displayName" : "ألقاهرة",
    "name" : "Cairo",
    "coordinates" : "30.06263, 31.24967",
    "countryIataCode" : "EGY",
    "interests" : [ {
      "displayName" : "التسوق",
      "name" : "Shopping"
    }, {
      "displayName" : "التسوق",
      "name" : "Shopping"
    } ],
    "countryDisplayName" : "مصر"
  } ]
};
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
 * language String  (optional)
 * departure date the departure date from the origin (optional)
 * _return date the return date to the origin (optional)
 * citiesSequence List the iata codes of the cities, ordered by the sequence the client wants to travel (optional)
 * numberOfAdults BigDecimal  (optional)
 * numberOfChildren BigDecimal  (optional)
 * numberOfInfants BigDecimal  (optional)
 * returns inline_response_200_1
 **/
exports.searchTransportation = transportationService.searchTransportation;
