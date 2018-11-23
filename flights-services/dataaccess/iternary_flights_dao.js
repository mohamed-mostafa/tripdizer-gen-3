/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./dao_utilities.js");

//calls the onSuccess with a itinerary object if successful
//calls the onFailure with an err object in case of technical error
var update = function (flight, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the itinerary and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					// the flight object here has only the updated months, so we have to be careful when we build the query not to erase existing prices
					var flightsAdultPricesUpdateStatement = 'UPDATE month_price SET '
					+ 'JAN = ' + (flight.aJAN || 'JAN') + ' , ' 
					+ 'FEB = ' + (flight.aFEB || 'FEB') + ' , '
					+ 'MAR = ' + (flight.aMAR || 'MAR') + ' , '
					+ 'APR = ' + (flight.aAPR || 'APR') + ' , '
					+ 'MAY = ' + (flight.aMAY || 'MAY') + ' , '
					+ 'JUN = ' + (flight.aJUN || 'JUN') + ' , '
					+ 'JUL = ' + (flight.aJUL || 'JUL') + ' , '
					+ 'AUG = ' + (flight.aAUG || 'AUG') + ' , '
					+ 'SEP = ' + (flight.aSEP || 'SEP') + ' , '
					+ 'OCT = ' + (flight.aOCT || 'OCT') + ' , '
					+ 'NOV = ' + (flight.aNOV || 'NOV') + ' , '
					+ '`DEC` = ' + (flight.aDEC || '`DEC`') + ' WHERE id = ' + flight.adultMonthPriceId + ';';

					var flightsChildPricesUpdateStatement = 'UPDATE month_price SET '
					+ 'JAN = ' + (flight.kJAN || 'JAN') + ' , '
					+ 'FEB = ' + (flight.kFEB || 'FEB') + ' , '
					+ 'MAR = ' + (flight.kMAR || 'MAR') + ' , '
					+ 'APR = ' + (flight.kAPR || 'APR') + ' , '
					+ 'MAY = ' + (flight.kMAY || 'MAY') + ' , '
					+ 'JUN = ' + (flight.kJUN || 'JUN') + ' , '
					+ 'JUL = ' + (flight.kJUL || 'JUL') + ' , '
					+ 'AUG = ' + (flight.kAUG || 'AUG') + ' , '
					+ 'SEP = ' + (flight.kSEP || 'SEP') + ' , '
					+ 'OCT = ' + (flight.kOCT || 'OCT') + ' , '
					+ 'NOV = ' + (flight.kNOV || 'NOV') + ' , '
					+ '`DEC` = ' + (flight.kDEC || '`DEC`') + ' WHERE id = ' + flight.childMonthPriceId + ';';

					var flightsInfantPricesUpdateStatement = 'UPDATE month_price SET '
					+ 'JAN = ' + (flight.iJAN || 'JAN') + ' , '
					+ 'FEB = ' + (flight.iFEB || 'FEB') + ' , '
					+ 'MAR = ' + (flight.iMAR || 'MAR') + ' , '
					+ 'APR = ' + (flight.iAPR || 'APR') + ' , '
					+ 'MAY = ' + (flight.iMAY || 'MAY') + ' , '
					+ 'JUN = ' + (flight.iJUN || 'JUN') + ' , '
					+ 'JUL = ' + (flight.iJUL || 'JUL') + ' , '
					+ 'AUG = ' + (flight.iAUG || 'AUG') + ' , '
					+ 'SEP = ' + (flight.iSEP || 'SEP') + ' , '
					+ 'OCT = ' + (flight.iOCT || 'OCT') + ' , '
					+ 'NOV = ' + (flight.iNOV || 'NOV') + ' , '
					+ '`DEC` = ' + (flight.iDEC || '`DEC`') + ' WHERE id = ' + flight.infantMonthPriceId + ';';
					var flightQuery = flightsAdultPricesUpdateStatement  + flightsChildPricesUpdateStatement  + flightsInfantPricesUpdateStatement;
					console.log(flightQuery);
					connection.query(flightQuery, [], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing flight: " + flight.id);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(flight);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAllFlights = function (onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM hws.iternary_flight', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all flights");
					console.log(err);
					onFailure(err);
				} else {
					// end the connection
					connection.end();
					var flights = [];
					rows.forEach(row => {
						var flight = {
							id: row.id,
							origin: row.departing_from,
							destination: row.arriving_to,
							"return": row["return"],
							carrierIata: row.airline_name,
							adultMonthPriceId: row.adult_price,
							childMonthPriceId: row.kid_price,
							infantMonthPriceId: row.infant_price
						};
						flights.push(flight);
					})
					onSuccess(flights);	
				}
			});
		}
	});
};

exports.update = update;
exports.getAllFlights = getAllFlights;