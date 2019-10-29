import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE_CREDENTIALS } from "../util/secrets";

export let db: Firestore;

const dbConnect = () => {
  db = new Firestore({
    projectId: FIRESTORE_CREDENTIALS.project_id,
    credentials: FIRESTORE_CREDENTIALS
  });
};
dbConnect();
