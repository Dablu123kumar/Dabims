import mongoose from "mongoose";

// Define a schema for the counter collection
const reciptSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 100 },
});

// Create a model for the recipt collection
const reciptNumberModel = mongoose.model("recipt", reciptSchema);
export default reciptNumberModel;
