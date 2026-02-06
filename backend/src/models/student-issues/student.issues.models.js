import mongoose from "mongoose";

const studentIssueSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    particulars: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    showOnDashboard: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StudentIssueModel = mongoose.model("Student-Issues", studentIssueSchema);
export default StudentIssueModel;
