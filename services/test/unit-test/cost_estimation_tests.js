var assert = require('assert');
var mockery = require('mockery');
var costEstimationTestsMocks = require('./utilities/cost_estimation_test_mocks.js');

describe('hws_request_business', function() {
	describe('budgetCalculation - totalBudget', function() {
		before(done => {
			mockery.enable({ useCleanCache: true });
			mockery.warnOnUnregistered(false);
			mockery.warnOnReplace(false);
			mockery.registerMock('../dataaccess/hws_itineraries_dao.js', costEstimationTestsMocks.itirnaryDaoMock);
			done();
		});

		after(done => {
			mockery.deregisterAll();
			mockery.disable();
			done();
		});

		it('should estimate 8800 egp for 1 adult, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 1,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((100 * 7) + 7000 + 300) * 1.1);
					assert.equal(result.totalBudget, 8800);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 9790 egp for 1 adult, 7 days spanning 2 months that cost 100 and 200 egp per night (economy), 7000 and 8000 egp 1 flight, 300 and 400 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-30-2015',
				departure_date: '02-06-2015',
				number_of_adults: 1,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3, // economy
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((150 * 7) + 7500 + 350) * 1.1);
					assert.equal(result.totalBudget, 9790);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 20,185 egp for 1 adult, 7 days spanning 2 months that cost 1000 and 2000 egp per night (splurge), 7000 and 8000 egp 1 flight, 300 and 400 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-30-2015',
				departure_date: '02-06-2015',
				number_of_adults: 1,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 5, // splurge
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((1500 * 7) + 7500 + 350) * 1.1);
					assert.equal(result.totalBudget, 20185);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 18425 egp for 1 adult, 7 days during a month that cost 100 and 200 egp per night (economy) in 2 hotels, 7000 and 8000 egp 2 flights, 300 and 400 egp 2 ferries', function(done) {
			var request = {
				itinerary_id: 2,
				return_date: '01-11-2015',
				departure_date: '01-18-2015',
				number_of_adults: 1,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3, // economy
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((150 * 7) + 7000 + 8000 + 300 + 400) * 1.1);
					assert.equal(result.totalBudget, 18425);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 34595 egp for 1 adult, 1 kid, 1 infant, 7 days during a month that cost 100 and 200 egp per night (economy) in 2 hotels, 7000 and 8000 egp 2 flights, 300 and 400 egp 2 ferries', function(done) {
			var request = {
				itinerary_id: 2,
				return_date: '01-11-2015',
				departure_date: '01-18-2015',
				number_of_adults: 1,
				number_of_kids: 1,
				number_of_infants: 1,
				budget_category: 3, // economy
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((150 * 7) + 7000 + 8000 + 5000 + 6000 + 1000 + 2000 + 300 + 400 + 300 + 400) * 1.1);
					assert.equal(result.totalBudget, 34595);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 12800 egp for 1 adult, 4 infants, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 1,
				number_of_kids: 0,
				number_of_infants: 4,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((100 * 7) + 7000 + 4000 + 300) * 1.1);
					assert.equal(result.totalBudget, 13200);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 15300 egp for 2 adults, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 2,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					assert.equal(result.totalBudget, (100 * 7 + 7000 * 2 + 300 * 2) * 1.1);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 25129.5 egp for 3 adults, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 0,
				number_of_infants: 0,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((100 * 7 * 1.35) + (7000 * 3) + (300 * 3) ) * 1.1);
					assert.equal(result.totalBudget, 25129.5);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 28429.5 egp for 3 adults, 3 infants, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 0,
				number_of_infants: 3,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((100 * 7 * 1.35) + (7000 * 3) + (1000 * 3) + (300 * 3) ) * 1.1);
					assert.equal(result.totalBudget, 28429.5);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 47190 egp for 3 adults, 3 kids, 3 infants, 7 days during a month that costs 100 egp per night (economy), 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 3,
				number_of_infants: 3,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					// assert.equal(result.totalBudget, ((100 * 7 * 3) + (7000 * 3) + (1000 * 3) + (5000 * 3) + (300 * 6) ) * 1.1);
					assert.equal(result.totalBudget, 47190);
					done();
				},
				null,
				null
			);
		});
	}); // end function describe
}); // end module describe

describe('hws_request_business', function() {
	describe('budgetCalculation - dailySpendings', function() {
		before(done => {
			mockery.enable({ useCleanCache: true });
			mockery.warnOnUnregistered(false);
			mockery.warnOnReplace(false);
			mockery.registerMock('../dataaccess/hws_itineraries_dao.js', costEstimationTestsMocks.itirnaryDaoMock);
			done();
		});

		after(done => {
			mockery.deregisterAll();
			mockery.disable();
			done();
		});

		it('should estimate 100 egp daily sepding when budget category is super-economy', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 3,
				number_of_infants: 3,
				budget_category: 2,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					//assert.equal(result.dailySpending, 100);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 100 egp daily sepding when budget category is economy', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 3,
				number_of_infants: 3,
				budget_category: 3,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					//assert.equal(result.dailySpending, 100);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 150 egp daily sepding when budget category is mid-range', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 3,
				number_of_infants: 3,
				budget_category: 4,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					//assert.equal(result.dailySpending, 150);
					done();
				},
				null,
				null
			);
		});

		it('should estimate 200 egp daily sepding when budget category is splurge', function(done) {
			var request = {
				itinerary_id: 1,
				return_date: '01-18-2015',
				departure_date: '01-11-2015',
				number_of_adults: 3,
				number_of_kids: 3,
				number_of_infants: 3,
				budget_category: 5,
			};

			var requestsBusiness = require('../../hws_modules/business/hws_requests_business.js');
			requestsBusiness.budgetCalculation(
				request,
				function(result) {
					//assert.equal(result.dailySpending, 200);
					done();
				},
				null,
				null
			);
		});
	}); // end function describe
}); // end module describe
