var flightsDao = require('../dataaccess/iternary_flights_dao.js');
var dateUtilities = require('./date_utilities.js');
var flightFaresAdapter = require('../adapters/flight_fares_adapter.js');
var fs = require('fs');

var updateAllFlightsCosts = async function() {
	// var months = [1,2,3,4,5,6,7,8,9,10,11,12];
	var months = [1, 2, 3];

	flightsDao.getAllFlights(function(flights) {
		flights.forEach((flight, flightIndex) => {
			// each flight should have a maximum of 12 months * 8 dates per month = 96 API calls
			// these calls should be done over 24 seconds
			setTimeout(() => {
				months.forEach((month, monthIndex) => {
					// each month has 8 dates (8 API calls), so it should take 2 seconds
					setTimeout(() => {
						var dates = [];
						if (flight["return"] == 0) { // one way flight
							dates = dateUtilities.getDatePairsForMonth(month);
						} else { // return flight
							dates = dateUtilities.getDatesForMonth(month);
						}
						dates.forEach((date, dateIndex) => {
							// each date should have 1/4 seconds to execute
							setTimeout(() => {
								var flightFares = flightFaresAdapter.getFamilyFaresForCarriers(flight.origin, flight.destination, date.departureDate, date.returnDate, flight.carrierIata)
								.then(flightFares => {
									var monthName = monthsMap[month+""];
									var infant = 0; var kid = 0; var adult = 0;
									flightFares.forEach(flightFare => {
										infant += parseInt(flightFare.infantPrice);
										kid += parseInt(flightFare.childPrice);
										adult += parseInt(flightFare.adultPrice);
									});
									flight["i"+monthName] = infant / flightFares.length;
									flight["k"+monthName] = kid / flightFares.length;
									flight["a"+monthName] = adult / flightFares.length;
									// update the flight. Yes, this happens after each date, so the same month in the same flight will happen incrementally, but I can't guarantee to do it when the setTimeout of the flight ends, as its internal calls might not be ended by then !
									flightsDao.update(flight, function() {
										console.log("Flight updated successfully!");
									}, function(err) {
										console.log("Flight update failed!");
										console.log(err);
									});
								}).catch(err => {
									console.log(extractAmadeusError(err));
								})
							}, 250 * dateIndex * 3); // 1/4 seconds / datePair (API call) (all X 3 for safety)
						})
					}, 2 * 1000 * monthIndex * 3); // 2 seconds / month (all X 3 for safety)
				})
			}, 24 * 1000 * flightIndex * 3); // 24 seconds / flight (all X 3 for safety)
		})

	}, function(err) {
		console.log(err);
	})
};

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
				errorMessage = JSON.stringify(error);
			}
		}
	} else {
		errorMessage = JSON.stringify(error);
	}
	return errorMessage;
}

exports.updateAllFlightsCosts = updateAllFlightsCosts;