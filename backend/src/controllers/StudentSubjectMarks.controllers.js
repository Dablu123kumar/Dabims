import asyncHandler from "../middlewares/asyncHandler.js";
import studentSubjectMarksModel from "../models/subject/student.subject.marks.models.js";
import SubjectModel from "../models/subject/subject.models.js";
import mongoose from "mongoose";

// ADD SUBJECTS TO STUDENT (Admission Time – No Marks)
export const addCourseSubjectsToStudentController = asyncHandler(
  async (req, res) => {
    const { studentId, courseId, courseCategoryId, companyName, subjectIds } = req.body;

    if (!studentId || !courseId || !courseCategoryId || !companyName || !Array.isArray(subjectIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request payload",
      });
    }

    let record = await studentSubjectMarksModel.findOne({
      studentInfo: studentId,
      course: courseId,
    });

    // 🔹 CREATE if NOT EXISTS
    if (!record) {
      const subjects = subjectIds.map((id) => ({
        subject: id,
        theory: null,
        practical: null,
        totalMarks: null,
      }));

      record = await studentSubjectMarksModel.create({
        studentInfo: studentId,
        course: courseId,
        courseCategory: courseCategoryId,
        companyName,
        subjects,
        resultStatus: "NotStarted",
      });

      return res.status(201).json({
        success: true,
        message: "Subjects added successfully",
        record,
      });
    }

    // 🔹 APPEND ONLY NEW SUBJECTS
    const existingSubjectIds = record.subjects.map((s) =>
      s.subject.toString()
    );

    const newSubjects = subjectIds
      .filter((id) => !existingSubjectIds.includes(id))
      .map((id) => ({
        subject: id,
        theory: null,
        practical: null,
        totalMarks: null,
      }));

    if (!newSubjects.length) {
      return res.status(400).json({
        success: true,
        message: "No new subjects to add or subjects already assigned",
      });
    }

    record.subjects.push(...newSubjects);
    await record.save();

    res.status(200).json({
      success: true,
      message: "New subjects appended successfully",
    });
  }
);
// export const addCourseSubjectsToStudentController = asyncHandler(
//   async (req, res) => {
//     const { studentId, courseId, companyName, subjectIds } = req.body;
//     console.log(req.body)

//     // Check if record already exists
//     const exists = await studentSubjectMarksModel.findOne({
//       studentInfo: studentId,
//       course: courseId,
//     });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Subjects already assigned to this student for this course",
//       });
//     }
//     const subjects = subjectIds.map((id) => ({
//       subject: id,
//       theory: null,
//       practical: null,
//       totalMarks: null,
//     }));

//     const record = await studentSubjectMarksModel.create({
//       studentInfo: studentId,
//       course: courseId,
//       companyName,
//       subjects,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Subjects added to student successfully",
//       record,
//     });
//   }
// );

// ADD / UPDATE MARKS FOR A SUBJECT (After Course Completion)
export const updateStudentSubjectMarksController = asyncHandler(
  async (req, res) => {
    const { studentId, courseId, courseCategoryId, subjectId, theory, practical } = req.body;

    const totalMarks = (theory || 0) + (practical || 0);

    const result = await studentSubjectMarksModel.updateOne(
      {
        studentInfo: studentId,
        course: courseId,
        "subjects.subject": subjectId,
      },
      {
        $set: {
          "subjects.$.theory": theory,
          "subjects.$.practical": practical,
          "subjects.$.totalMarks": totalMarks,
          resultStatus: "Completed",
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Subject not found for this student",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
    });
  }
);

// ADD / UPDATE MULTIPLE SUBJECT MARKS AT ONCE
export const updateStudentMultipleSubjectMarksController = asyncHandler(
  async (req, res) => {
    const { studentId, courseId, subjects } = req.body;
    // console.log(req.body)

    if (!studentId || !courseId || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request payload",
      });
    }

    const record = await studentSubjectMarksModel.findOne({
      studentInfo: studentId,
      course: courseId,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Student subject record not found",
      });
    }

    // 🔥 REMOVE CORRUPTED SUBJECTS (CRITICAL FIX)
    record.subjects = record.subjects.filter(
      (s) => s.subject && s.subject.toString
    );

    subjects.forEach(({ subjectId, theory, practical }) => {
      if (!subjectId) return;

      const existing = record.subjects.find(
        (s) => s.subject.toString() === subjectId.toString()
      );

      if (existing) {
        existing.theory = theory ?? null;
        existing.practical = practical ?? null;
        existing.totalMarks = (theory ?? 0) + (practical ?? 0);
        existing.isActive = true;
      } else {
        record.subjects.push({
          subject: new mongoose.Types.ObjectId(subjectId),
          theory: theory ?? null,
          practical: practical ?? null,
          totalMarks: (theory ?? 0) + (practical ?? 0),
          isActive: true,
        });
      }
    });

    record.resultStatus = "Completed";
    await record.save();

    res.status(200).json({
      success: true,
      message: "Subject marks updated successfully",
    });
  }
);

