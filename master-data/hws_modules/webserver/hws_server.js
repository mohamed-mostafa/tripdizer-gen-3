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
	var attractionsInterface = require('./hws_attractions_interface.js');
	var itinerariesInterface = require('./hws_itineraries_interface.js');
	var purposesInterface = require('./hws_purposes_interface.js');
	var interestsInterface = require('./hws_interests_interface.js');
	var budgetCategoriesInterface = require('./hws_budgetcategories_interface.js');
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
	app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls

	var router = express.Router();
	// routing - Start

	//		users
	router.get('/users', auth.isAuthenticatedAsAdmin, usersInterface.getAllUsers);
	router.get('/users/to-assign', usersInterface.getAllUsersToAssign);
	router.get('/users/active', auth.isAuthenticatedAsAdmin, usersInterface.getAllActiveUsers);
	router.post('/user/login', usersInterface.loginUser);
	router.put('/user', auth.isAuthenticatedAsAdmin, usersInterface.createUser);
	router.post('/user', auth.isAuthenticatedAsAdmin, usersInterface.updateUser);

	//		countries
	router.get('/countries', countriesInterface.getAll);
	router.get('/country/:id', countriesInterface.getById);
	router.put('/country', auth.isAuthenticated, countriesInterface.create);
	router.post('/country', auth.isAuthenticated, countriesInterface.update);
	router.post('/country/:id/:active', auth.isAuthenticated, countriesInterface.toggleActivation);

	//		cities
	router.get('/cities/:countryId', citiesInterface.getAllCitiesByCountry);
	router.get('/cities', citiesInterface.getAll);
	router.get('/citiesInIternaries', auth.isAuthenticated, citiesInterface.getAllCitiesInIternaries);
	router.get('/city/:id', citiesInterface.getById);
	router.put('/city', auth.isAuthenticated, citiesInterface.create);
	router.post('/city', auth.isAuthenticated, citiesInterface.update);
	router.post('/city/:id/:active', auth.isAuthenticated, citiesInterface.toggleActivation);

	//		hotels
	router.get('/hotels/:cityId', hotelsInterface.getAllByCity);
	router.get('/hotel/:id', hotelsInterface.getById);
	router.put('/hotel', auth.isAuthenticated, hotelsInterface.create);
	router.post('/hotel', auth.isAuthenticated, hotelsInterface.update);
	router.post('/hotel/:id/:active', auth.isAuthenticated, hotelsInterface.toggleActivation);

	//		attractions
	router.get('/attractions/:cityId', attractionsInterface.getAllAttractionsByCity);
	router.get('/attraction/:id', attractionsInterface.getById);
	router.put('/attraction', auth.isAuthenticated, attractionsInterface.create);
	router.post('/attraction', auth.isAuthenticated, attractionsInterface.update);
	router.post('/attraction/:id/:active', auth.isAuthenticated, attractionsInterface.toggleActivation);

	//		itineraries
	router.get('/itineraries', itinerariesInterface.getAll);
	router.get('/itinerary/:id', auth.isAuthenticated, itinerariesInterface.getById);
	router.put('/itinerary', auth.isAuthenticated, itinerariesInterface.create);
	router.post('/itinerary', auth.isAuthenticated, itinerariesInterface.update);
	router.post('/itinerary/note', auth.isAuthenticated, itinerariesInterface.updateAgentNotes);
	router.post('/itinerary/budget-calculation', budgetCalculationInterface.budgetCalculation);
	router.post('/itinerary/recommendation', recommendationInterface.recommendation);

	//		Purposes
	router.get('/purposes', purposesInterface.getAll);
	router.get('/purpose/:id', auth.isAuthenticated, purposesInterface.getById);
	router.put('/purpose', auth.isAuthenticated, purposesInterface.create);
	router.post('/purpose', auth.isAuthenticated, purposesInterface.update);

	//		Interests
	router.get('/interests', interestsInterface.getAll);
	router.get('/interest/:id', auth.isAuthenticated, interestsInterface.getById);
	router.put('/interest', auth.isAuthenticated, interestsInterface.create);
	router.post('/interest', auth.isAuthenticated, interestsInterface.update);

	//		BudgetCategories
	router.get('/budget-categories', budgetCategoriesInterface.getAll);
	router.get('/budget-category/:id', auth.isAuthenticated, budgetCategoriesInterface.getById);
	router.put('/budget-category', auth.isAuthenticated, budgetCategoriesInterface.create);
	router.post('/budget-category', auth.isAuthenticated, budgetCategoriesInterface.update);

	//		Professions
	router.get('/professions', professionsInterface.getAll);
	router.get('/profession/:id', auth.isAuthenticated, professionsInterface.getById);
	router.put('/profession', auth.isAuthenticated, professionsInterface.create);
	router.post('/profession', auth.isAuthenticated, professionsInterface.update);

	//		Referral Types
	router.get('/referral-types', referralTypesInterface.getAll);
	router.get('/referral-type/:id', auth.isAuthenticated, referralTypesInterface.getById);
	router.put('/referral-type', auth.isAuthenticated, referralTypesInterface.create);
	router.post('/referral-type', auth.isAuthenticated, referralTypesInterface.update);

	//		Statuses
	router.get('/statuses', auth.isAuthenticated, statusesInterface.getAll);
	router.get('/status/:id', auth.isAuthenticated, statusesInterface.getById);
	router.put('/status', auth.isAuthenticated, statusesInterface.update);
	router.post('/status', auth.isAuthenticated, statusesInterface.create);
	router.delete('/status/:id', auth.isAuthenticated, statusesInterface.delete);

	// Videos
	router.get('/public/videos', publicInterface.getVideos);
	router.post('/public/video', auth.isAuthenticated, publicInterface.create);
	router.put('/public/video', auth.isAuthenticated, publicInterface.update);

	// Website
	router.get('/public/country-requests', publicInterface.getCountryRequests);
	router.post('/public/country-request', publicInterface.createCountryRequest);
	router.put('/public/country-request', publicInterface.updateCountryRequest);

	// routing - end
	app.use('/master-data', router);

	var port = process.env.PORT || 8083;

	app.listen(port, function() {
		console.log('%s: "master-data" Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;
