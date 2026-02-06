import mongoose, { Schema } from "mongoose";

const studentNotesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    particulars: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      default: null,
    },
    // endTime: {
    //   type: Date,
    //   default: null,
    // },
    addedBy: {
      type: String,
      required: true,
    },
    userId: {
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

const studentNotesModel = mongoose.model("Student-Notes", studentNotesSchema);
export default studentNotesModel;
