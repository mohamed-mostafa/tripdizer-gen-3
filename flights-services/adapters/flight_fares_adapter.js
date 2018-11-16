var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: 'dNt2lgOTmxgQ6UMSiEHYxetOxsbEgqp1',
  clientSecret: 'a4u1TaQUSdKO4mm6'
});

var getAirlineNameByIATACode = function(iataCode) {
	amadeus.referenceData.airlines.get({
	  airlineCodes: iataCode
	}).then(function(response){
	  console.log(response.data);
	}).catch(function(responseError){
	  console.log(responseError);
	});
}

var getFamilyFaresForCarriers = function(originCityIata, destinationCityIata, departureDate, returnDate, carriersCommaSeparatedIata) {
	var amadeusRequest = {
		origin: originCityIata,
		destination: destinationCityIata,
		departureDate: departureDate,
		returnDate: returnDate,
		currency: "EGP",
		adults: 1,
		infants: 1,
		children: 1,
		includeAirlines: carriersCommaSeparatedIata
	};
	if (returnDate == null) delete amadeusRequest.returnDate;

	return new Promise(function(resolve, reject) {
		amadeus.shopping.flightOffers.get(amadeusRequest).then(response => {
		var flightFares = [];
		var offers = response.result.data; // offers
		offers.forEach (offer => {
			offer.offerItems.forEach(offerItem => { // usually will be one item
				var flightFare = {
					type: returnDate == null ? "ONEWAY" : "ROUNDTRIP",
					
					adultPrice: offerItem.pricePerAdult.total,
					childPrice: offerItem.pricePerChild.total,
					infantPrice: offerItem.pricePerInfant.total,
					
					departureFromOrigin: offerItem.services[0].segments[0].flightSegment.departure.iataCode,
					departureFromOriginAt: offerItem.services[0].segments[0].flightSegment.departure.at,
					arrivalAtDestination: offerItem.services[0].segments[offerItem.services[0].segments.length - 1].flightSegment.arrival.iataCode,
					arrivalAtDestinationAt: offerItem.services[0].segments[offerItem.services[0].segments.length - 1].flightSegment.arrival.at,
					
					// return data, if needed
					departureFromDestination: returnDate != null ? offerItem.services[1].segments[0].flightSegment.departure.iataCode : null,
					departureFromDestinationAt: returnDate != null ? offerItem.services[1].segments[0].flightSegment.departure.at : null,
					arrivalAtOrigin: returnDate != null ? offerItem.services[1].segments[offerItem.services[1].segments.length - 1].flightSegment.arrival.iataCode : null,
					arrivalAtOriginAt: returnDate != null ? offerItem.services[1].segments[offerItem.services[1].segments.length - 1].flightSegment.arrival.at : null,
				}
				flightFares.push(flightFare);
			});
		});
		flightFares.sort((a, b) => parseFloat(a.adultPrice) - parseFloat(b.adultPrice));
		resolve(flightFares);
		// fs.writeFileSync('./flightFares-roundtrip.json', JSON.stringify(flightFares) , 'utf-8'); 
	}).catch(responseError => {
		reject(responseError);
	})
	});
	
}

exports.getFamilyFaresForCarriers = getFamilyFaresForCarriers;

// to get average flights cost per month
	// use the carrier provided by the agents for each FLIGHT in each destination
	// fire 4 requests for each flight
		// departure weekend, return weekend
		// departure weekend, return weekday
		// departure weekday, return weekday
		// departure weekday, return weekend
		// carrier is the one specified in the FLIGHT
		// whether it has a return or not is also specified in the flight
		// use departing from as the origin city iataCode
		// use the arriving to as the destination city iataCode
	// get the avarage of the 4 flights
	// get the average of the layovers for the departure and return flights

	// OR

	// use the coutries in each destination to decide the origin/destination pairs yourself
		// consider countries are cities, and use the city iataCode
		// always assume customer will travel to first city from CAI and return from the last city to CAI
		// get return flights between first and last city, then get oneway flights for each city in between
		// in addition to 'order' of city in the trip, add the preferred carrier iataCode