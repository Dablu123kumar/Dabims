import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    batchTrainer: {
      type: String,
      required: true,
    },
    batchLab: {
      type: String,
      required: true,
    },
    batchStartDate: {
      type: Date,
      required: true,
    },
    batchEndDate: {
      type: Date,
      required: true,
    },
    batchTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const batchModel = mongoose.model("Batches", batchSchema);

export default batchModel;
