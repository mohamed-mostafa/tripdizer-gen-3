var chai = require('chai');
var expect = chai.expect;
let moment = require("moment");

const flightsService = require('../../service/FlightsService');

var sessionId = "";
var fareSourceCode = "";
var bookingUniqueId = "";
var isPublicFlightOffer = true;

describe('Public flight booking', function () {

	describe('happy public booking scenario', function () {

		function delay(interval) {
			return it('should delay', done => {
				setTimeout(() => done(), interval)

			}).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
		}

		it('search for multi-city flights', function (done) {
			var request = {
				"numberOfAdults": 2,
				"numberOfChildren": 1,
				"numberOfInfants": 1,
				"tripSegments": [
					{ "cityIata": "AMS", "arrivalDate": moment().add(7, 'days').format("YYYY-MM-DD"), "leavingDate": moment().add(7, 'days').format("YYYY-MM-DD"), "cityName": "AMS", "countryIso": "IND" },
					{ "cityIata": "LHR", "arrivalDate": moment().add(7, 'days').format("YYYY-MM-DD"), "cityName": "LHR", "countryIso": "IND", "leavingDate": moment().add(14, 'days').format("YYYY-MM-DD") }]
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
				"adultsPNRInfoList":
					[
						{
							"ageGroup": "adult",
							"dateOfBirth": "1984-09-11",
							"email": "eng.mmustafa84" + Math.random() * 1000 + "@gmail.com",
							"firstName": "Mohamed",
							"lastName": "Mostafa",
							"nationality": "EG",
							"passportExpiry": "2025-02-03",
							"passportNumber": "A" + Math.random() * 10000000,
							"phone": 19739626,
							"title": "Mr"
						},
						{
							"passportNumber": "A" + Math.random() * 10000000,
							"lastName": "Ahmed",
							"title": "Mr",
							"passportExpiry": "2025-05-03",
							"ageGroup": "adult",
							"firstName": "Hossam",
							"dateOfBirth": "1984-10-11"
						}
					],
				"childrenPNRInfoList": [
					{
						"passportNumber": "A" + Math.random() * 10000000,
						"passportExpiry": "2025-05-03",
						"lastName": "Ahmed",
						"title": "Mr",
						"ageGroup": "kid",
						"firstName": "Aly",
						"dateOfBirth": "2016-10-11"
					}
				],
				"infantsPNRInfoList": [
					{
						"passportNumber": "A" + Math.random() * 10000000,
						"passportExpiry": "2025-05-03",
						"lastName": "Emam",
						"title": "Mr",
						"ageGroup": "infant",
						"firstName": "Mohsen",
						"dateOfBirth": "2019-10-11"
					}
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
			if (isPublicFlightOffer == true) {
				flightsService.issueTicket("en", sessionId, bookingUniqueId)
					.then(function (res) {
						expect(res).to.have.property("ticketUniqueId").not.null;
						done();
					})
					.catch(function (err) {
						done(err);
					});
			} else {
				done("Couldn't find a public offer to book");
			}
		})

		delay(5000);
		it('should get trip details', function (done) {
			flightsService.getTripDetails("en", sessionId, bookingUniqueId)
				.then(function (res) {
					expect(res).to.have.property("passengerDetails").not.null;
					expect(res).to.have.property("passengerDetails").to.be.an("array");
					expect(res).to.have.property("reservationDetails").not.null;
					expect(res).to.have.property("reservationDetails").to.be.an("array");
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})
	}); // end function describe
}); // end module describe