// GET STUDENT SUBJECTS WITH MARKS (Student-wise)
export const getCourseSubjectBasedOnStudentController = asyncHandler(
  async (req, res) => {
    const { studentId, courseId } = req.params;
    //console.log('sub', studentId,courseId)

    const data = await studentSubjectMarksModel
      .find({ studentInfo: studentId, course: courseId })
      .populate("studentInfo", "name rollNumber")
      .populate("course", "courseName")
      .populate("subjects.subject", "_id subjectName subjectCode fullMarks passMarks");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No subjects found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  }
);

// GET STUDENT SUBJECTS BASED ON STUDENT ID WITH MARKS (Student-wise)
export const getCourseSubjectBasedOnCourseCategoryStudentController = asyncHandler(
  async (req, res) => {
    const { studentId } = req.params;
    //console.log('sub1', studentId,courseCategoryId)

    const data = await studentSubjectMarksModel
      .find({ studentInfo: studentId })
      .populate("studentInfo", "name rollNumber")
      .populate("course", "courseName")
      .populate("subjects.subject", "_id subjectName subjectCode fullMarks passMarks");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No subjects found",
      });
    }

    
    res.status(200).json({
      success: true,
      data,
    });
  }
);

// GET ALL STUDENT MARKS (Admin View)
export const getAllCourseSubjectMarksController = asyncHandler(
  async (req, res) => {
    const data = await studentSubjectMarksModel
      .find({})
      .populate("studentInfo", "name rollNumber")
      .populate("course", "courseName")
      .populate("companyName", "companyName")
      .populate("subjects.subject", "subjectName subjectCode");

    res.status(200).json({
      success: true,
      data,
    });
  }
);

// export const addCourseSubjectMarksController = asyncHandler(
//   async (req, res, next) => {
//     try {
//       // Define the filter criteria to find the existing record
//       const filter = {
//         studentInfo: req.body.studentId,
//         Subjects: req.body.subjectId,
//         course: req.body.courseId,
//         companyName: req.body.companyName,
//       };

//       // Define the update data
//       const updateData = {
//         ...req.body,
//         studentInfo: req.body.studentId,
//         Subjects: req.body.subjectId,
//         course: req.body.courseId,
//         companyName: req.body.companyName,
//       };

//       // Check if a record already exists for the given combination
//       const existingRecord = await studentSubjectMarksModel.findOne(filter);

//       if (existingRecord) {
//         // If the record exists, update it
//         await studentSubjectMarksModel.updateOne(filter, updateData);
//       } else {
//         // If the record does not exist, create a new one
//         const newRecord = new studentSubjectMarksModel(updateData);
//         await newRecord.save();
//       }

//       return res
//         .status(200)
//         .json({ success: true, message: "Marks added/updated successfully" });
//     } catch (error) {
//       console.error("Error while adding/updating marks:", error);
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   }
// );

// export const getCourseSubjectMarksController = asyncHandler(
//   async (req, res, next) => {
//     try {
//       // console.log(req.params.studentId);
//       const studentSubjectMarks = await studentSubjectMarksModel
//         .find({})
//         .populate(["studentInfo", "Subjects", "course", "companyName"])
//       // console.log(studentSubjectMarks);
//       res.status(200).json(studentSubjectMarks);
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// );

// export const getCourseSubjectBasedOnStudentController = asyncHandler(
//   async (req, res) => {
//     try {
//       const { studentId } = req.params;

//       const studentSubjectMarks = await studentSubjectMarksModel.findOne({
//         studentInfo: studentId
//       });

//       if (!studentSubjectMarks) {
//         return res.status(404).json({
//           success: false,
//           message: "No subjects found for the student"
//         });
//       }

