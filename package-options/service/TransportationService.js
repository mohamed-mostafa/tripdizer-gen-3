let request = require("request");
let moment = require("moment");
const MAX_NUMBER_OF_OFFERS_PER_LEG = 3;
const MAX_TRANSIT_TIME_IN_MINUTES = 8 * 60;
const TRAWEX_ADAPTER_ENDPOINT =
  process.env.TRAWEX_ADAPTER_ENDPOINT ||
  "http://localhost:8085/trawex-adapter/1.0.0";
const MASTER_DATA_ENDPOINT =
  process.env.MASTER_DATA_ENDPOINT || "http://localhost:8083/master-data";
const SQUARE_LOGOS_ROOT = "https://www.gstatic.com/flights/airline_logos/70px/";
const WIDE_LOGOS_ROOT = "https://www.skyscanner.net/images/airlines/small/";
const MEDIA_STORAGE_BASE_URL =
  process.env.MEDIA_STORAGE_BASE_URL ||
  "https://storage.cloud.google.com/tripdizer-dev.appspot.com";
const FLIGHT_COST_THRESHOLD = 15000;
const FLIGHT_PROFIT_BELOW_THRESHOLD = 300;
const FLIGHT_PROFIT_ABOVE_THRESHOLD = 500;
/**
 * retrieve options of transportation between cities and countries for a package
 * Retrieve the recommended transportation options (flights or others) for a package, between the cities choosen by the client.
 *
 * language String
 * transportationSearchRequest TransportationSearchRequest
 * returns transportationLegOffers
 **/
exports.searchTransportation = function (language, transportationSearchRequest) {
  return new Promise(async function (resolve, reject) {

    // change JS date to moments
    let departureMoment = new moment(transportationSearchRequest.departure);

    let multiCitySearchRequest = {
      numberOfAdults: transportationSearchRequest.numberOfAdults,
      numberOfChildren: transportationSearchRequest.numberOfChildren,
      numberOfInfants: transportationSearchRequest.numberOfInfants,
      tripSegments: [
        {
          cityIata: transportationSearchRequest.origin,
          arrivalDate: departureMoment.format('YYYY-MM-DD'),
          leavingDate: departureMoment.format('YYYY-MM-DD'),
          cityName: transportationSearchRequest.origin,
          countryIso: transportationSearchRequest.origin,
        }
      ]
    };

    // create a trip segment for each city
    for (let i = 0; i < transportationSearchRequest.citiesSequence.length; i++) {
      let newTripSegment = {
        cityIata: transportationSearchRequest.citiesSequence[i].cityIata,
        arrivalDate: departureMoment.format('YYYY-MM-DD'),
        cityName: transportationSearchRequest.citiesSequence[i].cityIata,
        countryIso: transportationSearchRequest.citiesSequence[i].countryIso,
        leavingDate: departureMoment.add(transportationSearchRequest.citiesSequence[i].numberOfNights, "Days").format('YYYY-MM-DD')
      }
      multiCitySearchRequest.tripSegments.push(newTripSegment);
      departureMoment = moment(newTripSegment.leavingDate);
    }

    request.post(
      { url: TRAWEX_ADAPTER_ENDPOINT + "/flights/search/multi-city", body: multiCitySearchRequest, headers: { 'language': language }, json: true },
      async function (err, httpResponse, body) {
        if (err || httpResponse.statusCode != 200) {
          // reject(err || httpResponse.statusMessage);
          console.error(
            "Failed to retrieve flight offers for request: " + JSON.stringify(transportationSearchRequest)
          );
          console.error(err || body.error || httpResponse.statusMessage);
          reject({ error: err || body.error || httpResponse.statusMessage });
        } else {
          if (body.error) {
            reject(body);
          } else {
            let flightOffers = body; // offers coming form flights adapter
            if (flightOffers) {
              // flightOffers = filterFlightOffers(flightOffers);
              for (var i = 0; i < flightOffers.length; i++) {
                for (var j = 0; j < flightOffers[i].flightLegs.length; j++) {
                  var flightLeg = flightOffers[i].flightLegs[j];
                  flightLeg.origin = await getCityByIata(flightLeg.origin);
                  flightLeg.destination = await getCityByIata(flightLeg.destination);
                }
              }
              resolve({ flightOffers: flightOffers });
            } else {
              console.warn(
                "No flight offers found for request: " + JSON.stringify(transportationSearchRequest)
              );
              resolve({ flightOffers: {} });
            }
          }
        }
      }
    );
  });
};

function filterFlightOffers(flightOffers) {
  let filteredflightOffers = [];
  for (let i = 0; i < flightOffers.length; i++) {
    let currentOffer = flightOffers[i];
    if (currentOffer.transitDurationInMinutes < MAX_TRANSIT_TIME_IN_MINUTES) {
      filterFlightOffers.push(currentOffer);
    }
    if (filteredflightOffers.length == MAX_NUMBER_OF_OFFERS_PER_LEG) {
      break;
    }
  }
  return filteredflightOffers;
}

var citiesCache = {};
function getCityByIata(cityIata, language) {
  return new Promise(function (resolve, reject) {

    if (citiesCache[cityIata] != null) {
      resolve(citiesCache[cityIata]);
    }
    var cityUrl = MASTER_DATA_ENDPOINT + "/city/" + cityIata;

    request.get({ url: cityUrl, json: true, qs: { lang: language } }, function (
      error,
      response,
      city
    ) {
      if (error) {
        reject(error);
      } else if (response.statusCode != 200) {
        reject(response.statusMessage);
      } else {
        citiesCache[cityIata] = {
          iataCode: city != null ? city.iataCode : cityIata,
          name:
            city != null
              ? language == "ar"
                ? city.arName
                : city.enName
              : null,
          latitude: city != null ? city.lat : null,
          longitude: city != null ? city.lng : null
        }
        resolve(citiesCache[cityIata]);
      }
    });
  });
}
