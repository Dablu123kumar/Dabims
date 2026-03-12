import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    trainerImage: {
      type: String,
      required: true,
    },
    trainerName: {
      type: String,
      required: true,
    },
    trainerDesignation: {
      type: String,
      required: true,
    },
    trainerEmail: {
      type: String,
      required: true,
    },
    trainerRole : {
      type : String,
      required : true,
      default : "Trainer"
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

const trainerFormModel = mongoose.model("Trainers", trainerSchema);

export default trainerFormModel;
