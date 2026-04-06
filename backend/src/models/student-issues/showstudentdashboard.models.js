import mongoose from "mongoose";

const showStudentDashboardSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  showStudent: {
    type: Boolean,
    default: false,
  },
  studentName: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
});

const ShowStudentDashboardModel = mongoose.model(
  "ShowStudentDashboard",
  showStudentDashboardSchema
);

export default ShowStudentDashboardModel;
