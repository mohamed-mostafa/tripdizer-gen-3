'use strict';


/**
 * retrieve options of activities of a city for a package
 * By passing in the appropriate options, you can search for available activities in the system 
 *
 * language String  (optional)
 * cities List the client's choosen cities (optional)
 * returns inline_response_200_3
 **/
exports.activitiesSearchActivities = function(language,cities) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "activityOffers" : [ {
    "date" : "2019-06-03",
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
    "date" : "2019-06-03",
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
 * retrieve options of accomodations for a package
 * By passing in the appropriate options, you can search for available hotels in the system 
 *
 * cities List the client's chosen cities
 * budgetCategory String the client's chosen budget category
 * language String  (optional)
 * returns inline_response_200_2
 **/
exports.searchAccomodations = function(cities,budgetCategory,language) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accomodationOffers" : [ {
    "checkin" : "2019-06-03",
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
    "checkout" : "2019-06-03"
  }, {
    "checkin" : "2019-06-03",
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
    "checkout" : "2019-06-03"
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
 * countries List The list of countries IATA codes chosen by the client
 * interests List The list of interests chosen by the client
 * language String  (optional)
 * returns inline_response_200
 **/
exports.searchCities = function(countries,interests,language) {
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
 * departure date 
 * citiesSequence List 
 * numberOfAdults BigDecimal 
 * language String  (optional)
 * _return date  (optional)
 * numberOfChildren BigDecimal  (optional)
 * numberOfInfants BigDecimal  (optional)
 * returns inline_response_200_1
 **/
exports.searchTransportation = function(departure,citiesSequence,numberOfAdults,language,_return,numberOfChildren,numberOfInfants) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "transportationLegs" : [ {
    "flightOffers" : [ {
      "price" : 4500.0,
      "flightLegs" : [ {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      }, {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      } ],
      "currency" : "EGP"
    }, {
      "price" : 4500.0,
      "flightLegs" : [ {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      }, {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      } ],
      "currency" : "EGP"
    } ],
    "origin" : "CAI",
    "destination" : "AMS",
    "departure" : "2019-10-10"
  }, {
    "flightOffers" : [ {
      "price" : 4500.0,
      "flightLegs" : [ {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      }, {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      } ],
      "currency" : "EGP"
    }, {
      "price" : 4500.0,
      "flightLegs" : [ {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      }, {
        "totalDuration" : "0D6H30M",
        "transitDuration" : "0D2H0M",
        "carrierThumbnail" : "https://static.tripdizer.comm/EgyptAir.png",
        "carrier" : "EgyptAir",
        "origin" : "CAI",
        "destination" : "AMS",
        "segments" : [ {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        }, {
          "duration" : "0D6H30M",
          "arrival" : "2016-08-29T10:00:00",
          "origin" : "CAI",
          "destination" : "AMS",
          "departure" : "2016-08-29T10:00:00"
        } ]
      } ],
      "currency" : "EGP"
    } ],
    "origin" : "CAI",
    "destination" : "AMS",
    "departure" : "2019-10-10"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

