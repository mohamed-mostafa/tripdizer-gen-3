/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./dao_utilities.js");

var getById = function (id, lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			var iternaryQuery = `SELECT * FROM iternary WHERE id = ${connection.escape(id)};`;
			var flightQuery = `SELECT ifl.*, mpa.JAN aJAN, mpa.FEB aFEB, mpa.MAR aMAR, mpa.APR aAPR, mpa.MAY aMAY, mpa.JUN aJUN, mpa.JUL aJUL, mpa.AUG aAUG, mpa.SEP aSEP, mpa.OCT aOCT, mpa.NOV aNOV, mpa.DEC aDEC, 
			mpk.JAN kJAN, mpk.FEB kFEB, mpk.MAR kMAR, mpk.APR kAPR, mpk.MAY kMAY, mpk.JUN kJUN, mpk.JUL kJUL, mpk.AUG kAUG, mpk.SEP kSEP, mpk.OCT kOCT, mpk.NOV kNOV, mpk.DEC kDEC,
			mpi.JAN iJAN, mpi.FEB iFEB, mpi.MAR iMAR, mpi.APR iAPR, mpi.MAY iMAY, mpi.JUN iJUN, mpi.JUL iJUL, mpi.AUG iAUG, mpi.SEP iSEP, mpi.OCT iOCT, mpi.NOV iNOV, mpi.DEC iDEC
			FROM iternary i join iternary_flight ifl on i.Id = ifl.Iternary_id join month_price mpa on mpa.id = ifl.adult_price join month_price mpk on mpk.id = ifl.kid_price join month_price mpi on mpi.id = ifl.infant_price WHERE i.Id = ${connection.escape(id)};`;
			connection.query(iternaryQuery + flightQuery, [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a itinerary with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows[0].length != 0) {
						// populate the itinerary attributes
						var itinerary = {
							id: rows[0][0].Id,
							en_name: rows[0][0].EN_Name,
							en_description: rows[0][0].EN_Description,
							ar_name: rows[0][0].AR_Name,
							ar_description: rows[0][0].AR_Description,
							flights: rows[1]
						};
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(itinerary);
					} else {
						// no itinerary is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};

//calls the onSuccess with a itinerary object if successful
//calls the onFailure with an err object in case of technical error
var update = function (itinerary, onSuccess, onFailure) {
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
					var flightsQuery = `DELETE FROM month_price WHERE id in (SELECT adult_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)}) OR id in (SELECT kid_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)}) OR id in (SELECT infant_price FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)});DELETE FROM iternary_flight WHERE Iternary_Id = ${connection.escape(itinerary.id)};`;
					for (let i = 0; i < itinerary.flights.length; i++) {
						if (itinerary.flights[i].departing_from && itinerary.flights[i].arriving_to) {
							flightsQuery += `INSERT INTO month_price VALUES (0, ${connection.escape(itinerary.flights[i].aJAN || 0)}, ${connection.escape(itinerary.flights[i].aFEB || 0)}, ${connection.escape(itinerary.flights[i].aMAR || 0)}, ${connection.escape(itinerary.flights[i].aAPR || 0)}, ${connection.escape(itinerary.flights[i].aMAY || 0)}, ${connection.escape(itinerary.flights[i].aJUN || 0)}, ${connection.escape(itinerary.flights[i].aJUL || 0)}, ${connection.escape(itinerary.flights[i].aAUG || 0)}, ${connection.escape(itinerary.flights[i].aSEP || 0)}, ${connection.escape(itinerary.flights[i].aOCT || 0)}, ${connection.escape(itinerary.flights[i].aNOV || 0)}, ${connection.escape(itinerary.flights[i].aDEC || 0)})`;
							flightsQuery += `, (0, ${connection.escape(itinerary.flights[i].kJAN || 0)}, ${connection.escape(itinerary.flights[i].kFEB || 0)}, ${connection.escape(itinerary.flights[i].kMAR || 0)}, ${connection.escape(itinerary.flights[i].kAPR || 0)}, ${connection.escape(itinerary.flights[i].kMAY || 0)}, ${connection.escape(itinerary.flights[i].kJUN || 0)}, ${connection.escape(itinerary.flights[i].kJUL || 0)}, ${connection.escape(itinerary.flights[i].kAUG || 0)}, ${connection.escape(itinerary.flights[i].kSEP || 0)}, ${connection.escape(itinerary.flights[i].kOCT || 0)}, ${connection.escape(itinerary.flights[i].kNOV || 0)}, ${connection.escape(itinerary.flights[i].kDEC || 0)})`;
							flightsQuery += `, (0, ${connection.escape(itinerary.flights[i].iJAN || 0)}, ${connection.escape(itinerary.flights[i].iFEB || 0)}, ${connection.escape(itinerary.flights[i].iMAR || 0)}, ${connection.escape(itinerary.flights[i].iAPR || 0)}, ${connection.escape(itinerary.flights[i].iMAY || 0)}, ${connection.escape(itinerary.flights[i].iJUN || 0)}, ${connection.escape(itinerary.flights[i].iJUL || 0)}, ${connection.escape(itinerary.flights[i].iAUG || 0)}, ${connection.escape(itinerary.flights[i].iSEP || 0)}, ${connection.escape(itinerary.flights[i].iOCT || 0)}, ${connection.escape(itinerary.flights[i].iNOV || 0)}, ${connection.escape(itinerary.flights[i].iDEC || 0)});`;
							flightsQuery += 'INSERT INTO iternary_flight (`iternary_id`, `type`, `departing_from`, `arriving_to`, `departure_time`, `arrival_time`, `lay_over`, `airline_name`, `return`, `return_departure_time`, `return_arrival_time`, `return_lay_over`, `adult_price`, `kid_price`, `infant_price`) VALUES ';
							flightsQuery += `(${connection.escape(itinerary.id)}, ${connection.escape(itinerary.flights[i].type || 0)}, ${connection.escape(itinerary.flights[i].departing_from || "")}, ${connection.escape(itinerary.flights[i].arriving_to || "")}, ${connection.escape(itinerary.flights[i].departure_time || "")}, ${connection.escape(itinerary.flights[i].arrival_time || "")}, ${connection.escape(itinerary.flights[i].lay_over || "")}, ${connection.escape(itinerary.flights[i].airline_name || "")}, ${connection.escape(itinerary.flights[i].return || itinerary.flights[i].return == 1 ? 1 : 0)}, ${connection.escape(itinerary.flights[i].return_departure_time || "")}, ${connection.escape(itinerary.flights[i].return_arrival_time || "")}, ${connection.escape(itinerary.flights[i].return_lay_over || "")}, (SELECT id FROM month_price ORDER BY id DESC LIMIT 2, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 1, 1), (SELECT id FROM month_price ORDER BY id DESC LIMIT 0, 1));`;
						}
					}
					connection.query(flightsQuery, [], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing itinerary: " + itinerary.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(itinerary);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAllLong = function (onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT Id AS id FROM hws.iternary', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all itineraries");
					console.log(err);
					onFailure(err);
				} else {
					// end the connection
					connection.end();
					const itineraryFuncs = [];
					for (let i = 0; i < rows.length; i++) {
						itineraryFuncs.push(new Promise((resolve, reject) => getById(rows[i].id, 'EN', itinerary => resolve(itinerary), err => reject(err))));
					}
					// call the callback function provided by the caller, and give it the response
					Promise.all(itineraryFuncs).then(itineraries => {
						onSuccess(itineraries);
					});
				}
			});
		}
	});
};

exports.getById = getById;
exports.update = update;
exports.getAllLong = getAllLong;