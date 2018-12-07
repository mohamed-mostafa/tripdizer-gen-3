var flightsDao = require('../dataaccess/iternary_flights_dao.js');
var dateUtilities = require('./date_utilities.js');
var flightFaresAdapter = require('../adapters/flight_fares_adapter.js');
var fs = require('fs');
var Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  reservoir: 2, // initial value
  reservoirRefreshAmount: 2,
  reservoirRefreshInterval: 1000 // must be divisible by 250
});
const wrapper = limiter.wrap(flightFaresAdapter.getFamilyFaresForCarriers);


var updateAllFlightsCosts = function() {
	flightsDao.getAllFlights(function(flights) {
		flights.forEach(flight => {
			updateFlight(flight);	
		})
	}, function(err) {
		console.log(err);
	})
};

var updateFlight = function(flight) {
	var numberOfMonths = 1;
	try {
		numberOfMonths = parseInt(process.env.MONTHS_AHEAD || 1);
	} catch (err) {
		console.log("Number of months is not valid: " + process.env.MONTHS_AHEAD);
	}
	var months = dateUtilities.getMonthsListStaringCurrentMonth(numberOfMonths);
	months.forEach(month => {
		updateFlightMonth(flight, month);
	});
}

var updateFlightMonth = function(flight, month) {
	var dates = [];
	if (flight["return"] == 0) { // one way flight
		dates = dateUtilities.getDatePairsForMonth(month);
	} else { // return flight
		dates = dateUtilities.getDatesForMonth(month);
	}
	var monthName = monthsMap[month+""];

	dates.forEach((date, index) => { // make this loop synchoronous
			wrapper(flight.origin, flight.destination, date.departureDate, date.returnDate, flight.carrierIata)
			.then(flightFares => {
				console.log("Recieved response for flight " + flight.id + " from " + flight.origin + " to " + flight.destination + " on " + flight.carrierIata + " for month " + monthName);
				var infant = 0; var kid = 0; var adult = 0;
				// sum of prices for all airlines in the current date combination
				flightFares.forEach(flightFare => {
					infant += parseInt(flightFare.infantPrice);
					kid += parseInt(flightFare.childPrice);
					adult += parseInt(flightFare.adultPrice);
				});
				// average of prices for all airlines in the current date combination
				var infantAverageForDateCombination = infant / flightFares.length;
				var kidAverageForDateCombination = kid / flightFares.length;
				var adultAverageForDateCombination = adult / flightFares.length;
				console.log("adultAverageForDateCombination : " + adultAverageForDateCombination);
				// if that average is not zero and not NaN, keep it in the flight object (which is cross-date-combination object)
				// but only when its not zero
				if (adultAverageForDateCombination != 0 && adultAverageForDateCombination != NaN) {
					if (flight.adultPrices == null) {
						flight.adultPrices = [];
						flight.kidPrices = [];
						flight.infantPrices = [];
					}
					// update the flight to include the average of the current date combination (it should contain other averages from other date combinations for the same flight)
					flight.infantPrices.push(infantAverageForDateCombination);
					flight.adultPrices.push(adultAverageForDateCombination);
					flight.kidPrices.push(kidAverageForDateCombination);
				}
				console.log("flight.adultPrices: " + flight.adultPrices);

				// then, recalculate the month price of the flight to include the new average
				
				// first, sum all averages
				flight["a"+monthName] = 0;
				flight["i"+monthName] = 0;
				flight["k"+monthName] = 0;
				flight.adultPrices.forEach(price => {
					flight["a"+monthName] += price;	
				});
				flight.infantPrices.forEach(price => {
					flight["i"+monthName] += price;	
				});
				flight.kidPrices.forEach(price => {
					flight["k"+monthName] += price;	
				});

				// then take their averages
				flight["a"+monthName] = flight["a"+monthName] / flight.adultPrices.length;
				flight["i"+monthName] = flight["i"+monthName] / flight.infantPrices.length;
				flight["k"+monthName] = flight["k"+monthName] / flight.kidPrices.length;

				console.log("flight[a" + monthName + "]: " + flight["a"+monthName]);

				// then, update the flight
				flightsDao.update(flight, () => {}, (err) => {
					console.log("Flight " + flight.id + " update failed!");
					console.log(err);
				});
			}).catch(err => {
				console.log("Recieved error for flight " + flight.id + " from " + flight.origin + " to " + flight.destination + " on " + flight.carrierIata + " for month " + monthName + ": " + extractAmadeusError(err));
			})
	});
}

var monthsMap = {"1": "JAN","2": "FEB","3": "MAR","4": "APR","5": "MAY","6": "JUN","7": "JUL","8": "AUG",
"9": "SEP","10": "OCT","11": "NOV","12": "DEC"}

var extractAmadeusError = function(error) {
	var errorMessage = "";
	if (error) {
		if (error.description) {
			if (error.description.length > 0) {
				error.description.forEach(description => {
					errorMessage += "[" + description.detail;
					if (description.source && description.source.parameter)
						errorMessage += ": " + description.source.parameter;
					errorMessage += "]";
				})
			} else {
				errorMessage = "Unknown Error"; //JSON.stringify(error);
			}
		}
	} else {
		errorMessage = "Unknown Error"; //JSON.stringify(error);
	}
	return errorMessage;
}

exports.updateAllFlightsCosts = updateAllFlightsCosts;