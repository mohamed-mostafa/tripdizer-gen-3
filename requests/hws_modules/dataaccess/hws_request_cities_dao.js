let daoUtilities = require('./hws_dao_utilities');
 
exports.save = async function(requestId, cities) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-cities/' + requestId); 
  // Enter new data into the document.
  try {
    await document.set(cities);  
  } catch (err) {
    console.log("Failed to save cities for request " + requestId);
    console.log(err);
  }
}

exports.get = async function(requestId) {
  let firestore = daoUtilities.getFireStoreClient();
    // Obtain a document reference.
    const document = firestore.doc('request-cities/' + requestId); 
    // Read data fro the document.
    return document.get();
  }