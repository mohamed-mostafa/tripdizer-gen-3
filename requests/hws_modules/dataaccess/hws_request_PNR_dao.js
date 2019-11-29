let daoUtilities = require('./hws_dao_utilities');

exports.save = async function (requestId, pnrInfo) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-pnr/' + requestId);
  // Enter new data into the document.
  try {
    await document.set(pnrInfo);
  } catch (err) {
    console.log("Failed to save PNR info for request " + requestId);
    console.error(err);
  }
}

exports.get = function (requestId) {
  let firestore = daoUtilities.getFireStoreClient();
  // Obtain a document reference.
  const document = firestore.doc('request-pnr/' + requestId);
  // Read data fro the document.
  return document.get();
}