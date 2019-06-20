/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
var emailBusiness = require('../adapters/hws_email_adapter.js');
var Promise = require('promise');
var httpRequest = require('request');
var googlePeopleAdapter = require('../adapters/google_people_adapter.js');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083'

//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function(request, onSuccess, onFailure, onUserError) {
	request = {
		...request,
		status: request.isFromWebsite ? 3 : request.status,
		travelingFrom: request.travelingFrom || request.leavingCountry || request.leaving_country,
		departureDate: request.departureDate || request.departure_date,
		returnDate: request.returnDate || request.return_date,
		isFlexibleDates: request.isFlexibleDates || request.flexible_dates,
		adultsNumber: request.adultsNumber || request.number_of_adults,
		kidsNumber: request.kidsNumber || request.number_of_kids || 0,
		infantsNumber: request.infantsNumber || request.number_of_infants || 0,
		budget: request.budget || request.budget,
		budgetCategory: request.budgetCategory || request.budget_category,
		purpose: request.purpose || request.travel_purpose,
		preferences: request.preferences || request.interests,
		otherInterestName: request.otherInterestName || request.otherPreferenceName,
		destination: request.destination || request.itinerary_id,
		estimatedCost: request.estimatedCost || request.estimatedCost,
		visaAssistanceNeeded: request.visaAssistanceNeeded || request.visa_assistance_needed,
		tourGuideNeeded: request.tourGuideNeeded || request.tour_guide_needed,
		specialRequests: request.comments || request.specialRequests,
		channel: request.isFromWebsite ? 1 : request.channel,
		traveler: {
			...request.traveler,
			email: request.traveler.email || request.traveler.emailAddress,
			birthday: request.traveler.birthday || request.traveler.dateOfBirth,
		},
		referralType: request.referralType || 1,
	};
	request.otherPurposeName = request.purpose == 1 ? request.otherPurposeName : null;
	if (Array.isArray(request.preferences)) {
		request.preferences = request.preferences.map(ri => ({
			id: ri.id || ri,
			percentage: ri.percentage || 100,
		}));
	}
	if (typeof request.preferences === 'object') {
		const preferences = [];
		for (const key in request.preferences) {
			if (request.preferences.hasOwnProperty(key)) {
				preferences.push({
					id: key,
					percentage: 100,
				});
			}
		}
		request.preferences = preferences;
	}
	// insert the request in our database
	request.date = new Date(new Date().setHours(0, 0, 0, 0));
	request.departureDate = new Date(request.departureDate);
	request.returnDate = new Date(request.returnDate);
	if (!request.budget) request.budget = 0;
	if (request.destination) {
		request.first_country = 1;
		// delete request.other_country
		delete request.second_country;
		delete request.third_country;
	}
	request.score = calculateRequestScore(request);
	requestsDao.createNewRequest(
		request,
		function(request) {
			// create the request

			getPackage(
				request.id,
				data => {
					request.packageUrl = data.pdfUrl;
					request.packageDownloadUrl = data.pdfDownloadUrl;
					onSuccess(request);
				},
				data => {
					if (data && data.pdfUrl) {
						request.packageUrl = data.pdfUrl;
						request.packageDownloadUrl = data.pdfDownloadUrl;
					}
					onSuccess(request);
				}
			);

			if (request.traveler.name === 'Essawy') {
				requestsDao.modifyRequestStatusById(request.id, 11, () => {}, () => {});
			} else {
				// notify creation
				if (process.env.ENABLE_AGENTS_NOTIFICATION_EMAIL == 'TRUE')
					emailBusiness.sendEmail(
						'bookings@tripdizer.com',
						'notifications@tripdizer.com',
						'Request #' + request.id + ' is placed at Tripdizer',
						request.traveler.name +
							' has just placed a new request at Tripdizer. Visit the Dashboard to view its details.'
					);

				if (process.env.ENABLE_END_USER_CONFIRMATION_EMAIL == 'TRUE')
					notifyCustomer(request.traveler.email, request.traveler.name, request.id);

				if (process.env.ENABLE_GOOGLE_PEOPLE_CONTACT_CREATION == 'TRUE')
					googlePeopleAdapter.createNewContact(
						request.traveler.email,
						request.traveler.name,
						request.traveler.mobile,
						'(' + request.id.toString() + ')'
					);
			}
		},
		function(err) {
			// respond to caller
			console.log('An error occured while saving a new request');
			console.log(err);
			onFailure(err);
			// });
			// }
		},
		function(err) {
			console.log('An error occured while checking if traveler exists before');
			console.log(err);
			onFailure(err);
		}
	);
};

