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
				'SELECT H.*, mp.*, CI.EN_Name City_EN_Name, CI.AR_Name City_AR_Name, BC.EN_Name Budget_Category_Name FROM Hotels H JOIN Cities CI ON H.City_Id = CI.Id LEFT JOIN Budget_Category BC on H.Budget_Category_Id = BC.Id LEFT JOIN month_price mp on mp.id = H.night_price WHERE H.Id = ?',
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
								address: rows[0].Address,
								stars: rows[0].Stars,
								budgetCategoryId: rows[0].Budget_Category_Id,
								budgetCategoryName: rows[0].Budget_Category_Name,
								rates: {
									JAN: rows[0].JAN,
									FEB: rows[0].FEB,
									MAR: rows[0].MAR,
									APR: rows[0].APR,
									MAY: rows[0].MAY,
									JUN: rows[0].JUN,
									JUL: rows[0].JUL,
									AUG: rows[0].AUG,
									SEP: rows[0].SEP,
									OCT: rows[0].OCT,
									NOV: rows[0].NOV,
									DEC: rows[0].DEC,
								},
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
			console.log('An error occurred while trying to open a database connection'); console.log(err); onFailure(err);
		} else {
			// begin a transaction to insert the hotel and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end(); console.log('An error occurred while trying to begin a database transaction');
					console.log(err); onFailure(err);
				} else {
					var hotelsQuery = `INSERT INTO month_price VALUES (0, ${connection.escape(hotel.rates.JAN || 0
					)}, ${connection.escape(hotel.rates.FEB || 0)}, ${connection.escape(hotel.rates.MAR || 0
					)}, ${connection.escape(hotel.rates.APR || 0)}, ${connection.escape(hotel.rates.MAY || 0
					)}, ${connection.escape(hotel.rates.JUN || 0)}, ${connection.escape(hotel.rates.JUL || 0
					)}, ${connection.escape(hotel.rates.AUG || 0)}, ${connection.escape(hotel.rates.SEP || 0
					)}, ${connection.escape(hotel.rates.OCT || 0)}, ${connection.escape(hotel.rates.NOV || 0
					)}, ${connection.escape(hotel.rates.DEC || 0)});`;
					connection.query(hotelsQuery, function(err, result) {
						if (err) {
							connection.end(); console.log('An error occurred while trying to create the month prices for the new hotel: ' + hotel.enName);
							console.log(err);connection.rollback(); onFailure(err);
						} else {
							var nightPriceId = result.insertId; // the primary key in the month_price table
							connection.query(
								'INSERT INTO Hotels (City_Id, EN_Name, EN_Description, AR_Name, AR_Description, Address, Stars, Budget_Category_Id, night_price) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
								[
									hotel.cityId,
									hotel.enName,
									hotel.enDescription,
									hotel.arName,
									hotel.arDescription,
									hotel.address,
									hotel.stars,
									hotel.budgetCategoryId,
									nightPriceId
								],
								function(err, result) {
									if (err) {
										connection.end(); console.log('An error occurred while trying to create the new hotel: ' + hotel.enName);
										console.log(err);connection.rollback(); onFailure(err);
									} else {
										// set the hotelId to the hotel
										hotel.id = result.insertId;
										connection.commit(); connection.end(); onSuccess(hotel);
									}
								}
							);
						}
					})
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
					connection.end(); console.log('An error occurred while trying to begin a database transaction');
					console.log(err); onFailure(err);
				} else {
					connection.query(
						'UPDATE Hotels SET City_Id = ?, EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Address = ?, Stars = ?, Budget_Category_Id = ? WHERE Id = ?',
						[
							hotel.cityId,
							hotel.enName,
							hotel.enDescription,
							hotel.arName,
							hotel.arDescription,
							hotel.address,
							hotel.stars,
							hotel.budgetCategoryId,
							hotel.id,
						],
						function(err, result) {
							if (err) {
								console.log('An error occurred while trying to update the existing hotel: ' + hotel.enName);
								console.log(err); connection.rollback(); connection.end(); onFailure(err);
							} else {
								var monthPriceQuery = 'UPDATE hws.month_price SET JAN=?, FEB=?, MAR=?, APR=?, MAY=?, JUN=?, JUL=?, AUG=?, SEP=?, OCT=?, NOV=?, hws.month_price.DEC=? WHERE id in (select night_price from hws.Hotels WHERE Id = ?)'
								connection.query(monthPriceQuery, [
									hotel.rates.JAN, hotel.rates.FEB, hotel.rates.MAR, hotel.rates.APR,
									hotel.rates.MAY, hotel.rates.JUN, hotel.rates.JUL, hotel.rates.AUG,
									hotel.rates.SEP, hotel.rates.OCT, hotel.rates.NOV, hotel.rates.DEC,
									hotel.id
								], function(err, result) {
									if (err) {
										console.log('An error occurred while trying to update the month price of the existing hotel: ' + hotel.enName);
										console.log(err); connection.rollback(); connection.end(); onFailure(err);
									} else {
										connection.commit(); connection.end(); onSuccess(hotel);
									}
								})
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
				'SELECT H.*, mp.*, CI.EN_Name City_EN_Name, CI.AR_Name City_AR_Name, BC.EN_Name Budget_Category_Name FROM Hotels H JOIN Cities CI ON H.City_Id = CI.Id LEFT JOIN Budget_Category BC on H.Budget_Category_Id = BC.Id LEFT JOIN month_price mp on mp.id = H.night_price WHERE H.City_Id = ? OR CI.Iata_Code = ?',
				[cityId, cityId],
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
									address: rows[i].Address,
									stars: rows[i].Stars,
									budgetCategoryId: rows[i].Budget_Category_Id,
									budgetCategoryName: rows[i].Budget_Category_Name,
									rates: {
										JAN: rows[i].JAN,
										FEB: rows[i].FEB,
										MAR: rows[i].MAR,
										APR: rows[i].APR,
										MAY: rows[i].MAY,
										JUN: rows[i].JUN,
										JUL: rows[i].JUL,
										AUG: rows[i].AUG,
										SEP: rows[i].SEP,
										OCT: rows[i].OCT,
										NOV: rows[i].NOV,
										DEC: rows[i].DEC,
									},
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
					connection.query('UPDATE Hotels SET Active = ? WHERE Id = ?', [active, id],
						function(err, result) {
							if (err) {
								console.log('An error occurred while trying to activate/deactivate hotel: ' + id);
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
exports.getAllByCity = getAllByCity;
exports.toggleActivation = toggleActivation;