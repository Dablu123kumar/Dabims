import mongoose from "mongoose";

// Define a schema for the counter collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1000 },
});

// Create a model for the counter collection
const CounterRollNumberModel = mongoose.model("Counter", counterSchema);
export default CounterRollNumberModel;
