'use strict';

const flightsBookingService = require('../service/FlightsService');
const hotelsBookingService = require('../service/HotelsService');
const pubSubPublisher = require('./PubSubPublishers');

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const projectId = process.env.PROJECT_NAME || 'tripdizer-dev';
const keyFileName = './tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });
const flightBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.FLIGHT_BOOKING_PUBSUB_SUBSCRIPTION_NAME || 'flight-booking-subscription');
const hotelBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.HOTEL_BOOKING_PUBSUB_SUBSCRIPTION_NAME || 'hotel-booking-subscription');

// References an existing subscription
const flightSubscription = pubsub.subscription(flightBookingSubscriptionName);
const hotelSubscription = pubsub.subscription(hotelBookingSubscriptionName);

// Create an event handler to handle messages

const flightBookingMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();

  let bookingData = JSON.parse(message.data.toString())

  try {
    let bookFlightRequest = createBookFlightRequestFromFlightOffer(bookingData);
    // retrieve fare details, even though we won't do anything with it for now
    let fareDetailsResponse = await flightsBookingService.getFareDetails("en", bookFlightRequest.sessionId, bookFlightRequest.fareSourceCode);
    // revalidate fare. it may also be done before payment.
    let fareValidateResponse = await flightsBookingService.revalidateFare("en", bookFlightRequest.sessionId, bookFlightRequest.fareSourceCode);
    // book
    let bookingResponse = await flightsBookingService.bookFlight("en ", bookFlightRequest);

    // check if bookingResponse.bookingStatus = CONFIRMED ?
    if (bookingResponse.bookingStatus == 'CONFIRMED') {
      // Check if we're booking a Public or Private, then issue ticket
      // With Public and Private fares, the booking is not enough, issuing the ticket is what actually confirms the booking
      // with LCC fares (Low Cost Carriers), booking is confirmed immediately with the booking service
      if (bookingData.flightOffer.fareType == 'Public' || bookingData.flightOffer.fareType == 'Private') {
        let issueTicketResponse = await flightsBookingService.issueTicket("en", bookFlightRequest.sessionId, bookingResponse.bookingUniqueId);
      }

      // then we recieve the details of the trip (PNR numbers, E-Ticket numbers, ... etc)
      let tripDetailsResponse = await flightsBookingService.getTripDetails("en", bookFlightRequest.sessionId, bookingResponse.bookingUniqueId);

      let bookingConfirmation = {
        bookingStatus: bookingResponse.bookingStatus,
        confirmationNumbers: tripDetailsResponse.reservationDetails.map(detail => detail.AirlinePNR),
        referenceNumbers: tripDetailsResponse.passengerDetails.map(detail => detail.eTicketNumber),
        bookingDetails: tripDetailsResponse,
      }
      // notify successful booking
      pubSubPublisher.publishFlightBookingConfirmedMessage(bookingData.requestId, bookingData.flightOffer.fareSourceCode, bookingConfirmation);
    } else {
      throw ({ error: `Booking failed - BookingStatus recieved: ${bookingResponse.bookingStatus}` })
    }
  } catch (err) {
    // notify failed booking
    pubSubPublisher.publishFlightBookingFailedMessage(bookingData.requestId, bookingData.flightOffer.fareSourceCode, err);
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

      // NOTIFY successful booking
      var bookingConfirmation = {
        bookingDetails: bookResponse.bookingDetails,
        bookingStatus: bookResponse.bookingStatus,
        confirmationNumbers: bookResponse.supplierConfirmationNum,
        referenceNumbers: bookResponse.reference
      }
      pubSubPublisher.publishHotelBookingConfirmedMessage(bookingData.requestId, bookingData.hotel.moreDetails.hotelId, bookingConfirmation);
    } else {
      throw ({ errorMessage: "No room rates available for this hotel! " });
    }

  } catch (err) {
    // notify failed booking
    pubSubPublisher.publishHotelBookingFailedMessage(bookingData.requestId, bookingData.hotel.moreDetails.hotelId, err);
  }

}

var createBookFlightRequestFromFlightOffer = function (bookingData) {
  return {
    sessionId: bookingData.flightOffer.sessionId,
    fareSourceCode: bookingData.flightOffer.fareSourceCode,
    fareType: bookingData.flightOffer.fareType,
    adultsPNRInfoList: bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == "adult"),
    childrenPNRInfoList: bookingData.pnrInfoList.choices.filter(pnrInfo => pnrInfo.ageGroup == "kid"),
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