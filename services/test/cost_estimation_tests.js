var assert = require('assert');
var mockery = require('mockery');

describe('hws_request_business', function() {
  describe('budgetCalculation', function() {

  	before(function(done) {
  		mockery.enable({ useCleanCache: true });
		mockery.warnOnUnregistered(false);
		mockery.warnOnReplace(false);
  		mockery.registerMock('../dataaccess/hws_itineraries_dao.js', {
	    	getById: function (requestId, language, onSuccess, onFailure) { 
	    		var itinerary = {
					ferries: [{JAN: 300}],
					flights: [{aJAN: 7000, iJAN: 1000, kJAN: 5000}],
					hotels: [{budget_category_id: 1, JAN: 100}],
				};
	    		onSuccess(itinerary);
	    	}
		});
		done();
  	})

  	after(function(done) {
  		mockery.deregisterAll();
  		mockery.disable();
		done();
  	})

    it('should return 8800 egp when: 1 adult, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 1, number_of_kids: 0, number_of_infants: 0,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			// assert.equal(result.totalBudget, ((100 * 7) + 7000 + 300) * 1.1);
			assert.equal(result.totalBudget, 8800);
			done();
		}, null, null);
    });

    it('should return 12800 egp when: 1 adult, 4 infants, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 1, number_of_kids: 0, number_of_infants: 4,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			// assert.equal(result.totalBudget, ((100 * 7) + 7000 + 4000 + 300) * 1.1);
			assert.equal(result.totalBudget, 13200);
			done();
		}, null, null);
    });

  it('should return 15300 egp when: 2 adults, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 2, number_of_kids: 0, number_of_infants: 0,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			assert.equal(result.totalBudget, ((100 * 7) + (7000 * 2) + (300 * 2) )* 1.1);
			done();
		}, null, null);
    });

  it('should return 25129.5 egp when: 3 adults, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 3, number_of_kids: 0, number_of_infants: 0,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			// assert.equal(result.totalBudget, ((100 * 7 * 1.35) + (7000 * 3) + (300 * 3) ) * 1.1);
			assert.equal(result.totalBudget, 25129.5);
			done();
		}, null, null);
    });

  it('should return 28429.5 egp when: 3 adults, 3 infants, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 3, number_of_kids: 0, number_of_infants: 3,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			// assert.equal(result.totalBudget, ((100 * 7 * 1.35) + (7000 * 3) + (1000 * 3) + (300 * 3) ) * 1.1);
			assert.equal(result.totalBudget, 28429.5);
			done();
		}, null, null);
    });

  it('should return 47190 egp when: 3 adults, 3 kids, 3 infants, 7 days in month with costs: 100 egp per night, 7000 egp 1 flight, 300 egp 1 ferry', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '01-18-2015', departure_date: '01-11-2015',
			number_of_adults: 3, number_of_kids: 3, number_of_infants: 3,
			budget_category: 1
		};
		
		var requestsBusiness = require('../hws_modules/business/hws_requests_business.js')
		requestsBusiness.budgetCalculation(request, function(result) {
			// assert.equal(result.totalBudget, ((100 * 7 * 3) + (7000 * 3) + (1000 * 3) + (5000 * 3) + (300 * 6) ) * 1.1);
			assert.equal(result.totalBudget, 47190);
			done();
		}, null, null);
    });

  }); // end function describe
}); // end module describe