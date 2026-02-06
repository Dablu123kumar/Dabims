import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    gst_percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentGST_GuggestionModel = mongoose.model(
  "StudentGST_Guggestion",
  schema
);
export default StudentGST_GuggestionModel;
