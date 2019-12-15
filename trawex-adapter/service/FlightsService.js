'use strict';

let httpRequest = require("request");
let moment = require("moment");
let humanizeDuration = require('humanize-duration');
let writer = require('../utils/writer');

let TRAWEX_BASE_ENDPOINT = process.env.TRAWEX_BASE_ENDPOINT || "https://trawex.biz/api";
let TRAWEX_FLIGHTS_ROOT = "/flight_trawex";
let TRAWEX_FLIGHTS_AUTHENTICATE_URL = "/authenticate";
let TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL = "/flight_availability_search";
let TRAWEX_FLIGHTS_FARE_RULES_URL = "/fare_rules";
let TRAWEX_FLIGHTS_REVALIDATE_FARE_URL = "/revalidate";
let TRAWEX_FLIGHTS_BOOK_URL = "/book";
let TRAWEX_FLIGHTS_TICKET_ORDER_URL = "/ticket_order";
let TRAWEX_FLIGHTS_TRIP_DETAILS_URL = "/trip_details";
let ENABLE_TRAWEX_PROXY = process.env.ENABLE_TRAWEX_PROXY || "Y";

let TRAWEX_USERNAME = process.env.TRAWEX_USERNAME || "TripdizerAPITest";
let TRAWEX_PASSWORD = process.env.TRAWEX_PASSWORD || "TripdizerAPI@2019";
let TRAWEX_SOURCE_IP_ADDRESS = process.env.TRAWEX_FLIGHTS_SOURCE_IP_ADDRESS || "34.90.113.143";
let TRAWEX_ENVIRONMENT = process.env.TRAWEX_ENVIRONMENT || "Test";
let TRAWEX_PROXY_ENDPOINT = process.env.TRAWEX_FLIGHTS_PROXY_ENDPOINT || "http://34.90.113.143:3128";
let ENABLE_API_LOGGING = process.env.ENABLE_API_LOGGING || false;

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
      let departureDatesList = multiCityFlightsSearchRequest.tripSegments.map(tripSegment => tripSegment.leavingDate);// departureDatesList.push(multiCityFlightsSearchRequest.tripSegments[multiCityFlightsSearchRequest.tripSegments.length - 1].leavingDate)

      let airportFromCodesSequence = ""; airportFromCodesSequence = originList.reduce((airportFromCodesSequence, cityIata) => airportFromCodesSequence + "<br>" + cityIata);
      let airportToCodesSequence = ""; airportToCodesSequence = destinationsList.reduce((airportToCodesSequence, cityIata) => airportToCodesSequence + "<br>" + cityIata);
      let departureDatesSequence = ""; departureDatesSequence = departureDatesList.reduce((departureDatesSequence, arrivalDate) => departureDatesSequence + "<br>" + arrivalDate);

      searchFlights(sessionId, "Circle", airportFromCodesSequence, airportToCodesSequence, departureDatesSequence, null, multiCityFlightsSearchRequest.numberOfAdults, multiCityFlightsSearchRequest.numberOfChildren, multiCityFlightsSearchRequest.numberOfInfants, "Economy", "EGP").then(function (data) {
        // for multi-city flights  requests, the API returns all the segments under the same originDestinationOption
        let flightOffers = data.AirSearchResponse.AirSearchResult.FareItineraries.map(fareItinerary => {
          let flightOffer = {
            price: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount,
            currency: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
            sessionId: sessionId,
            fareSourceCode: fareItinerary.FareItinerary.AirItineraryFareInfo.FareSourceCode,
            fareType: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType,
            refundable: fareItinerary.FareItinerary.AirItineraryFareInfo.FareType.IsRefundable,
            passportMandatory: fareItinerary.FareItinerary.IsPassportMandatory,
            flightLegs: originList.map((origin, index) => (
              {
                origin: origin,
                destination: destinationsList[index],
                flightDay: departureDatesList[index],
                segments: []
              }
            )),
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

            // find which tripSegment this flightSegment belongs to, based on the flight date of the leg and the departureDate of the flightSegment (or one day after for overnight flights)
            var flightLeg = flightOffer.flightLegs.find(flightLeg => moment(flightLeg.flightDay).isSame(moment(flightSegment.departure), 'day') || moment(flightLeg.flightDay).isSame(moment(flightSegment.departure).add(-1, 'days'), 'day'));
            if (flightLeg) { // we found a leg that starts on the same day of the segment
              flightLeg.segments.push(flightSegment);
            } else { // couldn't find a leg whose dat is the departure date of a segment, then this is a second segment of a leg that happens to be in the next day
              // find the first leg that has a segment whole destination is the same origin of the segment (segments should be sorted, so the first segment of this leg should already be there)
              flightLeg = flightOffer.flightLegs.find(flightLeg => flightLeg.segments.find(flightLegSegment => flightLegSegment.destination == flightSegment.origin) != null);
              if (flightLeg) {
                flightLeg.segments.push(flightSegment);
              } else {
                console.error("A flight segment couldn't be added to a leg. Adding it to the offer directly");
                flightOffer.segment.push(flightSegment);
              }
            }
          });
          flightOffer.flightLegs.forEach(flightLeg => {
            flightLeg.carrier = flightLeg.segments.length != 0 ? flightLeg.segments[0].carrier : null;
            flightLeg.totalDurationInMinutes = flightLeg.segments.length > 0 ? (new Date(flightLeg.segments[flightLeg.segments.length - 1].arrival).getTime() - new Date(flightLeg.segments[0].departure).getTime()) / 60000 : 0;
            flightLeg.totalDurationInWords = language == 'ar' ? shortArabicHumanizer(flightLeg.totalDurationInMinutes * 60 * 1000) : shortEnglishHumanizer(flightLeg.totalDurationInMinutes * 60 * 1000);
            flightLeg.transitDurationInMinutes = flightLeg.segments.length > 0 ? calculateTotalTransitFromFlightSegments(flightLeg.segments) / 60000 : 0;
            flightLeg.transitDurationInWords = language == 'ar' ? shortArabicHumanizer(flightLeg.transitDurationInMinutes * 60 * 1000) : shortEnglishHumanizer(flightLeg.transitDurationInMinutes * 60 * 1000);

          })
          return flightOffer;
        })
        resolve(flightOffers);
      }).catch(function (error) {
        reject(error)
      })
    }).catch(function (error) {
      reject(error)
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
            currency: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
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
        reject(error)
      })
    }).catch(function (error) {
      reject(error)
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
            currency: fareItinerary.FareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.CurrencyCode,
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
        reject(error)
      })
    }).catch(function (error) {
      reject(error)
    });
  });
}

