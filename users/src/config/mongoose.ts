import bluebird from "bluebird";
import mongoose from "mongoose";
import { MONGODB_URI } from "../util/secrets";

export default () => {
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
