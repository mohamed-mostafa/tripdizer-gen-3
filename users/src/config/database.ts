import { Firestore } from "@google-cloud/firestore";
import { KEY_FILE_NAME, PROJECT_NAME } from "../util/secrets";

export let db: Firestore;

const dbConnect = () => {
  // mongoose.Promise = bluebird;
  db = new Firestore({
    projectId: PROJECT_NAME,
    keyFilename: KEY_FILE_NAME
  });
};
dbConnect();
