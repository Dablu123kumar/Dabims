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
});

const ShowStudentDashboardModel = mongoose.model(
  "ShowStudentDashboard",
  showStudentDashboardSchema
);

export default ShowStudentDashboardModel;
