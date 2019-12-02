'use strict';

// Imports the Google Cloud client library
const fs = require('fs');
const moment = require('moment');
const { PubSub } = require('@google-cloud/pubsub');
const bookingsDao = require('../dataaccess/hws_bookings_dao');
const requestsDao = require('../dataaccess/hws_requests_dao');
const emailBusiness = require('./hws_email_adapter');
// Creates a client
const projectId = process.env.PROJECT_NAME || 'tripdizer-dev';
const keyFileName = './tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });
const flightBookingConfirmationSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.FLIGHT_BOOKING_CONFIRMATION_PUBSUB_SUBSCRIPTION_NAME || 'flight-booking-confirmation-subscription');
const hotelBookingConfirmationSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.HOTEL_BOOKING_CONFIRMATION_PUBSUB_SUBSCRIPTION_NAME || 'hotel-booking-confirmation-subscription');
const flightBookingErrorSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.FLIGHT_BOOKING_ERROR_PUBSUB_SUBSCRIPTION_NAME || 'flight-booking-error-subscription');
const hotelBookingErrorSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.HOTEL_BOOKING_ERROR_PUBSUB_SUBSCRIPTION_NAME || 'hotel-booking-error-subscription');

// References an existing subscription
const flightConfirmationSubscription = pubsub.subscription(flightBookingConfirmationSubscriptionName);
const hotelConfirmationSubscription = pubsub.subscription(hotelBookingConfirmationSubscriptionName);
const flightErrorSubscription = pubsub.subscription(flightBookingErrorSubscriptionName);
const hotelErrorSubscription = pubsub.subscription(hotelBookingErrorSubscriptionName);

// Create an event handler to handle messages

const flightBookingConfirmationMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();
  try {
    let confirmationMessage = JSON.parse(message.data.toString());
    bookingsDao.saveFlightBookingResult(confirmationMessage.requestId, confirmationMessage.fareSourceCode, { failure: null, confirmation: confirmationMessage.bookingConfirmation });
    // NOTIFY CUSTOER HERE
    requestsDao.getRequestById(confirmationMessage.requestId, async request => {
      sendFlightBookingInformationEmail(request.traveler.name, request.traveler.emailAddress, confirmationMessage.bookingConfirmation)
    }, err => {
      console.error(`FATAL ERROR: Failed to send flight booking confirmation email to customer of request ${confirmationMessage.requestId}. Reason: ${JSON.stringify(err)}`)
    })
  } catch (err) {
    console.error(`FATAL ERROR: Failed to write successful flight booking for request: ${confirmationMessage.requestId}. Missing data is ${confirmationMessage}`)
    // NOTIFY OPERATIONS TEAM HERE
    sendBookingSuccessfulButUpdateFailureIncidentEmail(confirmationMessage.requestId, "flight");
  }
}

const hotelBookingConfirmationMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();
  let confirmationMessage = JSON.parse(message.data.toString());
  try {
    bookingsDao.saveHotelBookingResult(confirmationMessage.requestId, confirmationMessage.hotelId, { failure: null, confirmation: confirmationMessage.bookingConfirmation });
    // NOTIFY CUSTOER HERE
    requestsDao.getRequestById(confirmationMessage.requestId, request => {
      sendHotelBookingInformationEmail(request.traveler.name, request.traveler.emailAddress, confirmationMessage.bookingConfirmation.bookingDetails, confirmationMessage.bookingConfirmation.referenceNumbers[0])
    }, err => {
      console.error(`FATAL ERROR: Failed to send hotel booking confirmation email to customer of request ${confirmationMessage.requestId}. Reason: ${JSON.stringify(err)}`)
    })
  } catch (err) {
    console.error(`FATAL ERROR: Failed to write successful hotel booking for request: ${confirmationMessage.requestId}. Missing data is ${confirmationMessage}`)
    // NOTIFY OPERATIONS TEAM HERE
    sendBookingSuccessfulButUpdateFailureIncidentEmail(confirmationMessage.requestId, "hotel");
  }
}

const flightBookingErrorMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();
  let confirmationMessage = JSON.parse(message.data.toString());
  try {
    bookingsDao.saveFlightBookingResult(confirmationMessage.requestId, confirmationMessage.fareSourceCode, { failure: confirmationMessage.failureReason, confirmation: null });

    // NOTIFY OPERATIONS TEAM HERE
    sendBookingIncidentEmail(confirmationMessage.requestId, "flight");
  } catch (err) {
    console.error(`FATAL ERROR: Failed to write failed flight booking for request: ${confirmationMessage.requestId}. Missing data is ${confirmationMessage}`)
    // NOTIFY OPERATIONS TEAM HERE
    sendBookingFailedAndUpdateFailureIncidentEmail(confirmationMessage.requestId, "flight");
  }
}

const hotelBookingErrorMessageHandler = async message => {
  // "Ack" (acknowledge receipt of) the message
  message.ack();
  let confirmationMessage = JSON.parse(message.data.toString());
  try {
    bookingsDao.saveHotelBookingResult(confirmationMessage.requestId, confirmationMessage.hotelId, { failure: confirmationMessage.failureReason, confirmation: null });

    // NOTIFY OPERATIONS TEAM HERE
    sendBookingIncidentEmail(confirmationMessage.requestId, "hotel");
  } catch (err) {
    console.error(`FATAL ERROR: Failed to write failed hotel booking for request: ${confirmationMessage.requestId}. Missing data is ${confirmationMessage}`)
    // NOTIFY OPERATIONS TEAM HERE
    sendBookingFailedAndUpdateFailureIncidentEmail(confirmationMessage.requestId, "hotel");
  }
}

