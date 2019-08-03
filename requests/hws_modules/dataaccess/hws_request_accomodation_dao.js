let daoUtilities = require('./hws_dao_utilities');

exports.save = async function(requestId, accomodationOffers) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-accomodation-offers/' + requestId); 
  // Enter new data into the document.
  try {
    await document.set(accomodationOffers); 
  } catch (err) {
    console.log("Failed to save accomodation offers for request " + requestId);
    console.error(err);
  } 
}

exports.get = function(requestId) {
  let firestore = daoUtilities.getFireStoreClient();
    // Obtain a document reference.
    const document = firestore.doc('request-accomodation-offers/' + requestId); 
    // Read data fro the document.
    return document.get();
}