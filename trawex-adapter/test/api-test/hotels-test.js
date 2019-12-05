var chai = require('chai');
var expect = chai.expect;

const hotelsService = require('../../service/HotelsService');

var hotelDetails = null;
var hotelBookingDetails = null;
var roomRateDetails = null;
var preBookingToken = "";
describe('hotel booking', function () {

	describe('happy booking scenario', function () {

		function delay(interval) {
			return it('should delay', done => {
				setTimeout(() => done(), interval)

			}).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
		}
		delay(2000);

		it('search for hotels', function (done) {
			var request = {
				"tripSegments": [
					{
						"cityName": "Delhi",
						"countryName": "India",
						"arrivalDate": "2020-05-01",
						"leavingDate": "2020-05-03",
						"limit": 9
					}
				],
				"rooms": [
					[
						{
							"type": "adult",
							"age": 28
						},
						{
							"type": "child",
							"age": 3
						}
					],
					[
						{
							"type": "adult",
							"age": 40
						}
					]
				],
				"stars": [
					4
				],
				"sortColumn": "price",
				"limitPerCity": 9,
				"nationality": "EG",
				"currency": "EGP"
			}
			// search for offers
			hotelsService.searchHotels("en", request)
				.then(function (res) {
					expect(res).to.be.an("array");
					expect(res[res.length - 1].moreDetails.sessionId).to.be.a("string");
					hotelDetails = res[res.length - 1];
					hotelBookingDetails = res[res.length - 1].moreDetails;
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});

		delay(2000);

		it('should retrieve the hotel details', function (done) {
			// call validate fare for the first offer
			hotelsService.getHotelDetails("en", hotelBookingDetails.sessionId, hotelBookingDetails.productId, hotelBookingDetails.hotelId)
				.then(function (res) {
					expect(res).to.have.property("name");
					expect(res).to.not.be.null;
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})

		delay(2000);

		it('should retrieve the hotel room rates details', function (done) {
			// call fare details for the first offer
			hotelsService.getHotelOffers("en", hotelBookingDetails)
				.then(function (res) {
					expect(res).to.be.an("array");
					expect(res).to.have.length.greaterThan(0);
					roomRateDetails = res[0];
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})

		delay(2000);

		it('should validate the room rate', function (done) {
			// call validate
			var validateRequest = {
				// fieilds from search, generic
				traceId: hotelDetails.moreDetails.traceId,
				tokenId: hotelDetails.moreDetails.tokenId,
				productId: hotelDetails.moreDetails.productId,
				propertyId: hotelDetails.moreDetails.propertyId,
				sessionId: hotelDetails.moreDetails.sessionId,
				resultIndex: hotelDetails.moreDetails.resultIndex,
				bookingToken: hotelDetails.moreDetails.bookingToken,
				hotelCode: hotelDetails.moreDetails.hotelId, // or code ?

				// fields from search, per hotel
				hotelName: hotelDetails.name,

				// fields from room rate
				allocationDetails: roomRateDetails.allocationDetails,
				infoSource: roomRateDetails.infoSource,
				boardBasis: roomRateDetails.boardBasis,
				mealCode: roomRateDetails.mealCode,
				rateBasisIds: roomRateDetails.rateBasisIds,
				roomTypeRunnos: roomRateDetails.roomTypeRunnos,
				roomCodes: roomRateDetails.roomCodes,
			}
			hotelsService.validateHotelOffer("en", validateRequest)
				.then(function (res) {
					expect(res).to.have.property("preBookingToken");
					preBookingToken = res.preBookingToken;
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});

		delay(2000);

		it('should book the room rate', function (done) {
			var bookRequest = {
				// generic fields from search 
				traceId: hotelDetails.moreDetails.traceId,
				tokenId: hotelDetails.moreDetails.tokenId,
				productId: hotelDetails.moreDetails.productId,
				propertyId: hotelDetails.moreDetails.propertyId,
				sessionId: hotelDetails.moreDetails.sessionId,
				resultIndex: hotelDetails.moreDetails.resultIndex,
				hotelId: hotelDetails.moreDetails.hotelId,

				// fields from room rate
				changedOccupancy: roomRateDetails.changedOccupancy,
				extraBeds: roomRateDetails.extraBeds,

				"refCode": "ThisIsACorellationProvidedByTripdizer",
				// fields from validate
				"preBookingToken": preBookingToken,
				rooms: [
					[
						{
							"firstName": "Mohamed",
							"lastName": "Mostafa",
							"title": "Mr",
							"gender": "M",
							"dateOfBirth": "1984-02-01",
							"ageGroup": "adult",
							"nationality": "EG",
							"email": "email",
							"countryCode": "+2",
							"areaCode": "02",
							"phone": 33378321,
							"passportNumber": "A08102235",
							"passportExpiry": "2013-02-03",
							"passportIssueCountry": "EG"
						},
						{
							"firstName": "Mohamed",
							"lastName": "Mostafa",
							"title": "Mr",
							"gender": "M",
							"dateOfBirth": "2010-02-01",
							"ageGroup": "child",
							"nationality": "EG",
							"email": "email",
							"countryCode": "+2",
							"areaCode": "02",
							"phone": 33378321,
							"passportNumber": "A08102235",
							"passportExpiry": "2013-02-03",
							"passportIssueCountry": "EG"
						}
					],
					[
						{
							"firstName": "Hossam",
							"lastName": "Hassan",
							"title": "Mr",
							"gender": "M",
							"dateOfBirth": "1985-02-01",
							"ageGroup": "adult",
							"nationality": "EG",
							"email": "email",
							"countryCode": "+2",
							"areaCode": "02",
							"phone": 33378322,
							"passportNumber": "A08102233",
							"passportExpiry": "2013-02-03",
							"passportIssueCountry": "EG"
						}
					]
				]
			}
			delete bookRequest.moreDetails;
			hotelsService.bookHotel("en", bookRequest)
				.then(function (res) {
					expect(res).to.have.property("clientReference").equals("ThisIsACorellationProvidedByTripdizer");
					expect(res).to.have.property("bookingStatus").equals("Confirmed");
					done();
				})
				.catch(function (err) {
					done(err);
				});
		})
	}); // end function describe
}); // end module describe
