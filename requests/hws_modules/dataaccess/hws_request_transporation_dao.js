let daoUtilities = require('./hws_dao_utilities');
 
exports.save = async function(requestId, transportationOffers) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-transportation-offers/' + requestId); 
  // Enter new data into the document.
  try {
    await document.set(transportationOffers);
  } catch (err) {
    console.log("Failed to save transportation offers for request " + requestId);
    console.error(err);
  }
}

exports.get = async function(requestId) {
  let firestore = daoUtilities.getFireStoreClient();
    // Obtain a document reference.
    const document = firestore.doc('request-transportation-offers/' + requestId); 
    // Read data fro the document.
    return document.get();
}