//       const subjectsMap = studentSubjectMarks.subjects || new Map();

//       const subjectIds = Array.from(subjectsMap.entries())
//         .filter(([_, isSelected]) => isSelected === true)
//         .map(([subjectId]) => new mongoose.Types.ObjectId(subjectId));

//       if (!subjectIds.length) {
//         return res.status(200).json({
//           success: true,
//           subjects: []
//         });
//       }

//       const subjectDetails = await SubjectModel.find({
//         _id: { $in: subjectIds }
//       }).select("subjectName subjectCode");

//       res.status(200).json({
//         success: true,
//         studentId,
//         subjects: subjectDetails
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }
// );
// export const getCourseSubjectBasedOnStudentController = asyncHandler(
//   async (req, res, next) => {
//     try {
//       const {studentId} = req.params;
//       console.log('studentid', req.params.studentId);
//       const studentSubjectMarks = await studentSubjectMarksModel
//         .findOne({ studentInfo: studentId })
      
//         if(!studentSubjectMarks){
//           return  res.status(404).json({ success: false, message: "No subjects found for the student" });
//         }

//         // extract subjects ids from map
//         const subjectIds = Array.from(studentSubjectMarks.subjects.entries())
//         .filter(([_,isSelected])=> isSelected)
//         .map(([subjectId])=> subjectId);

//         // fetch subject name 
//         const subjectDetails = await SubjectModel.find({
//           _id: { $in: subjectIds}
//         }).select('subjectName subjectCode')
  
//       // console.log(studentSubjectMarks);
//       res.status(200).json({
//         studentId,
//         subjects: subjectDetails
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// );


// export const updateCourseSubjectMarksController = asyncHandler(
//   async (req, res, next) => {
//     // console.log(req.params);
//     try {
//       const { marksId } = req.params;
//       const findStudentSubjectMarks = await studentSubjectMarksModel.findById(
//         marksId
//       );
//       if (!findStudentSubjectMarks) {
//         return res.status(404).json({ message: "Marks not found" });
//       }
//       // console.log(findStudentSubjectMarks);

//       findStudentSubjectMarks.theory =
//         req.body.theory || findStudentSubjectMarks.theory;
//       findStudentSubjectMarks.practical =
//         req.body.practical || findStudentSubjectMarks.practical;
//       findStudentSubjectMarks.totalMarks =
//         req.body.totalMarks || findStudentSubjectMarks.totalMarks;
//       findStudentSubjectMarks.subjects !== undefined
//         ? req.body.subjects
//         : findStudentSubjectMarks.subjects;
//       findStudentSubjectMarks.studentInfo =
//         req.body.studentId || findStudentSubjectMarks.studentInfo;
//       findStudentSubjectMarks.Subjects =
//         req.body.subjectId || findStudentSubjectMarks.Subjects;
//       findStudentSubjectMarks.course =
//         req.body.courseId || findStudentSubjectMarks.course;

//       const updateStudentMarks = await findStudentSubjectMarks.save();
//       res.status(200).json({message:"Updated Student Marks Successfully",updateStudentMarks});
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// );




// export const studentAddOnCourseSubjectController = async (req, res, next) => {
//   try {
//     // console.log(req.body);
//     // console.log(req.user);
//     const {
//       subjectName,
//       subjectCode,
//       fullMarks,
//       passMarks,
//       studentInfo,
//       course,
//       courseType,
//     } = req.body;

//     switch (true) {
//       case !subjectName:
//         return res.status(400).json({ message: "Subject Name is required" });
//       case !subjectCode:
//         return res.status(400).json({ message: "Subject Code is required" });
//       case !fullMarks:
//         return res.status(400).json({ message: "Full Mark is required" });
//       case !passMarks:
//         return res.status(400).json({ message: "Pass Mark is required" });
//       default:
//         break;
//     }

//     let addOnSubject = new AddOnSubjectModel(req.body);
//     addOnSubject.addedBy = req.user.fName + " " + req.user.lName;
//     let addedSubject = await addOnSubject.save();
//     res.status(200).json(addedSubject);
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getAllAddOnSubjectController = async (req, res, next) => {
//   try {
//     const addOnSubjects = await AddOnSubjectModel.find({}).populate([
//       "course",
//       "courseType",
//       "studentInfo",
//     ]);
//     res.status(200).json(addOnSubjects);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
