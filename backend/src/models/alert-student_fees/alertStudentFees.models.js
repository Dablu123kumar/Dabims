import mongoose from "mongoose";

const schema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  Date: {
    type: Date,
    required: true,
  },
  RemainderDateAndTime: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  particulars: {
    type: String,
    required: true,
  },
  isEmailSent: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
});

const AlertStudentPendingFeesModel = new mongoose.model(
  "AlertStudentPendingFees",
  schema
);
export default AlertStudentPendingFeesModel;