exports.getFareDetails = function (language, sessionId, fareSourceCode) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_FARE_RULES_URL;
    var qs = { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, session_id: sessionId, fare_source_code: fareSourceCode };
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject({ error: "Failed to get fare rules with trawex. Reason: " + error })
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject({ error: "Failed to get fare rules with trawex. Reason: " + response.statusMessage })
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErroCode + "|" + err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({ error: data.Errors.ErrorCode + "|" + data.Errors.ErrorMessage });
          }
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          resolve(data);
        }
      }
    );
  });
}

exports.revalidateFare = function (language, sessionId, fareSourceCode) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_REVALIDATE_FARE_URL;
    var qs = { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, session_id: sessionId, fare_source_code: fareSourceCode };
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject({ error: "Failed to revalidate fare with trawex. Reason: " + error })
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject({ error: "Failed to revalidate fare with trawex. Reason: " + response.statusMessage })
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({ error: data.Errors.ErrorMessage });
          }
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);

          if (data && data.AirRevalidateResponse && data.AirRevalidateResponse.AirRevalidateResult) {
            if (data.AirRevalidateResponse.AirRevalidateResult.IsValid == "true" || data.AirRevalidateResponse.AirRevalidateResult.IsValid == true) {
              resolve({ requiredFieldsToBook: data.AirRevalidateResponse.AirRevalidateResult.FareItineraries.FareItinerary.RequiredFieldsToBook });
            } else {
              var error = `Fare is no longer valid for booking. AirRevalidateResult.IsValid is ${data.AirRevalidateResponse.AirRevalidateResult.IsValid}. Please select another offer`;
              console.error(error);
              reject({ error: error })
            }
          } else {
            var error = `Fare is no longer valid for booking. Please select another offer. Data: ${JSON.stringify(data)}`;
            console.error(error);
            reject({ error: error })
          }
        }
      }
    );
  });
}

