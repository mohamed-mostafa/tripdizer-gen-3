'use strict';
// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
// Creates a client
const projectId = process.env.PROJECT_ID || 'tripdizer-dev';
const keyFileName = './tripdizer-service-account.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFileName;

const pubsub = new PubSub({ projectId, keyFileName });

const flightBookingConfirmationTopicName = process.env.FLIGHT_BOOKING_CONFIRMATION_PUBSUB_TOPIC_NAME || 'flight-booking-confirmation-topic';
const hotelBookingConfirmationTopicName = process.env.HOTEL_BOOKING_CONFIRMATION_PUBSUB_TOPIC_NAME || 'hotel-booking-confirmation-topic';

const flightBookingErrorTopicName = process.env.FLIGHT_BOOKING_ERROR_PUBSUB_TOPIC_NAME || 'flight-booking-error-topic';
const hotelBookingErrorTopicName = process.env.HOTEL_BOOKING_ERROR_PUBSUB_TOPIC_NAME || 'hotel-booking-error-topic';

exports.publishFlightBookingConfirmedMessage = async function (requestId, flightOfferFareSourceCode, bookingConfirmation) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, fareSourceCode: flightOfferFareSourceCode, bookingConfirmation: bookingConfirmation }))
        const messageId = await pubsub.topic(flightBookingConfirmationTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + flightBookingConfirmationTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${flightBookingConfirmationTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}

exports.publishHotelBookingConfirmedMessage = async function (requestId, hotelId, bookingConfirmation) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, hotelId: hotelId, bookingConfirmation: bookingConfirmation }));
        const messageId = await pubsub.topic(hotelBookingConfirmationTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + hotelBookingConfirmationTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${hotelBookingConfirmationTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}

exports.publishFlightBookingFailedMessage = async function (requestId, flightOfferFareSourceCode, failureReason) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, fareSourceCode: flightOfferFareSourceCode, failureReason: failureReason }))
        const messageId = await pubsub.topic(flightBookingErrorTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + flightBookingErrorTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${flightBookingTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}

exports.publishHotelBookingFailedMessage = async function (requestId, hotelId, failureReason) {
    try {
        var data = Buffer.from(JSON.stringify({ requestId: requestId, hotelId: hotelId, failureReason: failureReason }));
        const messageId = await pubsub.topic(hotelBookingErrorTopicName).publish(data);
        console.log(`Message ${messageId} published to ` + hotelBookingErrorTopicName);
    } catch (err) {
        console.error(`FATAL ERROR: Failed to publish message ${JSON.stringify(data)} to ${hotelBookingErrorTopicName}. Reason: ${JSON.stringify(err)} `);
    }
}