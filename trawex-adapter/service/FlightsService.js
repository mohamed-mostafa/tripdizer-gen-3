'use strict';

let httpRequest = require("request");
let moment = require("moment");

let TRAWEX_BASE_ENDPOINT = "https://trawex.biz/api";
let TRAWEX_FLIGHTS_ROOT = "/flight_trawex";
let TRAWEX_FLIGHTS_AUTHENTICATE_URL = "/authenticate";
let TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL = "/flight_availability_search";

let TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
let TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019"
let TRAWEX_SOURCE_IP_ADDRESS = process.env.TRAWEX_SOURCE_IP_ADDRESS || "34.90.113.143"
let TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";

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
      searchFlights(sessionId).then(function (data) {

        let flightOffers = data.AirSearchResponse.AirSearchResult.FareItineraries.map(fareItinerary => {
          let flightOffer = {
            price: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount,
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode
          }
          flightOffer.flightLegs = fareItinerary.FareItinerary.OriginDestinationOptions.map(originDestinationOptionsItem => {
            let flightLeg = {
              origin: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.DepartureAirportLocationCode,
              destination: originDestinationOptionsItem.OriginDestinationOption[originDestinationOptionsItem.OriginDestinationOption.length - 1].FlightSegment.ArrivalAirportLocationCode,
              totalDurationInWords: "",
              transitDurationInWords: "",
              totalDurationInMinutes: "",
              transitDurationInMinutes: "",
              carrier: {
                iataCode: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode,
                name: originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode
              }
            }
            flightLeg.segments = originDestinationOptionsItem.OriginDestinationOption.map(originDestinationOption => {
              let flightSegment = {
                origin: originDestinationOption.FlightSegment.DepartureAirportLocationCode,
                destination: originDestinationOption.FlightSegment.ArrivalAirportLocationCode,
                departure: originDestinationOption.FlightSegment.DepartureDateTime,
                arrival: originDestinationOption.FlightSegment.ArrivalDateTime
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

function searchFlights(sessionId) {
  return new Promise(function (resolve, reject) {
    var trawexAuthenticationUrl = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL;
    httpRequest.get(
      {
        url: trawexAuthenticationUrl, json: true, proxy: "http://jumpbox.tripdizer.com:8080", rejectUnauthorized: false,
        qs: {
          user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          session_id: sessionId, journey_type: "OneWay", airport_from_code: "CAI", airport_to_code: "AMS",
          departure_date: "2019-12-12", return_date: "2019-12-15", adult_flight: "1", child_flight: "0", infant_flight: "0",
          class: "Economy", target: TRAWEX_ENVIRONMENT, currency: "EGP"
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