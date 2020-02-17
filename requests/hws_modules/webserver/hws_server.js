/**
 * The hws server exposing the REST services
 */

let start = function() {
	// initialize express
	const express = require('express');
	const cors = require('cors');
	const bodyParser = require('body-parser');
	const auth = require('../app/auth/index');
	const publicUserAuth = require('../app/auth/publicUserAuth');
	// interfaces
	require('../app/cron/index');
	const requestsInterface = require('./hws_requests_interface.js');
	const grouptripsInterface = require('./hws_grouptrips_interface.js');
	const paymentsInterface = require('./hws_payments_interface');

	const json2xls = require('json2xls');
	const app = express();
	// your express configuration here

	app.use(cors()); // add CORS middleware (to enable cross-domain requests from clients.)
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);
	app.use(bodyParser.json()); // for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls

	var router = express.Router();
	// routing - Start

	// requests
	router.put('/website/place', requestsInterface.placeWebsiteRequest);
	router.put('/dashboard/place', requestsInterface.placeDashboardRequest);
	router.get('/promo-code-validity', requestsInterface.validatePromoCode);
	router.get('/users/requests', publicUserAuth.isPublicUserAuthenticated, requestsInterface.getRequestsByMail);
	router.get('/paymentStatus', auth.isAuthenticated, requestsInterface.getPaymentStatus);
	router.get('/:requestId', auth.isAuthenticated, requestsInterface.getRequestById);
	router.put('/', auth.isAuthenticated, requestsInterface.updateRequest);
	router.post('/assign', auth.isAuthenticated, requestsInterface.assignRequestToUser);
	router.get('/statuses/summaries', auth.isAuthenticated, requestsInterface.getRequestSummaries);
	router.get('/statuses/count', auth.isAuthenticated, requestsInterface.getRequestSummariesCount);
	router.post('/statuses/send-mails', auth.isAuthenticated, requestsInterface.sendMailsToRequestTraveler);
	router.get('/package/:requestId', auth.isAuthenticated, requestsInterface.getPackage);
	router.post('/send-package', requestsInterface.sendPackageByMail);
	router.get('/statuses/emails', auth.isAuthenticatedAsAdmin, requestsInterface.getTravelerEmails);
	// 		set status and options
	router.put('/toggle-options', auth.isAuthenticated, requestsInterface.toggleOptions);
	router.post('/status', auth.isAuthenticated, requestsInterface.changeRequestStatus);

	// Group Trips
	router.get('/group-trips', auth.isAuthenticated, grouptripsInterface.getAll);
	router.get('/group-trips/current', grouptripsInterface.getAllCurrentTrips);
	router.get('/group-trips/:id', auth.isAuthenticated, grouptripsInterface.getById);
	router.post('/group-trips', auth.isAuthenticated, grouptripsInterface.create);
	router.post('/group-trips/register', grouptripsInterface.register);
	router.put('/group-trips/toggle', auth.isAuthenticated, grouptripsInterface.toggle);
	router.put('/group-trips', auth.isAuthenticated, grouptripsInterface.update);

	// Payments
	router.get('/payments/key/:amount', auth.isAuthenticated, paymentsInterface.generatePaymentKeyWithOrderRegistration);
	router.post('/payments/notification-callback', paymentsInterface.notificationCallback);
	router.get('/payments/response-callback', paymentsInterface.responseCallback);

	// routing - end
	app.use('/requests', router);

	var port = process.env.PORT || 8082;

	app.listen(port, function() {
		console.log('%s: "requests" Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;
