/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
let transportationDao = require('../dataaccess/hws_request_transporation_dao');
let accomodationDao = require('../dataaccess/hws_request_accomodation_dao');
let attractionsDao = require('../dataaccess/hws_request_attractions_dao');
let pnrDao = require('../dataaccess/hws_request_PNR_dao');
let citiesDao = require('../dataaccess/hws_request_cities_dao');
let bookingsDao = require('../dataaccess/hws_bookings_dao');
let paymentDao = require('../dataaccess/hws_payments_dao');
var emailBusiness = require('../adapters/hws_email_adapter.js');
var paymentsService = require('./hws_payments_business');
var Promise = require('promise');
var httpRequest = require('request');
var googlePeopleAdapter = require('../adapters/google_people_adapter.js');
let googlePubSubAdapter = require('../adapters/PubSubPublishers');
let moment = require('moment');

const MASTER_DATA_ENDPOINT = process.env.MASTER_DATA_ENDPOINT || 'http://localhost:8083';
const MEDIA_STORAGE_BASE_URL =
	process.env.MEDIA_STORAGE_BASE_URL || 'https://storage.cloud.google.com/tripdizer-dev.appspot.com';
const BYPASS_PAYMENT = process.env.BYPASS_PAYMENT || 'N';

//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function(request, onSuccess, onFailure, onUserError) {
	request = {
		...request,
		status: request.isFromWebsite ? 1 : request.status,
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
	request.estimatedCost = getItineraryCostFromRequest(request.flightOffers, request.selectedHotels);
	request.score = calculateRequestScore(request);
	requestsDao.createNewRequest(
		request,
		async function(request) {
			// request is created. now persist the cities/accomodation/transportation/attractions
			var requestSelectedHotels = { choices: request.selectedHotels };
			var requestSelectedCities = { choices: request.selectedCities };
			var requestSelectedAttractions = { choices: request.selectedAttractions };
			var requestFlightOffers = { choices: request.flightOffers };
			accomodationDao.save(request.id, requestSelectedHotels);
			transportationDao.save(request.id, requestFlightOffers);
			citiesDao.save(request.id, requestSelectedCities);
			attractionsDao.save(request.id, requestSelectedAttractions);

			if (request.requiresPayment) {
				// if (BYPASS_PAYMENT == "Y") {
				// 	request.pnrInfoList = require('../../test-data/pnr.json');
				// }
				// save PNR info
				var requestPNRInfo = { choices: request.pnrInfoList };
				pnrDao.save(request.id, requestPNRInfo);

				if (BYPASS_PAYMENT == 'Y') {
					await new Promise((resolve, reject) => {
						setTimeout(() => resolve(), 10000);
					});
					publishRequestChoicesForBooking(request.id);
				}
				// at this point, we've saved the request to the database. let's generate a payment key
				request.paymentKey = await new Promise(resolve => {
					paymentsService.generatePaymentKeyWithOrderRegistration(
						true,
						request,
						({ paymentKey }) => {
							requestsDao.updatePaymentStatusById(
								request.id,
								0, //pending payment
								() => {
									requestsDao.modifyRequestPaymentInfo(
										request.id,
										paymentKey,
										() => {
											resolve(paymentKey); // only when persisting the request status, and the payment info in the database, we return the payment key to the front-end, to start the payment process
										},
										err => {
											console.log(
												'Failed to update payment info of the request in the database. Reason: ' + JSON.stringify(err)
											);
											resolve(); // if we failed, we won't proceed with payment. we need to make sure all the request data in the database is accurate before payment proceeds
										}
									);
								},
								err => {
									console.log('Failed to update request status in the database. Reason: ' + JSON.stringify(err));
									resolve(); // if we failed, we won't proceed with payment. we need to make sure all the request data in the database is accurate before payment proceeds
								}
							);
						},
						err => {
							console.error('An error occurred while generating a payment key');
							console.error(err);
							resolve();
						}
					);
				});
			} else {
				const package = await new Promise(resolve => {
					getPackage(
						request.id,
						null,
						data => {
							console.log('Package creation succeeded. Now responding to caller');
							resolve({ packageUrl: data.pdfUrl, packageDownloadUrl: data.pdfDownloadUrl });
						},
						data => {
							if (data && data.pdfUrl) {
								console.log('Package creation partially succeeded. Now responding to caller');
								resolve({ packageUrl: data.pdfUrl, packageDownloadUrl: data.pdfDownloadUrl });
							} else {
								console.error('Package creation failed. Reason: ' + data + ', Responding to caller anyway');
								resolve({});
							}
							// onSuccess(request);
						},
						{ choices: request.flightOffers },
						{ choices: request.selectedCities },
						{ choices: request.selectedHotels },
						{ choices: request.selectedAttractions }
					);
				});
				requestsDao.updatePaymentStatusById(
					request.id,
					2, // unpaid
					() => console.log('Traveler request payment status updated successfully '),
					err => console.log('Failed to update request status in the database. Reason: ' + JSON.stringify(err))
				);
				request = { ...request, ...package };
			}

			onSuccess(request);

			// notify creation
			if (process.env.ENABLE_AGENTS_NOTIFICATION_EMAIL == 'TRUE')
				emailBusiness.sendEmail(
					'bookings@tripdizer.com',
					'notifications@tripdizer.com',
					'Request #' + request.id + ' is placed at Tripdizer',
					request.traveler.name +
						' has just placed a new request at Tripdizer. Visit the Dashboard to view its details.'
				);

			if (process.env.ENABLE_END_USER_CONFIRMATION_EMAIL == 'TRUE' && !request.requiresPayment)
				notifyCustomer(request.traveler.email, request.traveler.name, request.id);

			if (process.env.ENABLE_GOOGLE_PEOPLE_CONTACT_CREATION == 'TRUE')
				googlePeopleAdapter.createNewContact(
					request.traveler.email,
					request.traveler.name,
					request.traveler.mobile,
					'(' + request.id.toString() + ')'
				);
		},
		function(err) {
			// respond to caller
			console.error('An error occurred while saving a new request');
			console.error(err);
			onFailure(err);
			// });
			// }
		},
		function(err) {
			console.error('An error occurred while checking if traveler exists before');
			console.error(err);
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
			console.error('An error occurred while getting request package');
			console.error(err);
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
				console.error('An error occurred while getting travelers');
				console.error(err);
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
			console.error('An error occurred while getting request counts');
		}
	);
};

