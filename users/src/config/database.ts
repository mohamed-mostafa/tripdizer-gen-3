import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE_CREDENTIALS, PROJECT_NAME } from "../util/secrets";

export let db: Firestore;

const dbConnect = () => {
  // mongoose.Promise = bluebird;
  db = new Firestore({
    projectId: PROJECT_NAME,
    credentials: FIRESTORE_CREDENTIALS
  });
};
dbConnect();
