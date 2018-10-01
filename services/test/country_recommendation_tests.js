var assert = require('assert');
var mockery = require('mockery');

describe('hws_request_business', function() {
  describe('recommendation', function() {

  	before(function(done) {
  		mockery.enable({ useCleanCache: true });
		mockery.warnOnUnregistered(false);
		mockery.warnOnReplace(true);
  		mockery.registerMock('../dataaccess/hws_itineraries_dao.js', {
  			getById: function (requestId, language, onSuccess, onFailure) { 
	    		var itinerary = {
					ferries: [{MAY: 300}],
					flights: [{aMAY: 7000, iMAY: 1000, kMAY: 5000}],
					hotels: [{budget_category_id: 2, MAY: 100}],
				};
	    		onSuccess(itinerary);
	    	},
	    	getAllLong: function (onSuccess, onFailure) { 
				var destination1 = {
					id:1,
					en_name: "BALI",
					needsVisa: false,
					seasons: [
						{start: '01-01-2018', end: '03-31-2018', type: 2}, // shoulder season
						{start: '04-01-2018', end: '09-30-2018', type: 0},// high season
						{start: '10-01-2018', end: '12-31-2018', type: 1} // low season
					], 
					budgetCategories: [
						{budget_category_Id: 2, Percentage: 100}, // super economy
						{budget_category_Id: 3, Percentage: 100}, // economy
						{budget_category_Id: 4, Percentage: 100}, // mid-range
						{budget_category_Id: 5, Percentage: 100} // splurge
					],
					purposes: [
						{travel_purpose_Id: 2, Percentage: 0}, // solo
						{travel_purpose_Id: 3, Percentage: 0}, // family
						{travel_purpose_Id: 4, Percentage: 0}, // group
						{travel_purpose_Id: 5, Percentage: 100}, // honeymoon
						{travel_purpose_Id: 6, Percentage: 0} // business
					],
					interests: [
						{interest_Id: 1, Percentage: 100}, // activities
						{interest_Id: 2, Percentage: 50}, // history
						{interest_Id: 3, Percentage: 25}, // night life
						{interest_Id: 4, Percentage: 100}, // beaches
						{interest_Id: 5, Percentage: 50}, // nature
						{interest_Id: 6, Percentage: 50} // shopping
					]
				};
	    		onSuccess([destination1]);
	    	}
		});
		done();
  	});

	after(function(done) {
  		mockery.deregisterAll();
  		mockery.disable();
		done();
  	})

    it('should return BALI when travelling in May, low budget, honeymoon, for activities and beaches', function(done) {
		var request = {
			itinerary_id: 1,
			return_date: '05-18-2015', departure_date: '05-11-2015',
			travel_purpose: 5, // honeymoon
			interests: [
				{id: 1, percentage: 100}, // activities
				{id: 2, percentage: 0}, // hstory
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

  }); // end function describe
}); // end module describe