var updateRequest = function(request, onSuccess, onFailure) {
	request.score = calculateRequestScore(request);
	request.otherPurposeName = request.purpose == 1 ? request.otherPurposeName : null;
	requestsDao.updateRequest(
		request,
		function(request) {
			onSuccess(request);
		},
		function(err) {
			console.log('An error occured while getting request package');
			console.log(err);
			onFailure(err);
		}
	);
};

var notifyCustomer = function(to, customerName, requestId) {
	// prepare email body
	var emailBody = '';
	emailBody += '<html>';
	emailBody += "<p style='font-weight: bold;'>Dear {customerName},</p>";
	emailBody +=
		'<p>Thank you for submitting your travel request at Tripdizer. One of our agents will contact you as soon as possible.</p>';
	emailBody += "<p style='font-weight: bolder;'>Regards,</p>";
	emailBody += "<p style='font-weight: bold;'>Tripdizer Booking Team</p>";
	emailBody +=
		"<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
	emailBody += '</html>';

	emailBody = emailBody.replace('{requestId}', requestId);
	emailBody = emailBody.replace('{customerName}', customerName);

	// notify creation
	emailBusiness.sendEmail(
		to,
		'Tripdizer Notifications <do-not-reply@tripdizer.com>',
		'Your Tripdizer request has been received',
		emailBody
	);
};
var sendMailsToRequestTraveler = function(email, onSuccess, onFailure) {
	if (email.type === 'traveler') {
		sendMails(email.recipients, email, onSuccess);
	} else if (email.type === 'request') {
		requestsDao.getRequestSummariesByStatus(
			email.recipients,
			Number.MAX_SAFE_INTEGER,
			1,
			function(travelers) {
				var emails = [];
				for (var i = 0; i < travelers.length; i++) emails.push(travelers[i].traveler.emailAddress);
				sendMails(emails, email, onSuccess);
			},
			function(err) {
				console.log('An error occured while getting travelers');
				console.log(err);
				onFailure(err);
			}
		);
	}
};

var sendMails = function(emails, email, onSuccess) {
	responses = [];
	for (var i = 0; i < emails.length; ++i)
		responses.push(
			emailBusiness
				.sendEmail(emails[i], 'notifications@tripdizer.com', email.subject, email.body, email.attachments)
				.then(function(response) {
					return response;
				})
				.catch(function(response) {
					return response;
				})
		);
	Promise.all(responses).then(function(resp) {
		email.response = resp;
		email.count = {
			success: resp.filter(function(item) {
				return item.done;
			}).length,
			fail: resp.filter(function(item) {
				return !item.done;
			}).length,
		};
		onSuccess(email);
	});
};

var validatePromoCode = function(promoCode, onSuccess, onFailure) {
	if (promoCode != null && promoCode.toLowerCase() == 'tripdizer10') {
		requestsDao.getRequestCountsByPromoCode(
			promoCode,
			function(count) {
				if (count < 50) {
					onSuccess(true);
				} else {
					onSuccess(false);
				}
			},
			onFailure
		);
	} else {
		onSuccess(false);
	}
};

