let daoUtilities = require('./hws_dao_utilities');

exports.saveHotelBookingResult = async function (requestId, hotelId, bookingResult) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-hotel-booking-result/' + requestId + "-" + hotelId);
	// Enter new data into the document.
	try {
		await document.set(bookingResult);
	} catch (err) {
		console.log("Failed to save request hotel booking result request and hotel " + requestId + "-" + hotelId);
		console.error(err);
	}
}

exports.getHotelBookingResult = function (requestId, hotelId) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-hotel-booking-result/' + requestId + "-" + hotelId);
	// Read data fro the document.
	return document.get();

	// return firestore.getAll(...hotelIds.map(hotelId => `request-hotel-booking-result/' ${requestId}-${hotelId}`))
}

exports.saveFlightBookingResult = async function (requestId, fareSourceCode, bookingResult) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-flight-booking-result/' + requestId + "-" + fareSourceCode);
	// Enter new data into the document.
	try {
		await document.set(bookingResult);
	} catch (err) {
		console.log("Failed to save request flight booking result request and flight " + requestId + "-" + fareSourceCode);
		console.error(err);
	}
}

exports.getFlightBookingResult = function (requestId, fareSourceCode) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-flight-booking-result/' + requestId + "-" + fareSourceCode);
	// Read data fro the document.
	return document.get();

	// return firestore.getAll(...fareSourceCodes.map(fareSourceCode => `request-flight-booking-result/' ${requestId}-${fareSourceCode}`))
}