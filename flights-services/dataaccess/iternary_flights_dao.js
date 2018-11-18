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
					var flightsQuery = `DELETE FROM month_price WHERE id in (SELECT adult_price FROM iternary_flight WHERE id = ${connection.escape(flight.id)}) OR id in (SELECT kid_price FROM iternary_flight WHERE id = ${connection.escape(flight.id)}) OR id in (SELECT infant_price FROM iternary_flight WHERE id = ${connection.escape(flight.id)});`;
					flightsQuery += `INSERT INTO month_price VALUES (0, ${connection.escape(flight.aJAN || 0)}, ${connection.escape(flight.aFEB || 0)}, ${connection.escape(flight.aMAR || 0)}, ${connection.escape(flight.aAPR || 0)}, ${connection.escape(flight.aMAY || 0)}, ${connection.escape(flight.aJUN || 0)}, ${connection.escape(flight.aJUL || 0)}, ${connection.escape(flight.aAUG || 0)}, ${connection.escape(flight.aSEP || 0)}, ${connection.escape(flight.aOCT || 0)}, ${connection.escape(flight.aNOV || 0)}, ${connection.escape(flight.aDEC || 0)})`;
					flightsQuery += `, (0, ${connection.escape(flight.kJAN || 0)}, ${connection.escape(flight.kFEB || 0)}, ${connection.escape(flight.kMAR || 0)}, ${connection.escape(flight.kAPR || 0)}, ${connection.escape(flight.kMAY || 0)}, ${connection.escape(flight.kJUN || 0)}, ${connection.escape(flight.kJUL || 0)}, ${connection.escape(flight.kAUG || 0)}, ${connection.escape(flight.kSEP || 0)}, ${connection.escape(flight.kOCT || 0)}, ${connection.escape(flight.kNOV || 0)}, ${connection.escape(flight.kDEC || 0)})`;
					flightsQuery += `, (0, ${connection.escape(flight.iJAN || 0)}, ${connection.escape(flight.iFEB || 0)}, ${connection.escape(flight.iMAR || 0)}, ${connection.escape(flight.iAPR || 0)}, ${connection.escape(flight.iMAY || 0)}, ${connection.escape(flight.iJUN || 0)}, ${connection.escape(flight.iJUL || 0)}, ${connection.escape(flight.iAUG || 0)}, ${connection.escape(flight.iSEP || 0)}, ${connection.escape(flight.iOCT || 0)}, ${connection.escape(flight.iNOV || 0)}, ${connection.escape(flight.iDEC || 0)});`;
					flightsQuery += `UPDATE iternary_flight SET adult_price = (SELECT id FROM month_price ORDER BY id DESC LIMIT 2, 1) , kid_price = (SELECT id FROM month_price ORDER BY id DESC LIMIT 1, 1) , infant_price = (SELECT id FROM month_price ORDER BY id DESC LIMIT 0, 1);`;
					connection.query(flightsQuery, [], function (err, result) {
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
							carrierIata: row.airline_name
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