import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  reciept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseFees",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  check: {
    type: Boolean,
    default: false,
  },
});

const approvalModel = mongoose.model("ApprovalReciepts", approvalSchema);

export default approvalModel;
