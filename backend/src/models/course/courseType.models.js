import mongoose from "mongoose";

const courseTypeSchema = new mongoose.Schema(
  {
    courseType: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CourseTypeModel = mongoose.model("CourseType", courseTypeSchema);

export default CourseTypeModel;
