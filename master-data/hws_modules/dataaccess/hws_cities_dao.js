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
				'SELECT c.*, cds.Budget_Category_Id, cds.Daily_Spending, CO.EN_Name Country_EN_Name, CO.AR_NAME Country_AR_Name, CO.ISO_CODE Country_ISO_Code FROM Cities c LEFT JOIN City_Daily_Spending cds on c.Id = cds.City_Id LEFT JOIN Countries CO on CO.Id = c.Country_Id WHERE c.id = ? OR c.Iata_Code = ?',
				[id, id],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while trying to find a city with id ' + id);
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						if (rows.length != 0) {
							// populate the city attributes
							var city = {
								id: rows[0].Id,
								countryId: rows[0].Country_Id,
								countryIsoCode: rows[0].Country_ISO_Code,
								countryEnName: rows[0].Country_EN_Name,
								countryArName: rows[0].Country_EN_Name,
								iataCode: rows[0].Iata_Code,
								enName: rows[0].EN_Name,
								enDescription: rows[0].EN_Description,
								arName: rows[0].AR_Name,
								arDescription: rows[0].AR_Description,
								thumbnail: rows[0].Thumbnail,
								lat: rows[0].Latitude,
								lng: rows[0].Longitude,
								visitOrder: rows[0].Visit_Order,
								active: rows[0].Active,
								dailySpending: {},
							};
							rows.forEach(cityRow => (city.dailySpending[cityRow.Budget_Category_Id] = cityRow.Daily_Spending));

							if (lang) {
								city.name = city[lang.toLowerCase() + 'Name'];
								city.description = city[lang.toLowerCase() + 'Description'];
							}

							// end the connection
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(city);
						} else {
							// no city is found with the id
							connection.end();
							onSuccess(null);
						}
					}
				}
			);
		}
	});
};

