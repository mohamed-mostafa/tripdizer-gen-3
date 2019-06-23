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
				'SELECT H.*, CI.EN_Name City_EN_Name, CI.AR_Name City_AR_Name, BC.EN_Name Budget_Category_Name FROM Hotels H JOIN Cities CI ON H.City_Id = CI.Id LEFT JOIN Budget_Category BC on H.Budget_Category_Id = BC.Id WHERE H.Id = ?',
				[id],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while trying to find a hotel with id ' + id);
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						if (rows.length != 0) {
							// populate the hotel attributes
							var hotel = {
								id: rows[0].Id,
								cityId: rows[0].City_Id,
								cityEnName: rows[0].City_EN_Name,
								cityArName: rows[0].City_AR_Name,
								enName: rows[0].EN_Name,
								enDescription: rows[0].En_Description,
								arName: rows[0].AR_Name,
								arDescription: rows[0].Ar_Description,
								thumbnail: rows[0].Thumbnail,
								stars: rows[0].Stars,
								budgetCategoryId: rows[0].Budget_Category_Id,
								budgetCategoryName: rows[0].Budget_Category_Name,
								active: rows[0].Active,
							};
							if (lang) {
								hotel.name = hotel[lang.toLowerCase() + 'Name'];
								hotel.description = hotel[lang.toLowerCase() + 'Description'];
							}

							// end the connection
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(hotel);
						} else {
							// no hotel is found with the id
							connection.end();
							onSuccess(null);
						}
					}
				}
			);
		}
	});
};

var create = function(hotel, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the hotel and his addresses
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
						'INSERT INTO Hotels (City_Id, EN_Name, EN_Description, AR_Name, AR_Description, Thumbnail, Stars, Budget_Category_Id, Active) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
						[
							hotel.cityId,
							hotel.enName,
							hotel.enDescription,
							hotel.arName,
							hotel.arDescription,
							hotel.thumbnail,
							hotel.stars,
							hotel.budgetCategoryId,
							hotel.active,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.log('An error occurred while trying to create the new hotel: ' + hotel.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the hotelId to the hotel
								hotel.id = result.insertId;

								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(hotel);
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a hotel object if successful
//calls the onFailure with an err object in case of technical error
var update = function(hotel, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the hotel and his addresses
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
						'UPDATE Hotels SET City_Id = ?, EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Thumbnail = ?, Stars = ?, Budget_Category_Id = ?, Active = ? WHERE Id = ?',
						[
							hotel.cityId,
							hotel.enName,
							hotel.enDescription,
							hotel.arName,
							hotel.arDescription,
							hotel.thumbnail,
							hotel.stars,
							hotel.budgetCategoryId,
							hotel.active,
							hotel.id,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.log('An error occurred while trying to update the existing hotel: ' + hotel.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(hotel);
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
var getAllByCity = function(lang, cityId, onSuccess, onFailure) {
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
				'SELECT H.*, CI.EN_Name City_EN_Name, CI.AR_Name City_AR_Name, BC.EN_Name Budget_Category_Name FROM Hotels H JOIN Cities CI ON H.City_Id = CI.Id LEFT JOIN Budget_Category BC on H.Budget_Category_Id = BC.Id WHERE H.City_Id = ?',
				[cityId],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while list all hotels');
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						var hotels = [];
						// populate the attributes
						for (var i = 0; i < rows.length; ++i) {
							const hotelIndex = hotels.findIndex(hotel => hotel.id === rows[i].Id);
							if (hotelIndex === -1) {
								var hotel = {
									id: rows[i].Id,
									cityId: rows[i].City_Id,
									cityEnName: rows[i].City_EN_Name,
									cityArName: rows[i].City_AR_Name,
									enName: rows[i].EN_Name,
									enDescription: rows[i].En_Description,
									arName: rows[i].AR_Name,
									arDescription: rows[i].Ar_Description,
									thumbnail: rows[i].Thumbnail,
									stars: rows[i].Stars,
									budgetCategoryId: rows[i].Budget_Category_Id,
									budgetCategoryName: rows[i].Budget_Category_Name,
									active: rows[i].Active,
								};
								if (lang) {
									hotel.name = hotel[lang.toLowerCase() + 'Name'];
									hotel.description = hotel[lang.toLowerCase() + 'Description'];
								}
								hotels.push(hotel);
							} else {
							}
						}
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(hotels);
					}
				}
			);
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAllByCity = getAllByCity;
