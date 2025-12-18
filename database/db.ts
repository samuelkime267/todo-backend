import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";

const connectDb = async (cb: () => void) => {
  try {
    await mongoose.connect(MONGO_URL);
    cb();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDb;