var sendHotelBookingInformationEmail = function (travellerName, recepient, bookingInfo, confirmationNumber) {
  fs.readFile("email_templates/hotel_confirmation.html", 'utf8', function (err, data) {
    if (err) {
      console.error(`FATAL ERROR: Failed to send hotel booking confirmation mail to customer`)
      // NOTIFY OPERATIONS TEAM HERE

    } else {
      if (bookingInfo) {
        data = data.replace("#name#", travellerName);
        data = data.replace("#confirmation#", confirmationNumber);
        data = data.replace("#destination#", bookingInfo.destinationName);
        data = data.replace("#hotel#", bookingInfo.hotelName);
        data = data.replace("#checkin#", bookingInfo.checkIn);
        data = data.replace("#checkout#", bookingInfo.checkOut);
        data = data.replace("#address#", bookingInfo.address);
        emailBusiness.sendEmail(
          recepient,
          'bookings@tripdizer.com',
          `Your hotel booking has been confirmed`,
          data
        );
      } else {
        console.error(`FATAL ERROR: Failed to send hotel booking confirmation mail to customer`)
        // NOTIFY OPERATIONS TEAM HERE
      }
    }
  });
}

var sendFlightBookingInformationEmail = function (travellerName, recepient, bookingConfirmation) {
  fs.readFile("email_templates/flight_confirmation.html", 'utf8', function (err, data) {
    if (err) {
      console.error(`FATAL ERROR: Failed to send flight booking confirmation mail to customer`)
      // NOTIFY OPERATIONS TEAM HERE

    } else {
      data = data.replace("#name#", travellerName);

      var flightDetailsRows = "";
      if (bookingConfirmation.bookingDetails.reservationDetails && bookingConfirmation.bookingDetails.reservationDetails.length > 0) {
        for (var i = 0; i < bookingConfirmation.bookingDetails.reservationDetails.length; i++) {
          var flightSegment = bookingConfirmation.bookingDetails.reservationDetails[i];
          flightDetailsRows += "<p>"
          flightDetailsRows += "<strong>Departure: </strong>" + (flightSegment.DepartureAirportLocationName + (flightSegment.DepartureTerminal != "" ? "( " + flightSegment.DepartureTerminal + " )" : "") + " at " + moment(flightSegment.DepartureDateTime).format("dd/MM/yyyy hh:mm"));
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Arrival: </strong>" + (flightSegment.ArrivalAirportLocationName + (flightSegment.ArrivalTerminal != "" ? "( " + flightSegment.ArrivalTerminal + " )" : "") + " at " + moment(flightSegment.ArrivalDateTime).format("dd/MM/yyyy hh:mm"));
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Duration: </strong>" + flightSegment.JourneyDurationInWords;
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Stops: </strong>" + ((flightSegment.StopQuantity == 0 || flightSegment.StopQuantity == "0") ? "Direct" : flightSegment.StopQuantity);
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Ariline: </strong>" + (flightSegment.MarketingAirlineName + (flightSegment.MarketingAirlineName == flightSegment.OperatingAirlineName ? "" : "( Operated by: " + flightSegment.OperatingAirlineName + " )"));
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Baggage: </strong>" + flightSegment.Baggage;
          flightDetailsRows += "<br>"
          flightDetailsRows += "<strong>Confirmation Number: </strong><strong style = 'color:#2989ff' >" + flightSegment.AirlinePNR + "</strong>";
          flightDetailsRows += "</p>"
        }
        data = data.replace("#booking_details#", flightDetailsRows);
        emailBusiness.sendEmail(
          recepient,
          'bookings@tripdizer.com',
          `Your flight booking has been confirmed`,
          data
        );
      } else {
        console.error(`FATAL ERROR: Failed to send flight booking confirmation mail to customer. Confirmation: ${JSON.stringify(bookingConfirmation)}`)
        // NOTIFY OPERATIONS TEAM HERE
      }
    }
  });
}

var sendBookingIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    'bookings@tripdizer.com',
    `[Booking failure incident] Request # ${requestId} Has a failed ${bookingType} booking.`,
    `Request # ${requestId} Has a failed ${bookingType} booking. Please check the dashboard immediately.`
  );
}

var sendBookingSuccessfulButUpdateFailureIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    'bookings@tripdizer.com',
    `[Booking information persistance incident] Request # ${requestId} Has a successful ${bookingType} booking, but booking details not saved to Tripdizer databases.`,
    `Request # ${requestId} Has a successful ${bookingType} booking, but booking details were not saved to Tripdizer databases. Please contact the system administrators immediately.`
  );
}

var sendBookingFailedAndUpdateFailureIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    'bookings@tripdizer.com',
    `[Booking information persistance incident] Request # ${requestId} Has a a failed ${bookingType} booking, and failure reason not saved to Tripdizer databases.`,
    `Request # ${requestId} Has a a failed ${bookingType} booking, but failure reason was not saved to Tripdizer databases. Please contact the system administrators immediately.`
  );
}

module.exports.start = function () {
  flightConfirmationSubscription.on(`message`, flightBookingConfirmationMessageHandler);
  console.log("Listenning for message on flightConfirmationSubscription");
  hotelConfirmationSubscription.on(`message`, hotelBookingConfirmationMessageHandler);
  console.log("Listenning for message on hotelConfirmationSubscription");

  flightErrorSubscription.on(`message`, flightBookingErrorMessageHandler);
  console.log("Listenning for message on flightErrorSubscription");
  hotelErrorSubscription.on(`message`, hotelBookingErrorMessageHandler);
  console.log("Listenning for message on hotelErrorSubscription");
};