'use strict';
// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const projectId = process.env.PROJECT_NAME || 'tripdizer-dev';
const keyFileName = 'tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });

const flightBookingTopicName = process.env.FLIGHT_BOOKING_PUBSUB_TOPIC_NAME || 'flight-booking-topic';
const hotelBookingTopicName = process.env.HOTEL_BOOKING_PUBSUB_TOPIC_NAME || 'hotel-booking-topic';

exports.publishFlightBookingMessage = async function (flightOffer, pnrInfoList) {
    var data = Buffer.from(JSON.stringify({ flightOffer: flightOffer, pnrInfoList: pnrInfoList }))
    const messageId = await pubsub.topic(flightBookingTopicName).publish(data);
    console.log(`Message ${messageId} published to ` + flightBookingTopicName);
}

exports.publishHotelBookingMessage = async function (hotel, pnrInfoList) {
    var data = Buffer.from(JSON.stringify({ hotel: hotel, pnrInfoList: pnrInfoList }));
    const messageId = await pubsub.topic(hotelBookingTopicName).publish(data);
    console.log(`Message ${messageId} published to ` + hotelBookingTopicName);
}

this.publishFlightBookingMessage({ "flight-number": "MS 965" }, { "passenger": "mohamed" })
this.publishHotelBookingMessage({ "hotel-name": "Hilton" }, { "occupant": "ahmed" })