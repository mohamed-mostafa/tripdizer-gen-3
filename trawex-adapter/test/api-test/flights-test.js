var chai = require('chai');
var expect = chai.expect;

const flightsService = require('../../service/FlightsService');

var sessionId = "";
var fareSourceCode = "";
var bookingUniqueId = "";
var isPublicFlightOffer = true;

describe('flight booking', function () {

	describe('happy booking scenario', function () {

		function delay(interval) {
			return it('should delay', done => {
				setTimeout(() => done(), interval)

			}).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
		}

		it('search for multi-city flights', function (done) {
			var request = {
				"numberOfAdults": 2,
				"numberOfChildren": 0,
				"numberOfInfants": 0,
				"tripSegments": [
					{ "cityIata": "BLR", "arrivalDate": "2020-01-20", "leavingDate": "2020-01-20", "cityName": "BLR", "countryIso": "IND" },
					{ "cityIata": "DEL", "arrivalDate": "2020-01-20", "cityName": "DEL", "countryIso": "IND", "leavingDate": "2020-01-25" }]
			};
			// search for offers from cairo to lahore
			flightsService.searchMultiCityFlights("en", request)
				.then(function (res) {
					expect(res).to.be.an("array");

					// find the first offer with fareType 'Public'
					var publicFlightOffers = res.filter(flightOffer => flightOffer.fareType == "Public");
					if (publicFlightOffers && publicFlightOffers.length > 0) {
						expect(publicFlightOffers[0].sessionId).to.be.a("string");
						expect(publicFlightOffers[0].fareSourceCode).to.be.a("string");
						sessionId = publicFlightOffers[0].sessionId;
						fareSourceCode = publicFlightOffers[0].fareSourceCode;
					} else {
						expect(res[0].sessionId).to.be.a("string");
						expect(res[0].fareSourceCode).to.be.a("string");
						isPublicFlightOffer = false;
						sessionId = res[0].sessionId;
						fareSourceCode = res[0].fareSourceCode;
					}
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});

		delay(1000);

		it('should retrieve the fare details', function (done) {
			// call fare details for the first offer
			flightsService.getFareDetails("en", sessionId, fareSourceCode)
				.then(function (res) {
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})

		delay(1000);

		it('should validate the fare', function (done) {
			// call validate fare for the first offer
			flightsService.revalidateFare("en", sessionId, fareSourceCode)
				.then(function (res) {
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})

		delay(10000);

		it('should book the fare', function (done) {
			// call book fare for the first offer
			var bookRequest = {
				"passportMandatory": true,
				"sessionId": sessionId,
				"fareSourceCode": fareSourceCode,
				"adultsPNRInfoList": [
					{
						"passportNumber": "A" + Math.random() * 99999999,
						"lastName": "Mostafa",
						"gender": "M",
						"title": "Mr",
						"passportExpiry": "2025-02-03",
						"firstName": "Mohamed",
						"areaCode": "6",
						"nationality": "EG",
						"phone": 19739626,
						"passportIssueCountry": "EG",
						"countryCode": "0031",
						"email": "eng.mmustafa84" + Math.random() * 1000 + "@gmail.com",
						"postCode": 12311,
						"dateOfBirth": "1984-09-11"
					},
					{
						"passportNumber": "A" + Math.random() * 99999999,
						"lastName": "Ahmed",
						"gender": "M",
						"title": "Mr",
						"passportExpiry": "2025-05-03",
						"firstName": "Hossam",
						"areaCode": "6",
						"nationality": "EG",
						"phone": 19737626,
						"passportIssueCountry": "EG",
						"countryCode": "0031",
						"email": "mohamed" + Math.random() * 1000 + "@tripdizer.com",
						"postCode": 12311,
						"dateOfBirth": "1984-10-11"
					}
				],
				"childrenPNRInfoList": [
				],
				"infantsPNRInfoList": [
				],
				"refundable": "true",
				"fareType": "Public"
			}
			flightsService.bookFlight("en", bookRequest)
				.then(function (res) {
					expect(res).to.have.property("bookingUniqueId").not.null;
					expect(res).to.have.property("bookingStatus").is.oneOf(["PENDING", "CONFIRMED"]);
					bookingUniqueId = res.bookingUniqueId;
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});

		delay(5000);

		it('should issue the ticket', function (done) {
			flightsService.issueTicket("en", sessionId, bookingUniqueId)
				.then(function (res) {
					expect(res).to.have.property("ticketUniqueId").not.null;
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})
	}); // end function describe
}); // end module describe
