let daoUtilities = require('./hws_dao_utilities');

let save = async function(requestId, pnrInfo) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-pnr/' + requestId);
	// Enter new data into the document.
	try {
		await document.set(pnrInfo);
	} catch (err) {
		console.log('Failed to save PNR info for request ' + requestId);
		console.error(err);
	}
};

let get = function(requestId) {
	let firestore = daoUtilities.getFireStoreClient();
	// Obtain a document reference.
	const document = firestore.doc('request-pnr/' + requestId);
	// Read data fro the document.
	return document.get();
};

let getUserIdsBYMail = function(email, callback) {
	let firestore = daoUtilities.getFireStoreClient();
	let foundData = [];
	const document = firestore
		.collection('request-pnr')
		.get()
		.then(snapshot => {
			if (snapshot.empty) {
				callback('No matching documents.');
				return;
			}
			snapshot.forEach(doc => {
				// console.log(doc.id, '=>', doc.data());
				doc.data().choices.forEach(res => {
					if (res.email == email) foundData.push(doc.id);
				});
			});
			callback(foundData);
		})
		.catch(err => {
			callback('Error getting documents', err);
		});
};
module.exports = {
	save,
	get,
	getUserIdsBYMail,
};
