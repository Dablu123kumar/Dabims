import mongoose from "mongoose";

const lateFeesSchema = new mongoose.Schema(
  {
    lateFees: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LateFeesModel = mongoose.model("LateFees", lateFeesSchema);

export default LateFeesModel;
