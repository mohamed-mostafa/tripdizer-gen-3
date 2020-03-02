const requestsBusiness = require('../business/hws_requests_business.js');

const placeWebsiteRequest = function(req, res) {
	try {
		var request = req.body.request;
		request.isFromWebsite = true;
		// call the business function and give it a callback function
		requestsBusiness.placeRequest(
			request,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.error('An error occurred in /website/place');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const placeDashboardRequest = function(req, res) {
	try {
		var request = req.body.request;
		request.isFromDashboard = true;
		// call the business function and give it a callback function
		requestsBusiness.placeRequest(
			request,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.error('An error occurred in /dashboard/place');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getRequestById = function(req, res) {
	try {
		var requestId = req.params.requestId;
		// call the business function and give it a callback function
		requestsBusiness.getRequestById(
			requestId,
			function(request) {
				res.json(request);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getRequestSummaries = function(req, res) {
	try {
		// call the business function and give it a callback function
		var statuses = req.query.statuses;
		var page = req.query.page;
		var size = req.query.size;
		requestsBusiness.getRequestSummaries(
			statuses.split(','),
			page,
			size,
			function(requestSummaries) {
				res.json(requestSummaries);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /status');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getRequestSummariesCount = function(req, res) {
	try {
		// call the business function and give it a callback function
		var statuses = req.query.statuses;
		var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
		requestsBusiness.getRequestSummariesCount(
			statuses.split(','),
			filter,
			function(response) {
				res.json(response);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /status/' + statuses + '/count');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const sendMailsToRequestTraveler = function(req, res) {
	try {
		var email = req.body.email;
		// call the business function and give it a callback function
		requestsBusiness.sendMailsToRequestTraveler(
			email,
			function(response) {
				res.json(response);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /statuses/send-mails');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const changeRequestStatus = function(req, res) {
	try {
		var requestId = req.body.requestId;
		var status = req.body.status;
		// call the business function and give it a callback function
		requestsBusiness.changeRequestStatus(
			requestId,
			status,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /status');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getRequestsByMail = function(req, res) {
	try {
		let user = req.user;
		// call the business function and give it a callback function
		requestsBusiness.getRequestsByMail(
			user,
			function(request) {
				res.json(request);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SET STATUS ------------------------------

const markRequestBeingPrepared = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function
		requestsBusiness.markRequestBeingPrepared(
			requestId,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /ststus/beingprepared');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const markRequestDelivered = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function
		requestsBusiness.markRequestDelivered(
			requestId,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /ststus/delivered');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const markRequestPlaced = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function
		requestsBusiness.markRequestPlaced(
			requestId,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /status/placed');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const assignRequestToUser = function(req, res) {
	try {
		var requestId = req.body.requestId;
		var userId = req.body.userId;
		// call the business function and give it a callback function
		requestsBusiness.assignRequestToUser(
			requestId,
			userId,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /assign');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const updateRequest = function(req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function
		requestsBusiness.updateRequest(
			request,
			function() {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

const budgetCalculation = function(req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function
		requestsBusiness.budgetCalculation(
			request,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.error('An error occurred in /budgetCalculation');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const recommendation = function(req, res) {
	try {
		var request = req.body.request;
		var lang = req.query.lang;
		// call the business function and give it a callback function
		requestsBusiness.recommendation(
			request,
			lang,
			function(request) {
				res.json(request);
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.error('An error occurred in /recommendation');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const toggleOptions = function(req, res) {
	try {
		var requestId = req.body.requestId;
		var option = req.body.option;
		// call the business function and give it a callback function
		requestsBusiness.toggleOptions(
			requestId,
			option,
			function(result) {
				res.json();
			},
			function(error) {
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(userErrorMessage) {
				res.status(500).send(userErrorMessage);
			}
		);
	} catch (error) {
		console.error('An error occurred in /toggleOptions');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getPackage = function(req, res) {
	try {
		var requestId = req.params.requestId;
		// call the business function and give it a callback function
		requestsBusiness.getPackage(
			requestId,
			req.headers.authorization,
			function(packageUrl) {
				res.send(packageUrl);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const sendPackageByMail = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function
		requestsBusiness.sendPackageByMail(
			requestId,
			function(response) {
				res.send(response);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const validatePromoCode = function(req, res) {
	try {
		var promoCode = req.query.promoCode;
		// call the business function and give it a callback function
		requestsBusiness.validatePromoCode(
			promoCode,
			function(isValid) {
				res.send(isValid);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /promo-code-validity');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getTravelerEmails = function(req, res) {
	try {
		// call the business function and give it a callback function
		requestsBusiness.getTravelerEmails(
			function(emails) {
				res.send(emails);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /emails');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

const getPaymentStatus = function(req, res) {
	try {
		// call the business function and give it a callback function
		requestsBusiness.getPaymentStatus(
			function(status) {
				res.send(status);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /payment status');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

let requestACall = function(req, res) {
	try {
		let request = {
			name: req.body.name,
			mobile: req.body.mobile,
			email: req.body.email,
		};
		// call the business function and give it a callback function
		requestsBusiness.requestACall(
			request,
			function(data) {
				res.json(data);
			},
			function(error) {
				res
					.status(500)
					.send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			},
			function(businessError) {
				res.status(500).send(businessError);
			}
		);
	} catch (error) {
		console.error('An error occurred in /request a call /');
		console.error(error);
		res
			.status(500)
			.send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

let getAllRequestsACall = function(req, res) {
	try {
		// call the business function and give it a callback function
		requestsBusiness.getAllRequestsACall(
			function(status) {
				res.send(status);
			},
			function(error) {
				console.error(error);
				res
					.status(500)
					.send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}
		);
	} catch (error) {
		console.error('An error occurred in /get all requests a call');
		console.error(error);
		res
			.status(500)
			.send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.placeWebsiteRequest = placeWebsiteRequest;
exports.placeDashboardRequest = placeDashboardRequest;
exports.getRequestById = getRequestById;
exports.assignRequestToUser = assignRequestToUser;
exports.updateRequest = updateRequest;

exports.getRequestSummaries = getRequestSummaries;
exports.getRequestSummariesCount = getRequestSummariesCount;
exports.sendMailsToRequestTraveler = sendMailsToRequestTraveler;
exports.changeRequestStatus = changeRequestStatus;

exports.markRequestBeingPrepared = markRequestBeingPrepared;
exports.markRequestDelivered = markRequestDelivered;
exports.markRequestPlaced = markRequestPlaced;
exports.budgetCalculation = budgetCalculation;
exports.recommendation = recommendation;
exports.toggleOptions = toggleOptions;
exports.getPackage = getPackage;
exports.sendPackageByMail = sendPackageByMail;
exports.validatePromoCode = validatePromoCode;
exports.getTravelerEmails = getTravelerEmails;
exports.getRequestsByMail = getRequestsByMail;
exports.getPaymentStatus = getPaymentStatus;
exports.requestACall = requestACall;
exports.getAllRequestsACall = getAllRequestsACall;
