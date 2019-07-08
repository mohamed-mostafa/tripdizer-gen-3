let daoUtilities = require('./hws_dao_utilities');
 
exports.save = async function(requestId, attractions) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-attractions/' + requestId); 
  // Enter new data into the document.
  try {
    await document.set(attractions);
  } catch (err) {
    console.log("Failed to save attractions for request " + requestId);
    console.log(err);
  }  
}

exports.get = function(requestId) {
  let firestore = daoUtilities.getFireStoreClient();
    // Obtain a document reference.
    const document = firestore.doc('request-attractions/' + requestId); 
    // Read data fro the document.
    return document.get();
}