exports.bookFlight = function (language, bookFlightRequest) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_BOOK_URL;
    var titlesToGenderMap = {
      lord: "M", miss: "F", mr: "M", mrs: "F", sir: "M", mstr: "M"
    }
    var qs = {
      user_id: TRAWEX_USERNAME,
      user_password: TRAWEX_PASSWORD,
      access: TRAWEX_ENVIRONMENT,
      target: TRAWEX_ENVIRONMENT,
      ip_address: TRAWEX_SOURCE_IP_ADDRESS,
      // general booking fields
      session_id: bookFlightRequest.sessionId,
      area_code: 2, // bookFlightRequest.adultsPNRInfoList[0].areaCode, // 6
      country_code: 2, //bookFlightRequest.adultsPNRInfoList[0].countryCode,// 31,
      FareSourceCode: bookFlightRequest.fareSourceCode,
      type: bookFlightRequest.fareType, //'Public',
      PostCode: 12311, // bookFlightRequest.adultsPNRInfoList[0].postCode, // 123411
      IsPassportMandatory: bookFlightRequest.passportMandatory,  // false, 
      // number of travelers
      adult_flight: bookFlightRequest.adultsPNRInfoList.length, //1 
      child_flight: bookFlightRequest.childrenPNRInfoList.length, //0
      infant_flight: bookFlightRequest.infantsPNRInfoList.length, // 1,

      // generic booking fields taken from first adult
      email_id: bookFlightRequest.adultsPNRInfoList[0].email, // "mohamed@tripdizer.com",
      mobile_no: bookFlightRequest.adultsPNRInfoList[0].phone, // 19739626
      // adults unique fields
      first_name: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName), // "Mohamed"
      last_name: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName), // Mostafa
      title: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName), //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf", // "Mr"
      dob: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => moment(pnrInfo.dateOfBirth).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName), //"2014-02-01",
      passport_no: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName), // "A08102235",
      passport_expiry: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => moment(pnrInfo.passportExpiry).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName), //"2013-02-03",
      gender: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => titlesToGenderMap[pnrInfo.title.toLowerCase()]).reduce((result, nextName) => result + "<br>" + nextName), //"M",

      // adults fields taken from first adult
      nationality: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => bookFlightRequest.adultsPNRInfoList[0].nationality).reduce((result, nextName) => result + "<br>" + nextName), //"EG",
      issue_country: bookFlightRequest.adultsPNRInfoList.map(pnrInfo => bookFlightRequest.adultsPNRInfoList[0].nationality).reduce((result, nextName) => result + "<br>" + nextName), //"EG",

      frequentFlyrNum: null,
      adultmealplan: null,
      // children unique fields
      child_first_name: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_last_name: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_title: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName) : null, //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf",
      child_dob: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => moment(pnrInfo.dateOfBirth).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2014-02-01 T00:00:00",
      child_passport_no: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName) : null,
      child_passport_expiry_date: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => moment(pnrInfo.passportExpiry).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2013-02-03",
      child_gender: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => titlesToGenderMap[pnrInfo.title.toLowerCase()]).reduce((result, nextName) => result + "<br>" + nextName) : null, //"M",

      // children fields taken from first adult
      child_issue_country: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.childrenPNRInfoList.map(pnrInfo => bookFlightRequest.adultsPNRInfoList[0].nationality).reduce((result, nextName) => result + "<br>" + nextName) : null, //"EG",

      child_FrequentFlyrNum: null,
      childMealplan: null,
      // infants
      infant_first_name: bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.firstName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      infant_last_name: bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.lastName).reduce((result, nextName) => result + "<br>" + nextName) : null,
      infant_title: bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.title).reduce((result, nextName) => result + "<br>" + nextName) : null, //"Mr/Mrs/Sir/Lord/Lady/Miss/Inf",
      infant_dob: bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => moment(pnrInfo.dateOfBirth).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2014-02-01 T00:00:00",
      infant_passport_no: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => pnrInfo.passportNumber).reduce((result, nextName) => result + "<br>" + nextName) : null,
      infant_passport_expiry_date: bookFlightRequest.childrenPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => moment(pnrInfo.passportExpiry).format('YYYY-MM-DD')).reduce((result, nextName) => result + "<br>" + nextName) : null, //"2013-02-03",
      infant_gender: bookFlightRequest.infantsPNRInfoList.length > 0 ? bookFlightRequest.infantsPNRInfoList.map(pnrInfo => titlesToGenderMap[pnrInfo.title.toLowerCase()]).reduce((result, nextName) => result + "<br>" + nextName) : null, //"M",

      infantMealplan: null,
    }
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject({ error: "Failed to book with trawex. Reason: " + error })
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject({ error: "Failed to book with trawex. Reason: " + response.statusMessage })
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({ error: data.Errors.ErrorMessage });
          }
        } else if (data.BookFlightResponse.BookFlightResult.Errors && Array.isArray(data.BookFlightResponse.BookFlightResult.Errors) && data.BookFlightResponse.BookFlightResult.Errors.length > 0) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          reject({ error: data.BookFlightResponse.BookFlightResult.Errors.map(err => err.Errors.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (data.BookFlightResponse.BookFlightResult.Success == "false" || data.BookFlightResponse.BookFlightResult.Success == false) {
            // return all errors, coma-separated
            if (Array.isArray(data.BookFlightResponse.BookFlightResult.Errors)) {
              reject({ error: data.BookFlightResponse.BookFlightResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
            } else {
              reject({ error: data.BookFlightResponse.BookFlightResult.Errors.ErrorMessage });
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
    var qs = {
      user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD,
      target: TRAWEX_ENVIRONMENT, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS,
      UniqueID: bookingUniqueId, session_id: sessionId
    };
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject("Failed to issue ticket with Trawex. Reason: " + response.statusMessage);
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({
              error: data.Errors.ErrorMessage
            });
          }
        } else if (data.AirOrderTicketRS.TicketOrderResult.Errors && Array.isArray(data.AirOrderTicketRS.TicketOrderResult.Errors) && data.AirOrderTicketRS.TicketOrderResult.Errors.length > 0) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          reject({ error: data.AirOrderTicketRS.TicketOrderResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (data.AirOrderTicketRS.TicketOrderResult.Success == "false" || data.AirOrderTicketRS.TicketOrderResult.Success == false) {
            // return all errors, coma-separated
            reject({ error: data.AirOrderTicketRS.TicketOrderResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            resolve({ ticketUniqueId: data.AirOrderTicketRS.TicketOrderResult.UniqueID });
          }
        }
      }
    );
  });
}

exports.getTripDetails = function (language, sessionId, bookingUniqueId) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_TRIP_DETAILS_URL;
    var qs = {
      user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD,
      target: TRAWEX_ENVIRONMENT, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS,
      UniqueID: bookingUniqueId, session_id: sessionId
    };
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject("Failed to get trip details from Trawex. Reason: " + response.statusMessage);
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({
              error: data.Errors.ErrorMessage
            });
          }
        } else if (data.TripDetailsResponse.TripDetailsResult.Errors && Array.isArray(data.TripDetailsResponse.TripDetailsResult.Errors) && data.TripDetailsResponse.TripDetailsResult.Errors.length > 0) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          reject({ error: data.TripDetailsResponse.TripDetailsResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (data.TripDetailsResponse.TripDetailsResult.Success == "false" || data.TripDetailsResponse.TripDetailsResult.Success == false) {
            // return all errors, coma-separated
            reject({ error: data.TripDetailsResponse.TripDetailsResult.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
            resolve(
              {
                passengerDetails: data.TripDetailsResponse.TripDetailsResult.TravelItinerary.ItineraryInfo.CustomerInfos.map(item => item.CustomerInfo),
                reservationDetails: data.TripDetailsResponse.TripDetailsResult.TravelItinerary.ItineraryInfo.ReservationItems.map(item => ({
                  ...item.ReservationItem,
                  DepartureAirportLocationName: mapAirportCodeToName(item.ReservationItem.DepartureAirportLocationCode),
                  ArrivalAirportLocationName: mapAirportCodeToName(item.ReservationItem.ArrivalAirportLocationCode),
                  MarketingAirlineName: mapAirlineCodeToName(item.ReservationItem.MarketingAirlineCode),
                  OperatingAirlineName: mapAirlineCodeToName(item.ReservationItem.OperatingAirlineCode),
                  JourneyDurationInWords: shortEnglishHumanizer(item.ReservationItem.JourneyDuration * 60 * 1000)
                }))
              });
          }
        }
      }
    );
  });
}

