import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    AddOnSubjects: {
      type: String,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    fullMarks: {
      type: Number,
      required: true,
    },
    passMarks: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseType",
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    semYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const SubjectModel = mongoose.model("Subject", subjectSchema);

export default SubjectModel;
