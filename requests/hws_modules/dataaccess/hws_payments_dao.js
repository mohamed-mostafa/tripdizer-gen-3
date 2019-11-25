let daoUtilities = require('./hws_dao_utilities');

exports.save = async function (requestId, paymentType, createdAt, response) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore
		.doc(`request-payments/${requestId}`)
		.collection(paymentType)
		.doc(createdAt);
	// Enter new data into the document.
	try {
		await document.set(response);
	} catch (err) {
		console.log('Failed to save transaction for request: ' + requestId);
		console.error(err);
	}
};

exports.get = function (requestId) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-payments/' + requestId);
	// Read data fro the document.
	return document.get();
}