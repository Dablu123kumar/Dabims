import admissionFormModel from "../models/addmission_form.models.js";
import ShowStudentDashboardModel from "../models/student-issues/showstudentdashboard.models.js";
import StudentIssueModel from "../models/student-issues/student.issues.models.js";

export const addStudentIssueController = async (req, res) => {
  try {
    const { particulars, studentId } = req.body;
    // console.log(req);
    if (!particulars) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide particulars!" });
    }

    //console.log(req.user);

    const studentIssue = new StudentIssueModel({
      particulars,
      studentId,
      addedBy: req.user.fName,
    });

    await studentIssue.save();

    res
      .status(201)
      .json({ success: true, message: "student issue created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server error" });
  }
};

export const getAllStudentIssuesListsController = async (req, res) => {
  try {
    const studentIssues = await StudentIssueModel.find({}).sort({
      createdAt: -1,
    });
    res.status(200).json(studentIssues);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server error" });
  }
};

export const updateSingleStudentIssueController = async (req, res) => {
  try {
    const { id } = req.params;
    const { particulars, studentId } = req.body;
    const updatedStudentIssue = await StudentIssueModel.findByIdAndUpdate(
      id,
      { particulars, studentId },
      { new: true }
    );

    await updatedStudentIssue.save();

    res.status(200).json({
      success: true,
      message: "Student issue updated successfully!",
    });
  } catch (error) {
    res.status(500);
  }
};

export const deleteSingleStudentIssueController = async (req, res) => {
  try {
    const { id } = req.params;
    await StudentIssueModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "delete student Issue successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateStudentIssueNoteStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { showNotesDashBoard } = req.body;
    const updatedStudentIssue = await admissionFormModel.findByIdAndUpdate(
      id,
      { showNotesDashBoard },
      { new: true }
    );
    await updatedStudentIssue.save();
    res
      .status(200)
      .json({ success: true, message: "updated student notes status" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server error" });
  }
};

export const showStudentIssueOnDashboardController = async (req, res) => {
  try {
    const { studentId, showStudent, studentName } = req.body;
    const existedStudentIssueStatus = await ShowStudentDashboardModel.findOne({
      studentId,
    });

    if (existedStudentIssueStatus) {
      existedStudentIssueStatus.showStudent = showStudent;
      existedStudentIssueStatus.studentName = studentName;
      await existedStudentIssueStatus.save(); // Move save inside if block
    } else {
      const newStudentIssueStatus = new ShowStudentDashboardModel({
        studentId,
        showStudent: showStudent,
        studentName,
      });
      await newStudentIssueStatus.save();
    }

    return res.status(200).json({
      success: true,
      message: "student issue status updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAllShowStudentIssueOnDashboardController = async (req, res) => {
  try {
    const getAllStudentIssueStatus = await ShowStudentDashboardModel.find();
    return res.status(200).json(getAllStudentIssueStatus);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSingleStudentShowStudentIssueOnDashboardController = async (
  req,
  res
) => {
  try {
    const singleStudentIssueStatus = await ShowStudentDashboardModel.findOne({
      studentId: req.params.id,
    });
    res.status(200).json({ success: true, singleStudentIssueStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
