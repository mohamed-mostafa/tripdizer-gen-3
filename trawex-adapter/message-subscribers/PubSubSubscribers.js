'use strict';

const flightsBookingService = require('../service/FlightsService');
const hotelsBookingService = require('../service/HotelsService');

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const projectId = process.env.PROJECT_NAME || 'tripdizer-dev';
const keyFileName = './tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });
const flightBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.FLIGHT_BOOKING_SUBSCRIPTION_NAME || 'flight-booking-subscription');
const hotelBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.HOTEL_BOOKING_SUBSCRIPTION_NAME || 'hotel-booking-subscription');

// References an existing subscription
const flightSubscription = pubsub.subscription(flightBookingSubscriptionName);
const hotelSubscription = pubsub.subscription(hotelBookingSubscriptionName);

// Create an event handler to handle messages

const flightBookingMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();

  let bookingData = JSON.parse(message.data.toString())
  let bookFlightRequest = createBookFlightRequestFromFlightOffer(bookingData);

  try {
    // retrieve fare details, even though we won't do anything with it for now
    let fareDetailsResponse = await flightsBookingService.getFareDetails("en", bookFlightRequest.sessionId, bookFlightRequest.fareSourceCode);
    // revalidate fare. it may also be done before payment.
    let fareValidateResponse = await flightsBookingService.revalidateFare("en", bookFlightRequest.sessionId, bookFlightRequest.fareSourceCode);
    // book
    let bookingResponse = await flightsBookingService.bookFlight("en ", bookFlightRequest);

    // check if bookingResponse.bookingStatus = CONFIRMED or PENDING

    // Check if we're booking an LLC ?
    // issue ticket
    let issueTicketResponse = await flightsBookingService.issueTicket("en", bookFlightRequest.sessionId, bookingResponse.bookingUniqueId);

    // NOTIFY CUSTOMER ?
    // WE HAVE BOOKING CONFIRMATION NUMBER FROM BOOK, AND TICKET NUMBER FROM ISSUE TICKET

  } catch (err) {
    console.error(`FATAL ERROR: Flight Booking for request with id: ${bookingData.requestId} failed to process. Flight booking has not been made. Flight booking data: ${JSON.stringify(bookingData)}. Error: ${JSON.stringify(err)}`);
  }
}

const hotelBookingMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();

  var bookingData = JSON.parse(message.data.toString());

  try {
    var hotelOffers = await hotelsBookingService.getHotelOffers("en", bookingData.hotel.moreDetails);
    if (hotelOffers && hotelOffers.length > 0) {
      var targetRoomRate = hotelOffers[0];

      var validateRequest = createValidateRoomRateRequestFromHotelAndRoomRate(bookingData, targetRoomRate);
      var validateResponse = await hotelsBookingService.validateHotelOffer("en", validateRequest);

      var bookRequest = createBookRequestFromHotelAndRoomRateAndPNR(bookingData, targetRoomRate, validateResponse.preBookingToken)
      var bookResponse = await hotelsBookingService.bookHotel("en", bookRequest);

      // NOTIFY CUSTOMER ?
      // WE HAVE supplierConfirmationNum:Array, bookingDetails, bookingStatus (Confirmed) IN BOOK RESPONSE

    } else {
      throw ("No room rates available for this hotel! ");
    }

  } catch (err) {
    console.error(`FATAL ERROR: Hotel Booking for request with id: ${bookingData.requestId} failed to process. Hotel booking has not been made. Hotel booking data: ${JSON.stringify(bookingData)}. Error: ${JSON.stringify(err)}`);
  }

}

var createBookFlightRequestFromFlightOffer = function (bookingData) {
  return {
    sessionId: bookingData.flightOffer.sessionId,
    fareSourceCode: bookingData.flightOffer.fareSourceCode,
    fareType: bookingData.flightOffer.fareType,
    adultsPNRInfoList: bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == "adult"),
    childrenPNRInfoList: bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == "child"),
    infantPNRInfoList: bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == "infant")
  }
}

var createValidateRoomRateRequestFromHotelAndRoomRate = function (bookingData, targetRoomRate) {
  return {
    // fieilds from search, generic
    traceId: bookingData.hotel.moreDetails.traceId,
    tokenId: bookingData.hotel.moreDetails.tokenId,
    productId: bookingData.hotel.moreDetails.productId,
    propertyId: bookingData.hotel.moreDetails.propertyId,
    sessionId: bookingData.hotel.moreDetails.sessionId,
    resultIndex: bookingData.hotel.moreDetails.resultIndex,
    bookingToken: bookingData.hotel.moreDetails.bookingToken,
    hotelCode: bookingData.hotel.moreDetails.hotelId,

    // fields from search, per hotel
    hotelName: bookingData.hotel.name,

    // fields from room rate
    allocationDetails: targetRoomRate.allocationDetails,
    infoSource: targetRoomRate.infoSource,
    boardBasis: targetRoomRate.boardBasis,
    mealCode: targetRoomRate.mealCode,
    rateBasisIds: targetRoomRate.rateBasisIds,
    roomTypeRunnos: targetRoomRate.roomTypeRunnos,
    roomCodes: targetRoomRate.roomCodes,
  }
}

var createBookRequestFromHotelAndRoomRateAndPNR = function (bookingData, targetRoomRate, preBookingToken) {

  var adults = bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == 'adult')
  var childrenAndInfants = bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup != 'adult')
  var numberOfRooms = Math.ceil(adults.length / 2);
  var rooms = [];
  for (var i = 0; i < numberOfRooms; i++) rooms.push([]);

  for (var i = 0; i < adults.length; i++) {
    rooms[i % numberOfRooms].push(adults[i]);
  }
  for (var i = 0; i < childrenAndInfants.length; i++) {
    rooms[i % numberOfRooms].push(childrenAndInfants[i]);
  }

  return {
    // generic fields from search 
    traceId: bookingData.hotel.moreDetails.traceId,
    tokenId: bookingData.hotel.moreDetails.tokenId,
    productId: bookingData.hotel.moreDetails.productId,
    propertyId: bookingData.hotel.moreDetails.propertyId,
    sessionId: bookingData.hotel.moreDetails.sessionId,
    resultIndex: bookingData.hotel.moreDetails.resultIndex,
    hotelId: bookingData.hotel.moreDetails.hotelId,

    // fields from room rate
    changedOccupancy: targetRoomRate.changedOccupancy,
    extraBeds: targetRoomRate.extraBeds,

    "refCode": bookingData.requestId,
    // fields from validate
    "preBookingToken": preBookingToken,
    rooms: rooms
  }
}

module.exports.start = function () {
  flightSubscription.on(`message`, flightBookingMessageHandler);
  console.log("Listenning for message on flightSubscription");
  hotelSubscription.on(`message`, hotelBookingMessageHandler);
  console.log("Listenning for message on hotelSubscription");
}