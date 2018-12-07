var updater = require('../business/itinerary_flights_cost_updater.js');
var flightsFaresAdapter = require('../adapters/flight_fares_adapter.js');
var fs = require('fs');

// var test2 = function() {
// 	flightsFaresAdapter.getFamilyFaresForRoundTripFlights("CAI", "AMS", "2018-12-12", "2018-12-18", "LH")
// 	.then(flightFares => {
// 		fs.writeFileSync('./flightFares-roundtrip.json', JSON.stringify(flightFares) , 'utf-8'); 
// 	}).catch(error => {
// 		console.log(error);
// 	});
// }
console.log("Starting at: " + new Date().toString());
updater.updateAllFlightsCosts();
// flightsFaresAdapter.getFamilyFaresForCarriers("CAI", "CMB", "2018-12-19", null, "A3")
// .then(flightFares => {
// 		fs.writeFileSync('./flightFares.json', JSON.stringify(flightFares) , 'utf-8'); 
// 	}).catch(error => {
// 		console.log(error.description[0].detail + " - " + error.description[0].source.parameter);
// 	});
// setTimeout(test2, 5000);

// flightsFaresAdapter.getFamilyFaresForCarriers("KUL", "HKT", "2018-12-12", "2018-12-18", null)
// 			.then(flightFares => {
// 				// console.log(flightFares);
// 			}).catch(err => {
// 				console.log(err);
// 			})