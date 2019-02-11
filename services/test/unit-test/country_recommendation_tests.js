var assert = require('assert');
var mockery = require('mockery');
var countryRecommendationMocks = require('./utilities/country_recommendation_test_mocks.js');

describe('hws_request_business', function() {
	describe('recommendation', function() {
		before(done => {
			mockery.enable({ useCleanCache: true });
			mockery.warnOnUnregistered(false);
			mockery.warnOnReplace(true);
			mockery.registerMock('../dataaccess/hws_itineraries_dao.js', countryRecommendationMocks.itirnaryDaoMock);
			done();
		});

		after(done => {
			mockery.deregisterAll();
			mockery.disable();
			done();
		});

		it('should recommend BALI when travelling in May, low budget, honeymoon, for activities and beaches', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '05-18-2015',
				departure_date: '05-11-2015',
				travel_purpose: 5, // honeymoon
				preferences: [1, 4],
				budget_category: 2, // super economy
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[0].enName, 'BALI');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend EGYPT when travelling in Feb, low budget, family, for history', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '02-18-2015',
				departure_date: '02-11-2015',
				travel_purpose: 3, // family
				preferences: [2],
				budget_category: 2, // super economy
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[0].enName, 'EGYPT');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend NIPAL instead of EGYPt when travelling in Feb, low budget, family, for activities', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '02-18-2015',
				departure_date: '02-11-2015',
				travel_purpose: 3, // family
				preferences: [1],
				budget_category: 2, // super economy
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						console.log(result);
						assert.equal(result[0].enName, 'NIPAL');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend DUBAI when travelling in Feb, splurge, group, for night life and shopping', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '02-18-2015',
				departure_date: '02-11-2015',
				travel_purpose: 4, // group
				preferences: [3, 6],
				budget_category: 5, // splurge
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[0].enName, 'DUBAI');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend PARIS instead of DUBAI when travelling in June, splurge, group, for night life and shopping', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '06-18-2015',
				departure_date: '06-11-2015',
				travel_purpose: 4, // group
				preferences: [3, 6],
				budget_category: 5, // splurge
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[0].enName, 'PARIS');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend BANGKOK instead of PARIS when travelling in June, mid-range, group, for night life and shopping', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '06-18-2015',
				departure_date: '06-11-2015',
				travel_purpose: 4, // group
				preferences: [3, 6],
				budget_category: 4, // mid range
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[0].enName, 'BANGKOK');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should recommend KUALALUMPUR after BANGKOK when travelling in June, mid-range, group, for night life and shopping', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '06-18-2015',
				departure_date: '06-11-2015',
				travel_purpose: 4, // group
				preferences: [3, 6],
				budget_category: 4, // mid range
				visa_assistance_needed: false,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.recommendation(
				request,
				'en',
				function(result) {
					try {
						assert.equal(result[1].enName, 'KUALALUMPUR');
						done();
					} catch (e) {
						done(e);
					}
				},
				null,
				null
			);
		});

		it('should re-consider the interests ranking ? better be according to whether users exceeds or below the interest rating ?', function(done) {
			try {
				assert.equal(true, true);
				done();
			} catch (e) {
				done(e);
			}
		});

		it('should re-consider the budget category ranking ? better be according to whether users exceeds or below a budget rating ?', function(done) {
			try {
				assert.equal(true, true);
				done();
			} catch (e) {
				done(e);
			}
		});
	}); // end function describe
}); // end module describe
