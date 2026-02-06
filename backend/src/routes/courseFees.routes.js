import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCourseFeesController,
  getAllCourseFeesController,
  getSingleStudentCourseFeesController,
  updateSingleStudentCourseFeesController,
  deleteSingleStudentCourseFeesController,
  getCourseFeesByStudentIdController,
  //getAllStudentCourseFeesNextInstallmentController,
  getCollectionFeesAccordingToCompanyIdController,
  createEaseBuzzCourseFeesController,
  getNotPaidStudentsController
} from "../controllers/courseFees.controllers.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { BACKEND_URL, FRONTEND_URL } from "../config/config.js";
import moment from "moment";
import CompanyModels from "../models/company/company.models.js";
import DayBookDataModel from "../models/day-book/DayBookData.models.js";
import StudentGST_GuggestionModel from "../models/email-remainder/Student.GST.Suggestion.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
const router = Router();

router.post("/", requireSignIn, createCourseFeesController);
router.post("/get-not-paid-students", requireSignIn, getNotPaidStudentsController);

router.post(
  "/online-payment",
  requireSignIn,
  createEaseBuzzCourseFeesController
);

router.post("/payment/success", async (req, res) => {
  try {
    const {
      firstname,
      amount,
      status,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      udf6,
      udf7,
      addedon,
      email,
      phone,
    } = req.body;

    const params = new URLSearchParams(udf2);
    const { courseName, lateFees } = Object.fromEntries(params);

    // Check if the payment status is "success"
    if (status !== "success") {
      console.error("Payment status is not success:", status);
      return res.status(400).json({ message: "Payment status is not success" });
    }

    // Fetch student details
    const student = await admissionFormModel
      .findOne({ email })
      .populate(["courseName", "companyName"]);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Save the payment details
    let reciptNumber;
    const currentCompany = await CompanyModels.findById(
      student.companyName._id
    );
    if (student.companyName.reciptNumber) {
      reciptNumber = student.companyName.reciptNumber;
    }

    const alreadyExistsReciptNumberInCourseFees = await CourseFeesModel.findOne(
      { reciptNumber }
    );
    if (alreadyExistsReciptNumberInCourseFees) {
      currentCompany.reciptNumber = `${reciptNumber?.split("-")[0]}-${
        Number(reciptNumber?.split("-")[1]) + 1
      }`;
      await currentCompany.save();
      reciptNumber = currentCompany.reciptNumber;
    }

    const newDayBookData = new DayBookDataModel({
      udf3: student._id,
      rollNo: student.rollNumber,
      StudentName: student.name,
      studentLateFees: +lateFees,
      companyId: student?.companyName?._id,
      dayBookDatadate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
      reciptNumber,
      credit: +Number(amount) - Number(lateFees),
      narration: "Paid By Easebuzz",
      addedBy: firstname,
    });
    await newDayBookData.save();

    const studentGSTStatus = await StudentGST_GuggestionModel.find();
    let gstAmount =
      student.companyName.isGstBased === "Yes"
        ? (Number(amount) / (studentGSTStatus[0]?.gst_percentage + 100)) * 100
        : Number(amount);
    let cutGSTAmount = Number(amount) - gstAmount;

    if (Number(udf3) === 0 && student.installmentPaymentSkipMonth === 0) {
      student.remainingCourseFees = 0;
      student.no_of_installments_expireTimeandAmount = null;

      const newCourseFees = new CourseFeesModel({
        netCourseFees: udf6,
        amountPaid: Number(amount) - Number(lateFees),
        remainingFees: udf3,
        narration: "Paid By Easebuzz",
        paymentOption: udf7,
        studentInfo: udf1,
        lateFees: lateFees,
        no_of_installments_amount: udf5,
        no_of_installments: udf4,
        courseName: courseName,
        amountDate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
        reciptNumber,
        companyName: student.companyName._id,
        addedBy: firstname,
        gst_percentage: studentGSTStatus[0]?.gst_percentage,
      });
      const savedCourseFees = await newCourseFees.save();

      student.down_payment = Number(amount);
      student.remainingCourseFees = Number(udf3);
      student.totalPaid += Number(amount) - Number(lateFees);
      student.no_of_installments = 0;
      await student.save();

      const queryParam = new URLSearchParams({
        status: "Approved",
        recipt: savedCourseFees?._id,
        student: student?._id,
        companyId: student?.companyName?._id,
      }).toString();

      return res.redirect(`${BACKEND_URL}/payment/success?${queryParam}`);
    }

    const newCourseFees = new CourseFeesModel({
      netCourseFees: udf6,
      amountPaid: Number(amount) - Number(lateFees),
      remainingFees: udf3,
      narration: "Paid By Easebuzz",
      paymentOption: udf7,
      studentInfo: udf1,
      lateFees: lateFees,
      no_of_installments_amount: udf5,
      no_of_installments: udf4,
      courseName: courseName,
      amountDate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
      reciptNumber,
      companyName: student.companyName._id,
      addedBy: firstname,
      gst_percentage: studentGSTStatus[0]?.gst_percentage,
    });

    let reciptNumberString = Number(reciptNumber?.split("-")[1]) + 1;
    const savedCourseFees = await newCourseFees.save();
    currentCompany.reciptNumber = `${
      reciptNumber?.split("-")[0]
    }-${reciptNumberString}`;
    await currentCompany.save();

    student.down_payment = Number(amount);
    student.remainingCourseFees = udf3;
    student.totalPaid += Number(amount) - Number(lateFees);
    student.no_of_installments -= 1;

    let expirationDate = moment(addedon).toDate();
    const nextInstallment = Number(udf4) - 1;
    const installmentAmount = Math.floor(Number(udf3) / nextInstallment);

    const lastPaymentInstallmentExpirationTime =
      await PaymentInstallmentTimeExpireModel.findOne({ udf3 }).sort({
        createdAt: -1,
      });
    if (lastPaymentInstallmentExpirationTime) {
      if (
        Number(lastPaymentInstallmentExpirationTime.installment_number) ===
        Number(udf4)
      ) {
        await lastPaymentInstallmentExpirationTime.deleteOne();
      }
    }

    const currentInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      udf3,
      companyName: student.companyName._id,
      courseName: student?.courseName?._id,
      expiration_date: expirationDate,
      installment_number: udf4,
      installment_amount: Number(amount) - Number(lateFees),
    });
    expirationDate = moment(addedon).add(1, "months");

    const nextInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      udf3,
      companyName: student.companyName._id,
      courseName: student?.courseName?._id,
      expiration_date: expirationDate.toDate(),
      installment_number: nextInstallment,
      installment_amount: installmentAmount,
    });

    await currentInstallmentExpiration.save();
    await nextInstallmentExpiration.save();

    student.no_of_installments_expireTimeandAmount = expirationDate.toDate();
    student.no_of_installments_amount = installmentAmount;
    await student.save();

    // console.log(data);
    // const data = await CourseFeesModel.findOne({ studentInfo: student?._id });

    const queryParams = new URLSearchParams({
      status: "Approved",
      recipt: savedCourseFees?._id,
      student: student?._id,
      companyId: student?.companyName?._id,
    }).toString();

    // res.redirect(`${BACKEND_URL}/payment/success`);

    return res.redirect(`${BACKEND_URL}/payment/success?${queryParams}`);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      message: "Payment processing failed",
      error: error.message || "Unknown Error",
    });
  }
});

// Failure URL
router.post("/payment/failure", async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch student details
    const student = await admissionFormModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the failure
    // console.error("⚠️ Route:", student);
    const queryParams = new URLSearchParams({
      status: "Failed",
      student: student?._id,
    });

    // Redirect URL and failure message
    res.redirect(`${BACKEND_URL}/payment/failure?${queryParams}`);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      message: "Payment processing failed",
      error: error.message || "Unknown Error",
    });
  }
});

router.get(
  "/paymentInstallmentFees/:companyId",
  requireSignIn,
  getCollectionFeesAccordingToCompanyIdController
);

router
  .route("/allCourseFess")
  .get(requireSignIn, isAdmin, getAllCourseFeesController);

router
  .route("/:id")
  .get(requireSignIn, getSingleStudentCourseFeesController)
  .put(requireSignIn, isAdmin, updateSingleStudentCourseFeesController)
  .delete(requireSignIn, isAdmin, deleteSingleStudentCourseFeesController);

router.get(
  "/studentFees/:studentId",
  requireSignIn,
  getCourseFeesByStudentIdController
);

export default router;
