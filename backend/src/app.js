import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/users.routes.js";
import addMissionFormRoutes from "./routes/addMissionForm.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import courseFeesRoutes from "./routes/courseFees.routes.js";
import paymentOptionsRoutes from "./routes/paymentOptions.routes.js";
import companyRoutes from "./routes/company.routes.js";
import emailRemainderRoutes from "./routes/emailRemainder.routes.js";
import whatsAppMessageSuggestionRoutes from "./routes/whatsAppMessageSuggestion.routes.js";
import dayBookRoutes from "./routes/dayBook.routes.js";
import studentGstSuggestionsRoutes from "./routes/studentGstSuggestions.routes.js";
import { BACKEND_URL, FRONTEND_URL } from "./config/config.js";
import studentIssuesRoutes from "./routes/student.issues.routes.js";
import completeCourseStudentsRoutes from "./routes/completeCourseStudentsRoutes.routes.js";
import customField from "./routes/customField.routes.js";
import addForms from "./routes/addForms.routes.js";
import submitForm from "./routes/submitForm.routes.js";
import reOrderingColumnsAndRows from "./routes/reorderingColumnsAndRows.routes.js";
import addTrainer from "./routes/addTrainer.routes.js";
import labRoutes from "./routes/lab.routes.js";
import startSchedulerStudentRemainderFeesToStudents from "../cron-jobs/SendRemainderFeesToStudent.cron_job.js";
import batchRoutes from "./routes/batch.routes.js";
import batchCategoryRoutes from "./routes/batchCategory.routes.js";
import timingRoutes from "./routes/addTiming.routes.js";
import defaultSelectRoutes from "./routes/selectDefault.routes.js";
import StudentNotesRoutes from "./routes/studentNotes.routes.js";
import userRoleAccessRoutes from "./routes/userRoleAccess.routes.js";
import allMails from "./routes/getAllEmailsData.routes.js";
import emailTemplate from "./routes/emailTemplate.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import attendenceRoute from './routes/attendence.routes.js'

const app = express();

// Apply CORS middleware with options
// app.use(cors({ origin: [BACKEND_URL, FRONTEND_URL], credentials: true }));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

startSchedulerStudentRemainderFeesToStudents();

app.use("/api", userRoutes);
app.use("/api/addmission_form", addMissionFormRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/student-issues", studentIssuesRoutes);
app.use("/api/student-notes", StudentNotesRoutes);
app.use("/api/complete/course/students", completeCourseStudentsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/courseFees", courseFeesRoutes);
app.use("/api/paymentOptions", paymentOptionsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/emailRemainder", emailRemainderRoutes);
app.use("/api/whatsAppMessageSuggestion", whatsAppMessageSuggestionRoutes);
app.use("/api/student-gst-suggestions", studentGstSuggestionsRoutes);
app.use("/api/dayBook", dayBookRoutes);
app.use("/api/custom-field", customField);
app.use("/api/select-field", defaultSelectRoutes);
app.use("/api/add-form", addForms);
app.use("/api/add-trainer", addTrainer);
app.use("/api/add-lab", labRoutes);
app.use("/api/email", emailTemplate);
app.use("/api/add-timing", timingRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/attendence", attendenceRoute);
app.use("/api/submit-form", submitForm);
app.use("/api/user-role", userRoleAccessRoutes);
app.use("/api/receipt-approval", approvalRoutes);
app.use("/api/teachers", teacherRoutes);
// app.use("/api/enquiry-form", submitForm);
app.use("/api", reOrderingColumnsAndRows);
app.use("/api/allMails", allMails);
app.use("/api/batch-categories", batchCategoryRoutes);

const __dirname = path.resolve();
app.use("/api/images", express.static(path.join(__dirname + "/images")));
app.use(express.static(path.join(__dirname, "./build")));

// app.use(sendRemainderFeesStudent);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});
export default app;
