import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const labModel = mongoose.model("Labs", labSchema);

export default labModel;