var sendDailyReportOfRequestsCount = function() {
	requestsDao.getRequestCounts(
		function(counts) {
			// prepare email body
			var emailBody = '';
			emailBody +=
				'<html><head><style>table{border-collapse:collapse;width:100%}th,td{padding:8px 30px 8px 10px;text-align:left;border-bottom:1px solid #ddd}tr:hover{background-color:#f5f5f5}tr:nth-child(even){background-color:#f2f2f2}thead td{background-color:#3c8dbc;color:#fff}</style></head>';
			emailBody += "<p style='font-weight: bold;'>Dear Team,</p>";
			emailBody += '<p>Current State:</p>';
			emailBody +=
				'<table><thead><tr><td>Status<td><td>Count<td><td>Total Travellers<td><td>Adults<td><td>Kids<td><td>Infants<td></tr></thead>';
			for (let i = 0; i < counts.length; ++i) {
				emailBody += '<tr>';
				emailBody += `<td>${counts[i].Status}<td>`;
				emailBody += `<td>${counts[i].Count}<td>`;
				emailBody += `<td>${counts[i].Total_Travellers}<td>`;
				emailBody += `<td>${counts[i].Adults}<td>`;
				emailBody += `<td>${counts[i].Kids}<td>`;
				emailBody += `<td>${counts[i].Infants}<td>`;
				emailBody += '</tr>';
			}
			emailBody += '</table>';
			emailBody += "</table><p style='font-weight: bolder;'>Regards,</p>";
			emailBody += "<p style='font-weight: bold;'>Tripdizer Notifications</p>";
			emailBody +=
				"<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
			emailBody += '</html>';

			// notify creation
			emailBusiness.sendEmail(
				'bookings@tripdizer.com',
				'Tripdizer Notifications <notifications@tripdizer.com>',
				'Tripdizer daily requests report',
				emailBody
			);
		},
		function() {
			console.log('An error occured while getting request counts');
		}
	);
};

