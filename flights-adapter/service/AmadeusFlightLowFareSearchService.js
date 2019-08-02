'use strict';

var Amadeus = require('amadeus');
var dateFormat = require('dateformat');
const humanizeDuration = require('humanize-duration');
const retry = require('async-retry')

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


var amadeus = new Amadeus({
	clientId: process.env.AMADEUS_CLIENT_ID || 'CuQTXfZihGnlCrPIXKJIgXO21gqi7VHU',
	clientSecret: process.env.AMADEUS_CLIENT_SECRET || 'DTwStDfZ4W7VJNeC',
	hostname: 'production'
});

/**
 * searches flights from origin to destination on specific dates for number of travelers
 * By passing in the appropriate options, you can search for flights
 *
 * origin String The IATA code of the origin city or airport
 * destination String The IATA code of the destination city or airport
 * departure date The desired departure date
 * numberOfAdults BigDecimal 
 * _return date The desired return date - if not provided, then it a one-way flight (optional)
 * returnOrigin String The IATA code of the ciry or airport to return from - if not provided, the destination city/airport will be considered the returnOrigin (optional)
 * numberOfChildren BigDecimal  (optional)
 * numberOfInfants BigDecimal  (optional)
 * returns inline_response_200
 **/
exports.searchFlights = function (origin, destination, departure, numberOfAdults, _return, numberOfChildren, numberOfInfants) {
	return new Promise(function (resolve, reject) {
		var amadeusRequest = {
			origin: origin,
			destination: destination,
			departureDate: dateFormat(departure, 'yyyy-mm-dd'),
			returnDate: _return != null ? dateFormat(_return, 'yyyy-mm-dd') : null,
			currency: "EGP",
			adults: numberOfAdults,
			infants: numberOfInfants,
			children: numberOfChildren
		};
		if (_return == null) delete amadeusRequest.returnDate;

		faultTolerantAmadeusFlighLowFareSearch(amadeusRequest).then(response => {
			var flightOffers = [];
			var offers = response.result.data; // array of offers
			var carriersMap = response.result.dictionaries.carriers;
			var locationsMap = response.result.dictionaries.locations;
			try {
				offers.forEach(offer => {
					offer.offerItems.forEach(offerItem => { // usually will be one item
						var flightOffer = {
							price: offerItem.price.total,
							currency: amadeusRequest.currency,
							originCityIata: amadeusRequest.origin,
							destinationCityIata: amadeusRequest.destination,
							isOneWay: amadeusRequest.returnDate == null,
							flightLegs: []
						}
						offerItem.services.forEach(service => {
							// each service is a flight leg
							var flightDurationInMillis = new Date(service.segments[service.segments.length - 1].flightSegment.arrival.at).getTime() - new Date(service.segments[0].flightSegment.departure.at).getTime();
							var transitDurationInMillis = calculateTotalTransit(service.segments);
							var flightLeg = {
								origin: service.segments[0].flightSegment.departure.iataCode,
								destination: service.segments[service.segments.length - 1].flightSegment.arrival.iataCode,
								totalDurationInWords: shortEnglishHumanizer(flightDurationInMillis),
								transitDurationInWords: shortEnglishHumanizer(transitDurationInMillis),
								totalDurationInMinutes: flightDurationInMillis / (1000 * 60),
								transitDurationInMinutes: transitDurationInMillis / (1000 * 60),
								segments: []
							};
							flightLeg.carrier = {
								iataCode: service.segments[0].flightSegment.carrierCode,
								name: carriersMap[service.segments[0].flightSegment.carrierCode]
							};

							service.segments.forEach(segment => {
								var segmentDurationInMillis = new Date(segment.flightSegment.arrival.at).getTime() - new Date(segment.flightSegment.departure.at).getTime();
								var flightLegSegment = {
									origin: segment.flightSegment.departure.iataCode,
									destination: segment.flightSegment.arrival.iataCode,
									originDetails: locationsMap[segment.flightSegment.departure.iataCode] == null ? null : locationsMap[segment.flightSegment.departure.iataCode].detailedName + " " + locationsMap[segment.flightSegment.departure.iataCode].subType,
									destinationDetails: locationsMap[segment.flightSegment.arrival.iataCode] == null ? null : locationsMap[segment.flightSegment.arrival.iataCode].detailedName + " " + locationsMap[segment.flightSegment.arrival.iataCode].subType,
									departure: segment.flightSegment.departure.at,
									"return": segment.flightSegment.arrival.at,
									durationInWords: shortEnglishHumanizer(segmentDurationInMillis),
									durationInMinutes: segmentDurationInMillis / (1000 * 60),
									aircraftCode: segment.flightSegment.aircraft.code
								}
								flightLeg.segments.push(flightLegSegment);
							});
							flightOffer.flightLegs.push(flightLeg);
						});
						flightOffers.push(flightOffer);
					});
				});
				flightOffers = flightOffers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).filter(flightOffer => flightOffer.flightLegs && flightOffer.flightLegs.length > 0 && flightOffer.flightLegs[0].segments[0].aircraftCode != "TRN");
			} catch (err) {
				reject(err);
			}
			resolve(flightOffers);
		}).catch(responseError => {
			console.error("The following error occurred while calling amadeus with request: " + amadeusRequest);
			console.error(responseError);
			reject(responseError);
		})
	});
}

var faultTolerantAmadeusFlighLowFareSearch = function (amadeusRequest) {
	return new Promise((resolve, reject) => {
		var opts = {
			retries: 10,
			minTimeout: 50,
			factor: 2
		}
		retry(async () => {
			try {
				console.log("Requesting flights from amadeus at: " + new Date());
				var response = await amadeus.shopping.flightOffers.get(amadeusRequest);
				resolve(response);
			} catch (err) {
				if (err.response.statusCode == 429) { // only retry in the case of TOO MANY REQUESTS error
					console.warn(err.response.statusCode + " - response coming from amadeus - Retrying ...");
				} else {
					console.error(err.response.statusCode + " response coming from amadeus - Aborting");
					console.error("The following error occurred while calling amadeus with request: " + amadeusRequest);
					console.error(err);
					reject(err);
				}
			}
		}, opts);
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
			var transitBetween2Segments = new Date(nextSegment.flightSegment.departure.at).getTime() - new Date(thisSegment.flightSegment.arrival.at).getTime();
			totalTransit += transitBetween2Segments;
		}
		return totalTransit;
	}
}