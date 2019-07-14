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
				'SELECT C.*, vt.EN_Name as EN_Visa_Type_Name, vt.AR_Name as AR_Visa_Type_Name FROM Countries C LEFT JOIN Visa_Types VT ON C.Visa_Type = VT.Id WHERE C.Id = ? OR ISO_Code = ?',
				[id, id],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while trying to find a country with id ' + id);
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						if (rows.length != 0) {
							// populate the country attributes
							var country = {
								id: rows[0].Id,
								enName: rows[0].EN_Name,
								enDescription: rows[0].EN_Description,
								arName: rows[0].AR_Name,
								arDescription: rows[0].AR_Description,
								thumbnail: rows[0].Thumbnail,
								introduction: rows[0].Introduction,
								includes: rows[0].Includes,
								excludes: rows[0].Excludes,
								visaType: rows[0].Visa_Type,
								enVisaTypeName: rows[0].EN_Visa_Type_Name,
								arVisaTypeName: rows[0].AR_Visa_Type_Name,
								visaRequirements: rows[0].Visa_Requirements,
								ISOCode: rows[0].ISO_Code,
								active: rows[0].Active,
							};

							if (lang) {
								country.name = country[lang.toLowerCase() + 'Name'];
								country.description = country[lang.toLowerCase() + 'Description'];
							}

							// end the connection
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(country);
						} else {
							// no country is found with the id
							connection.end();
							onSuccess(null);
						}
					}
				}
			);
		}
	});
};

var create = function(country, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the country and his addresses
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
						'INSERT INTO Countries (EN_Name, EN_Description, AR_Name, AR_Description, Thumbnail, Introduction, Includes, Excludes, Visa_Type, Visa_Requirements, ISO_Code) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
						[
							country.enName,
							country.enDescription,
							country.arName,
							country.arDescription,
							country.thumbnail,
							country.introduction,
							country.includes,
							country.excludes,
							country.visaType,
							country.visaRequirements,
							country.ISOCode,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.log('An error occurred while trying to create the new country: ' + country.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the countryId to the country
								country.id = result.insertId;

								// end the connection
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(country);
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a country object if successful
//calls the onFailure with an err object in case of technical error
var update = function(country, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log('An error occurred while trying to open a database connection');
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the country and his addresses
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
						'UPDATE Countries SET EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Thumbnail = ?, Introduction = ?, Includes = ?, Excludes = ?, Visa_Type = ?, Visa_Requirements = ?, ISO_Code = ? WHERE Id = ?',
						[
							country.enName,
							country.enDescription,
							country.arName,
							country.arDescription,
							country.thumbnail,
							country.introduction,
							country.includes,
							country.excludes,
							country.visaType,
							country.visaRequirements,
							country.ISOCode,
							country.id,
						],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.log('An error occurred while trying to update the existing country: ' + country.enName);
								console.log(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(country);
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
				'SELECT C.*, VT.EN_Name as EN_Visa_Type_Name, VT.AR_Name as AR_Visa_Type_Name FROM Countries C LEFT JOIN Visa_Types VT ON C.Visa_Type = VT.Id',
				[],
				function(err, rows) {
					// if an error is thrown, end the connection and throw an error
					if (err) {
						// end the connection
						connection.end();
						console.log('An error occurred while list all countries');
						console.log(err);
						onFailure(err);
					} else {
						// no error is thrown
						var countries = [];
						// populate the attributes
						for (var i = 0; i < rows.length; ++i) {
							var country = {
								id: rows[i].Id,
								enName: rows[i].EN_Name,
								enDescription: rows[i].EN_Description,
								arName: rows[i].AR_Name,
								arDescription: rows[i].AR_Description,
								thumbnail: rows[i].Thumbnail,
								introduction: rows[i].Introduction,
								includes: rows[i].Includes,
								excludes: rows[i].Excludes,
								visaType: rows[i].Visa_Type,
								enVisaTypeName: rows[i].EN_Visa_Type_Name,
								arVisaTypeName: rows[i].AR_Visa_Type_Name,
								visaRequirements: rows[i].Visa_Requirements,
								ISOCode: rows[i].ISO_Code,
								active: rows[i].Active,
							};
							if (lang) {
								country.name = country[lang.toLowerCase() + 'Name'];
								country.description = country[lang.toLowerCase() + 'Description'];
							}
							countries.push(country);
						}
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(countries);
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
					connection.query('UPDATE hws.Countries SET Active = ? WHERE Id = ?', [active, id],
						function(err, result) {
							if (err) {
								console.log('An error occurred while trying to activate/deactivate country: ' + id);
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
exports.toggleActivation = toggleActivation;