var getPackage = function(requestId, accessToken, onSuccess, onFailure) {
	requestsDao.getRequestById(
		requestId,
		function(request) {
			const departureDate = new Date(request.departureDate);
			const returnDate = new Date(request.returnDate);
			const tripDays = Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24));
			if (request.itineraryId && request.itineraryId !== -1) {
				httpRequest.get({url: MASTER_DATA_ENDPOINT + "/itinerary/" + request.itineraryId, json: true, headers: {authorization: accessToken}}, 
				// itinerariesDao.getById(
				// 	request.itineraryId,
				// 	null,
					async function(error, response, itinerary) {
						if (error || response.statusCode != 200) {
							console.log('An error occured while getting request package');
							console.log(error || response.statusMessage);
							onFailure(error || response.statusMessage);
						}
						else if (itinerary.flights.length > 0) {
							itinerary.flights = itinerary.flights.sort((a, b) => a.type - b.type);
							itinerary.flights[0].date = departureDate.toLocaleDateString();
							for (let i = itinerary.flights.length - 1; i >= 0; i--)
								if (itinerary.flights[i].return)
									itinerary.flights.push({
										type: itinerary.flights[i].type,
										arriving_to: itinerary.flights[i].departing_from,
										departing_from: itinerary.flights[i].arriving_to,
										departure_time: itinerary.flights[i].return_departure_time,
										arrival_time: itinerary.flights[i].return_arrival_time,
										lay_over: itinerary.flights[i].return_lay_over,
										Iternary_id: itinerary.flights[i].Iternary_id,
									});
						}
						itinerary.cities = itinerary.cities.sort((a, b) => a.order - b.order);
						for (let i = 0; i < itinerary.cities.length; ++i) {
							itinerary.cities[i].numberOfDays = Math.round((tripDays * itinerary.cities[i].days) / 100);
							itinerary.cities[i].startDate =
								i === 0
									? departureDate
									: new Date(
											new Date(itinerary.cities[i - 1].endDate).setDate(itinerary.cities[i - 1].endDate.getDate())
									  );
							itinerary.cities[i].endDate = new Date(
								new Date(itinerary.cities[i].startDate).setDate(
									itinerary.cities[i].startDate.getDate() + itinerary.cities[i].numberOfDays
								)
							);
							if (itinerary.flights[i + 1])
								itinerary.flights[i + 1].date = itinerary.cities[i].endDate.toLocaleDateString();
						}
						if (itinerary.cities.length)
							itinerary.cities[itinerary.cities.length - 1].numberOfDays +=
								tripDays - itinerary.cities.reduce((ac, cv) => ac + cv.numberOfDays, 0);
						itinerary.hotels = itinerary.hotels.filter(h => h.budget_category_id === request.budgetCategory);
						for (let i = 0; i < itinerary.hotels.length; ++i) {
							const city = itinerary.cities.find(c => c.id == itinerary.hotels[i].City_Id);
							if (city) {
								itinerary.hotels[i].order = city.order;
								itinerary.hotels[i].checkIn = city.startDate.toLocaleDateString();
								itinerary.hotels[i].checkOut = city.endDate.toLocaleDateString();
								itinerary.hotels[i].nights = city.numberOfDays;
							}
						}
						request = {
							id: request.id,
							travelerName: request.traveler.name ? request.traveler.name : '',
							estimatedCost: request.estimatedCost ? currencyFormat(request.estimatedCost) : currencyFormat(0),
							numberOfTravelers: request.adultsNumber + request.kidsNumber + request.infantsNumber,
							itinerary: {
								name: itinerary.en_name ? itinerary.en_name : '',
								introduction: itinerary.introduction ? itinerary.introduction : 'Introduction',
								includes: itinerary.includes ? itinerary.includes : '',
								excludes: itinerary.excludes ? itinerary.excludes : '',
								visaRequirements: itinerary.visaRequirements ? itinerary.visaRequirements : '',
								image1:
									itinerary.image1 && (await isValidImage(itinerary.image1))
										? itinerary.image1
										: 'https://i.imgur.com/LsHCFiD.jpg',
								flights: itinerary.flights.map(rf => ({
									date: rf.date ? rf.date : '',
									departingFrom: rf.departing_from ? rf.departing_from : '',
									arrivingTo: rf.arriving_to ? rf.arriving_to : '',
									departureTime: rf.departure_time ? rf.departure_time : '',
									arrivalTime: rf.arrival_time ? rf.arrival_time : '',
									layOver: rf.lay_over ? rf.lay_over : '',
								})),
								hotels: itinerary.hotels
									.sort((a, b) => a.order - b.order)
									.map(rh => ({
										cityName: rh.City_Name ? rh.City_Name : '',
										checkIn: rh.checkIn ? rh.checkIn : '',
										checkOut: rh.checkOut ? rh.checkOut : '',
										nights: rh.nights ? rh.nights : '',
										name: rh.EN_Name ? rh.EN_Name : '',
									})),
							},
						};
						packageHttp(
							'post',
							'https://script.google.com/a/tripdizer.com/macros/s/AKfycbxu2ZUmMCLa3xr4AzynM7zAQswyJmaIikMkT0psVA/exec',
							JSON.stringify(request),
							function(doc) {
								packageHttp(
									'get',
									`https://script.google.com/a/tripdizer.com/macros/s/AKfycbxu2ZUmMCLa3xr4AzynM7zAQswyJmaIikMkT0psVA/exec?docId=${
										doc.docId
									}`,
									null,
									function(package) {
										requestsDao.modifyRequestPackageInfo(
											request.id,
											package.docId,
											package.pdfId,
											() => {
												onSuccess(package);
											},
											() => {
												onSuccess(package);
											}
										);
									},
									e => {
										console.log('An error occured while getting request package pdf: ' + e);
										onSuccess(doc);
									}
								);
							},
							e => {
								console.log('An error occured while getting request package document: ' + e);
								onFailure(e);
							}
						);
					}
				);
			} else {
				onFailure("Itinerary Id doesn't exists!.");
			}
		},
		function(err) {
			console.log('An error occured while getting request package');
			console.log(err);
			onFailure(err);
		}
	);
};

