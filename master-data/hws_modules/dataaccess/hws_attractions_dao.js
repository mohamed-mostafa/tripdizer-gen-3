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
			connection.query(
				'SELECT a.* FROM Attractions A WHERE A.Id = ?',
				[id],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while trying to find an attraction with id ' + id);
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						if (rows.length != 0) {
							// populate the attraction attributes
							var attraction = {
								id: rows[0].Id,
								enName: rows[0].EN_Name,
								arName: rows[0].AR_Name,
								enDescription: rows[0].EN_Description,
								arDescription: rows[0].AR_Description,
								enCategory: rows[0].EN_Category,
								arCategory: rows[0].AR_Category,
								thumbnail: rows[0].thumbnail,
								priority: rows[0].Priority,
								cityId: rows[0].City_Id,
								active: rows[0].Active
							};

							if (lang) {
								attraction.name = attraction[lang.toLowerCase() + 'Name'];
								attraction.description = attraction[lang.toLowerCase() + 'Description'];
							}

							// end the connection
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(attraction);
						} else {
							// no attraction is found with the id
							connection.end();
							onSuccess(null);
						}
					}
				}
			);
		}
	});
};

var create = function(attraction, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the attraction
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
						'INSERT INTO Attractions (EN_Name, EN_Description, AR_Name, AR_Description, EN_Category, AR_Category, Thumbnail, Priority, City_Id) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
						[
							attraction.enName,
							attraction.enDescription,
							attraction.arName,
							attraction.arDescription,
							attraction.enCategory,
							attraction.arCategory,
							attraction.thumbnail,
							attraction.priority,
							attraction.cityId
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.log('An error occurred while trying to create the new attraction: ' + attraction.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the Id to the attraction
								attraction.id = result.insertId;
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(attraction);
								
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a attraction object if successful
//calls the onFailure with an err object in case of technical error
var update = function(attraction, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to update the attraction
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
						'UPDATE Attractions SET City_Id = ?, EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, EN_Category = ?, AR_Category = ?, Thumbnail = ?, Priority = ? WHERE Id = ?',
						[
							attraction.cityId,
							attraction.enName,
							attraction.enDescription,
							attraction.arName,
							attraction.arDescription,
							attraction.enCategory,
							attraction.arCategory,
							attraction.thumbnail,
							attraction.priority,
							attraction.id,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.log('An error occurred while trying to update the existing attraction: ' + attraction.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(attraction);
							}
						}
					);
				}
			});
		}
	});
};

var toggleActivation = function(id, active, onSuccess, onFailure) {
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection'); console.log(err); onFailure(err);
		} else {
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					connection.end(); console.log('An error occurred while trying to begin a database transaction');
					console.log(err); onFailure(err);
				} else {
					connection.query('UPDATE Attractions SET Active = ? WHERE Id = ?', [active, id],
						function(err, result) {
							if (err) {
								console.log('An error occurred while trying to activate/deactivate attraction: ' + id);
								console.log(err); connection.rollback(); connection.end(); onFailure(err);
							} else {
								connection.commit(); connection.end(); onSuccess();
							}
					});
				}
			});
		}
	});
}

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
			connection.query(
				'SELECT A.*, C.Iata_Code FROM Attractions A LEFT JOIN Cities C on A.City_Id = C.Id ORDER BY A.Priority ASC',
				[],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while list all attractions');
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						var attractions = [];
						// populate the attributes
						for (var i = 0; i < rows.length; ++i) {
							var attraction = {
								id: rows[i].Id,
								cityId: rows[i].City_Id,
								enName: rows[i].EN_Name,
								enDescription: rows[i].EN_Description,
								arName: rows[i].AR_Name,
								arDescription: rows[i].AR_Description,
								enCategory: rows[i].EN_Category,
								arCategory: rows[i].AR_Category,
								thumbnail: rows[i].Thumbnail,
								priority: rows[i].Priority,
								cityIata: rows[i].Iata_Code,
								active: rows[i].Active
							};
							if (lang) {
								attraction.name = attraction[lang.toLowerCase() + 'Name'];
								attraction.description = attraction[lang.toLowerCase() + 'Description'];
								attraction.category = attraction[lang.toLowerCase() + 'Catgory'];
							}
							attractions.push(attraction);
						}
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(attractions);
					}
				}
			);
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
exports.toggleActivation = toggleActivation;
