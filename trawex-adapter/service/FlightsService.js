'use strict';

let httpRequest = require("request");
let moment = require("moment");
let humanizeDuration = require('humanize-duration');

let TRAWEX_BASE_ENDPOINT = "https://trawex.biz/api";
let TRAWEX_FLIGHTS_ROOT = "/flight_trawex";
let TRAWEX_FLIGHTS_AUTHENTICATE_URL = "/authenticate";
let TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL = "/flight_availability_search";

let TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
let TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019"
let TRAWEX_SOURCE_IP_ADDRESS = process.env.TRAWEX_SOURCE_IP_ADDRESS || "34.90.113.143"
let TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      d: () => 'd',
      h: () => 'h',
      m: () => 'm'
    }
  }
})

const shortArabicHumanizer = humanizeDuration.humanizer({
  language: 'shortAr',
  languages: {
    shortAr: {
      d: () => 'ي',
      h: () => 'س',
      m: () => 'د'
    }
  }
})
/**
 * searches flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * language String 
 * multiCityFlightsSearchRequest MultiCityFlightsSearchRequest 
 * returns FlightOffers
 **/
exports.searchMultiCityFlights = function (language, multiCityFlightsSearchRequest) {
  return new Promise(function (resolve, reject) {
    authenticate().then(function (sessionId) {
      let originList = multiCityFlightsSearchRequest.tripSegments.map(tripSegment => tripSegment.cityIata);
      let destinationsList = multiCityFlightsSearchRequest.tripSegments.map(tripSegment => tripSegment.cityIata); destinationsList.push(destinationsList.shift());
      let departureDatesList = multiCityFlightsSearchRequest.tripSegments.map(tripSegment => tripSegment.arrivalDate); departureDatesList.push(multiCityFlightsSearchRequest.tripSegments[multiCityFlightsSearchRequest.tripSegments.length - 1].leavingDate)

      let airportFromCodesSequence = ""; airportFromCodesSequence = originList.reduce((airportFromCodesSequence, cityIata) => airportFromCodesSequence + "<br>" + cityIata);
      let airportToCodesSequence = ""; airportToCodesSequence = destinationsList.reduce((airportToCodesSequence, cityIata) => airportToCodesSequence + "<br>" + cityIata);
      let departureDatesSequence = ""; departureDatesSequence = departureDatesList.reduce((departureDatesSequence, arrivalDate) => departureDatesSequence + "<br>" + arrivalDate);

      searchFlights(sessionId, "Circle", airportFromCodesSequence, airportToCodesSequence, departureDatesSequence, null, multiCityFlightsSearchRequest.numberOfAdults, multiCityFlightsSearchRequest.numberOfKids, multiCityFlightsSearchRequest.numberOfInfants, "Economy", "EGP").then(function (data) {
        // for multi-city flights  requests, the API returns all the segments under the same originDestinationOption
        let flightOffers = data.AirSearchResponse.AirSearchResult.FareItineraries.map(fareItinerary => {
          let flightOffer = {
            price: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount,
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
            segments: []
          }
          fareItinerary.FareItinerary.OriginDestinationOptions[0].OriginDestinationOption.forEach(originDestinationOptionItem => {
            let flightSegment = {
              origin: originDestinationOptionItem.FlightSegment.DepartureAirportLocationCode,
              destination: originDestinationOptionItem.FlightSegment.ArrivalAirportLocationCode,
              originDetails: originDestinationOptionItem.FlightSegment.DepartureAirportLocationCode, // map using airport list 
              destinationDetails: originDestinationOptionItem.FlightSegment.ArrivalAirportLocationCode, // map using airport list 
              departure: originDestinationOptionItem.FlightSegment.DepartureDateTime,
              arrival: originDestinationOptionItem.FlightSegment.ArrivalDateTime,
              totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOptionItem.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOptionItem.FlightSegment.JourneyDuration * 60 * 1000),
              totalDurationInMinutes: originDestinationOptionItem.FlightSegment.JourneyDuration,
              carrier: {
                iataCode: originDestinationOptionItem.FlightSegment.MarketingAirlineCode,
                name: originDestinationOptionItem.FlightSegment.MarketingAirlineCode
              }
            }
            flightOffer.segments.push(flightSegment);
          });
          return flightOffer;
        })
        resolve(flightOffers);
      }).catch(function (error) {
        reject({ error: "Failed to search for flights with trawex. Reason: " + error });
      })
    }).catch(function (error) {
      reject({ error: "Failed to authenticate with trawex. Reason: " + error });
    });
  });
}

