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

    // Drop old unique indexes that conflict with multi-tenant SaaS
    try {
      const db = res.connection.db;
      const paymentOptionsCollection = db.collection("paymentoptions");
      const indexes = await paymentOptionsCollection.indexes();
      const nameIndex = indexes.find(
        (idx) => idx.key?.name === 1 && idx.unique === true
      );
      if (nameIndex) {
        await paymentOptionsCollection.dropIndex(nameIndex.name);
        console.log("Dropped old unique index on paymentoptions.name");
      }
    } catch (e) {
      // Index may not exist, ignore
    }

    // Migrate existing companies: any company without isApproved set is legacy (owner-created) → approve them
    try {
      const db = res.connection.db;
      const companiesCollection = db.collection("companies");
      const result = await companiesCollection.updateMany(
        { isApproved: { $exists: false } },
        { $set: { isApproved: true, status: "approved" } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Migrated ${result.modifiedCount} existing companies to approved status`);
      }
    } catch (e) {
      console.log("Company migration error:", e.message);
    }

    return true;
  } catch (error) {
    console.log(`Error while connecting to db ${error.message}`);
    console.log('Full error:', error);
    return false;
  }
};
