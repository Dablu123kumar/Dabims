import moment from "moment";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import { sendEmail } from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import { userModel } from "../models/user.models.js";

export const getCourseCompleteStudentsController = asyncHandler(
  async (req, res, next) => {
    try {
      // Fetch all students from the model
      const students = await admissionFormModel.find();

      // Filter students who have completed their course
      const filteredStudents = students.filter((student) => {
        return (
          student.netCourseFees > student.course_fees &&
          moment(student?.courseduration).diff(moment(), "days") === 0
        );
      });

      const users = await userModel.find({
        role: { $in: ["Admin", "SuperAdmin"] },
      });
      let toEmails = "";
      users.forEach((user) => {
        toEmails += `${user.email},`;
      });
      // console.log(toEmails);

      //console.log(filteredStudents);
      // send the email to the students
      filteredStudents.forEach(async (student) => {
        //console.log(student.skipMonthIncremented);
        if (student.skipMonthIncremented === false) {
          await sendEmail(
            `${toEmails}`,
            `Hello ${student.name} your course is completed`,
            `Hello ${student.name} your course is completed today if you want to renew course for further classes then contact to institute `
          );
          student.skipMonthIncremented = true;
          await student.save();
        }
      });

      res.status(200).json(filteredStudents);
    } catch (error) {
      res.status(500).json({ success: false, error: "Something went wrong!" });
    }
  }
);
