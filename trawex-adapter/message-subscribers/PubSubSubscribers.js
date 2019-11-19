'use strict';

const flightsBookingService = require('../service/FlightsService');
const hotelsBookingService = require('../service/HotelsService');

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const projectId = process.env.PROJECT_NAME || 'tripdizer-dev';
const keyFileName = '../tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });
const flightBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.FLIGHT_BOOKING_SUBSCRIPTION_NAME || 'flight-booking-subscription');
const hotelBookingSubscriptionName = 'projects/' + projectId + '/subscriptions/' + (process.env.HOTEL_BOOKING_SUBSCRIPTION_NAME || 'hotel-booking-subscription');

// References an existing subscription
const flightSubscription = pubsub.subscription(flightBookingSubscriptionName);
const hotelSubscription = pubsub.subscription(hotelBookingSubscriptionName);

// Create an event handler to handle messages

const flightBookingMessageHandler = message => {
  console.log(`Received flight booking message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);

  let bookFlightRequest = {
    sessionId: message.data.flightOffer.sessionId,
    fareSourceCode: message.data.flightOffer.fareSourceCode,
    fareType: message.data.flightOffer.fareType,
    adultsPNRInfoList: message.data.pnrInfoList.filter(pnrInfo => pnrInfo.ageGroup == "adult"),
    childrenPNRInfoList: message.data.pnrInfoList.filter(pnrInfo => pnrInfo.ageGroup == "child"),
    infantPNRInfoList: message.data.pnrInfoList.filter(pnrInfo => pnrInfo.ageGroup == "infant")
  }
  flightsBookingService.bookFlight(en, bookFlightRequest).then(response => {
    // "Ack" (acknowledge receipt of) the message
    message.ack();
  }).catch(err => {
    console.error("Message with id: " + message.id + " failed to process");
    console.error(err);
  })

}

const hotelBookingMessageHandler = message => {
  console.log(`Received hotel booking message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);
  // "Ack" (acknowledge receipt of) the message
  message.ack();
}

flightSubscription.on(`message`, flightBookingMessageHandler);
console.log("Listenning for message on flightSubscription");
hotelSubscription.on(`message`, hotelBookingMessageHandler);
console.log("Listenning for message on hotelSubscription");