var sendPackageByMail = function(requestId, onSuccess, onFailure) {
	requestsDao.getRequestById(
		requestId,
		function(request) {
			// prepare email body
			var emailBody = '';
			emailBody += '<html>';
			emailBody += "<p style='font-weight: bold;'>Dear {customerName},</p>";
			emailBody += '<p>Thank you for using Tripdizer,</p>';
			emailBody +=
				'<p>Please click on the <a href="{packageUrl}">link</a> to get redirected to your primary package.</p>';
			emailBody +=
				'<p>Please note that this is just a primarily package, one of our representatives will get in with you touch within 48 hours after submitting your request.</p>';
			emailBody += "<p style='font-weight: bolder;'>Regards,</p>";
			emailBody += "<p style='font-weight: bold;'>Tripdizer Booking Team</p>";
			emailBody +=
				"<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
			emailBody += '</html>';

			emailBody = emailBody.replace('{requestId}', request.id);
			emailBody = emailBody.replace('{customerName}', request.traveler.name);
			emailBody = emailBody.replace('{packageUrl}', request.pdfUrl);

			// notify creation
			emailBusiness.sendEmail(
				request.traveler.emailAddress,
				'Tripdizer Notifications <do-not-reply@tripdizer.com>',
				'Primary itinerary',
				emailBody,
				[request.PdfDownloadUrl]
			);
			onSuccess({ success: true });
		},
		function(err) {
			console.log('An error occured while getting request package');
			console.log(err);
			onFailure({ ...err, success: false });
		}
	);
};

function currencyFormat(value) {
	var r = new RegExp(
		(1)
			.toLocaleString()
			.replace(/^1/, '')
			.replace(/\./, '\\.') + '$'
	);
	return (
		(~~value).toLocaleString().replace(r, '') +
		(value % 1)
			.toFixed(2)
			.toLocaleString()
			.replace(/^[+-]?0+/, '')
	);
}

async function isValidImage(url) {
	return await new Promise(resolve => {
		httpRequest(url, function(error, response, body) {
			if (!error && response.statusCode == 200 && response.headers['content-type'].match(/(image)+\//g)) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

function isUrl(str) {
	const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
	if (regexp.test(str)) return true;
	else return false;
}

function calculateRequestScore(request) {
	let score = 0;
	// Traveled Before
	if (request.travelHistory === 1) score += 1;
	// Honeymoon
	if (request.purpose === 5) score += 2;
	// Female & Solo
	if (request.purpose === 2 && request.traveler && request.traveler.gender === 2) score += 1;
	// Student
	if (request.traveler && request.traveler.profession === 2) score += 1;
	// Employee
	if (request.traveler && request.traveler.profession === 3) score += 2;
	// Business Owner
	if (request.traveler && request.traveler.profession === 4) score += 3;
	// MidRange || Splurge
	if (request.budgetCategory === 4 || request.budgetCategory === 5) score += 1;
	// Friend
	if (request.referralType === 3) score += 1;
	return score;
}

function packageHttp(method, url, data = {}, onSuccess, onFailure) {
	httpRequest[method](
		{
			url: url,
			form: data,
			followAllRedirects: true,
			headers: {
				'Content-Type': 'text/plain',
			},
		},
		function(error, response, body) {
			try {
				const package = JSON.parse(body);
				if (response.statusCode === 200 && package.docId) {
					onSuccess(package);
				} else {
					const errorBody = package.match(/<body(?:.*?)>([^<].*?)<\/.*>/);
					if (errorBody[1]) {
						onFailure(errorBody[1]);
					} else {
						onFailure(error);
					}
				}
			} catch (e) {
				onFailure(e);
			}
		}
	);
}

exports.placeRequest = placeRequest;
exports.getRequestById = requestsDao.getRequestById;
exports.assignRequestToUser = requestsDao.assignRequestToUser;
exports.updateRequest = updateRequest;

exports.getRequestSummaries = requestsDao.getRequestSummariesByStatus;
exports.getRequestSummariesCount = requestsDao.getRequestSummariesCountByStatus;
exports.sendMailsToRequestTraveler = sendMailsToRequestTraveler;
exports.changeRequestStatus = requestsDao.modifyRequestStatusById;
exports.sendDailyReportOfRequestsCount = sendDailyReportOfRequestsCount;
exports.toggleOptions = requestsDao.toggleOptions;
exports.getPackage = getPackage;
exports.sendPackageByMail = sendPackageByMail;
exports.validatePromoCode = validatePromoCode;
exports.getTravelerEmails = requestsDao.getTravelerEmails;
