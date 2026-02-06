import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    mandatory: {
      type: Boolean,
      default: false,
    },
    headerView: {
      type: Boolean,
      default: false,
    },
    options: [{ label: String, value: String }],
    companyName: {
      type: String,
    },
    formId: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const customFieldModel = new mongoose.model("Field", Schema);

export default customFieldModel;
