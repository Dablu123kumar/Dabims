import mongoose, { get, now } from "mongoose";
import crypto from "crypto";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import {
	BACKEND_URL,
	EASEBUZZ_ENV,
	EASEBUZZ_KEY,
	EASEBUZZ_SALT,
	FRONTEND_URL,
	USER_EMAIL,
} from "../config/config.js";
import axios from "axios";
import { mailTransporter } from "../utils/mail_helpers.js";
import { MailHTML } from "../../helpers/mail/index.js";
import CourseModel from "../models/course/courses.models.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";
import CompanyModels from "../models/company/company.models.js";
import EmailSuggestionModel from "../models/email-remainder/EmailSuggestions.models.js";
import EmailRemainderModel from "../models/email-remainder/email.remainder.models.js";
import { userModel } from "../models/user.models.js";
import DayBookDataModel from "../models/day-book/DayBookData.models.js";
import moment from "moment";
import SubjectModel from "../models/subject/subject.models.js";
import StudentGST_GuggestionModel from "../models/email-remainder/Student.GST.Suggestion.js";
import EmailLogModel from "../models/mail.models.js";
import qs from "qs";
import approvalModel from "../models/approval/approval.models.js";

export const getNotPaidStudentsController = asyncHandler(
	async (req, res, next) => {
		const { toDate, fromDate, companyId } = req.body;

		if (!toDate || !fromDate) {
			return res.status(400).json({ message: "Required fields are missing" });
		}

		try {
			// Step 1: Filter students who are still enrolled, have fees, and belong to the company
			const students = await admissionFormModel
				.find({
					remainingCourseFees: { $gt: 0 },
					dropOutStudent: { $ne: true },
					companyName: companyId,
				})
				.lean();

			const studentIds = students.map((s) => s._id);

			// Step 2: Get latest payment date using createdAt
			const latestFees = await CourseFeesModel.aggregate([
				{ $match: { studentInfo: { $in: studentIds } } },
				{ $sort: { createdAt: -1 } }, // use createdAt instead of amountDate
				{
					$group: {
						_id: "$studentInfo",
						latestCreatedAt: { $first: "$createdAt" }, // changed field
					},
				},
			]);

			const latestFeeMap = new Map(
				latestFees.map((fee) => [
					String(fee._id),
					new Date(fee.latestCreatedAt),
				])
			);

			const currentDate = new Date();
			const notPaidStudents = [];

			// Step 3: Check how many months have passed since last payment
			for (const student of students) {
				const latestDate = latestFeeMap.get(String(student._id));
				if (!latestDate) continue;

				const unpaidMonthsBeforeCurrentMonth =
					(currentDate.getFullYear() - latestDate.getFullYear()) * 12 +
					(currentDate.getMonth() - latestDate.getMonth());

				if (unpaidMonthsBeforeCurrentMonth > 0) {
					notPaidStudents.push({
						...student,
						missingMonths: unpaidMonthsBeforeCurrentMonth,
					});
				}
			}

			return res.status(200).json({ notPaidStudents });
		} catch (error) {
			console.error("Error fetching unpaid students:", error);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
);

export const createCourseFeesController = asyncHandler(
	async (req, res, next) => {
		try {
			const {
				studentInfo,
				remainingFees,
				amountPaid,
				narration,
				amountDate,
				lateFees,
				paymentOption,
			} = req.body;
			// console.log(req.body);

			// Validate required fields
			if (!amountPaid || !amountDate || !studentInfo) {
				return res.status(400).json({ message: "Required fields are missing" });
			}

			const emailSuggestionsStatus = await EmailSuggestionModel.find({});
			// console.log(
			//   "email suggestions status ->>>>>>>>>",
			//   emailSuggestionsStatus
			// );
			// get the status of student GST

			//console.log(studentGSTStatus[0].studentGST_Guggestion);
			// const gstAmount =
			//   student.student_status === "GST"
			//     ? (Number(amountPaid) *
			//         (studentGSTStatus[0].studentGST_Guggestion === true ? 18 : 0)) /
			//       100
			//     : 0;

			// Fetch student and validate remaining fees
			const student = await admissionFormModel
				.findById(studentInfo)
				.populate(["courseName", "companyName"]);
			if (!student) {
				return res.status(404).json({ message: "Student not found" });
			}
			//console.log("day book data model", existingDataModel);

			//console.log(BACKEND_URL + "/api/images/" + student.companyName.logo);

			// get the admin email and super admin email addresses
			let adminEmail, superAdminEmail;
			const adminUser = await userModel.find({});
			adminUser.forEach((user) => {
				//sconsole.log(user);
				// if (user.role === "Admin") {
				//   adminEmail = user.email;
				// }
				if (user.role === "SuperAdmin") {
					superAdminEmail = user.email;
				}
			});

			// generate the recipt number from
			let reciptNumber;
			const currentCompany = await CompanyModels.findById(
				student.companyName._id
			);
			if (student.companyName.reciptNumber) {
				reciptNumber = student.companyName.reciptNumber;
			}

			const alreadyExistsReciptNumberInCourseFees =
				await CourseFeesModel.findOne({ reciptNumber: reciptNumber });
			if (alreadyExistsReciptNumberInCourseFees) {
				// return res.status(404).json({
				//   success: false,
				//   error: `Already Exists this recipt number ${reciptNumber}.to solve this problem you have to increase the recipt number by 1 from manage company`,
				// });
				currentCompany.reciptNumber = `${reciptNumber.split("-")[0]}-${
					Number(reciptNumber.split("-")[1]) + 1
				}`;
				await currentCompany.save();
				reciptNumber = currentCompany.reciptNumber;
				// console.log(
				//   "current company recipt number ",
				//   currentCompany.reciptNumber
				// );
			}

			const userName =
				req.user.fName === req.user.lName
					? req.user.fName
					: `${req.user.fName} ${req.user.lName}`;

			// console.log(userName);

			const newDayBookData = new DayBookDataModel({
				studentInfo: student._id,
				rollNo: student.rollNumber,
				StudentName: student.name,
				studentLateFees: +lateFees,
				companyId: student?.companyName?._id,
				dayBookDatadate: amountDate,
				reciptNumber,
				credit: +amountPaid,
				narration,
				addedBy: userName,
			});

			await newDayBookData.save();

			const studentGSTStatus = await StudentGST_GuggestionModel.find();
			//console.log(studentGSTStatus[0].studentGST_Guggestion);
			let gstAmount =
				student.companyName.isGstBased === "Yes"
					? (Number(amountPaid) / (studentGSTStatus[0]?.gst_percentage + 100)) *
					  100
					: Number(amountPaid);
			let cutGSTAmount = amountPaid - gstAmount;
			//console.log("gst amount: " + gstAmount);

			if (
				Number(req.body.remainingFees) === 0 &&
				student.installmentPaymentSkipMonth === 0
			) {
				student.remainingCourseFees = 0;
				student.no_of_installments_expireTimeandAmount = null;
				// Save course fees
				// console.log(req.user);
				const newCourseFees = new CourseFeesModel({
					...req.body,
					reciptNumber,
					companyName: student.companyName._id,
					addedBy: userName,
					gst_percentage: studentGSTStatus[0]?.gst_percentage,
				});

				const savedCourseFees = await newCourseFees.save();
				// const currentCompany = await CompanyModels.findById(
				//   student.companyName._id
				// );

				student.down_payment = amountPaid;
				student.remainingCourseFees = remainingFees;
				student.totalPaid += amountPaid;
				student.no_of_installments = 0;
				// const findPaymentOptionName = await PaymentOptionsModel.findById(
				//   paymentOption
				// );
				// // console.log(findPaymentOptionName);
				// // Send email asynchronously

				// let companyLogoURL =
				//   BACKEND_URL + "/api/images/" + student.companyName.logo;
				// // Send email asynchronously

				// let recieptId = await CourseFeesModel.findById(studentInfo);

				// let status = await approvalModel.findOne({ reciept: recieptId });

				// if (
				//   emailSuggestionsStatus[0].emailSuggestionStatus &&
				//   status.status === "Approved"
				// ) {
				//   sendEmail(
				//     `${student.email}, ${student.companyName.email},${superAdminEmail}`,
				//     ` Your Fees Submitted Successfully - ${student.companyName.companyName}`,
				//     `Hello ${student.name} you have submitted fees `,
				//     `<!DOCTYPE html>
				//       <html>

				//       <head>
				//         <meta charset="utf-8" />
				//         <meta http-equiv="x-ua-compatible" content="ie=edge" />
				//         <title>Email Receipt</title>
				//         <meta name="viewport" content="width=device-width, initial-scale=1" />
				//         <style type="text/css">
				//           /**
				//                  * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
				//                  */
				//           @media screen {
				//             @font-face {
				//               font-family: "Source Sans Pro";
				//               font-style: normal;
				//               font-weight: 400;
				//               src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
				//                 url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
				//             }

				//             @font-face {
				//               font-family: "Source Sans Pro";
				//               font-style: normal;
				//               font-weight: 700;
				//               src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
				//                 url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
				//             }
				//           }

				//           /**
				//                  * Avoid browser level font resizing.
				//                  * 1. Windows Mobile
				//                  * 2. iOS / OSX
				//                  */
				//           body,
				//           table,
				//           td,
				//           a {
				//             -ms-text-size-adjust: 100%;
				//             /* 1 */
				//             -webkit-text-size-adjust: 100%;
				//             /* 2 */
				//           }

				//           /**
				//                  * Remove extra space added to tables and cells in Outlook.
				//                  */
				//           table,
				//           td {
				//             mso-table-rspace: 0pt;
				//             mso-table-lspace: 0pt;
				//           }

				//           /**
				//                  * Better fluid images in Internet Explorer.
				//                  */
				//           img {
				//             -ms-interpolation-mode: bicubic;
				//           }

				//           /**
				//                  * Remove blue links for iOS devices.
				//                  */
				//           a[x-apple-data-detectors] {
				//             font-family: inherit !important;
				//             font-size: inherit !important;
				//             font-weight: inherit !important;
				//             line-height: inherit !important;
				//             color: inherit !important;
				//             text-decoration: none !important;
				//           }

				//           /**
				//                  * Fix centering issues in Android 4.4.
				//                  */
				//           div[style*="margin: 16px 0;"] {
				//             margin: 0 !important;
				//           }

				//           body {
				//             width: 100% !important;
				//             height: 100% !important;
				//             padding: 0 !important;
				//             margin: 0 !important;
				//           }

				//           /**
				//                  * Collapse table borders to avoid space between cells.
				//                  */
				//           table {
				//             border-collapse: collapse !important;
				//           }

				//           a {
				//             color: #1a82e2;
				//           }

				//           img {
				//             height: auto;
				//             line-height: 100%;
				//             text-decoration: none;
				//             border: 0;
				//             outline: none;
				//           }
				//         </style>
				//       </head>

				//       <body style="background-color: #d2c7ba">
				//         <!-- start preheader -->
				//         <div class="preheader" style="
				//                       display: none;
				//                       max-width: 0;
				//                       max-height: 0;
				//                       overflow: hidden;
				//                       font-size: 1px;
				//                       line-height: 1px;
				//                       color: #fff;
				//                       opacity: 0;
				//                     ">
				//           A preheader is the short summary text that follows the subject line when
				//           an email is viewed in the inbox.
				//         </div>
				//         <!-- end preheader -->

				//         <!-- start body -->
				//         <table border="0" cellpadding="0" cellspacing="0" width="100%">
				//           <!-- start logo -->
				//           <tr>
				//             <td align="center" bgcolor="#D2C7BA">
				//               <!--[if (gte mso 9)|(IE)]>
				//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                       <tr>
				//                       <td align="center" valign="top" width="600">
				//                       <![endif]-->
				//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
				//                 <tr>
				//                   <td align="center" valign="top" style="padding: 36px 24px">
				//                     <a href="http://www.visualmedia.co.in/" target="_blank" style="display: inline-block">
				//                       <img src=${companyLogoURL} alt="Logo" border="0" width="200px" style="
				//                                     display: block;
				//                                     width: 350px;
				//                                     max-width: 350px;
				//                                     min-width: 300px;
				//                                   " />
				//                     </a>
				//                   </td>
				//                 </tr>
				//               </table>
				//               <!--[if (gte mso 9)|(IE)]>
				//                       </td>
				//                       </tr>
				//                       </table>
				//                       <![endif]-->
				//             </td>
				//           </tr>
				//           <!-- end logo -->

				//           <!-- start hero -->
				//           <tr>
				//             <td align="center" bgcolor="#D2C7BA">
				//               <!--[if (gte mso 9)|(IE)]>
				//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                       <tr>
				//                       <td align="center" valign="top" width="600">
				//                       <![endif]-->
				//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
				//                 <tr>
				//                   <td align="left" bgcolor="#ffffff" style="
				//                                 padding: 36px 24px 0;
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//                                 border-top: 3px solid #d4dadf;
				//                               ">
				//                               <h6 style="
				//                               margin: 0;
				//                               font-size: 27px;
				//                               font-weight: 700;
				//                               letter-spacing: -1px;
				//                               line-height: 30px;
				//                               text-align: left;
				//                             ">
				//                             Thank You, Your Fees Submitted Successfully
				//                 </h6>
				//                   </td>
				//                 </tr>
				//               </table>
				//               <!--[if (gte mso 9)|(IE)]>
				//                       </td>
				//                       </tr>
				//                       </table>
				//                       <![endif]-->
				//             </td>
				//           </tr>
				//           <!-- end hero -->
				//           <!-- start student info block -->
				//       <tr>
				//       <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
				//       <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
				//         style="max-width: 600px">
				//         <tr>
				//           <td align="center" valign="top" style="font-size: 0;">

				//             <div style="display:inline-block;width:100%;max-width: 30%;vertical-align:top;margin-top: 10px;">
				//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
				//                 <tr>
				//                   <td valign="top" style="
				//                                     font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                       sans-serif;
				//                                     font-size: 12px;
				//                                   ">
				//                     <span style="display:block; width:max-content;"><strong>Student Name</strong></span>
				//                     <span style="display:block; width:max-content;"><strong>Father Name</strong></span>
				//                     <span style="display:block; width:max-content;"><strong>Roll Number</strong></span>
				//                     <span style="display:block; width:max-content;"><strong>Course Name</strong></span>
				//                     <span style="display:block; width:max-content;"><strong>Payment Method</strong></span>
				//                   </td>
				//                 </tr>
				//               </table>
				//             </div>
				//             <div style="display:inline-block;width:100%;max-width: 50%;vertical-align:top;margin-top: 10px;">
				//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
				//                 <tr>
				//                   <td valign="top" style="
				//                                     font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                       sans-serif;
				//                                     font-size: 12px;

				//                                   ">
				//                     <span style="display:block;width:max-content;">${
				//                       student.name
				//                     }</span>
				//                     <span style="display:block;width:max-content;">
				//                       ${student.father_name}
				//                     </span>

				//                       <span style="display:block;width:max-content;">
				//                       ${student.rollNumber}
				//                     </span>
				//                     <span style="display:block;width:max-content;">
				//                     ${student.courseName.courseName}
				//                     </span>
				//                     <span style="display:block;width:max-content;">
				//                     ${findPaymentOptionName.name}
				//                     </span>

				//                   </td>

				//                 </tr>
				//               </table>
				//             </div>
				//           </td>
				//         </tr>
				//       </table>
				//       </td>
				//       </tr>
				//       <!-- end student info block -->

				//           <!-- start copy block -->
				//           <tr>
				//             <td align="center" bgcolor="#D2C7BA">
				//               <!--[if (gte mso 9)|(IE)]>
				//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                       <tr>
				//                       <td align="center" valign="top" width="600">
				//                       <![endif]-->
				//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
				//                 <!-- start copy -->

				//                 <!-- end copy -->

				//                 <!-- start receipt table -->
				//                 <tr>
				//                   <td align="left" bgcolor="#ffffff" style="
				//                                 padding: 24px;
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//                                 font-size: 14px;
				//                                 line-height: 24px;
				//                               ">
				//                     <table border="0" cellpadding="0" cellspacing="0" width="100%">
				//                       <tr>
				//                         <td align="left" bgcolor="#D2C7BA" width="75%" style="
				//                                       padding: 12px;
				//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                         sans-serif;
				//                                       font-size: 16px;
				//                                       line-height: 24px;
				//                                     ">
				//                           <strong>Recipt No</strong>
				//                         </td>
				//                         <td align="left" bgcolor="#D2C7BA" width="25%" style="
				//                                       padding: 12px;
				//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                         sans-serif;
				//                                       font-size: 14px;
				//                                       line-height: 24px;
				//                                     ">
				//                           <strong>${
				//                             student.companyName.reciptNumber
				//                           }</strong>
				//                         </td>
				//                       </tr>
				//                       <tr>
				//                         <td align="left" width="75%" style="
				//                                       padding: 6px 12px;
				//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                         sans-serif;
				//                                       font-size: 12px;
				//                                       line-height: 24px;
				//                                     ">
				//                           Fees Paid
				//                         </td>

				//                         ${
				//                           student.companyName.isGstBased === "Yes"
				//                             ? ` <td
				//                               align="left"
				//                               width="25%"
				//                               style="
				//                           padding: 6px 12px;
				//                           font-family: 'Source Sans Pro', Helvetica, Arial,
				//                             sans-serif;
				//                           font-size: 12px;
				//                           line-height: 24px;
				//                         "
				//                             >
				//                               Rs ${Number(gstAmount.toFixed(2))}
				//                             </td>`
				//                             : ` <td
				//                               align="left"
				//                               width="25%"
				//                               style="
				//                                       padding: 6px 12px;
				//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                         sans-serif;
				//                                       font-size: 12px;
				//                                       line-height: 24px;
				//                                     "
				//                             >
				//                               Rs ${Number(amountPaid)}
				//                             </td>`
				//                         }

				//                       </tr>

				//                       <tr>
				//                         <td align="left" width="75%" style="
				//                                 padding: 6px 12px;
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                   sans-serif;
				//                                 font-size: 12px;
				//                                 line-height: 24px;
				//                               ">
				//                           Late Fees
				//                         </td>
				//                         <td align="left" width="25%" style="
				//                                 padding: 6px 12px;
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                   sans-serif;
				//                                 font-size: 12px;
				//                                 line-height: 24px;
				//                               ">
				//                          Rs ${lateFees}
				//                         </td>
				//                       </tr>
				//                       ${
				//                         student.companyName.isGstBased === "Yes"
				//                           ? `<tr>
				//                             <td
				//                               align="left"
				//                               width="75%"
				//                               style="
				//                       padding: 6px 12px;
				//                       font-family: 'Source Sans Pro', Helvetica, Arial,
				//                         sans-serif;
				//                       font-size: 12px;
				//                       line-height: 24px;
				//                     "
				//                             >
				//                               GST (${
				//                                 studentGSTStatus[0]?.gst_percentage
				//                               } %)
				//                             </td>

				//                             <td
				//                               align="left"
				//                               width="25%"
				//                               style="
				//                                 padding: 6px 12px;
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
				//                                   sans-serif;
				//                                 font-size: 12px;
				//                                 line-height: 24px;
				//                               "
				//                             >
				//                             Rs ${cutGSTAmount.toFixed(2)}

				//                             </td>
				//                           </tr>`
				//                           : ""
				//                       }

				//                       <tr style='border:2px dotted black;'>
				//   <td align="left" width="75%" style="
				//           padding: 6px 12px;
				//           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//           font-size: 12px;
				//           line-height: 24px;
				//       ">
				//       Total Amount
				//   </td>
				//   <td align="left" width="25%" style="
				//           padding: 6px 12px;
				//           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//           font-size: 12px;
				//           line-height: 24px;
				//       ">
				//       Rs ${
				//         student.companyName.isGstBased === "No"
				//           ? (Number(lateFees) + Number(amountPaid)).toFixed(2)
				//           : (
				//               Number(lateFees) + Number(gstAmount + cutGSTAmount)
				//             ).toFixed(2)
				//       }
				//   </td>
				// </tr>

				//                       <!-- end reeipt table -->
				//                     </table>
				//                     <!--[if (gte mso 9)|(IE)]>
				//                           </td>
				//                           </tr>

				//                       </table>
				//                       <![endif]-->
				//                   </td>
				//                 </tr>
				//                 <!-- end copy block -->

				//                 <!-- start 1 copy block -->
				//                 <!-- end copy block -->

				//                 <!-- start receipt address block -->
				//                 <tr>
				//                   <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
				//                     <!--[if (gte mso 9)|(IE)]>
				//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                       <tr>
				//                       <td align="center" valign="top" width="600">
				//                       <![endif]-->
				//                     <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
				//                       style="max-width: 600px">
				//                       <tr>
				//                         <td align="center" valign="top" style=" border-bottom: 3px solid #d4dadf">
				//                           <!--[if (gte mso 9)|(IE)]>
				//                             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                             <tr>
				//                             <td align="left" valign="top" width="300">
				//                             <![endif]-->

				//                           <!--[if (gte mso 9)|(IE)]>
				//                             </td>
				//                             <td align="center" valign="top" width="100%">
				//                             <![endif]-->
				//                           <div style="
				//                                   display: inline-block;
				//                                   width: 100%;

				//                                   vertical-align: top;
				//                                 ">
				//                                <p>
				//                                ${student.companyName.companyAddress}
				//                                </p>
				//                                <p>
				//                                Contact Us : ${
				//                                  student.companyName.companyPhone
				//                                }
				//                                </p>
				//                                <p>
				//                                website : ${
				//                                  student.companyName.companyWebsite
				//                                }
				//                                E-mail: ${student.companyName.email}
				//                            </p>

				//                           </div>
				//                           <!--[if (gte mso 9)|(IE)]>
				//                             </td>
				//                             </tr>
				//                             </table>
				//                             <![endif]-->
				//                         </td>
				//                       </tr>
				//                     </table>
				//                     <!--[if (gte mso 9)|(IE)]>
				//                       </td>
				//                       </tr>
				//                       </table>
				//                       <![endif]-->
				//                   </td>
				//                 </tr>
				//                 <!-- end receipt address block -->

				//                 <!-- start footer -->
				//                 <tr>
				//                   <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
				//                     <!--[if (gte mso 9)|(IE)]>
				//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
				//                       <tr>
				//                       <td align="center" valign="top" width="600">
				//                       <![endif]-->
				//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
				//                       <!-- start permission -->
				//                       <tr>
				//                         <td align="center" bgcolor="#D2C7BA" style="
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//                                 font-size: 14px;
				//                                 line-height: 20px;
				//                                 color: #666;
				//                               ">
				//                               <span style="display:block;">
				//                               CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
				//                               DEMANDED
				//                             </span>
				//                             <span style="display:block;">FEES ONCE PAID ARE NOT REFUNDABLE</span>
				//                         </td>
				//                       </tr>
				//                       <!-- end permission -->

				//                       <!-- start unsubscribe -->
				//                       <tr>
				//                         <td align="center" bgcolor="#D2C7BA" style="
				//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
				//                                 font-size: 14px;
				//                                 line-height: 20px;
				//                                 color: #666;
				//                               ">
				//                           <p style="margin: 0">
				//                             To stop receiving these emails, you can
				//                             <a href="http://www.visualmedia.co.in/" target="_blank">unsubscribe</a>
				//                             at any time.
				//                           </p>

				//                         </td>
				//                       </tr>
				//                       <!-- end unsubscribe -->
				//                     </table>
				//                     <!--[if (gte mso 9)|(IE)]>
				//                       </td>
				//                       </tr>
				//                       </table>
				//                       <![endif]-->
				//                   </td>
				//                 </tr>
				//                 <!-- end footer -->
				//               </table>
				//               <!-- end body -->
				//       </body>

				//       </html>`,
				//     req
				//   );
				// }

				await student.save();
				return res.status(200).json({
					status: true,
					message: "all course fees paid",
					id: student._id,
				});
			}

			// Save course fees
			const newCourseFees = new CourseFeesModel({
				...req.body,
				reciptNumber,
				companyName: student.companyName._id,
				addedBy: userName,
				gst_percentage: studentGSTStatus[0]?.gst_percentage,
			});
			let reciptNumberString = Number(reciptNumber.split("-")[1]) + 1;
			const savedCourseFees = await newCourseFees.save();

			//console.log(reciptNumberString);

			currentCompany.reciptNumber =
				reciptNumber.split("-")[0] + "-" + reciptNumberString;
			await currentCompany.save();

			//console.log("saved course fees", savedCourseFees);

			// Update student's payment information
			student.down_payment = amountPaid;
			student.remainingCourseFees = remainingFees;
			student.totalPaid += amountPaid;
			student.no_of_installments -= 1;

			// Calculate and store new installment expiration times
			let expirationDate = moment(amountDate).toDate();

			const nextInstallment = Number(req.body.no_of_installments) - 1;
			const installmentAmount = Math.floor(
				Number(req.body.remainingFees) / nextInstallment
			);

			//console.log("Installment amount :  ".installmentAmount);
			const lastPaymentInstallmentExpirationTime =
				await PaymentInstallmentTimeExpireModel.findOne({
					studentInfo,
				}).sort({ createdAt: -1 });

			if (lastPaymentInstallmentExpirationTime) {
				if (
					Number(lastPaymentInstallmentExpirationTime.installment_number) ===
					Number(req.body.no_of_installments)
				) {
					await lastPaymentInstallmentExpirationTime.deleteOne();
				}
			}

			// Create the entry for the current due installment
			// console.log(student);
			// console.log(req.body);
			const currentInstallmentExpiration =
				new PaymentInstallmentTimeExpireModel({
					studentInfo,
					companyName: student.companyName._id,
					courseName: student?.courseName?._id,
					expiration_date: expirationDate, // Set to current date
					installment_number: req.body.no_of_installments, // Current installment number
					installment_amount: amountPaid,
				});
			expirationDate = moment(amountDate).add(1, "months");

			// Create the entry for the next installment
			const nextInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
				studentInfo,
				companyName: student.companyName._id,
				courseName: student?.courseName?._id,
				expiration_date: expirationDate.toDate(), // Convert moment object to Date
				installment_number: nextInstallment,
				installment_amount: installmentAmount,
			});

			await currentInstallmentExpiration.save();
			await nextInstallmentExpiration.save();

			student.no_of_installments_expireTimeandAmount = expirationDate.toDate(); // Convert moment object to Date
			student.no_of_installments_amount = installmentAmount;
			await student.save();
			// const findPaymentOptionName = await PaymentOptionsModel.findById(
			//   paymentOption
			// );
			//console.log("student data from create course fees ", student);
			// console.log(findPaymentOptionName);
			// Send email asynchronously
			//     let companyLogoURL =
			//       BACKEND_URL + "/api/images/" + student.companyName.logo;
			//     if (emailSuggestionsStatus[0].emailSuggestionStatus) {
			//       sendEmail(
			//         ` ${student.email}, ${student.companyName.email},${superAdminEmail}`,
			//         ` Your Fees Submitted Successfully - ${student.companyName.companyName}`,
			//         `Hello ${student.name} you have submitted fees `,
			//         `<!DOCTYPE html>
			//       <html>

			//       <head>
			//         <meta charset="utf-8" />
			//         <meta http-equiv="x-ua-compatible" content="ie=edge" />
			//         <title>Email Receipt</title>
			//         <meta name="viewport" content="width=device-width, initial-scale=1" />
			//         <style type="text/css">
			//           /**
			//                  * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
			//                  */
			//           @media screen {
			//             @font-face {
			//               font-family: "Source Sans Pro";
			//               font-style: normal;
			//               font-weight: 400;
			//               src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
			//                 url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
			//             }

			//             @font-face {
			//               font-family: "Source Sans Pro";
			//               font-style: normal;
			//               font-weight: 700;
			//               src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
			//                 url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
			//             }
			//           }

			//           /**
			//                  * Avoid browser level font resizing.
			//                  * 1. Windows Mobile
			//                  * 2. iOS / OSX
			//                  */
			//           body,
			//           table,
			//           td,
			//           a {
			//             -ms-text-size-adjust: 100%;
			//             /* 1 */
			//             -webkit-text-size-adjust: 100%;
			//             /* 2 */
			//           }

			//           /**
			//                  * Remove extra space added to tables and cells in Outlook.
			//                  */
			//           table,
			//           td {
			//             mso-table-rspace: 0pt;
			//             mso-table-lspace: 0pt;
			//           }

			//           /**
			//                  * Better fluid images in Internet Explorer.
			//                  */
			//           img {
			//             -ms-interpolation-mode: bicubic;
			//           }

			//           /**
			//                  * Remove blue links for iOS devices.
			//                  */
			//           a[x-apple-data-detectors] {
			//             font-family: inherit !important;
			//             font-size: inherit !important;
			//             font-weight: inherit !important;
			//             line-height: inherit !important;
			//             color: inherit !important;
			//             text-decoration: none !important;
			//           }

			//           /**
			//                  * Fix centering issues in Android 4.4.
			//                  */
			//           div[style*="margin: 16px 0;"] {
			//             margin: 0 !important;
			//           }

			//           body {
			//             width: 100% !important;
			//             height: 100% !important;
			//             padding: 0 !important;
			//             margin: 0 !important;
			//           }

			//           /**
			//                  * Collapse table borders to avoid space between cells.
			//                  */
			//           table {
			//             border-collapse: collapse !important;
			//           }

			//           a {
			//             color: #1a82e2;
			//           }

			//           img {
			//             height: auto;
			//             line-height: 100%;
			//             text-decoration: none;
			//             border: 0;
			//             outline: none;
			//           }
			//         </style>
			//       </head>

			//       <body style="background-color: #d2c7ba">
			//         <!-- start preheader -->
			//         <div class="preheader" style="
			//                       display: none;
			//                       max-width: 0;
			//                       max-height: 0;
			//                       overflow: hidden;
			//                       font-size: 1px;
			//                       line-height: 1px;
			//                       color: #fff;
			//                       opacity: 0;
			//                     ">
			//           A preheader is the short summary text that follows the subject line when
			//           an email is viewed in the inbox.
			//         </div>
			//         <!-- end preheader -->

			//         <!-- start body -->
			//         <table border="0" cellpadding="0" cellspacing="0" width="100%">
			//           <!-- start logo -->
			//           <tr>
			//             <td align="center" bgcolor="#D2C7BA">
			//               <!--[if (gte mso 9)|(IE)]>
			//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                       <tr>
			//                       <td align="center" valign="top" width="600">
			//                       <![endif]-->
			//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
			//                 <tr>
			//                   <td align="center" valign="top" style="padding: 36px 24px">
			//                     <a href="http://www.visualmedia.co.in/" target="_blank" style="display: inline-block">
			//                       <img src=${companyLogoURL} alt="Logo" border="0" width="200px" style="
			//                                     display: block;
			//                                     width: 350px;
			//                                     max-width: 350px;
			//                                     min-width: 300px;
			//                                   " />
			//                     </a>
			//                   </td>
			//                 </tr>
			//               </table>
			//               <!--[if (gte mso 9)|(IE)]>
			//                       </td>
			//                       </tr>
			//                       </table>
			//                       <![endif]-->
			//             </td>
			//           </tr>
			//           <!-- end logo -->

			//           <!-- start hero -->
			//           <tr>
			//             <td align="center" bgcolor="#D2C7BA">
			//               <!--[if (gte mso 9)|(IE)]>
			//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                       <tr>
			//                       <td align="center" valign="top" width="600">
			//                       <![endif]-->
			//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
			//                 <tr>
			//                   <td align="left" bgcolor="#ffffff" style="
			//                                 padding: 36px 24px 0;
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//                                 border-top: 3px solid #d4dadf;
			//                               ">
			//                               <h6 style="
			//                               margin: 0;
			//                               font-size: 27px;
			//                               font-weight: 700;
			//                               letter-spacing: -1px;
			//                               line-height: 30px;
			//                               text-align: left;
			//                             ">
			//                             Thank You, Your Fees Submitted Successfully
			//                 </h6>
			//                   </td>
			//                 </tr>
			//               </table>
			//               <!--[if (gte mso 9)|(IE)]>
			//                       </td>
			//                       </tr>
			//                       </table>
			//                       <![endif]-->
			//             </td>
			//           </tr>
			//           <!-- end hero -->
			//           <!-- start student info block -->
			//       <tr>
			//       <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
			//       <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
			//         style="max-width: 600px">
			//         <tr>
			//           <td align="center" valign="top" style="font-size: 0;">

			//             <div style="display:inline-block;width:100%;max-width: 30%;vertical-align:top;margin-top: 10px;">
			//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
			//                 <tr>
			//                   <td valign="top" style="
			//                                     font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                       sans-serif;
			//                                     font-size: 12px;
			//                                   ">
			//                     <span style="display:block; width:max-content;"><strong>Student Name</strong></span>
			//                     <span style="display:block; width:max-content;"><strong>Father Name</strong></span>
			//                     <span style="display:block; width:max-content;"><strong>Roll Number</strong></span>
			//                     <span style="display:block; width:max-content;"><strong>Course Name</strong></span>
			//                     <span style="display:block; width:max-content;"><strong>Payment Method</strong></span>
			//                   </td>
			//                 </tr>
			//               </table>
			//             </div>
			//             <div style="display:inline-block;width:100%;max-width: 50%;vertical-align:top;margin-top: 10px;">
			//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
			//                 <tr>
			//                   <td valign="top" style="
			//                                     font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                       sans-serif;
			//                                     font-size: 12px;

			//                                   ">
			//                     <span style="display:block;width:max-content;">${
			//                       student.name
			//                     }</span>
			//                     <span style="display:block;width:max-content;">
			//                       ${student.father_name}
			//                     </span>

			//                       <span style="display:block;width:max-content;">
			//                       ${student.rollNumber}
			//                     </span>
			//                     <span style="display:block;width:max-content;">
			//                     ${student.courseName.courseName}
			//                     </span>
			//                     <span style="display:block;width:max-content;">
			//                     ${findPaymentOptionName.name}
			//                     </span>

			//                   </td>

			//                 </tr>
			//               </table>
			//             </div>
			//           </td>
			//         </tr>
			//       </table>
			//       </td>
			//       </tr>
			//       <!-- end student info block -->

			//           <!-- start copy block -->
			//           <tr>
			//             <td align="center" bgcolor="#D2C7BA">
			//               <!--[if (gte mso 9)|(IE)]>
			//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                       <tr>
			//                       <td align="center" valign="top" width="600">
			//                       <![endif]-->
			//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
			//                 <!-- start copy -->

			//                 <!-- end copy -->

			//                 <!-- start receipt table -->
			//                 <tr>
			//                   <td align="left" bgcolor="#ffffff" style="
			//                                 padding: 24px;
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//                                 font-size: 14px;
			//                                 line-height: 24px;
			//                               ">
			//                     <table border="0" cellpadding="0" cellspacing="0" width="100%">
			//                       <tr>
			//                         <td align="left" bgcolor="#D2C7BA" width="75%" style="
			//                                       padding: 12px;
			//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                         sans-serif;
			//                                       font-size: 16px;
			//                                       line-height: 24px;
			//                                     ">
			//                           <strong>Recipt No</strong>
			//                         </td>
			//                         <td align="left" bgcolor="#D2C7BA" width="25%" style="
			//                                       padding: 12px;
			//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                         sans-serif;
			//                                       font-size: 14px;
			//                                       line-height: 24px;
			//                                     ">
			//                           <strong>${student.companyName.reciptNumber}</strong>
			//                         </td>
			//                       </tr>
			//                       <tr>
			//                         <td align="left" width="75%" style="
			//                                       padding: 6px 12px;
			//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                         sans-serif;
			//                                       font-size: 12px;
			//                                       line-height: 24px;
			//                                     ">
			//                           Fees Paid
			//                         </td>

			//                         ${
			//                           student.companyName.isGstBased === "Yes"
			//                             ? ` <td
			//                               align="left"
			//                               width="25%"
			//                               style="
			//                           padding: 6px 12px;
			//                           font-family: 'Source Sans Pro', Helvetica, Arial,
			//                             sans-serif;
			//                           font-size: 12px;
			//                           line-height: 24px;
			//                         "
			//                             >
			//                               Rs ${Number(gstAmount.toFixed(2))}
			//                             </td>`
			//                             : ` <td
			//                               align="left"
			//                               width="25%"
			//                               style="
			//                                       padding: 6px 12px;
			//                                       font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                         sans-serif;
			//                                       font-size: 12px;
			//                                       line-height: 24px;
			//                                     "
			//                             >
			//                               Rs ${Number(amountPaid)}
			//                             </td>`
			//                         }

			//                       </tr>

			//                       <tr>
			//                         <td align="left" width="75%" style="
			//                                 padding: 6px 12px;
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                   sans-serif;
			//                                 font-size: 12px;
			//                                 line-height: 24px;
			//                               ">
			//                           Late Fees
			//                         </td>
			//                         <td align="left" width="25%" style="
			//                                 padding: 6px 12px;
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                   sans-serif;
			//                                 font-size: 12px;
			//                                 line-height: 24px;
			//                               ">
			//                          Rs ${lateFees}
			//                         </td>
			//                       </tr>
			//                       ${
			//                         student.companyName.isGstBased === "Yes"
			//                           ? `<tr>
			//                             <td
			//                               align="left"
			//                               width="75%"
			//                               style="
			//                       padding: 6px 12px;
			//                       font-family: 'Source Sans Pro', Helvetica, Arial,
			//                         sans-serif;
			//                       font-size: 12px;
			//                       line-height: 24px;
			//                     "
			//                             >
			//                               GST (${studentGSTStatus[0]?.gst_percentage} %)
			//                             </td>

			//                             <td
			//                               align="left"
			//                               width="25%"
			//                               style="
			//                                 padding: 6px 12px;
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial,
			//                                   sans-serif;
			//                                 font-size: 12px;
			//                                 line-height: 24px;
			//                               "
			//                             >
			//                             Rs ${cutGSTAmount.toFixed(2)}

			//                             </td>
			//                           </tr>`
			//                           : ""
			//                       }

			//                       <tr style='border:2px dotted black;'>
			//   <td align="left" width="75%" style="
			//           padding: 6px 12px;
			//           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//           font-size: 12px;
			//           line-height: 24px;
			//       ">
			//       Total Amount
			//   </td>
			//   <td align="left" width="25%" style="
			//           padding: 6px 12px;
			//           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//           font-size: 12px;
			//           line-height: 24px;
			//       ">
			//       Rs ${
			//         student.companyName.isGstBased === "No"
			//           ? (Number(lateFees) + Number(amountPaid)).toFixed(2)
			//           : (Number(lateFees) + Number(gstAmount + cutGSTAmount)).toFixed(2)
			//       }
			//   </td>
			// </tr>

			//                       <!-- end reeipt table -->
			//                     </table>
			//                     <!--[if (gte mso 9)|(IE)]>
			//                           </td>
			//                           </tr>

			//                       </table>
			//                       <![endif]-->
			//                   </td>
			//                 </tr>
			//                 <!-- end copy block -->

			//                 <!-- start 1 copy block -->
			//                 <!-- end copy block -->

			//                 <!-- start receipt address block -->
			//                 <tr>
			//                   <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
			//                     <!--[if (gte mso 9)|(IE)]>
			//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                       <tr>
			//                       <td align="center" valign="top" width="600">
			//                       <![endif]-->
			//                     <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
			//                       style="max-width: 600px">
			//                       <tr>
			//                         <td align="center" valign="top" style=" border-bottom: 3px solid #d4dadf">
			//                           <!--[if (gte mso 9)|(IE)]>
			//                             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                             <tr>
			//                             <td align="left" valign="top" width="300">
			//                             <![endif]-->

			//                           <!--[if (gte mso 9)|(IE)]>
			//                             </td>
			//                             <td align="center" valign="top" width="100%">
			//                             <![endif]-->
			//                           <div style="
			//                                   display: inline-block;
			//                                   width: 100%;

			//                                   vertical-align: top;
			//                                 ">
			//                                <p>
			//                                ${student.companyName.companyAddress}
			//                                </p>
			//                                <p>
			//                                Contact Us : ${
			//                                  student.companyName.companyPhone
			//                                }
			//                                </p>
			//                                <p>
			//                                website : ${
			//                                  student.companyName.companyWebsite
			//                                }
			//                                E-mail: ${student.companyName.email}
			//                            </p>

			//                           </div>
			//                           <!--[if (gte mso 9)|(IE)]>
			//                             </td>
			//                             </tr>
			//                             </table>
			//                             <![endif]-->
			//                         </td>
			//                       </tr>
			//                     </table>
			//                     <!--[if (gte mso 9)|(IE)]>
			//                       </td>
			//                       </tr>
			//                       </table>
			//                       <![endif]-->
			//                   </td>
			//                 </tr>
			//                 <!-- end receipt address block -->

			//                 <!-- start footer -->
			//                 <tr>
			//                   <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
			//                     <!--[if (gte mso 9)|(IE)]>
			//                       <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
			//                       <tr>
			//                       <td align="center" valign="top" width="600">
			//                       <![endif]-->
			//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
			//                       <!-- start permission -->
			//                       <tr>
			//                         <td align="center" bgcolor="#D2C7BA" style="
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//                                 font-size: 14px;
			//                                 line-height: 20px;
			//                                 color: #666;
			//                               ">
			//                               <span style="display:block;">
			//                               CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
			//                               DEMANDED
			//                             </span>
			//                             <span style="display:block;">FEES ONCE PAID ARE NOT REFUNDABLE</span>
			//                         </td>
			//                       </tr>
			//                       <!-- end permission -->

			//                       <!-- start unsubscribe -->
			//                       <tr>
			//                         <td align="center" bgcolor="#D2C7BA" style="
			//                                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
			//                                 font-size: 14px;
			//                                 line-height: 20px;
			//                                 color: #666;
			//                               ">
			//                           <p style="margin: 0">
			//                             To stop receiving these emails, you can
			//                             <a href="http://www.visualmedia.co.in/" target="_blank">unsubscribe</a>
			//                             at any time.
			//                           </p>

			//                         </td>
			//                       </tr>
			//                       <!-- end unsubscribe -->
			//                     </table>
			//                     <!--[if (gte mso 9)|(IE)]>
			//                       </td>
			//                       </tr>
			//                       </table>
			//                       <![endif]-->
			//                   </td>
			//                 </tr>
			//                 <!-- end footer -->
			//               </table>
			//               <!-- end body -->
			//       </body>

			//       </html>`,
			//         req
			//       );
			//     }

			res.status(201).json({
				status: true,
				message: "student paid fees successfully!",
				id: student._id,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

// 🔹 Generate Hash for Payment Request
// 🔹 Generate Hash for Payment Request
const generateHash = (data) => {
	const hashString = `${EASEBUZZ_KEY}|${data.txnid}|${data.amountPaid}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|${data.udf6}|${data.udf7}||||${EASEBUZZ_SALT}`;
	const hash = crypto.createHash("sha512").update(hashString).digest("hex");
	return hash;
};

// 🔹 Initiate Payment
export const createEaseBuzzCourseFeesController = async (req, res) => {
	try {
		// Check for EaseBuzz credentials
		if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
			return res
				.status(500)
				.json({ message: "EaseBuzz credentials are missing" });
		}

		const {
			studentInfo,
			amountPaid,
			narration,
			amountDate,
			lateFees,
			courseName,
			remainingFees,
			paymentOption,
			no_of_installments_amount,
			no_of_installments,
			netCourseFees,
		} = req.body;

		// console.log(req.body)

		if (!amountPaid || !amountDate || !studentInfo) {
			return res.status(400).json({ message: "Required fields are missing" });
		}

		const totalAmountPaid = Number(amountPaid) + Number(lateFees);

		// Fetch student details
		const student = await admissionFormModel
			.findById(studentInfo)
			.populate(["courseName", "companyName"]);

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		const txnid = "Txn" + Date.now(); // Generates a unique, shorter ID

		const userName =
			req.user.fName === req.user.lName
				? req.user.fName
				: `${req.user.fName} ${req.user.lName}`;

		let data = { courseName, lateFees };

		const hash = generateHash({
			txnid,
			amountPaid: totalAmountPaid,
			productinfo: "Online Student Fees",
			firstname: userName,
			phone: student.phone_number,
			email: student.email,
			udf1: studentInfo,
			udf2: qs.stringify(data),
			udf3: remainingFees,
			udf4: no_of_installments,
			udf5: no_of_installments_amount,
			udf6: netCourseFees,
			udf7: paymentOption,
			udf8: lateFees,
		});

		const paymentData = {
			key: EASEBUZZ_KEY,
			txnid,
			amount: String(totalAmountPaid), // Ensure amount is a string
			productinfo: "Online Student Fees",
			firstname: userName,
			email: student.email,
			phone: student.phone_number,
			udf1: studentInfo,
			udf2: qs.stringify(data),
			udf3: remainingFees,
			udf4: no_of_installments,
			udf5: no_of_installments_amount,
			udf6: netCourseFees,
			udf7: paymentOption,
			udf8: lateFees,
			surl: `${BACKEND_URL}/api/courseFees/payment/success`,
			furl: `${BACKEND_URL}/api/courseFees/payment/failure`,
			hash,
		};

		// Determine the EaseBuzz URL based on the environment
		const easeBuzzURL =
			EASEBUZZ_ENV === "prod"
				? "https://pay.easebuzz.in/payment/initiateLink"
				: "https://testpay.easebuzz.in/payment/initiateLink";

		try {
			const response = await axios.post(
				easeBuzzURL,
				qs.stringify(paymentData),
				{
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					timeout: 10000, // Set a timeout of 10 seconds
				}
			);

			// console.log("📢 EaseBuzz Response:", JSON.stringify(response.data));

			// Check if Payment API request was successful
			if (
				!response.data ||
				response.data.status !== 1 || // Ensure status = 1 (Success)
				response.data.payment?.error_desc // Ensure no error is returned
			) {
				// console.error("⚠️ Payment Failed:", response.data);
				return res.status(400).json({
					message: "Payment initiation failed",
					error: response.data?.error_desc || "Unknown error",
				});
			}

			// If the payment initiation is successful, send the payment link as a response
			const paymentLink = `https://testpay.easebuzz.in/pay/${response.data.data}`;
			return res.json({ success: true, paymentLink }); // Send the link as a response
		} catch (axiosError) {
			console.error(" Axios Error:", axiosError);
			if (axiosError.response) {
				console.error(
					" EaseBuzz API Error Response:",
					axiosError.response.data
				);
				return res.status(axiosError.response.status).json({
					message: "Payment initiation failed",
					error: axiosError.response.data,
				});
			} else if (axiosError.request) {
				console.error(
					"No response received from EaseBuzz API:",
					axiosError.request
				);
				return res.status(500).json({
					message: "No response received from EaseBuzz API",
					error: axiosError.request,
				});
			} else {
				console.error(" Error in setting up the request:", axiosError.message);
				return res.status(500).json({
					message: "Error in setting up the request",
					error: axiosError.message,
				});
			}
		}
	} catch (error) {
		console.error(" Error:", error);
		return res.status(500).json({
			message: "Payment initiation failed",
			error: error.message || "Unknown Error",
		});
	}
};

// Function to send email asynchronously
async function sendEmail(toEmails, subject, text, html, req) {
	const mailOptions = {
		from: USER_EMAIL,
		to: toEmails,
		subject: subject,
		text: text,
		html,
	};
	const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

	try {
		const result = await mailTransporter.sendMail(mailOptions);
		const emailLog = new EmailLogModel({
			recipientEmails: toEmails, // List of recipients
			subject: subject, // Email subject
			content: html, // Email content (optional)
			sentAt: currentDateTime, // Timestamp
			sendedBy: req.user.fName + " " + req.user.lName,
		});
		await emailLog.save();
		console.log("Email sent successfully", result);
	} catch (error) {
		console.log("Email send failed with error:", error);
	}
}

export const getCourseFeesByStudentIdController = asyncHandler(
	async (req, res, next) => {
		try {
			const { studentId } = req.params;

			// Query the database to find student fees
			const studentFees = await CourseFeesModel.find({
				studentInfo: studentId,
			})
				.sort({ createdAt: 1 })
				.populate([
					"courseName",
					"companyName",
					"studentInfo",
					"paymentOption",
				]);
			//console.log("from student fees controllers ", studentFees);

			// Check if student fees are not found
			if (!studentFees || studentFees.length === 0) {
				return res.status(404).json({ message: "Student fee not found" });
			}

			// Return student fees
			res.status(200).json(studentFees);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);

export const getSingleStudentCourseFeesController = asyncHandler(
	async (req, res, next) => {
		try {
			const courseFees = await CourseFeesModel.findById(req.params.id).populate(
				["courseName", "companyName", "studentInfo", "paymentOption"]
			);
			// console.log("get single student course fees ->>>>>>>> ", courseFees);

			if (!courseFees) {
				return res.status(404).json({ message: "Student fee not found" });
			}
			res.status(200).json(courseFees);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
);

export const updateSingleStudentCourseFeesController = asyncHandler(
	async (req, res) => {
		const {
			netCourseFees,
			studentInfo,
			remainingFees,
			narration,
			amountPaid,
			amountDate,
			paymentOption,
			lateFees,
			reciptNumber,
		} = req.body;
		//console.log(req.body)

		try {
			const alreadyReceiptExists = await CourseFeesModel.findOne({
				reciptNumber,
			});
			if (
				alreadyReceiptExists &&
				alreadyReceiptExists._id.toString() !== req.params.id
			) {
				return res.status(400).json({
					success: false,
					message: "A fee with the same receipt number already exists",
				});
			}

			const addedBy = `${req.user.fName} ${req.user.lName}`;

			let currentStudent = await admissionFormModel.findById(studentInfo);
			const oldStudentCourseFees = await CourseFeesModel.findById(
				req.params.id
			);

			let singleStudentAllCourseFees = await CourseFeesModel.find({
				studentInfo: studentInfo,
			});

			for (let i = 0; i < singleStudentAllCourseFees.length; i++) {
				if (singleStudentAllCourseFees[i]._id.toString() === req.params.id) {
					if (i === 0) {
						singleStudentAllCourseFees[i].reciptNumber =
							reciptNumber || singleStudentAllCourseFees[i].reciptNumber;
						singleStudentAllCourseFees[i].amountPaid =
							amountPaid || singleStudentAllCourseFees[i].amountPaid;
						singleStudentAllCourseFees[i].netCourseFees =
							currentStudent.netCourseFees;
						singleStudentAllCourseFees[i].remainingFees =
							currentStudent.netCourseFees - amountPaid ||
							currentStudent.netCourseFees -
								singleStudentAllCourseFees[i].amountPaid;
						singleStudentAllCourseFees[i].amountDate =
							amountDate || singleStudentAllCourseFees[i].amountDate;
						singleStudentAllCourseFees[i].paymentOption =
							paymentOption || singleStudentAllCourseFees[i].paymentOption;
						singleStudentAllCourseFees[i].lateFees =
							lateFees || singleStudentAllCourseFees[i].lateFees;
						singleStudentAllCourseFees[i].addedBy = addedBy;

						currentStudent.totalPaid = amountPaid;
						currentStudent.remainingCourseFees =
							currentStudent.netCourseFees - amountPaid;
					} else {
						if (singleStudentAllCourseFees[i - 1]) {
							singleStudentAllCourseFees[i].netCourseFees =
								singleStudentAllCourseFees[i - 1].remainingFees;
							singleStudentAllCourseFees[i].remainingFees =
								singleStudentAllCourseFees[i - 1].remainingFees - amountPaid ||
								singleStudentAllCourseFees[i - 1].remainingFees -
									singleStudentAllCourseFees[i].amountPaid;
							singleStudentAllCourseFees[i].narration =
								narration || singleStudentAllCourseFees[i].narration;
							singleStudentAllCourseFees[i].amountPaid =
								amountPaid || singleStudentAllCourseFees[i].amountPaid;
							singleStudentAllCourseFees[i].amountDate =
								amountDate || singleStudentAllCourseFees[i].amountDate;
							singleStudentAllCourseFees[i].reciptNumber =
								reciptNumber || singleStudentAllCourseFees[i].reciptNumber;
							singleStudentAllCourseFees[i].paymentOption =
								paymentOption || singleStudentAllCourseFees[i].paymentOption;
							singleStudentAllCourseFees[i].lateFees =
								lateFees || singleStudentAllCourseFees[i].lateFees;
							singleStudentAllCourseFees[i].addedBy = addedBy;
						}
					}

					await singleStudentAllCourseFees[i].save();
				}
			}

			let getSingleStudentDayBookDataWithReciptNumber =
				await DayBookDataModel.findOne({
					companyId: currentStudent.companyName,
					reciptNumber: oldStudentCourseFees.reciptNumber,
				});

			if (getSingleStudentDayBookDataWithReciptNumber) {
				getSingleStudentDayBookDataWithReciptNumber.reciptNumber =
					reciptNumber ||
					getSingleStudentDayBookDataWithReciptNumber?.reciptNumber;
				getSingleStudentDayBookDataWithReciptNumber.studentInfo =
					studentInfo ||
					getSingleStudentDayBookDataWithReciptNumber.studentInfo;
				getSingleStudentDayBookDataWithReciptNumber.narration =
					narration || getSingleStudentDayBookDataWithReciptNumber.narration;
				getSingleStudentDayBookDataWithReciptNumber.studentLateFees =
					lateFees ||
					getSingleStudentDayBookDataWithReciptNumber.studentLateFees;
				getSingleStudentDayBookDataWithReciptNumber.credit =
					amountPaid || getSingleStudentDayBookDataWithReciptNumber.credit;
				getSingleStudentDayBookDataWithReciptNumber.dayBookDatadate =
					amountDate ||
					getSingleStudentDayBookDataWithReciptNumber.dayBookDatadate;
				getSingleStudentDayBookDataWithReciptNumber.addedBy = addedBy;

				await getSingleStudentDayBookDataWithReciptNumber.save();
			}

			res.status(200).json({
				success: true,
				message: "Student fee updated successfully",
				updatedData: singleStudentAllCourseFees,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
);

export const deleteSingleStudentCourseFeesController = asyncHandler(
	async (req, res, next) => {
		try {
			const singleStudentFee = await CourseFeesModel.findById(req.params.id);
			if (!singleStudentFee) {
				return res.status(404).json({ message: "Student fee not found" });
			}

			let allCourseFeesSingleStudent = await CourseFeesModel.find({
				studentInfo: singleStudentFee.studentInfo,
			});

			let singleStudentDayBooksData = await DayBookDataModel.find({
				companyId: singleStudentFee.companyName,
				studentInfo: singleStudentFee.studentInfo,
			});

			// Update receipt numbers if they are not present in the DayBook data
			for (const [
				index,
				updateReciptNumberDayBookData,
			] of singleStudentDayBooksData.entries()) {
				if (updateReciptNumberDayBookData.reciptNumber === undefined) {
					updateReciptNumberDayBookData.reciptNumber =
						allCourseFeesSingleStudent[index]?.reciptNumber;
					await updateReciptNumberDayBookData.save();
				}
			}

			// Find and delete the specific DayBook data
			const singleDayBookData = await DayBookDataModel.findOne({
				reciptNumber: singleStudentFee.reciptNumber,
			});

			if (singleDayBookData) {
				await singleDayBookData.deleteOne();
			}

			await singleStudentFee.deleteOne();

			const currentStudent = await admissionFormModel.findById(
				singleStudentFee.studentInfo
			);

			const lastPaymentInstallmentOfCurrentStudent =
				await PaymentInstallmentTimeExpireModel.find({
					studentInfo: singleStudentFee.studentInfo,
				});
			lastPaymentInstallmentOfCurrentStudent.map(
				async (deleteCurrentStudentPaymentInstallments) => {
					if (deleteCurrentStudentPaymentInstallments) {
						await deleteCurrentStudentPaymentInstallments.deleteOne();
					}
				}
			);

			// Re-fetch course fees and DayBook data after deletion
			allCourseFeesSingleStudent = await CourseFeesModel.find({
				studentInfo: singleStudentFee.studentInfo,
			});

			singleStudentDayBooksData = await DayBookDataModel.find({
				companyId: singleStudentFee.companyName,
			});

			// Update remaining fees and balance for the student
			for (let i = 1; i < allCourseFeesSingleStudent.length; i++) {
				if (i === 0) {
					allCourseFeesSingleStudent[0].netCourseFees =
						currentStudent.netCourseFees;
					allCourseFeesSingleStudent[0].remainingFees =
						currentStudent.netCourseFees -
						allCourseFeesSingleStudent[0].amountPaid;
				}
				const previousFees = allCourseFeesSingleStudent[i - 1];
				const currentFees = allCourseFeesSingleStudent[i];
				currentFees.netCourseFees = previousFees.remainingFees;
				currentFees.remainingFees =
					previousFees.remainingFees - currentFees.amountPaid;
				await currentFees.save();
			}

			// Update the student's total paid and remaining course fees
			if (allCourseFeesSingleStudent.length === 0) {
				currentStudent.totalPaid = 0;
				currentStudent.remainingCourseFees = undefined;
				currentStudent.no_of_installments = singleStudentFee.no_of_installments;
				currentStudent.netCourseFees = currentStudent.netCourseFees;
				currentStudent.no_of_installments_amount =
					currentStudent.netCourseFees / singleStudentFee.no_of_installments;
			} else {
				const totalPaid = allCourseFeesSingleStudent.reduce(
					(acc, cur) => acc + cur.amountPaid,
					0
				);
				currentStudent.totalPaid = totalPaid;
				currentStudent.remainingCourseFees =
					currentStudent.netCourseFees - totalPaid;
				currentStudent.no_of_installments =
					allCourseFeesSingleStudent[allCourseFeesSingleStudent.length - 1]
						.no_of_installments + 1;
			}

			if (allCourseFeesSingleStudent.length === 1) {
				const totalPaid = allCourseFeesSingleStudent.reduce(
					(acc, cur) => acc + cur.amountPaid,
					0
				);
				currentStudent.totalPaid = totalPaid;
				currentStudent.remainingCourseFees =
					currentStudent.netCourseFees - totalPaid;
				currentStudent.no_of_installments =
					allCourseFeesSingleStudent[allCourseFeesSingleStudent.length - 1]
						.no_of_installments + 1;
			}

			const updatedStudent = await currentStudent.save();

			const newPaymentInstallmentOfStudent =
				new PaymentInstallmentTimeExpireModel({
					studentInfo: updatedStudent._id,
					companyName: updatedStudent.companyName,
					courseName: updatedStudent.courseName,
					expiration_date:
						updatedStudent.no_of_installments_expireTimeandAmount,
					installment_number: updatedStudent.no_of_installments,
					installment_amount:
						updatedStudent["remainingCourseFees"] !== undefined
							? updatedStudent.remainingCourseFees /
							  updatedStudent.no_of_installments
							: updatedStudent.netCourseFees /
							  updatedStudent.no_of_installments,
					dropOutStudent: updatedStudent.dropOutStudent,
				});

			await newPaymentInstallmentOfStudent.save();

			res.status(200).json({
				success: true,
				studentId: updatedStudent._id,
				message: "Student Course fee deleted Successfully",
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
);

export const getAllCourseFeesController = asyncHandler(
	async (req, res, next) => {
		try {
			// const allCourseFees = await CourseFeesModel.find({})
			//   .populate(["studentInfo", "courseName"])
			//   .sort("courseName");
			const nextInstallmentCourseFees = await CourseFeesModel.find({}).populate(
				["studentInfo", "courseName"]
			);
			//console.log(nextInstallmentCourseFees);
			res.status(200).json(nextInstallmentCourseFees);
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
);

export const getCollectionFeesAccordingToCompanyIdController = asyncHandler(
	async (req, res, next) => {
		try {
			const { companyId } = req.params;
			const collectionFees = await PaymentInstallmentTimeExpireModel.find({
				companyName: companyId,
			})
				.populate(["courseName", "companyName", "studentInfo"])
				.sort({ createdAt: 1 });
			res.status(200).json(collectionFees);
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
);
