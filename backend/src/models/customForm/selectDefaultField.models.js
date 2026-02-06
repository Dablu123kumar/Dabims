import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const selectSchema = new mongoose.Schema({
  selectName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: [OptionSchema],
  mandatory: { type: Boolean, default: true },
});

const selectDefaultModel = mongoose.model("select", selectSchema);

export default selectDefaultModel;