function authenticate() {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AUTHENTICATE_URL;
    var qs = { user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS }
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject("Failed to authenticate with Trawex. Reason: " + response.statusMessage);
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          reject(data.Errors.ErrorMessage);
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          resolve(data.SessionId);
        }
      }
    );
  });
}

function searchFlights(sessionId, journey_type, airport_from_code, airport_to_code, departure_date, return_date, adult_flight, child_flight, infant_flight, flight_class, currency) {
  return new Promise(function (resolve, reject) {
    var url = TRAWEX_BASE_ENDPOINT + TRAWEX_FLIGHTS_ROOT + TRAWEX_FLIGHTS_AVAILABILITY_SEARCH_URL;
    var qs = {
      user_id: TRAWEX_USERNAME, user_password: TRAWEX_PASSWORD, access: TRAWEX_ENVIRONMENT, ip_address: TRAWEX_SOURCE_IP_ADDRESS, target: TRAWEX_ENVIRONMENT,
      session_id: sessionId, journey_type: journey_type, airport_from_code: airport_from_code, airport_to_code: airport_to_code,
      departure_date: departure_date, return_date: return_date, adult_flight: adult_flight, child_flight: child_flight, infant_flight: infant_flight,
      class: flight_class, currency: currency
    };
    httpRequest.get(
      {
        url: url, json: true, proxy: ENABLE_TRAWEX_PROXY === "Y" ? TRAWEX_PROXY_ENDPOINT : null, timeout: 60 * 1000,
        gzip: true,
        qs: qs
      },
      function (error, response, data) {
        if (error) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode != 200) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject("Failed to search for flights with Trawex. Reason: " + response.statusMessage);
        } else if (!data) {
          console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(response)}`);
          reject([`Unknown response recieved - Response Body: ${response.body}`])
        } else if (data.Errors) {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
          if (Array.isArray(data.Errors)) {
            reject({ error: data.Errors.map(err => err.ErrorMessage).reduce((oneError, nextError) => oneError + ", " + nextError) });
          } else {
            reject({
              error: data.Errors.ErrorMessage
            });
          }
        } else {
          if (ENABLE_API_LOGGING) console.info(`URL:  ${url} - Request:  ${JSON.stringify(qs)} + " - Response:  ${JSON.stringify(data)}`);
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

var calculateTotalTransitFromFlightSegments = function (segments) {
  var totalTransit = 0;
  if (segments.length < 2) {
    return totalTransit;
  } else {
    for (var i = 0; i < segments.length - 1; i++) { // iterate over all segments except last one
      var thisSegment = segments[i];
      var nextSegment = segments[i + 1];
      var transitBetween2Segments = new Date(nextSegment.departure).getTime() - new Date(thisSegment.arrival).getTime();
      totalTransit += transitBetween2Segments;
    }
    return totalTransit;
  }
}