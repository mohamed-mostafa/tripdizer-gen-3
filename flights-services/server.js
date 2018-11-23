/**
 * The hws server exposing the REST services
 */

var start = function () {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var flightsBusiness = require('./business/itinerary_flights_cost_updater.js');
	
	var app = express();
	// your express configuration here

	app.use(cors()); // add CORS middleware (to enable cross-domain requests from clients.)

	// routing - Start

	app.get('/update-flights-prices', (req, res) => {
		flightsBusiness.updateAllFlightsCosts();
		res.status(200).end();
	});
	
	// routing - end

	var port = process.env.PORT || 8080;

	app.listen(port, function () {
		console.log('%s: Node server started on %d ...', Date(Date.now()), port);
	});
};

start();