var getPackage = function(
	requestId,
	accessToken,
	onSuccess,
	onFailure,
	requestFlightOffers,
	requestSelectedCities,
	requestSelectedHotels,
	requestSelectedAttractions
) {
	getRequestById(
		requestId,
		async function(request) {
			try {
				// if flights/accommodations/attractions/cities are passed to getPackage, ignore the ones with the request
				var flightOffers = requestFlightOffers != null ? requestFlightOffers : request.flightOffers;
				var selectedCities = requestSelectedCities != null ? requestSelectedCities : request.selectedCities;
				var selectedHotels = requestSelectedHotels != null ? requestSelectedHotels : request.selectedHotels;
				var selectedAttractions =
					requestSelectedAttractions != null ? requestSelectedAttractions : request.selectedAttractions;
				const departureDate = new Date(request.departureDate);
				const returnDate = new Date(request.returnDate);
				const tripDays = Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24));
				if (request.itineraryId && request.itineraryId !== -1) {
					httpRequest.get(
						{
							url: MASTER_DATA_ENDPOINT + '/master-data/itinerary/' + request.itineraryId,
							json: true,
							headers: { authorization: accessToken },
						},
						async function(error, response, itinerary) {
							if (error || response.statusCode != 200) {
								console.error('An error occurred while getting itinerary from master-data to generate request package');
								console.log(error || response.statusMessage);
								onFailure(error || response.statusMessage);
							} else if (itinerary.flights.length > 0) {
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
								'https://script.google.com/macros/s/AKfycbyRDf8cl_dobu-eNVnXuf9WFZ3xSwa9byvJYbTjnyO_2Vo2WIw0/exec',
								JSON.stringify(request),
								function(doc) {
									packageHttp(
										'get',
										`https://script.google.com/macros/s/AKfycbyRDf8cl_dobu-eNVnXuf9WFZ3xSwa9byvJYbTjnyO_2Vo2WIw0/exec?docId=${
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
											console.error('An error occurred while getting request package pdf: ' + e);
											onSuccess(doc);
										}
									);
								},
								e => {
									console.error('An error occurred while getting request package document: ' + e);
									onFailure(e);
								}
							);
						}
					);
				} else if (flightOffers && selectedHotels && selectedCities && selectedAttractions) {
					console.log('Starting to generate package for request:');
					var detailsOfFirstCountry = await getPackageDetailsOfCountry(selectedCities.choices[0].countryIsoCode);
					request = {
						id: request.id,
						travelerName: request.traveler.name ? request.traveler.name : '',
						estimatedCost: request.estimatedCost,
						numberOfTravelers: request.adultsNumber + request.kidsNumber + request.infantsNumber,
						itinerary: {
							name: selectedCities.choices.reduce(
								(itineraryName, city, index) =>
									index == 0 ? itineraryName + city.name : itineraryName + ', ' + city.name,
								''
							),
							...detailsOfFirstCountry,
							image1: (await isValidImage(
								MEDIA_STORAGE_BASE_URL + '/' + selectedCities.choices[0].countryIsoCode + '.png'
							))
								? MEDIA_STORAGE_BASE_URL + '/' + selectedCities.choices[0].countryIsoCode + '.png'
								: 'https://i.imgur.com/LsHCFiD.jpg',
							flights: flightOffers.choices[0].flightLegs.map(leg => ({
								date: leg.segments ? new moment(leg.segments[0].departure).format('DD/MM/YYYY') : '',
								departingFrom: leg.segments ? leg.segments[0].originDetails : '',
								arrivingTo: leg.segments ? leg.segments[leg.segments.length - 1].destinationDetails : '',
								departureTime: leg.segments ? new moment(leg.segments[0].departure).format('DD/MM HH:mm') : '',
								arrivalTime: leg.segments
									? new moment(leg.segments[leg.segments.length - 1].return).format('DD/MM HH:mm')
									: '',
								layOver: leg.transitDurationInMinutes == 0 ? 'Direct' : leg.transitDurationInWords,
							})),
							hotels: selectedHotels.choices.map(offer => ({
								cityName: offer.city ? offer.city : '',
								checkIn: offer.checkin ? new moment(offer.checkin).format('DD/MM') : '',
								checkOut: offer.checkout ? new moment(offer.checkout).format('DD/MM') : '',
								nights: offer.numberOfNights ? offer.numberOfNights : '',
								name: offer.name ? offer.name : '',
							})),
						},
					};
					console.log('Request going to google docs:');
					packageHttp(
						'post',
						'https://script.google.com/macros/s/AKfycbyRDf8cl_dobu-eNVnXuf9WFZ3xSwa9byvJYbTjnyO_2Vo2WIw0/exec',
						JSON.stringify(request),
						function(doc) {
							console.log('File created. Id: ' + doc.docId + ', Now generating the PDF');
							packageHttp(
								'get',
								`https://script.google.com/macros/s/AKfycbyRDf8cl_dobu-eNVnXuf9WFZ3xSwa9byvJYbTjnyO_2Vo2WIw0/exec?docId=${
									doc.docId
								}`,
								null,
								function(package) {
									console.log('PDF Created. Id: ' + package.pdfId + ', Now saving doc and pdf ids to the request');
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
									console.error('An error occurred while getting request package pdf: ' + e);
									onSuccess(doc);
								}
							);
						},
						e => {
							console.error('An error occurred while getting request package document: ' + e);
							onFailure(e);
						}
					);
				} else {
					onFailure("Itinerary Id doesn't exists!, or selected flights/accomodation/cities/attractions don't exist");
				}
			} catch (err) {
				console.error('An error occured while building the package');
				console.error(err);
				onFailure(err);
			}
		},
		function(err) {
			console.error('An error occurred while getting request package');
			console.error(err);
			onFailure(err);
		}
	);
};
var getItineraryCostFromRequest = function(flightOffers, accomodationOffers) {
	var cost = 0;
	if (flightOffers) cost += flightOffers.reduce((cost, offer) => parseInt(cost) + parseInt(offer.price), 0);
	if (accomodationOffers) cost += accomodationOffers.reduce((cost, offer) => parseInt(cost) + parseInt(offer.price), 0);
	return cost;
};

var getPackageDetailsOfCountry = function(isoCode) {
	return new Promise((resolve, reject) => {
		httpRequest.get({ url: MASTER_DATA_ENDPOINT + '/master-data/country/' + isoCode, json: true }, function(
			error,
			response,
			country
		) {
			if (error || response.statusCode != 200) {
				reject(error || response.statusMessage);
			} else {
				resolve({
					introduction: country.introduction,
					includes: country.includes,
					excludes: country.excludes,
					visaRequirements: country.visaRequirements,
				});
			}
		});
	});
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
				'<p>Please note that this is just a primarily package, one of our representatives will get in touch with you within 48 hours after submitting your request.</p>';
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
			console.error('An error occurred while getting request package');
			console.error(err);
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

function getRequestById(requestId, onSuccess, onFailure) {
	requestsDao.getRequestById(
		requestId,
		async function(request) {
			try {
				var accomodationOffers = await accomodationDao.get(requestId);
				if (accomodationOffers.exists) request.selectedHotels = accomodationOffers.data();

				var flightOffers = await transportationDao.get(requestId);
				if (flightOffers.exists) request.flightOffers = flightOffers.data();

				var cities = await citiesDao.get(requestId);
				if (cities.exists) request.selectedCities = cities.data();

				var attractions = await attractionsDao.get(requestId);
				if (attractions.exists) request.selectedAttractions = attractions.data();

				var pnrInfo = await pnrDao.get(requestId);
				if (pnrInfo.exists) request.pnrInfo = pnrInfo.data();

				if (request.flightOffers && request.flightOffers.choices && request.flightOffers.choices.length > 0) {
					for (var i = 0; i < request.flightOffers.choices.length; i++) {
						var flightBookingInfo = await bookingsDao.getFlightBookingResult(
							requestId,
							request.flightOffers.choices[i].fareSourceCode
						);
						if (flightBookingInfo.exists) request.flightOffers.choices[i].bookingInfo = flightBookingInfo.data();
					}
				}

				if (request.selectedHotels && request.selectedHotels.choices && request.selectedHotels.choices.length > 0) {
					for (var i = 0; i < request.selectedHotels.choices.length; i++) {
						var hotelBookingInfo = await bookingsDao.getHotelBookingResult(
							requestId,
							request.selectedHotels.choices[i].moreDetails.hotelId
						);
						if (hotelBookingInfo.exists) request.selectedHotels.choices[i].bookingInfo = hotelBookingInfo.data();
					}
				}

				var paymentInfo = await paymentDao.get(requestId);
				if (paymentInfo.exists) request.paymentInfo = paymentInfo.data();

				onSuccess(request);
			} catch (err) {
				console.log('Failed to retrieve data for request by id: ' + requestId);
				console.error(err);
				onFailure(err);
			}
		},
		function(err) {
			console.log('Failed to retrieve a request by Id: ' + requestId);
			console.error(err);
			onFailure(err);
		}
	);
}

var publishRequestChoicesForBooking = function(requestId) {
	return new Promise((resolve, reject) => {
		getRequestById(
			requestId,
			request => {
				if (request.flightOffers && request.flightOffers.choices) {
					request.flightOffers.choices.forEach(flightOffer => {
						googlePubSubAdapter.publishFlightBookingMessage(requestId, flightOffer, request.pnrInfo);
					});
				} else {
					console.error(
						`FATAL ERROR: Suspecious request with id: ${requestId}. No flights booking information available. Request doesn't have flight offers to book ?`
					);
				}

				if (request.selectedHotels && request.selectedHotels.choices) {
					request.selectedHotels.choices.forEach(hotel => {
						googlePubSubAdapter.publishHotelBookingMessage(requestId, hotel, request.pnrInfo);
					});
				} else {
					console.error(
						`FATAL ERROR: Suspecious request with id: ${requestId}. No hotel booking information available. Request doesn't have hotels to book ?`
					);
				}
				resolve();
			},
			err => {
				console.error(
					`FATAL ERROR: Failed to retrieve the request with id: ${requestId}. Request should be paid but booking messages has not been published`
				);
				console.error(err);
				reject(err);
			}
		);
	});
};

var handlePaidRequest = function(requestId) {
	requestsDao.updatePaymentStatusById(
		requestId,
		1, // paid
		() => {},
		() => {
			console.error(
				"FATAL ERROR: Failed to update request status to 'paid' for request: " +
					requestId +
					'. Publishing booking messages will proceed anyway'
			);
		}
	);
	if (BYPASS_PAYMENT == 'Y') {
		// booking was started immediately after saving the request, without waiting for the payment
		// no need to proceed with bookings again
	} else {
		publishRequestChoicesForBooking(requestId)
			.then(result => {
				console.log(
					'Attempts to publish booking messages for request: ' +
						requestId +
						' completed successfully for all flights and hotels'
				);
			})
			.catch(err => {
				console.error(
					'FATAL ERROR: Publishing booking messages for request: ' +
						requestId +
						' failed for the following reason: ' +
						JSON.stringify(err)
				);
			});
	}
};

exports.placeRequest = placeRequest;
exports.getRequestById = getRequestById;
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
exports.handlePaidRequest = handlePaidRequest;