exports.searchReturnFlights = function (language, returnFlightSearchRequest) {
  return new Promise(function (resolve, reject) {
    authenticate().then(function (sessionId) {
      searchFlights(sessionId, "Return", returnFlightSearchRequest.origin, returnFlightSearchRequest.destination, returnFlightSearchRequest.departure, returnFlightSearchRequest.return, returnFlightSearchRequest.numberOfAdults, returnFlightSearchRequest.numberOfKids, returnFlightSearchRequest.numberOfInfants, "Economy", "EGP").then(function (data) {
        // for a return flights search, the API returns the segments of every leg in a different originDestinationOption
        let flightOffers = data.AirSearchResponse.AirSearchResult.FareItineraries.map(fareItinerary => {
          let flightOffer = {
            price: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount,
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode
          }
          flightOffer.flightLegs = fareItinerary.FareItinerary.OriginDestinationOptions.map(originDestinationOptionsItem => {
            var flightDurationInMillis = new Date(originDestinationOptionsItem.OriginDestinationOption[originDestinationOptionsItem.OriginDestinationOption.length - 1].FlightSegment.ArrivalDateTime).getTime() - new Date(originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.DepartureDateTime).getTime();
            var transitDurationInMillis = calculateTotalTransit(originDestinationOptionsItem.OriginDestinationOption);
            let flightLeg = {
              origin: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.DepartureAirportLocationCode,
              destination: originDestinationOptionsItem.OriginDestinationOption[originDestinationOptionsItem.OriginDestinationOption.length - 1].FlightSegment.ArrivalAirportLocationCode,
              totalDurationInMinutes: flightDurationInMillis / 60000 + "",
              totalDurationInWords: language == 'ar' ? shortArabicHumanizer(flightDurationInMillis) : shortEnglishHumanizer(flightDurationInMillis),
              transitDurationInMinutes: transitDurationInMillis / 60000 + "",
              transitDurationInWords: language == 'ar' ? shortArabicHumanizer(transitDurationInMillis) : shortEnglishHumanizer(transitDurationInMillis),
              carrier: {
                iataCode: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode,
                name: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode
              }
            }
            flightLeg.segments = originDestinationOptionsItem.OriginDestinationOption.map(originDestinationOption => {
              let flightSegment = {
                origin: originDestinationOption.FlightSegment.DepartureAirportLocationCode,
                destination: originDestinationOption.FlightSegment.ArrivalAirportLocationCode,
                originDetails: originDestinationOption.FlightSegment.DepartureAirportLocationCode, // map using airport list 
                destinationDetails: originDestinationOption.FlightSegment.ArrivalAirportLocationCode, // map using airport list 
                departure: originDestinationOption.FlightSegment.DepartureDateTime,
                arrival: originDestinationOption.FlightSegment.ArrivalDateTime,
                totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000),
                totalDurationInMinutes: originDestinationOption.FlightSegment.JourneyDuration,
                carrier: {
                  iataCode: originDestinationOption.FlightSegment.MarketingAirlineCode,
                  name: originDestinationOption.FlightSegment.MarketingAirlineCode
                }
              }
              return flightSegment;
            })
            return flightLeg;
          })
          return flightOffer;
        })
        resolve(flightOffers);
      }).catch(function (error) {
        reject({ error: "Failed to search for flights with trawex. Reason: " + error });
      })
    }).catch(function (error) {
      reject({ error: "Failed to authenticate with trawex. Reason: " + error });
    });
  });
}

