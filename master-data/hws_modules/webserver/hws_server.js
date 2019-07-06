/**
 * The hws server exposing the REST services
 */

var start = function() {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var bodyParser = require('body-parser');
	// var daoUtilities = require('../dataaccess/hws_dao_utilities.js');
	// var connection = daoUtilities.createConnection();
	var auth = require('../app/auth/index');

	// interfaces
	var publicInterface = require('./hws_public_interface.js');
	var budgetCalculationInterface = require('./hws_budget_calculation_interface.js');
	var recommendationInterface = require('./hws_country_recommendation_interface.js');
	var usersInterface = require('./hws_users_interface.js');
	var countriesInterface = require('./hws_countries_interface.js');
	var citiesInterface = require('./hws_cities_interface.js');
	var hotelsInterface = require('./hws_hotels_interface.js');
	var itinerariesInterface = require('./hws_itineraries_interface.js');
	var purposesInterface = require('./hws_purposes_interface.js');
	var interestsInterface = require('./hws_interests_interface.js');
	var budgetcategoriesInterface = require('./hws_budgetcategories_interface.js');
	var professionsInterface = require('./hws_professions_interface.js');
	var referralTypesInterface = require('./hws_referraltypes_interface.js');
	var statusesInterface = require('./hws_statuses_interface.js');

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

	//		users
	app.get('/master-data/users', auth.isAuthenticatedAsAdmin, usersInterface.getAllUsers);
	app.get('/master-data/users/ToAssign', usersInterface.getAllUsersToAssign);
	app.get('/master-data/users/active', auth.isAuthenticatedAsAdmin, usersInterface.getAllActiveUsers);
	app.post('/master-data/user/login', usersInterface.loginUser);
	app.put('/master-data/user', auth.isAuthenticatedAsAdmin, usersInterface.createUser);
	app.post('/master-data/user', auth.isAuthenticatedAsAdmin, usersInterface.updateUser);

	//		countries
	app.get('/master-data/countries', countriesInterface.getAll);
	app.get('/master-data/country/:id', countriesInterface.getById);
	app.put('/master-data/country', auth.isAuthenticated, countriesInterface.create);
	app.post('/master-data/country', auth.isAuthenticated, countriesInterface.update);

	//		cities
	app.get('/master-data/cities/:countryId', citiesInterface.getAllCitiesByCountry);
	app.get('/master-data/cities', citiesInterface.getAll);
	app.get('/master-data/citiesInIternaries', auth.isAuthenticated, citiesInterface.getAllCitiesInIternaries);
	app.get('/master-data/city/:id', citiesInterface.getById);
	app.put('/master-data/city', auth.isAuthenticated, citiesInterface.create);
	app.post('/master-data/city', auth.isAuthenticated, citiesInterface.update);

	//		hotels
	app.get('/master-data/hotels/:cityId', hotelsInterface.getAllByCity);
	app.get('/master-data/hotel/:id', hotelsInterface.getById);
	app.put('/master-data/hotel', auth.isAuthenticated, hotelsInterface.create);
	app.post('/master-data/hotel', auth.isAuthenticated, hotelsInterface.update);

	//		itineraries
	app.get('/master-data/itineraries', itinerariesInterface.getAll);
	app.get('/master-data/itinerary/:id', auth.isAuthenticated, itinerariesInterface.getById);
	app.put('/master-data/itinerary', auth.isAuthenticated, itinerariesInterface.create);
	app.post('/master-data/itinerary', auth.isAuthenticated, itinerariesInterface.update);
	app.post('/master-data/itinerary/note', auth.isAuthenticated, itinerariesInterface.updateAgentNotes);
	app.post('/master-data/itinerary/budgetcalc', budgetCalculationInterface.budgetCalculation);
	app.post('/master-data/itinerary/recommendation', recommendationInterface.recommendation);

	//		Purposes
	app.get('/master-data/purposes', purposesInterface.getAll);
	app.get('/master-data/purpose/:id', auth.isAuthenticated, purposesInterface.getById);
	app.put('/master-data/purpose', auth.isAuthenticated, purposesInterface.create);
	app.post('/master-data/purpose', auth.isAuthenticated, purposesInterface.update);

	//		Interests
	app.get('/master-data/interests', interestsInterface.getAll);
	app.get('/master-data/interest/:id', auth.isAuthenticated, interestsInterface.getById);
	app.put('/master-data/interest', auth.isAuthenticated, interestsInterface.create);
	app.post('/master-data/interest', auth.isAuthenticated, interestsInterface.update);

	//		BudgetCategories
	app.get('/master-data/budgetcategories', budgetcategoriesInterface.getAll);
	app.get('/master-data/budgetcategory/:id', auth.isAuthenticated, budgetcategoriesInterface.getById);
	app.put('/master-data/budgetcategory', auth.isAuthenticated, budgetcategoriesInterface.create);
	app.post('/master-data/budgetcategory', auth.isAuthenticated, budgetcategoriesInterface.update);

	//		Professions
	app.get('/master-data/professions', professionsInterface.getAll);
	app.get('/master-data/profession/:id', auth.isAuthenticated, professionsInterface.getById);
	app.put('/master-data/profession', auth.isAuthenticated, professionsInterface.create);
	app.post('/master-data/profession', auth.isAuthenticated, professionsInterface.update);

	//		Referral Types
	app.get('/master-data/referraltypes', referralTypesInterface.getAll);
	app.get('/master-data/referraltype/:id', auth.isAuthenticated, referralTypesInterface.getById);
	app.put('/master-data/referraltype', auth.isAuthenticated, referralTypesInterface.create);
	app.post('/master-data/referraltype', auth.isAuthenticated, referralTypesInterface.update);

	//		Statuses
	app.get('/master-data/statuses', auth.isAuthenticated, statusesInterface.getAll);
	app.get('/master-data/status/:id', auth.isAuthenticated, statusesInterface.getById);
	app.put('/master-data/status', auth.isAuthenticated, statusesInterface.update);
	app.post('/master-data/status', auth.isAuthenticated, statusesInterface.create);
	app.delete('/master-data/status/:id', auth.isAuthenticated, statusesInterface.delete);

	// Videos
	app.get('/master-data/public/videos', publicInterface.getVideos);
	app.post('/master-data/public/video', auth.isAuthenticated, publicInterface.create);
	app.put('/master-data/public/video', auth.isAuthenticated, publicInterface.update);

	// Website
	app.get('/master-data/public/phones', publicInterface.getPhones);
	app.post('/master-data/public/phone', publicInterface.createPhone);
	app.put('/master-data/public/phone', publicInterface.updatePhone);

	// routing - end

	var port = process.env.PORT || 8083;

	app.listen(port, function() {
		console.log('%s: "master-data" Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;
