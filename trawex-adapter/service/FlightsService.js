'use strict';

let httpRequest = require("request");
let moment = require("moment");
let humanizeDuration = require('humanize-duration');
let writer = require('../utils/writer');

let TRAWEX_BASE_ENDPOINT = "https://trawex.biz/api";
let TRAWEX_FLIGHTS_ROOT = "/flight_trawex";
let TRAWEX_FLIGHTS_AUTHENTICATE_URL = "/authenticate";
let TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL = "/flight_availability_search";
let TRAWEX_FLIGHTS_FARE_RULES_URL = "/fare_rules";
let TRAWEX_FLIGHTS_REVALIDATE_FARE_URL = "/revalidate";
let TRAWEX_FLIGHTS_BOOK_URL = "/book";
let TRAWEX_FLIGHTS_TICKET_ORDER_URL = "/ticket_order";

let TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
let TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019"
let TRAWEX_SOURCE_IP_ADDRESS = process.env.TRAWEX_SOURCE_IP_ADDRESS || "35.242.174.95"
let TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";
let TRAWEX_PROXY_ENDPOINT = process.env.TRAWEX_PROXY_ENDPOINT || "http://35.242.174.95:3128";

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


let airlinesMap = require("../lookups/Airlines.json");
let airportsMap = require("../lookups/Airports.json");

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
            sessionId: sessionId,
            fareSourceCode: fareItinerary.FareItinerary.AirItineraryFareInfo.FareSourceCode,
            fareType: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType,
            refundable: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType.IsRefundable,
            passportMandatory: fareItinerary.FareItinerary.IsPassportMandatory,
            segments: []
          }
          fareItinerary.FareItinerary.OriginDestinationOptions[0].OriginDestinationOption.forEach(async originDestinationOptionItem => {
            let flightSegment = {
              origin: originDestinationOptionItem.FlightSegment.DepartureAirportLocationCode,
              destination: originDestinationOptionItem.FlightSegment.ArrivalAirportLocationCode,
              originDetails: mapAirportCodeToName(originDestinationOptionItem.FlightSegment.DepartureAirportLocationCode), // map using airport list 
              destinationDetails: mapAirportCodeToName(originDestinationOptionItem.FlightSegment.ArrivalAirportLocationCode), // map using airport list 
              departure: originDestinationOptionItem.FlightSegment.DepartureDateTime,
              arrival: originDestinationOptionItem.FlightSegment.ArrivalDateTime,
              return: originDestinationOptionItem.FlightSegment.ArrivalDateTime, // same as arrival, to keep legacy interface
              totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOptionItem.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOptionItem.FlightSegment.JourneyDuration * 60 * 1000),
              totalDurationInMinutes: originDestinationOptionItem.FlightSegment.JourneyDuration,
              carrier: {
                iataCode: originDestinationOptionItem.FlightSegment.MarketingAirlineCode,
                name: mapAirlineCodeToName(originDestinationOptionItem.FlightSegment.MarketingAirlineCode)
              }
            }
            flightOffer.segments.push(flightSegment);
          });
          return flightOffer;
        })
        resolve(flightOffers);
      }).catch(function (error) {
        reject(writer.respondWithCode(500, error))
      })
    }).catch(function (error) {
      reject(writer.respondWithCode(500, error))
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
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
            sessionId: sessionId,
            fareSourceCode: fareItinerary.FareItineraries.AirItineraryFareInfo.FareSourceCode,
            fareType: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType,
            refundable: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType.IsRefundable,
            passportMandatory: fareItinerary.FareItinerary.IsPassportMandatory,
          }
          flightOffer.flightLegs = fareItinerary.FareItinerary.OriginDestinationOptions.map(async originDestinationOptionsItem => {
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
                name: mapAirlineCodeToName(originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode)
              }
            }
            flightLeg.segments = originDestinationOptionsItem.OriginDestinationOption.map(async originDestinationOption => {
              let flightSegment = {
                origin: originDestinationOption.FlightSegment.DepartureAirportLocationCode,
                destination: originDestinationOption.FlightSegment.ArrivalAirportLocationCode,
                originDetails: mapAirportCodeToName(originDestinationOption.FlightSegment.DepartureAirportLocationCode), // map using airport list 
                destinationDetails: mapAirportCodeToName(originDestinationOption.FlightSegment.ArrivalAirportLocationCode), // map using airport list 
                departure: originDestinationOption.FlightSegment.DepartureDateTime,
                arrival: originDestinationOption.FlightSegment.ArrivalDateTime,
                return: originDestinationOption.FlightSegment.ArrivalDateTime, // same as arrival, to keep legacy interface
                totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000),
                totalDurationInMinutes: originDestinationOption.FlightSegment.JourneyDuration,
                carrier: {
                  iataCode: originDestinationOption.FlightSegment.MarketingAirlineCode,
                  name: mapAirlineCodeToName(originDestinationOption.FlightSegment.MarketingAirlineCode)
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
        reject(writer.respondWithCode(500, error))
      })
    }).catch(function (error) {
      reject(writer.respondWithCode(500, error))
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
            currenty: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
            sessionId: sessionId,
            fareSourceCode: fareItinerary.FareItinerary.AirItineraryFareInfo.FareSourceCode,
            fareType: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType,
            refundable: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType.IsRefundable,
            passportMandatory: fareItinerary.FareItinerary.IsPassportMandatory,
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
                name: mapAirlineCodeToName(originDestinationOptionsItem.OriginDestinationOption[0].FlightSegment.MarketingAirlineCode)
              }
            }
            flightLeg.segments = originDestinationOptionsItem.OriginDestinationOption.map(originDestinationOption => {
              let flightSegment = {
                origin: originDestinationOption.FlightSegment.DepartureAirportLocationCode,
                destination: originDestinationOption.FlightSegment.ArrivalAirportLocationCode,
                originDetails: mapAirportCodeToName(originDestinationOption.FlightSegment.DepartureAirportLocationCode), // map using airport list 
                destinationDetails: mapAirportCodeToName(originDestinationOption.FlightSegment.ArrivalAirportLocationCode), // map using airport list 
                departure: originDestinationOption.FlightSegment.DepartureDateTime,
                arrival: originDestinationOption.FlightSegment.ArrivalDateTime,
                return: originDestinationOption.FlightSegment.ArrivalDateTime, // same as arrival, to keep legacy interface
                totalDurationInWords: language == 'ar' ? shortArabicHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000) : shortEnglishHumanizer(originDestinationOption.FlightSegment.JourneyDuration * 60 * 1000),
                totalDurationInMinutes: originDestinationOption.FlightSegment.JourneyDuration,
                carrier: {
                  iataCode: originDestinationOption.FlightSegment.MarketingAirlineCode,
                  name: mapAirlineCodeToName(originDestinationOption.FlightSegment.MarketingAirlineCode)
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
        reject(writer.respondWithCode(500, error))
      })
    }).catch(function (error) {
      reject(writer.respondWithCode(500, error))
    });
  });
}

