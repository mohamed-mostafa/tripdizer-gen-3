"use strict";

var utils = require("../utils/writer.js");
var Default = require("../service/DefaultService");
var flightsService = require("../service/FlightsService");
var hotelsService = require("../service/HotelsService");

module.exports.bookFlight = function bookFlight(req, res, next) {
  var language = req.swagger.params["language"].value;
  var bookFlightRequest = req.swagger.params["bookFlightRequest"].value;
  flightsService
    .bookFlight(language, bookFlightRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFareDetails = function getFareDetails(req, res, next) {
  var language = req.swagger.params["language"].value;
  var sessionId = req.swagger.params["sessionId"].value;
  var fareSourceCode = req.swagger.params["fareSourceCode"].value;
  flightsService
    .getFareDetails(language, sessionId, fareSourceCode)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.issueTicket = function issueTicket(req, res, next) {
  var language = req.swagger.params["language"].value;
  var sessionId = req.swagger.params["sessionId"].value;
  var bookingUniqueId = req.swagger.params["bookingUniqueId"].value;
  flightsService
    .issueTicket(language, sessionId, bookingUniqueId)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.revalidateFare = function revalidateFare(req, res, next) {
  var language = req.swagger.params["language"].value;
  var sessionId = req.swagger.params["sessionId"].value;
  var fareSourceCode = req.swagger.params["fareSourceCode"].value;
  flightsService
    .revalidateFare(language, sessionId, fareSourceCode)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchMultiCityFlights = function searchMultiCityFlights(
  req,
  res,
  next
) {
  var language = req.swagger.params["language"].value;
  var multiCityFlightsSearchRequest =
    req.swagger.params["multiCityFlightsSearchRequest"].value;
  flightsService
    .searchMultiCityFlights(language, multiCityFlightsSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchOneWayFlights = function searchOneWayFlights(
  req,
  res,
  next
) {
  var language = req.swagger.params["language"].value;
  var oneWayFlightsSearchRequest =
    req.swagger.params["oneWayFlightsSearchRequest"].value;
  flightsService
    .searchOneWayFlights(language, oneWayFlightsSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchReturnFlights = function searchReturnFlights(
  req,
  res,
  next
) {
  var language = req.swagger.params["language"].value;
  var returnFlightsSearchRequest =
    req.swagger.params["returnFlightsSearchRequest"].value;
  flightsService
    .searchReturnFlights(language, returnFlightsSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchHotels = function searchHotels(req, res, next) {
  var language = req.swagger.params["language"].value;
  var hotelSearchRequest = req.swagger.params["HotelSearchRequest"].value;

  hotelsService
    .searchHotels(language, hotelSearchRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(
        res,
        utils.respondWithCode(response.code, response.message)
      );
    });
};

module.exports.getHotelDetails = function getHotelDetails(req, res, next) {
  var language = req.swagger.params["language"].value;
  var sessionId = req.swagger.params["sessionId"].value;
  var productId = req.swagger.params["productId"].value;
  var hotelId = req.swagger.params["hotelId"].value;
  hotelsService
    .getHotelDetails(language, sessionId, productId, hotelId)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRoomRates = function getRoomRates(req, res, next) {
  var language = req.swagger.params["language"].value;
  var roomRatesRequest = req.swagger.params["RoomRatesRequest"].value;
  hotelsService
    .getRoomRates(language, roomRatesRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};

module.exports.bookHotel = function bookHotel(req, res, next) {
  var language = req.swagger.params["language"].value;
  var bookHotelRequest = req.swagger.params["BookHotelRequest"].value;

  hotelsService
    .bookHotel(language, bookHotelRequest)
    .then(function(response) {
      utils.writeJson(res, response);
    })
    .catch(function(response) {
      utils.writeJson(res, response);
    });
};
