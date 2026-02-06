import mongoose from "mongoose";

const numberOfYearsSchema = new mongoose.Schema(
  {
    numberOfYears: {
      type: Number,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NumberOfYearsModel = mongoose.model("NumberOfYears", numberOfYearsSchema);

export default NumberOfYearsModel;
