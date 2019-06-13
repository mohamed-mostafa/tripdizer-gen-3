/**
 * The hws server exposing the REST services
 */

var start = function() {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var bodyParser = require('body-parser');
	var auth = require('../app/auth/index');

	// interfaces
	require('../app/cron/index');
	var requestsInterface = require('./hws_requests_interface.js');
	var grouptripsInterface = require('./hws_grouptrips_interface.js');

	var json2xls = require('json2xls');
	var app = express();
	// your express configuration here

	app.use(cors()); // add CORS middleware (to enable cross-domain requests from clients.)
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);
	app.use(bodyParser.json()); // for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls

	// routing - Start

	// requests
	app.put('/request/website/place', requestsInterface.placeWebsiteRequest);
	app.put('/request/dashboard/place', requestsInterface.placeDashboardRequest);
	app.get('/request/promocodevalidity', requestsInterface.validatePromoCode);
	app.get('/request/:requestId', auth.isAuthenticated, requestsInterface.getRequestById);
	app.put('/request', auth.isAuthenticated, requestsInterface.updateRequest);
	app.post('/request/assign', auth.isAuthenticated, requestsInterface.assignRequestToUser);
	app.get('/request/statuses/summaries', auth.isAuthenticated, requestsInterface.getRequestSummaries);
	app.get('/request/statuses/count', auth.isAuthenticated, requestsInterface.getRequestSummariesCount);
	app.post('/request/statuses/sendmails', auth.isAuthenticated, requestsInterface.sendMailsToRequestTraveler);
	app.post('/request/status', auth.isAuthenticated, requestsInterface.changeRequestStatus);
	app.post('/request/budgetcalc', requestsInterface.budgetCalculation);
	app.post('/request/recommendation', requestsInterface.recommendation);
	app.get('/request/package/:requestId', auth.isAuthenticated, requestsInterface.getPackage);
	app.post('/request/send-package', requestsInterface.sendPackageByMail);
	app.get('/request/statuses/emails', auth.isAuthenticatedAsAdmin, requestsInterface.getTravelerEmails);

	// 		set status
	app.post('/request/status/placed', auth.isAuthenticated, requestsInterface.markRequestPlaced);
	app.post('/request/status/beingprepared', auth.isAuthenticated, requestsInterface.markRequestBeingPrepared);
	app.post('/request/status/delivered', auth.isAuthenticated, requestsInterface.markRequestDelivered);
	app.put('/request/toggleoptions', auth.isAuthenticated, requestsInterface.toggleOptions);

	// Group Trips
	app.get('/groupTrips', auth.isAuthenticated, grouptripsInterface.getAll);
	app.get('/groupTrips/current', grouptripsInterface.getAllCurrentTrips);
	app.get('/groupTrips/:id', auth.isAuthenticated, grouptripsInterface.getById);
	app.post('/groupTrips', auth.isAuthenticated, grouptripsInterface.create);
	app.post('/groupTrips/register', grouptripsInterface.register);
	app.put('/groupTrips/toggle', auth.isAuthenticated, grouptripsInterface.toggle);
	app.put('/groupTrips', auth.isAuthenticated, grouptripsInterface.update);

	// routing - end

	var port = process.env.PORT || 8080;

	app.listen(port, function() {
		console.log('%s: Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;
