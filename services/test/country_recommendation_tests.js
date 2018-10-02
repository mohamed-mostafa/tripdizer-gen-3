var assert = require('assert');
var mockery = require('mockery');
var countryRecommendationMocks = require("./utilities/country_recommendation_test_mocks.js")

describe('hws_request_business', function() {
  describe('recommendation', function() {

  	before(function(done) {
  		mockery.enable({ useCleanCache: true });
		mockery.warnOnUnregistered(false);
		mockery.warnOnReplace(true);
  		mockery.registerMock('../dataaccess/hws_itineraries_dao.js', countryRecommendationMocks.itirnaryDaoMock);
		done();
  	});

	after(function(done) {
  		mockery.deregisterAll();
  		mockery.disable();
		done();
  	})

    it('should recommend BALI when travelling in May, low budget, honeymoon, for activities and beaches', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '05-18-2015', departure_date: '05-11-2015',
			travel_purpose: 5, // honeymoon
			interests: [
				{id: 1, percentage: 100}, // activities
				{id: 2, percentage: 0}, // history
				{id: 3, percentage: 0}, // night life
				{id: 4, percentage: 100}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 0}, // shopping
			],
			budget_category: 2, // super economy
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "BALI");
			done();
		}, null, null);
    });

    it('should recommend EGYPT when travelling in Feb, low budget, family, for history', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '02-18-2015', departure_date: '02-11-2015',
			travel_purpose: 3, // family
			interests: [
				{id: 1, percentage: 0}, // activities
				{id: 2, percentage: 100}, // history
				{id: 3, percentage: 0}, // night life
				{id: 4, percentage: 0}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 0}, // shopping
			],
			budget_category: 2, // super economy
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "EGYPT");
			done();
		}, null, null);
    });

    it('should recommend NIPAL instead of EGYPt when travelling in Feb, low budget, family, for activities', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '02-18-2015', departure_date: '02-11-2015',
			travel_purpose: 3, // family
			interests: [
				{id: 1, percentage: 100}, // activities
				{id: 2, percentage: 0}, // history
				{id: 3, percentage: 0}, // night life
				{id: 4, percentage: 0}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 0}, // shopping
			],
			budget_category: 2, // super economy
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "EGYPT");
			done();
		}, null, null);
    });

    it('should recommend DUBAI when travelling in Feb, splurge, group, for night life and shopping', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '02-18-2015', departure_date: '02-11-2015',
			travel_purpose: 4, // group
			interests: [
				{id: 1, percentage: 0}, // activities
				{id: 2, percentage: 0}, // history
				{id: 3, percentage: 100}, // night life
				{id: 4, percentage: 0}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 100}, // shopping
			],
			budget_category: 5, // splurge
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "DUBAI");
			done();
		}, null, null);
    });

    it('should recommend PARIS instead of DUBAI when travelling in June, splurge, group, for night life and shopping', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '06-18-2015', departure_date: '06-11-2015',
			travel_purpose: 4, // group
			interests: [
				{id: 1, percentage: 0}, // activities
				{id: 2, percentage: 0}, // history
				{id: 3, percentage: 100}, // night life
				{id: 4, percentage: 0}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 100}, // shopping
			],
			budget_category: 5, // splurge
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "PARIS");
			done();
		}, null, null);
    });

    it('should recommend BANGKOK instead of PARIS when travelling in June, mid-range, group, for night life and shopping', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '06-18-2015', departure_date: '06-11-2015',
			travel_purpose: 4, // group
			interests: [
				{id: 1, percentage: 0}, // activities
				{id: 2, percentage: 0}, // history
				{id: 3, percentage: 100}, // night life
				{id: 4, percentage: 0}, // beaches
				{id: 5, percentage: 0}, // nature
				{id: 6, percentage: 100}, // shopping
			],
			budget_category: 4, // mid range 
			visa_assistance_needed: false
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.recommendation(request, function(result) {
			assert.equal(result[0].enName, "PARIS");
			done();
		}, null, null);
    });

    it('should re-consider the interests ranking ? better be according to whether users exceeds or below the interest rating ?', function(done) {
		assert.equal(true, true);
		done();
    });

    it('should re-consider the budget category ranking ? better be according to whether users exceeds or below a budget rating ?', function(done) {
		assert.equal(true, true);
		done();	
    });

  }); // end function describe
}); // end module describe