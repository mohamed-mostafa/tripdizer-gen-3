/**
 * The dataaccess methods of hws
 */

var daoUtilities = require('./hws_dao_utilities.js');

var getById = function(id, lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM Professions WHERE id = ?', [id], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log('An error occurred while trying to find a profession with id ' + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the profession attributes
						var profession = {
							id: rows[0].Id,
							enName: rows[0].EN_Name,
							arName: rows[0].AR_Name,
						};

						if (lang) {
							profession.name = profession[lang.toLowerCase() + 'Name'];
							delete profession['enName'];
							delete profession['arName'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(profession);
					} else {
						// no professions is found with the id
						connection.end();
						onSuccess(null);
					}
				}
			});
		}
	});
};

var create = function(profession, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the profession and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log('An error occurred while trying to begin a database transaction');
					console.log(err);
					onFailure(err);
				} else {
					connection.query(
						'INSERT INTO Professions (EN_Name, AR_Name) values (?, ?)',
						[profession.enName, profession.arName],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.log('An error occurred while trying to create the new profession: ' + profession.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the insertId to the profession
								profession.id = result.insertId;

								// end the connection
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(profession);
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a et profession object if successful
//calls the onFailure with an err object in case of technical error
var update = function(profession, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the profession and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log('An error occurred while trying to begin a database transaction');
					console.log(err);
					onFailure(err);
				} else {
					connection.query(
						'UPDATE Professions SET EN_Name = ?, AR_Name = ? WHERE Id = ?',
						[profession.enName, profession.arName, profession.id],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.log('An error occurred while trying to update the existing profession: ' + profession.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(profession);
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAll = function(lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM Professions ORDER BY Id DESC', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log('An error occurred while list all professions');
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var professions = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var profession = {
							id: rows[i].Id,
							enName: rows[i].EN_Name,
							arName: rows[i].AR_Name,
						};
						if (lang) {
							profession.name = profession[lang.toLowerCase() + 'Name'];
							delete profession['enName'];
							delete profession['arName'];
						}
						professions.push(profession);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(professions);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
