/**
 * The dataaccess methods of hws
 */

var daoUtilities = require('./hws_dao_utilities.js');

var getVideos = function(lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM videos', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while list all videos');
					console.error(err);
					onFailure(err);
				} else {
					// no error is thrown
					var videos = [];
					// populate the attributes
					for (var i = 0; i < rows.length; i++) {
						var video = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_Description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_Description,
							uri: rows[i].URI,
						};
						if (lang) {
							video.name = video[lang.toLowerCase() + '_name'];
							video.description = video[lang.toLowerCase() + '_description'];
						}
						videos.push(video);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(videos);
				}
			});
		}
	});
};

var create = function(video, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the video and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while trying to begin a database transaction');
					console.error(err);
					onFailure(err);
				} else {
					connection.query(
						'INSERT INTO videos (EN_Name, EN_Description, AR_Name, AR_Description, URI) values (?, ?, ?, ?, ?)',
						[video.en_name, video.en_description, video.ar_name, video.ar_description, video.uri],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								// end the connection
								connection.end();
								console.error('An error occurred while trying to create the new video: ' + video.en_name);
								console.error(err);
								connection.rollback(); // rollback the transaction
								onFailure(err);
							} else {
								// set the videoId to the video
								video.id = result.insertId;

								// end the connection
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(video);
							}
						}
					);
				}
			});
		}
	});
};

//calls the onSuccess with a video object if successful
//calls the onFailure with an err object in case of technical error
var update = function(video, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the video and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while trying to begin a database transaction');
					console.error(err);
					onFailure(err);
				} else {
					connection.query(
						'UPDATE videos SET EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, URI = ? WHERE Id = ?',
						[video.en_name, video.en_description, video.ar_name, video.ar_description, video.uri, video.id],
						function(err, result) {
							// if an error is thrown, end the connection and throw an error
							if (err) {
								// if the first insert statement fails
								console.error('An error occurred while trying to update the existing video: ' + video.en_name);
								console.error(err);
								connection.rollback(); // rollback the transaction
								// end the connection
								connection.end();
								onFailure(err);
							} else {
								connection.commit();
								connection.end();
								// call the callback function provided by the caller, and give it the response
								onSuccess(video);
							}
						}
					);
				}
			});
		}
	});
};

var createPhone = function(phoneNumber) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the video and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while trying to begin a database transaction');
					console.error(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO Phones (Phone_Number) values (?)', [phoneNumber], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) {
							// if the first insert statement fails
							// end the connection
							connection.end();
							console.error('An error occurred while trying to create the new phone number: ' + phoneNumber);
							console.error(err);
						} else {
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a video object if successful
//calls the onFailure with an err object in case of technical error
var updatePhone = function(phone, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the video and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while trying to begin a database transaction');
					console.error(err);
					onFailure(err);
				} else {
					connection.query('UPDATE Phones SET Status = ? WHERE Id = ?', [phone.Status, phone.Id], function(
						err,
						result
					) {
						// if an error is thrown, end the connection and throw an error
						if (err) {
							// if the first insert statement fails
							console.error('An error occurred while trying to update the existing phone: ' + phone.Phone_Number);
							console.error(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(phone);
						}
					});
				}
			});
		}
	});
};

var getPhones = function(onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.error('An error occurred while trying to open a database connection');
			console.error(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM Phones', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.error('An error occurred while list all phones');
					console.error(err);
					onFailure(err);
				} else {
					// no error is thrown
					var phones = [];
					// populate the attributes
					for (var i = 0; i < rows.length; i++) {
						var phone = rows[i];

						phones.push(phone);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(phones);
				}
			});
		}
	});
};

exports.create = create;
exports.update = update;
exports.getVideos = getVideos;
exports.getPhones = getPhones;
exports.createPhone = createPhone;
exports.updatePhone = updatePhone;
