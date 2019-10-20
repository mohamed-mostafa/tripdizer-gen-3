import { Firestore } from "@google-cloud/firestore";
import bluebird from "bluebird";
import mongoose from "mongoose";
import { KEY_FILE_NAME, MONGODB_URI, PROJECT_NAME } from "../util/secrets";

export let db: Firestore;

const dbConnect = () => {
  db = new Firestore({
    projectId: PROJECT_NAME,
    keyFilename: KEY_FILE_NAME
  });

  mongoose.Promise = bluebird;
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .then(() => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch(err => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      // process.exit();
    });
};
dbConnect();