exports.searchOneWayFlights = function (language, oneWaylightsSearchRequest) {
  return new Promise(function (resolve, reject) {
    authenticate().then(function (sessionId) {
      searchFlights(sessionId, "OneWay", oneWaylightsSearchRequest.origin, oneWaylightsSearchRequest.destination, oneWaylightsSearchRequest.departure, null, oneWaylightsSearchRequest.numberOfAdults, oneWaylightsSearchRequest.numberOfKids, oneWaylightsSearchRequest.numberOfInfants, "Economy", "EGP").then(function (data) {

        let flightOffers = data.AirSearchResponse.AirSearchResult.FareItineraries.map(fareItinerary => {
          let flightOffer = {
            price: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount,
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode
          }
          flightOffer.flightLegs = fareItinerary.FareItinerary.OriginDestinationOptions.map(originDestinationOptionsItem => {
            var flightDurationInMillis = new Date(originDestinationOptionsItem.OriginDestinationOption[originDestinationOptionsItem.OriginDestinationOption.length - 1].FlightSegment.ArrivalDateTime).getTime() - new Date(originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.DepartureDateTime).getTime();
            var transitDurationInMillis = calculateTotalTransit(originDestinationOptionsItem.OriginDestinationOption);
            let flightLeg = {
              origin: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.DepartureAirportLocationCode,
              destination: originDestinationOptionsItem.OriginDestinationOption[originDestinationOptionsItem.OriginDestinationOption.length - 1].FlightSegment.ArrivalAirportLocationCode,
              totalDurationInMinutes: flightDurationInMillis / 60000 + "",
              totalDurationInWords: language == 'ar' ? shortArabicHumanizer(flightDurationInMillis) : shortEnglishHumanizer(flightDurationInMillis),
              transitDurationInMinutes: transitDurationInMillis / 60000 + "",
              transitDurationInWords: language == 'ar' ? shortArabicHumanizer(transitDurationInMillis) : shortEnglishHumanizer(transitDurationInMillis),
              carrier: {
                iataCode: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode,
                name: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode
              }
            }
            flightLeg.segments = originDestinationOptionsItem.OriginDestinationOption.map(originDestinationOption => {
              let flightSegment = {
                origin: originDestinationOption.FlightSegment.DepartureAirportLocationCode,
                destination: originDestinationOption.FlightSegment.ArrivalAirportLocationCode,
                originDetails: originDestinationOption.FlightSegment.DepartureAirportLocationCode, // map using airport list 
                destinationDetails: originDestinationOption.FlightSegment.ArrivalAirportLocationCode, // map using airport list 
                departure: originDestinationOption.FlightSegment.DepartureDateTime,
                arrival: originDestinationOption.FlightSegment.ArrivalDateTime,
                totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000),
                totalDurationInMinutes: originDestinationOption.FlightSegment.JourneyDuration,
                carrier: {
                  iataCode: originDestinationOption.FlightSegment.MarketingAirlineCode,
                  name: originDestinationOption.FlightSegment.MarketingAirlineCode
                }
              }
              return flightSegment;
            })
            return flightLeg;
          })
          return flightOffer;
        })
        resolve(flightOffers);
      }).catch(function (error) {
        reject({ error: "Failed to search for flights with trawex. Reason: " + error });
      })
    }).catch(function (error) {
      reject({ error: "Failed to authenticate with trawex. Reason: " + error });
    });
  });
}

function authenticate() {
  return new Promise(function (resolve, reject) {
    var trawexAuthenticationUrl = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AUTHENTICATE_URL;
    httpRequest.get(
      {
        url: trawexAuthenticationUrl, json: true, proxy: "http://jumpbox.tripdizer.com:8080", rejectUnauthorized: false,
        qs: { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS }
      },
      function (error, response, data) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else if (data.Errors) {
          reject(data.Errors.ErrorMessage);
        } else {
          resolve(data.SessionId);
        }
      }
    );
  });
}

function searchFlights(sessionId, journey_type, airport_from_code, airport_to_code, departure_date, return_date, adult_flight, child_flight, infant_flight, flight_class, currency) {
  return new Promise(function (resolve, reject) {
    var trawexAuthenticationUrl = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL;
    httpRequest.get(
      {
        url: trawexAuthenticationUrl, json: true, proxy: "http://jumpbox.tripdizer.com:8080", rejectUnauthorized: false,
        qs: {
          user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, target: TRAWEX_ENVIRONMENT,
          session_id: sessionId, journey_type: journey_type, airport_from_code: airport_from_code, airport_to_code: airport_to_code,
          departure_date: departure_date, return_date: return_date, adult_flight: adult_flight, child_flight: child_flight, infant_flight: infant_flight,
          class: flight_class, currency: currency
        }
      },
      function (error, response, data) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else if (data.Errors) {
          reject(data.Errors.ErrorMessage);
        } else {
          resolve(data);
        }
      }
    );
  });
}

var calculateTotalTransit = function (segments) {
  var totalTransit = 0;
  if (segments.length < 2) {
    return totalTransit;
  } else {
    for (var i = 0; i < segments.length - 1; i++) { // iterate over all segments except last one
      var thisSegment = segments[i];
      var nextSegment = segments[i + 1];
      var transitBetween2Segments = new Date(nextSegment.FlightSegment.DepartureDateTime).getTime() - new Date(thisSegment.FlightSegment.ArrivalDateTime).getTime();
      totalTransit += transitBetween2Segments;
    }
    return totalTransit;
  }
}