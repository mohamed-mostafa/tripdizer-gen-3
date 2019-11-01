'use strict';


/**
 * Books a flight fair, using the fareSourceCode returned from the search, and the PNR information of the travelers
 * By passing in the appropriate options, you can book a flight fair using the fareSourceCode returned from the search, ad the PNR information of the travelers
 *
 * language String 
 * bookFlightRequest BookFlightRequest 
 * returns Object
 **/
exports.bookFlight = function(language,bookFlightRequest) {
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
 * gets the details of a flight fair, using the fareSourceCode returned from the search
 * By passing in the appropriate options, you can retrieve details of a fareSourceCode returned from the search
 *
 * language String 
 * sessionId String 
 * fareSourceCode String  (optional)
 * no response value expected for this operation
 **/
exports.getFareDetails = function(language,sessionId,fareSourceCode) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Issues a ticket for a booking. Should only be done for Piblic or Private
 * By passing in the appropriate options, you can issue the ticket for a booking
 *
 * language String 
 * sessionId String 
 * bookingUniqueId String  (optional)
 * returns Object
 **/
exports.issueTicket = function(language,sessionId,bookingUniqueId) {
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
 * Revalidates a flight fair, using the fareSourceCode returned from the search
 * By passing in the appropriate options, you can revalidate a flight fair using the fareSourceCode returned from the search
 *
 * language String 
 * sessionId String 
 * fareSourceCode String  (optional)
 * returns Object
 **/
exports.revalidateFare = function(language,sessionId,fareSourceCode) {
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

