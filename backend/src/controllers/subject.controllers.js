import asyncHandler from "../middlewares/asyncHandler.js";
import SubjectModel from "../models/subject/subject.models.js";

export const addSubjectController = asyncHandler(async (req, res, next) => {
  //console.log(req.body);
  try {
    const {
      subjectName,
      subjectCode,
      fullMarks,
      passMarks,
      semYear,
      subjects,
      course,
      courseType,
    } = req.body;

    // console.log(req.body);

    switch (true) {
      case !subjectName:
        return res.status(400).json({ message: "Subject Name is required" });
      case !subjectCode:
        return res.status(400).json({ message: "Subject Code is required" });
      case !fullMarks:
        return res.status(400).json({ message: "Full Mark is required" });
      case !passMarks:
        return res.status(400).json({ message: "Pass Mark is required" });
      default:
        break;
    }
    // let existedSubject = await SubjectModel.findOne({ subjectName });
    // if (existedSubject) {
    //   return res.status(400).json({ message: "Subject already exists" });
    // }

    let newSubject = new SubjectModel(req.body);
    newSubject.addedBy = req.user.fName + " " + req.user.lName;
    let addedSubject = await newSubject.save();
    res.json(addedSubject);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getCourseSubjectsListsController = asyncHandler(
  async (req, res, next) => {
    try {
      const subjects = await SubjectModel.find({})
        .populate(["course", "courseType"])
        .sort({ createdAt: 1 });
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const updateCourseSubjectController = asyncHandler(
  async (req, res, next) => {
    try {
      // console.log(req.body);
      const { id } = req.params;
      const findSubject = await SubjectModel.findById({ _id: id });
      // console.log(findSubject);
      //console.log(req.body);

      findSubject.subjectName = req.body.subjectName || findSubject.subjectName;
      findSubject.subjectCode = req.body.subjectCode || findSubject.subjectCode;
      findSubject.fullMarks = req.body.fullMarks || findSubject.fullMarks;
      findSubject.passMarks = req.body.passMarks || findSubject.passMarks;
      // findSubject.subjects = req.body.subjects || findSubject.subjects;
      // findSubject.theory = req.body.theory || findSubject.theory;
      // findSubject.practical = req.body.practical || findSubject.practical;
      // findSubject.totalMarks = req.body.totalMarks || findSubject.totalMarks;
      findSubject.course = req.body.course || findSubject.course;
      findSubject.courseType = req.body.courseType || findSubject.courseType;
      findSubject.semYear = req.body.semYear || findSubject.semYear;
      findSubject.addedBy =
        req.user.fName + " " + req.user.lName || findSubject.addedBy;

      let updatedCourseSubject = await findSubject.save();
      res.status(200).json(updatedCourseSubject);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const deleteCourseSubjectController = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const findSubject = await SubjectModel.findById({ _id: id });

      let deletedCourseSubject = await findSubject.deleteOne();
      res.status(200).json(deletedCourseSubject);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getSubjectBasedOnCourseController = asyncHandler(
  async (req, res) => {
    try {
      const courseSubjects = await SubjectModel.find({
        course: req.params.courseId,
      });
      res.status(200).json(courseSubjects);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