var create = function(city, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the city and his addresses
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
						'INSERT INTO Cities (Country_Id, Iata_Code, EN_Name, EN_Description, AR_Name, AR_Description, Latitude, Longitude, Visit_Order) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
						[
							city.countryId,
							city.iataCode,
							city.enName,
							city.enDescription,
							city.arName,
							city.arDescription,
							city.lat,
							city.lng,
							city.visitOrder,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.log('An error occurred while trying to create the new city: ' + city.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the cityId to the city
								city.id = result.insertId;

								const budgetCategoryIds = Object.keys(city.dailySpending);
								let insertDailySpendingQuery = '';
								if (budgetCategoryIds.length) {
									budgetCategoryIds.forEach((budgetCategoryId, i) => {
										if (i === 0) insertDailySpendingQuery += `INSERT INTO City_Daily_Spending VALUES `;
										else insertDailySpendingQuery += ', ';
										insertDailySpendingQuery += `(${connection.escape(city.id)}, ${connection.escape(
											budgetCategoryId
										)}, ${connection.escape(city.dailySpending[budgetCategoryId])})`;
										if (i === budgetCategoryIds.length - 1) insertDailySpendingQuery += ';';
									});
									connection.query(insertDailySpendingQuery, [], function(err, result) {
										// if an error is thrown, end the connection and throw an error
										if (err) {
											// if the first insert statement fails
											console.log('An error occurred while trying to update the existing city: ' + city.enName);
											console.log(err);
											connection.rollback(); // rollback the transaction
											// end the connection
											connection.end();
											onFailure(err);
										} else {
											connection.commit();
											connection.end();
											// call the callback function provided by the caller, and give it the response
											onSuccess(city);
										}
									});
								} else {
									connection.commit();
									connection.end();
									// call the callback function provided by the caller, and give it the response
									onSuccess(city);
								}
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a city object if successful
//calls the onFailure with an err object in case of technical error
var update = function(city, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the city and his addresses
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
						'UPDATE Cities SET Country_Id = ?, Iata_Code = ?, EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Latitude = ?, Longitude = ?, Visit_Order = ? WHERE Id = ?',
						[
							city.countryId,
							city.iataCode,
							city.enName,
							city.enDescription,
							city.arName,
							city.arDescription,
							city.lat,
							city.lng,
							city.visitOrder,
							city.id,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.log('An error occurred while trying to update the existing city: ' + city.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								const budgetCategoryIds = Object.keys(city.dailySpending);
								let deleteDailySpendingQuery = '',
									insertDailySpendingQuery = '';
								if (budgetCategoryIds.length) {
									deleteDailySpendingQuery = `DELETE FROM City_Daily_Spending WHERE City_Id = ${connection.escape(
										city.id
									)};`;
									budgetCategoryIds.forEach((budgetCategoryId, i) => {
										if (i === 0) insertDailySpendingQuery += `INSERT INTO City_Daily_Spending VALUES `;
										else insertDailySpendingQuery += ', ';
										insertDailySpendingQuery += `(${connection.escape(city.id)}, ${connection.escape(
											budgetCategoryId
										)}, ${connection.escape(city.dailySpending[budgetCategoryId])})`;
										if (i === budgetCategoryIds.length - 1) insertDailySpendingQuery += ';';
									});
									connection.query(deleteDailySpendingQuery + insertDailySpendingQuery, [], function(err, result) {
										// if an error is thrown, end the connection and throw an error
										if (err) {
											// if the first insert statement fails
											console.log('An error occurred while trying to update the existing city: ' + city.enName);
											console.log(err);
											connection.rollback(); // rollback the transaction
											// end the connection
											connection.end();
											onFailure(err);
										} else {
											connection.commit();
											connection.end();
											// call the callback function provided by the caller, and give it the response
											onSuccess(city);
										}
									});
								} else {
									connection.commit();
									connection.end();
									// call the callback function provided by the caller, and give it the response
									onSuccess(city);
								}
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
			connection.query(
				'SELECT CI.*, CO.EN_Name Country_EN_Name, CO.AR_Name Country_AR_Name, CO.ISO_Code Country_ISO_Code, cds.Budget_Category_Id, cds.Daily_Spending FROM Cities CI JOIN Countries CO ON CI.Country_Id = CO.Id LEFT JOIN City_Daily_Spending cds on CI.Id = cds.City_Id ORDER BY CI.Visit_Order ASC',
				[],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while list all cities');
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						var cities = [];
						// populate the attributes
						for (var i = 0; i < rows.length; ++i) {
							const cityIndex = cities.findIndex(city => city.id === rows[i].Id);
							if (cityIndex === -1) {
								var city = {
									id: rows[i].Id,
									countryId: rows[i].Country_Id,
									iataCode: rows[i].Iata_Code,
									enName: rows[i].EN_Name,
									enDescription: rows[i].EN_Description,
									arName: rows[i].AR_Name,
									arDescription: rows[i].AR_Description,
									countryIsoCode: rows[i].Country_ISO_Code,
									countryEnName: rows[i].Country_EN_Name,
									countryArName: rows[i].Country_AR_Name,
									thumbnail: rows[i].Thumbnail,
									lat: rows[i].Latitude,
									lng: rows[i].Longitude,
									visitOrder: rows[i].Visit_Order,
									active: rows[i].Active,
									dailySpending: {},
								};
								if (rows[i].Budget_Category_Id) {
									city.dailySpending[rows[i].Budget_Category_Id] = rows[i].Daily_Spending;
								}
								if (lang) {
									city.name = city[lang.toLowerCase() + '_name'];
									city.description = city[lang.toLowerCase() + '_description'];
								}
								cities.push(city);
							} else {
								cities[cityIndex].dailySpending[rows[i].Budget_Category_Id] = rows[i].Daily_Spending;
							}
						}
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(cities);
					}
				}
			);
		}
	});
};

var getAllCitiesInIternaries = function(lang, onSuccess, onFailure) {
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
				'SELECT c.* FROM hws.Cities c where Id in (select Cities_Id from hws.iternary_cities)',
				[],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while list all cities in iternaries');
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						var cities = [];
						// populate the attributes
						for (var i = 0; i < rows.length; ++i) {
							var city = {
								id: rows[i].Id,
								countryId: rows[i].Country_Id,
								iataCode: rows[i].Iata_Code,
								enName: rows[i].EN_Name,
								enDescription: rows[i].EN_Description,
								arName: rows[i].AR_Name,
								arDescription: rows[i].AR_Description,
								thumbnail: rows[i].Thumbnail,
								lat: rows[i].Latitude,
								lng: rows[i].Longitude,
								visitOrder: rows[i].Visit_Order,
								active: rows[i].Active,
							};
							if (lang) {
								city.name = city[lang.toLowerCase() + 'Name'];
								city.description = city[lang.toLowerCase() + 'Description'];
							}
							cities.push(city);
						}
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(cities);
					}
				}
			);
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
					connection.query('UPDATE hws.Cities SET Active = ? WHERE Id = ?', [active, id],
						function(err, result) {
							if (err) {
								console.log('An error occurred while trying to activate/deactivate city: ' + id);
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

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
exports.getAllCitiesInIternaries = getAllCitiesInIternaries;
exports.toggleActivation = toggleActivation;
