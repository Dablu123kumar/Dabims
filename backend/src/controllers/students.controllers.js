import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
import studentSubjectMarksModel from "../models/subject/student.subject.marks.models.js";
import StudentComissionModel from "../models/student-comission/student.comission.models.js";
import DayBookDataModel from "../models/day-book/DayBookData.models.js";
import { userModel } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/createToken.js";
import AlertStudentPendingFeesModel from "../models/alert-student_fees/alertStudentFees.models.js";
import sendRemainderFeesStudent, {
  sendEmail,
} from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import moment from "moment";
import ShowStudentDashboardModel from "../models/student-issues/showstudentdashboard.models.js";
import CompanyModels from "../models/company/company.models.js";
import mongoose from "mongoose";

const __dirname = path.resolve();

export const updateStudentAsDropOutController = asyncHandler(
  async (req, res, next) => {
    try {
      const dropOutStudent = await admissionFormModel.updateOne(
        { _id: req.params.id },
        { $set: { dropOutStudent: req.body.isDropOutStudent } },
        { new: true }
      );

      // now add the drop student expire installment time also
      //console.log(dropOutStudent.no_of_installments);
      const studentMonthlyCollectionExpireData =
        await PaymentInstallmentTimeExpireModel.updateMany(
          {
            studentInfo: req.params.id,
            installment_number: dropOutStudent.no_of_installments,
          },
          {
            $set: {
              dropOutStudent: req.body.isDropOutStudent,
            },
          }
        );

      res
        .status(200)
        .json({ success: true, message: "drop out student successfully!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getAllStudentsController = asyncHandler(async (req, res, next) => {
  try {
    const users = await admissionFormModel
      .find({})
      .populate(["courseName"])
      .sort({ name: "asc" });

    // console.log(users);

    for (const student of users) {
      let existedStudent = await userModel.findOne({ email: student.email });

      if (!existedStudent) {
        let hashPassword = await bcryptjs.hash(
          student.mobile_number,
          await bcryptjs.genSalt(10)
        );

        // console.log(student);

        existedStudent = new userModel({
          studentId: student?._id,
          fName: student?.name,
          lName: student?.name,
          email: student?.email,
          password: hashPassword,
          phone: student?.mobile_number,
          role: "Student",
        });

        let token = generateToken(res, student?._id);
        existedStudent.api_token = token;

        await existedStudent.save();
      }
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const updateStudentController = asyncHandler(async (req, res, next) => {
  try {
    const expirePaymentInstallments =
      await PaymentInstallmentTimeExpireModel.find({
        studentInfo: req.params?.id,
      }).sort({ createdAt: -1 });
    const student = await admissionFormModel.findOne({ _id: req.params?.id });
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found!" });
      return; // Added return to exit the function if student is not found
    }

    //console.log(student);
    // ✅ Store previous data
    const previousCourse = student.select_course;
    const previousCourseName = student.courseName;

    // delete all installments of the payment expiration
    // await PaymentInstallmentTimeExpireModel.deleteMany({
    //   studentInfo: req.params?.id,
    // });
    expirePaymentInstallments.forEach(async (studentInstallment) => {
      if (studentInstallment) {
        await studentInstallment.deleteOne();
      }
    });

    // console.log(student);

    //console.log("update student", req.body);

    const file = req?.file?.filename;
    const {
      rollNumber,
      name,
      father_name,
      mobile_number,
      installment_duration,
      phone_number,
      present_address,
      //permanent_address,
      date_of_birth,
      city,
      email,
      student_status,
      education_qualification,
      //professional_qualification,
      select_course,
      // document_attached,
      // select_software,
      // name_of_person_for_commision,
      // commision_paid,
      // commision_date,
      // commision_voucher_number,
      course_fees,
      discount,
      netCourseFees,
      remainingCourseFees,
      down_payment,
      date_of_joining,
      no_of_installments,
      message,
    } = req.body;
    //console.log("req body ", req.body);
    let userFullName = req?.user
      ? `${req?.user?.fName} ${req?.user?.lName}`
      : "Admin";
    // Use || for conditional updates
    student.companyName = req.body.companyName || student.companyName;
    student.rollNumber = rollNumber || student.rollNumber;
    student.father_name = father_name || student.father_name;
    student.name = name || student.name;
    student.installment_duration =
      installment_duration || student.installment_duration;
    student.courseName = req.body.courseName[1] || student.courseName;
    student.mobile_number = mobile_number || student.mobile_number;
    student.phone_number = phone_number || student.phone_number;
    student.present_address = present_address || student.present_address;
    //student.permanent_address = permanent_address || student.permanent_address;
    student.date_of_birth = date_of_birth || student.date_of_birth;
    student.city = city || student.city;
    student.email = email || student.email;
    // student.student_status = student_status || student.student_status;
    student.education_qualification =
      education_qualification || student.education_qualification;
    // student.professional_qualification =
    //   professional_qualification || student.professional_qualification;
    student.select_course = select_course || student.select_course;
    // student.document_attached = document_attached || student.document_attached;
    // student.select_software = select_software || student.select_software;
    // student.name_of_person_for_commision =
    //   name_of_person_for_commision || student.name_of_person_for_commision;
    // student.commision_paid = commision_paid || student.commision_paid;
    // student.commision_date = commision_date || student.commision_date;
    // student.commision_voucher_number =
    //   commision_voucher_number || student.commision_voucher_number;
    student.course_fees = course_fees || student.course_fees;
    student.discount = discount || student.discount;
    // if (req.body.remainingCourseFees === undefined) {
    //   student.netCourseFees = netCourseFees || student.netCourseFees;
    // }
    student.netCourseFees = netCourseFees || student.netCourseFees;
    student.remainingCourseFees = student.netCourseFees - student.totalPaid;
    // student.remainingCourseFees =
    //   remainingCourseFees || student.remainingCourseFees;
    student.down_payment = down_payment || student.down_payment;
    student.date_of_joining = date_of_joining || student.date_of_joining;
    student.no_of_installments =
      no_of_installments || student.no_of_installments;
    student.courseduration = req.body.courseduration || student?.courseduration;
    student.message = message || student.message;
    student.updatedBy = userFullName;

    if (file) {
      let imagePath = student.image;
      if (imagePath) {
        imagePath = path.join(__dirname + `/images/${imagePath}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.log("File does not exist:", imagePath);
        }
      }
      student.image = file;
    } else {
      student.image = student.image;
    }

    let updatedStudent = await student.save();
    await updatedStudent.populate('companyName')
  
    

    
    
    // // send email
    // try {
    //   const updatedCourse = updatedStudent.select_course;

    //   // ✅ Only send email if course actually changed
    //   if (previousCourse !== updatedCourse) {
    //     const recipients = [];

    //     // Student email
    //     if (updatedStudent.email) {
    //       recipients.push(updatedStudent.email);
    //     }

    //     // Company email (if exists)
    //     // if (updatedStudent?.companyName?.email) {
    //     //   recipients.push(updatedStudent.companyName.email);
    //     // }

    //     if (recipients.length > 0) {
    //       await sendEmail(
    //         recipients,
    //         "Student Course Change Notification",
    //         updatedStudent.message, // plain text
    //         `
    //       <p>Hello,</p>

    //       <p>The course of the following student has been <b>changed</b>:</p>

    //       <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
    //         <tr>
    //           <td><b>Student Name</b></td>
    //           <td>${updatedStudent.name}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Roll Number</b></td>
    //           <td>${updatedStudent.rollNumber}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Previous Course</b></td>
    //           <td>${previousCourse}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Updated Course</b></td>
    //           <td>${updatedCourse}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Net Fees</b></td>
    //           <td>₹${updatedStudent.netCourseFees}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Remaining Fees</b></td>
    //           <td>₹${updatedStudent.remainingCourseFees}</td>
    //         </tr>
    //       </table>

    //       <br/>
    //       <p><b>Message:</b></p>
    //       <p>${updatedStudent.message}</p>

    //       <br/>
    //       <p>
    //         Updated By: <b>${userFullName}</b><br/>
    //         Updated At: ${new Date().toLocaleString()}
    //       </p>

    //       <p>
    //         Regards,<br/>
    //         ${updatedStudent.companyName?.companyName}
    //       </p>
    //     `,
    //         req,
    //         userFullName || "Admin"
    //       );
    //     }
    //   }
    // } catch (error) {
    //   console.error("Course change email error:", error.message);
    // }

    if (updatedStudent.no_of_installments_expireTimeandAmount) {
      const newPaymentInstallmentOfStudent =
        new PaymentInstallmentTimeExpireModel({
          studentInfo: updatedStudent?._id,
          companyName: updatedStudent?.companyName,
          courseName: updatedStudent?.courseName,
          expiration_date:
            updatedStudent?.no_of_installments_expireTimeandAmount,
          installment_number: updatedStudent?.no_of_installments,
          installment_amount:
            updatedStudent["remainingCourseFees"] !== undefined
              ? updatedStudent?.remainingCourseFees /
                updatedStudent?.no_of_installments
              : updatedStudent?.netCourseFees /
                updatedStudent?.no_of_installments,
          dropOutStudent: updatedStudent?.dropOutStudent,
        });
      await newPaymentInstallmentOfStudent.save();
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteStudentController = asyncHandler(async (req, res, next) => {
  try {
    // Find the student
    const student = await admissionFormModel.findById(req.params.id);
    // console.log("delete single student from controller ", student);
    const studentIssueDashboard = await ShowStudentDashboardModel.findOne({
      studentId: req.params.id,
    });

    //console.log("student issue on dashboard ", studentIssueDashboard);

    // Handle case where student is not found
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    // delete the student issue from dashboard
    if (studentIssueDashboard) {
      await studentIssueDashboard.deleteOne();
    }
    // image path

    let imagePath = student.image;
    if (imagePath) {
      imagePath = path.join(__dirname + `/images/${imagePath}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.log("File does not exist:", imagePath);
      }
    }

    // Find associated course fees records
    const studentCourseFeesRecord = await CourseFeesModel.find({
      studentInfo: req.params.id,
    });

    const installMentFees = await PaymentInstallmentTimeExpireModel.find({
      studentInfo: req.params.id,
    });

    // console.log(installMentFees);

    installMentFees?.map(async (installMentFee) => {
      if (installMentFee) {
        await installMentFee?.deleteOne();
      }
    });

    studentCourseFeesRecord?.map(async (studentFeeRecord) => {
      if (studentFeeRecord) {
        await studentFeeRecord?.deleteOne();
      }
    });
    // Delete the student

    // delete Student Marks Subjects
    const studentMarksSubjects = await studentSubjectMarksModel.find({
      studentInfo: req.params.id,
    });

    // console.log(
    //   "Student Marks data from student delete ",
    //   studentMarksSubjects
    // );
    studentMarksSubjects?.map(async (studentMarksSubject) => {
      if (studentMarksSubject) {
        await studentMarksSubject?.deleteOne();
      }
    });

    await student.deleteOne();

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully!" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getSingleStudentDetailsController = asyncHandler(
  async (req, res, next) => {
    try {
      //console.log(req.params.id)
      // Check if the parameter is a valid ObjectId
      const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

      let student;
      if (isObjectId) {
        // If it's a valid ObjectId, search by _id
        student = await admissionFormModel
          .findById(req.params.id)
          .populate("courseName");
      } else {
        // If it's not a valid ObjectId, search by email
        student = await admissionFormModel
          .findOne({ email: req.params.id })
          .populate("courseName");
      }

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export const getAllStudentsMonthlyCollectionFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const student = await admissionFormModel
        .find({})
        .sort({ createdAt: -1 })
        .populate("courseName");
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getStudentsAccordingToCompanyController = asyncHandler(
  async (req, res, next) => {
    const { companyId } = req.params;
    try {
      const students = await admissionFormModel.find({});
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getStudentsAccordingToCourseController = asyncHandler(
  async (req, res) => {
    const { companyId, courseId } = req.params;

    if (!companyId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "companyId and courseId are required",
      });
    }
    const students = await admissionFormModel
      .find({
        companyName: companyId,
        courseName: courseId,
      })
      .populate("courseName")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: students,
    });
  }
);

export const addStudentComissionController = asyncHandler(
  async (req, res, next) => {
    const {
      studentName,
      commissionPersonName,
      voucherNumber,
      commissionPaid,
      commissionRemaining,
      commissionAmount,
      dayBookAccountId,
      commissionDate,
      commissionNaretion,
      companyId,
    } = req.body;

    //console.log(req.body);

    try {
      switch (true) {
        case !studentName:
          return res
            .status(400)
            .json({ success: false, message: "Student name is required!" });
        case !commissionPersonName:
          return res.status(400).json({
            success: false,
            message: "Commission person name is required!",
          });
        case !commissionAmount:
          return res.status(400).json({
            success: false,
            message: "Commission amount is required!",
          });
        // case !commissionRemaining:
        //   return res.status(400).json({
        //     success: false,
        //     message: "Commission remaining is required!",
        //   });
        case !commissionPaid:
          return res.status(400).json({
            success: false,
            message: "Commission paid is required!",
          });
        case !commissionDate:
          return res
            .status(400)
            .json({ success: false, message: "Commission date is required!" });
        case !commissionNaretion:
          return res.status(400).json({
            success: false,
            message: "Commission Naretion is required!",
          });
      }
      // console.log(req.body);
      // console.log(dayBookAccountId);
      const commissionStudent = new StudentComissionModel({
        ...req.body,
      });

      const existingDataModel = await DayBookDataModel.find({ companyId });

      const totalBalanceOfDayBookData = existingDataModel.reduce((acc, cur) => {
        if (cur.credit) {
          acc += cur?.credit + cur?.studentLateFees;
        } else {
          acc -= cur.debit;
        }
        return acc;
      }, 0);
      // console.log(
      //   "day book data model",
      //   totalBalanceOfDayBookData,
      //   Number(commissionAmount),
      //   Number(totalBalanceOfDayBookData) > Number(commissionAmount)
      // );

      if (totalBalanceOfDayBookData > Number(commissionAmount) === false) {
        return res.status(401).json({
          error:
            `Your day Book is Balance ${totalBalanceOfDayBookData} is less than your commission amount ` +
            commissionAmount,
        });
      }

      const newDayBookData = new DayBookDataModel({
        rollNo: studentName.split("-")[1],
        StudentName: studentName.split("-")[0],
        commissionPersonName,
        dayBookAccountId,
        dayBookDatadate: commissionDate,
        debit: +commissionPaid,
        companyId,
        naretion: commissionNaretion,
      });

      await newDayBookData.save();

      const savedCommissionStudent = await commissionStudent.save();
      res
        .status(200)
        .json({ message: "Student commission created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getStudentCommissionListsController = asyncHandler(
  async (req, res) => {
    try {
      console.log("data", req.query);
      const studentCommissionLists = await StudentComissionModel.find({
        studentName: req.query.studentName,
      });
      res.status(200).json(studentCommissionLists);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const createAlertStudentPendingFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const { Date, RemainderDateAndTime, Status, particulars } = req.body;
      if (!Date || !RemainderDateAndTime || !Status || !particulars) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required!" });
      }
      const alertStudentPendingFees = new AlertStudentPendingFeesModel(
        req.body
      );

      await alertStudentPendingFees.save();
      res.status(200).json({
        success: true,
        message: "Alert student pending fees created successfully!",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getAlertStudentPendingFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const getAlertStudentPendingFeesData =
        await AlertStudentPendingFeesModel.find({});
      res.status(200).json(getAlertStudentPendingFeesData);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
export const getAllStudentsAlertPendingFeesDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const getAlertStudentPendingFeesData =
        await AlertStudentPendingFeesModel.find({}).populate("studentId");

      let adminEmail = null;
      let superAdminEmail = null;

      // Fetch admin and super admin emails
      const adminUsers = await userModel.find({});
      adminUsers.forEach((user) => {
        if (user.role === "SuperAdmin") {
          superAdminEmail = user.email;
        }
      });

      const currentTime = moment();

      // Iterate through fetched data to check reminder dates
      for (const studentData of getAlertStudentPendingFeesData) {
        const { RemainderDateAndTime, isEmailSent } = studentData;

        // Check if RemainderDateAndTime is valid
        if (
          RemainderDateAndTime &&
          moment(RemainderDateAndTime).diff(moment(), "days") === 0 &&
          !isEmailSent
        ) {
          // console.log(
          //   `Reminder time for student ${studentData.studentId.name} is now.`
          // );

          const toEmails = `${req?.user?.email}, ${superAdminEmail}`;
          const sendedBy = `${req.user.fName} ${req.user.lName}`;
          try {
            // Send email
            await sendEmail(
              toEmails,
              `Reminder: Payment Due for Student`,
              "Alert Student Pending Fees",
              studentData?.particulars,
              req,
              sendedBy
            );
            studentData.isEmailSent = true;
            await studentData.save();
            // console.log(
            //   `Reminder email sent for student ${studentData.studentId.name}.`
            // );
          } catch (emailError) {
            console.error(
              `Error sending email for student ${studentData.studentId.name}:`,
              emailError
            );
          }
        }
      }

      res.status(200).json(getAlertStudentPendingFeesData);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const deleteAlertStudentPendingFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const deleteAlertStudentPendingFeesData =
        await AlertStudentPendingFeesModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Alert student pending fees deleted successfully!",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const updateAlertStudentPendingFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const updateAlertStudentPendingFeesData =
        await AlertStudentPendingFeesModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
      res.status(200).json({
        success: true,
        message: "Alert student pending fees updated successfully!",
        updatedData: updateAlertStudentPendingFeesData,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const updateStudentRenewCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const studentRenewCourseFees = await admissionFormModel.findById(
        req.params.id
      );

      const currentStudentCompany = await CompanyModels.findById(
        studentRenewCourseFees.companyName
      );

      const [prefix, number] = currentStudentCompany.reciptNumber.split("-");
      const increasedReciptNumber = `${prefix}-${parseInt(number, 10) + 1}`;
      // console.log("increased recipt number", increasedReciptNumber);

      // const studentCompanyName = await
      if (studentRenewCourseFees.remainingCourseFees === 0) {
        studentRenewCourseFees.netCourseFees =
          Number(studentRenewCourseFees.netCourseFees) +
          Number(req.body.extraFees);
        studentRenewCourseFees.no_of_installments = req.body.noOfInstallments;
        studentRenewCourseFees.courseDuration = req.body.duration;
        studentRenewCourseFees.remainingCourseFees = Number(req.body.extraFees);
        currentStudentCompany.reciptNumber = increasedReciptNumber;

        await studentRenewCourseFees.save();
        await currentStudentCompany.save();
      } else {
        return res.status(404).json({
          success: false,
          message: "Student has Course Fees to Pay, you can't renew it now",
        });
      }

      res.status(200).json({
        success: true,
        message: "student course renewed successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Something went wrong" });
    }
  }
);
