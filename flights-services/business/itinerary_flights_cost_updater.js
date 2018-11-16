var itenerariesDao = require('../dataaccess/itineraries_dao.js');
var dateUtilities = require('./date_utilities.js');
var flightFaresAdapter = require('../adapters/flight_fares_adapter.js');
var fs = require('fs');

var updateAllMonthPricesForAllFlightsForAllIteneraries = function() {
	itenerariesDao.getAllLong(function(iteneraries) {
		iteneraries.forEach((itenerary, index) => {
			if (index != 1) return ; // for testing purpose
			// wait 1 second between each itenerary and the next
			setTimeout(() => {
				console.log(itenerary.en_name);
				updateAllMonthPricesForAllFlightsForItenerary(itenerary);
			}, 1000 * 180 * index); // 180 seconds for each itenerary 
		});		
	}, function(error) {
		console.log(error);
	})
}

var updateAllMonthPricesForAllFlightsForItenerary = function(itenerary) {
	var flights = itenerary.flights;
	flights.forEach((flight, index) => {
		// wait 1 second between each flight and the next 
		 setTimeout(() => {
		 	console.log("-- flight " + flight.departing_from + " => " + flight.arriving_to + " => " + flight.airline_name);
		 	updateAllMonthPricesForFlightForItenerary(itenerary, flight);
		 }, 1000 * 60 * index); // 60 seconds for each flight
	});
}

var updateAllMonthPricesForFlightForItenerary = function(itenerary, flight) {
	// var months = [1,2,3,4,5,6,7,8,9,10,11,12];
	var months = [1,2,3];
	months.forEach((month, index) => {
		// wait 1 second between each month and the next 
		 setTimeout(() => {
		 	console.log("---- month " + month);
		 	udpateMonthPricesForFlightForItenerary(itenerary, flight, month);
		 }, 1000 * 10 * index); // 10 seconds for each month
	});
};

var udpateMonthPricesForFlightForItenerary = function(itenerary, flight, month) {
	var dates = [];
	if (flight["return"] == 0) { // one way flight
		dates = dateUtilities.getDatePairsForMonth(month);
	} else { // return flight
		dates = dateUtilities.getDatesForMonth(month);
	}

	dates.forEach((date, index) => {
		// wait 1 second between each date or datePair and the next
		setTimeout(() => {
			console.log("------ " + date.departureDate + " - " + date.type);
			var origin = flight.departing_from;
			var destination = flight.arriving_to;
			var carrierIata = flight.airline_name;
			flightFaresAdapter.getFamilyFaresForCarriers(origin, destination, date.departureDate, date.returnDate, carrierIata)
			.then(flightFares => {
				var fileName = itenerary.en_name + "-" + flight.departing_from + "-" + flight.arriving_to + "-month" + month; 
				// console.log("received response and writing it to " + fileName);
				fs.writeFileSync('./' + fileName + ".json", JSON.stringify(flightFares, null, '\t') , 'utf-8'); 
			}).catch(error => {
				console.log("-------- " + extractAmadeusError(error));
			});
		}, 1000 * index); // 1 second for each date / date pair. this will make us do 1 request per second. the limit is 5 per second so we should be safe
	})
}

var extractAmadeusError = function(error) {
	var errorMessage = "";
	if (error) {
		if (error.description) {
			if (error.description.length > 0) {
				error.description.forEach(description => {
					var errorParameter = "";
					if (description.source && description.source.parameter) errorParameter = description.source.parameter; 
					errorMessage += "[" + description.detail + " - " + errorParameter + "] ";
				})
			} else {
				errorMessage = "Unknown Error";
			}
		}
	} else {
		errorMessage = "Unknown Error";
	}
	return errorMessage;
}

exports.updateAllMonthPricesForAllFlightsForAllIteneraries = updateAllMonthPricesForAllFlightsForAllIteneraries;