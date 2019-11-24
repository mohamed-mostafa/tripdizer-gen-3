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

exports.publishFlightBookingMessage = async function (requestId, flightOffer, pnrInfoList) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, flightOffer: flightOffer, pnrInfoList: pnrInfoList }))
        const messageId = await pubsub.topic(flightBookingTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + flightBookingTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${flightBookingTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}

exports.publishHotelBookingMessage = async function (requestId, hotel, pnrInfoList) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, hotel: hotel, pnrInfoList: pnrInfoList }));
        const messageId = await pubsub.topic(hotelBookingTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + hotelBookingTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${hotelBookingTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}

// this.publishFlightBookingMessage({ "flight-number": "MS 965" }, { "passenger": "mohamed" })
// this.publishHotelBookingMessage({ "hotel-name": "Hilton" }, { "occupant": "ahmed" })