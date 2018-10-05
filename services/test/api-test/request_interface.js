var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var newRequestId = 0;

describe('public website request interface', function() {
  describe('place request', function() {

    it('returns 200 when placing a request', function(done) {
		var request = {
				"traveler":{
					"name":"Test request user",
					"mobile":"01000000000",
					"emailAddress":"test@test.com",
					"dateOfBirth":"3 October, 2018"},
				"referralType":"2",
				"itinerary_id":"12",
				"first_country":1, "second_country":0, "third_country":0,
				"departure_date":"17 October, 2018", "return_date":"26 October, 2018",
				"flexible_dates":false,
				"leaving_country":"Egypt",
				"travel_purpose":3,
				"number_of_adults":1, "number_of_kids":2, "number_of_infants":3,
				"budget_category":3,"budget":null,
				"visa_assistance_needed":false,"tour_guide_needed":true,
				"specialRequests":"Private villa please",
				"interests":[{"id":1,"percentage":"18"},{"id":2,"percentage":"45"},{"id":3,"percentage":"62"},{"id":4,"percentage":"79"},{"id":5,"percentage":"91"},{"id":6,"percentage":"100"}]
				}
		
		chai.request('http://localhost:8080')
		  .put('/request/place')
		  .send({
		    'request': request
		  })
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

	it('returns 500 when placing an invalid request', function(done) {
		var request = {
				"traveler":{
					// "name":"Test request user",
					"mobile":"01000000000",
					// "emailAddress":"test@test.com",
					"dateOfBirth":"3 October, 2018"},
				"referralType":"2",
				// "itinerary_id":"12",
				"first_country":1, "second_country":0, "third_country":0,
				// "departure_date":"17 October, 2018", "return_date":"26 October, 2018",
				"flexible_dates":false,
				// "leaving_country":"Egypt",
				"travel_purpose":3,
				// "number_of_adults":1, "number_of_kids":2, "number_of_infants":3,
				"budget_category":3,"budget":null,
				// "visa_assistance_needed":false,"tour_guide_needed":true,
				"specialRequests":"Private villa please",
				"interests":[{"id":1,"percentage":"18"},{"id":2,"percentage":"45"},{"id":3,"percentage":"62"},{"id":4,"percentage":"79"},{"id":5,"percentage":"91"},{"id":6,"percentage":"100"}]
				}
		
		chai.request('http://localhost:8080')
		  .put('/request/place')
		  .send({
		    'request': request
		  })
		  .then(function (res) {
		    expect(res).to.have.status(500);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns a valid request number when placing a request', function(done) {
		var request = {
				"traveler":{
					"name":"Test request user",
					"mobile":"01000000000",
					"emailAddress":"test@test.com",
					"dateOfBirth":"3 October, 2018"},
				"referralType":"2",
				"itinerary_id":"12",
				"first_country":1, "second_country":0, "third_country":0,
				"departure_date":"17 October, 2018", "return_date":"26 October, 2018",
				"flexible_dates":false,
				"leaving_country":"Egypt",
				"travel_purpose":3,
				"number_of_adults":1, "number_of_kids":2, "number_of_infants":3,
				"budget_category":3,"budget":null,
				"visa_assistance_needed":false,"tour_guide_needed":true,
				"specialRequests":"Private villa please",
				"interests":[{"id":1,"percentage":"18"},{"id":2,"percentage":"45"},{"id":3,"percentage":"62"},{"id":4,"percentage":"79"},{"id":5,"percentage":"91"},{"id":6,"percentage":"100"}]
				}
		
		chai.request('http://localhost:8080')
		  .put('/request/place')
		  .send({
		    'request': request
		  })
		  .then(function (res) {
		  	newRequestId = res.body.id;
		    expect(newRequestId).to.be.a("number");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });
  
  }); // end function describe
}); // end module describe