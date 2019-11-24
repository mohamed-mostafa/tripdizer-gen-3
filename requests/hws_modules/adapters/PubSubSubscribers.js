'use strict';

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
const bookingsDao = require('../dataaccess/hws_bookings_dao');
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

    // NOTIFY CUSTOER HERE ?
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

    // NOTIFY CUSTOER HERE ?
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

var sendBookingIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    'bookings@tripdizer.com',
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    `[Booking Failure Indident] Request # ${requestId} Has a failed ${bookingType} booking.`,
    `[Booking Failure Indident] Request # ${requestId} Has a failed ${bookingType} booking. Please check the dashboard immediately.`
  );
}

var sendBookingSuccessfulButUpdateFailureIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    'bookings@tripdizer.com',
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    `[Booking Information Persistance Indident] Request # ${requestId} Has a successful ${bookingType} booking, but booking details not saved to Tripdizer databases.`,
    `[Booking Information Persistance Indident] Request # ${requestId} Has a successful ${bookingType} booking, but booking details not saved to Tripdizer databases. Please contact the system administrators immediately.`
  );
}

var sendBookingFailedAndUpdateFailureIncidentEmail = function (requestId, bookingType) {
  emailBusiness.sendEmail(
    'bookings@tripdizer.com',
    process.env.BOOKING_ERROR_NOTIFICATION_EMAIL || 'mohamed@tripdizer.com',
    `[Booking Information Persistance Indident] Request # ${requestId} Has a a failed ${bookingType} booking, and failure reason not saved to Tripdizer databases.`,
    `[Booking Information Persistance Indident] Request # ${requestId} Has a a failed ${bookingType} booking, but failure reason not saved to Tripdizer databases. Please contact the system administrators immediately.`
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
}