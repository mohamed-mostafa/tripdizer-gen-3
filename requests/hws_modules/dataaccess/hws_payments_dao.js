let daoUtilities = require('./hws_dao_utilities');

exports.save = async function(paymentId, paymentType, response) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore
		.doc(`payments/${paymentId}`)
		.collection(paymentType)
		.doc();
	// Enter new data into the document.
	try {
		await document.set(response);
	} catch (err) {
		console.log('Failed to save transaction ' + paymentId);
		console.error(err);
	}
};