exports.getFareDetails = function (language, sessionId, fareSourceCode) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_FARE_RULES_URL;
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
        qs: { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, session_id: sessionId, fare_source_code: fareSourceCode }
      },
      function (error, response, data) {
        if (error) {
          reject(writer.respondWithCode(500, { error: "Failed to get fare rules with trawex. Reason: " + error }))
        } else if (response.statusCode != 200) {
          reject(writer.respondWithCode(500, { error: "Failed to get fare rules with trawex. Reason: " + response.statusMessage }))
        } else if (data.Errors) {
          if (Array.isArray(data.Errors)) {
            reject(writer.respondWithCode(500, { error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else {
          resolve(data);
        }
      }
    );
  });
}

exports.revalidateFare = function (language, sessionId, fareSourceCode) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_REVALIDATE_FARE_URL;
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
        qs: { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, session_id: sessionId, fare_source_code: fareSourceCode }
      },
      function (error, response, data) {
        if (error) {
          reject(writer.respondWithCode(500, { error: "Failed to revalidate fare with trawex. Reason: " + error }))
        } else if (response.statusCode != 200) {
          reject(writer.respondWithCode(500, { error: "Failed to revalidate fare with trawex. Reason: " + response.statusMessage }))
        } else if (data.Errors) {
          if (Array.isArray(data.Errors)) {
            reject(writer.respondWithCode(500, { error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else {
          if (data.AirRevalidateResponse.AirRevalidateResult.IsValid == "true" || data.AirRevalidateResponse.AirRevalidateResult.IsValid == true) {
            resolve({ requiredFieldsToBook: data.AirRevalidateResponse.AirRevalidateResult.FareItineraries.FareItinerary.RequiredFieldsToBook });
          } else {
            reject(writer.respondWithCode(500, { error: "Failed to revalidate fare with trawex. Reason: Fare is no longer valid for booking" }))
          }
        }
      }
    );
  });
}

exports.bookFlight = function (language, bookFlightRequest) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_BOOK_URL;
    var params = {
      user_id: TRAWEX_USERNAME,
      user_password: TRAWEX_PASSWORD,
      access: TRAWEX_ENVIRONMENT,
      target: TRAWEX_ENVIRONMENT,
      ip_address: TRAWEX_SOURCE_IP_ADDRESS,
      // general booking fields
      session_id: bookFlightRequest.sessionId,
      area_code: 6,//bookFlightRequest.adultsPNRInfoList[0].areaCode,
      country_code: 31,//bookFlightRequest.adultsPNRInfoList[0].countryCode,
      FareSourceCode: bookFlightRequest.fareSourceCode,
      type: 'Public', // bookFlightRequest.fareType,
      PostCode: 123411,//bookFlightRequest.adultsPNRInfoList[0].postCode,
      IsPassportMandatory: false, // bookFlightRequest.passportMandatory,
      // number of travelers
      adult_flight: 1,// bookFlightRequest.adultsPNRInfoList.length,
      child_flight: 0, //bookFlightRequest.childrenPNRInfoList.length,
      infant_flight: 1, //bookFlightRequest.infantsPNRInfoList.length,
      // adults
      first_name: "Mohamed", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName),
      last_name: "Mostafa", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName),
      title: "Mr", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName), //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf",
      gender: "M", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.gender).reduce((result, nextName) => result + "<br>" + nextName), //"M",
      dob: "1984-02-01", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.dateOfBirth).reduce((result, nextName) => result + "<br>" + nextName), //"2014-02-01 T00:00:00",
      passport_no: " A08102235", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName),
      passport_expiry: "2022-02-14", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.passportExpiry).reduce((result, nextName) => result + "<br>" + nextName), //"2013-02-03",
      issue_country: "EG", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.passportIssueCountry).reduce((result, nextName) => result + "<br>" + nextName), //"EG",
      email_id: "mohamed@tripdizer.com", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.email).reduce((result, nextName) => result + "<br>" + nextName),
      mobile_no: 19739626, // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.phone).reduce((result, nextName) => result + "<br>" + nextName),
      nationality: " EG", // bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.nationality).reduce((result, nextName) => result + "<br>" + nextName), //"EG",
      frequentFlyrNum: null,
      adultmealplan: null,
      // children
      child_first_name: "abc",// bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_last_name: "xyz", // bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_title: "Mr", // bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName) : null, //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf",
      child_gender: "M", //bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.gender).reduce((result, nextName) => result + "<br>" + nextName) : null, //"M",
      child_dob: "2016-10-10", // bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.dateOfBirth).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2014-02-01 T00:00:00",
      child_passport_no: "abc", //bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_passport_expiry_date: "2022-10-10", // bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.passportExpiry).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2013-02-03",
      child_issue_country: "EG", //bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.passportIssueCountry).reduce((result, nextName) => result + "<br>" + nextName) : null, //"EG",
      child_FrequentFlyrNum: null,
      childMealplan: null,
      // infants
      infant_first_name: "abc", // bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      infant_last_name: "xyz", //bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      infant_title: "Mr", //bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName) : null, //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf",
      infant_gender: "M", // bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.gender).reduce((result, nextName) => result + "<br>" + nextName) : null, //"M",
      infant_dob: "2018-10-10", //bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.dateOfBirth).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2014-02-01 T00:00:00",
      // infant_passport_no: " abc", //bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName) : null,
      // infant_passport_expiry_date: "2021-10-10", //bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.passportExpiry).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2013-02-03",
      // infant_issue_country: "EG", // bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.passportIssueCountry).reduce((result, nextName) => result + "<br>" + nextName) : null, //"EG",
      infantMealplan: null,
    }
    console.log(params);
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
        qs: params
      },
      function (error, response, data) {
        if (error) {
          reject(writer.respondWithCode(500, { error: "Failed to book with trawex. Reason: " + error }))
        } else if (response.statusCode != 200) {
          reject(writer.respondWithCode(500, { error: "Failed to book with trawex. Reason: " + response.statusMessage }))
        } else if (data.Errors) {
          if (Array.isArray(data.Errors)) {
            reject(writer.respondWithCode(500, { error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else if (data.BookFlightResponse.BookFlightResult.Errors) {
          if (Array.isArray(data.BookFlightResponse.BookFlightResult.Errors)) {
            reject(writer.respondWithCode(500, { error: data.BookFlightResponse.BookFlightResult.Errors.map(err => err.Errors.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else {
          if (data.BookFlightResponse.BookFlightResult.Success == "false" || data.BookFlightResponse.BookFlightResult.Success == false) {
            // return all errors, coma-separated
            if (Array.isArray(data.BookFlightResponse.BookFlightResult.Errors)) {
              reject(writer.respondWithCode(500, { error: data.BookFlightResponse.BookFlightResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
            } else {
              reject(writer.respondWithCode(500, { error: data.BookFlightResponse.BookFlightResult.Errors.ErrorMessage }));
            }
          } else {
            resolve({
              bookingStatus: data.BookFlightResponse.BookFlightResult.Status,
              bookingUniqueId: data.BookFlightResponse.BookFlightResult.UniqueID,
              bookingTicketTimeLimit: data.BookFlightResponse.BookFlightResult.TktTimeLimit
            });
          }
        }
      }
    );
  });
}

exports.issueTicket = function (language, sessionId, bookingUniqueId) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_TICKET_ORDER_URL;
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
        qs: {
          user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD,
          target: TRAWEX_ENVIRONMENT, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS,
          UniqueID: bookingUniqueId, session_id: sessionId
        }
      },
      function (error, response, data) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(response.statusMessage);
        } else if (data.Errors) {
          if (Array.isArray(data.Errors)) {
            reject(writer.respondWithCode(500, { error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else if (data.AirOrderTicketRS.TicketOrderResult.Errors) {
          if (Array.isArray(data.AirOrderTicketRS.TicketOrderResult.Errors)) {
            reject(writer.respondWithCode(500, { error: data.AirOrderTicketRS.TicketOrderResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.AirOrderTicketRS.TicketOrderResult.Errors.Error ? data.AirOrderTicketRS.TicketOrderResult.Errors.Error.ErrorMessage : (data.AirOrderTicketRS.TicketOrderResult.Errors.ErrorMessage ? data.AirOrderTicketRS.TicketOrderResult.Errors.ErrorMessage : "UNKNOWN ERROR") }));
          }
        } else {
          if (data.AirOrderTicketRS.TicketOrderResult.Success == "false" || data.AirOrderTicketRS.TicketOrderResult.Success == false) {
            // return all errors, coma-separated
            reject(writer.respondWithCode(500, { error: data.AirOrderTicketRS.TicketOrderResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            resolve({ ticketUniqueId: data.AirOrderTicketRS.TicketOrderResult.UniqueID });
          }
        }
      }
    );
  });
}

function authenticate() {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AUTHENTICATE_URL;
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
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
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL;
    httpRequest.get(
      {
        url: url, json: true, proxy: TRAWEX_PROXY_ENDPOINT, timeout: 60 * 1000,
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
          if (Array.isArray(data.Errors)) {
            reject(writer.respondWithCode(500, { error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) }));
          } else {
            reject(writer.respondWithCode(500, { error: data.Errors.ErrorMessage }));
          }
        } else {
          resolve(data);
        }
      }
    );
  });
}

var mapAirlineCodeToName = function (airlineCode) {
  let airlineCodeNamePair = airlinesMap.filter(element => element.AirLineCode == airlineCode);
  if (airlineCodeNamePair.length != 0) {
    return airlineCodeNamePair[0].AirLineName;
  } else {
    return airlineCode;
  }
}

var mapAirportCodeToName = function (airportCode) {
  let airportCodeNamePair = airportsMap.filter(element => element.AirportCode == airportCode);
  if (airportCodeNamePair.length != 0) {
    return airportCodeNamePair[0].AirportName;
  } else {
    return airportCode;
  }
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