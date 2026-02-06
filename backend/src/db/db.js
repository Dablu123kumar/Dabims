import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', MONGO_URI);
    const res = await mongoose.connect(MONGO_URI);
    console.log(
      `Database connection established at host ${res.connection.host}`
    );
    return true;
  } catch (error) {
    console.log(`Error while connecting to db ${error.message}`);
    console.log('Full error:', error);
    return false;
  }
};
