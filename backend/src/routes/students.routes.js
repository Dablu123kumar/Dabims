import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  getAllStudentsController,
  updateStudentController,
  deleteStudentController,
  getSingleStudentDetailsController,
  getAllStudentsMonthlyCollectionFeesController,
  getStudentsAccordingToCompanyController,
  addStudentComissionController,
  getStudentCommissionListsController,
  createAlertStudentPendingFeesController,
  getAlertStudentPendingFeesController,
  deleteAlertStudentPendingFeesController,
  updateAlertStudentPendingFeesController,
  getAllStudentsAlertPendingFeesDataController,
  updateStudentAsDropOutController,
  updateStudentRenewCourseFeesController,
  getStudentsAccordingToCourseController,
} from "../controllers/students.controllers.js";
import upload from "../../multer-config/storageConfig.js";
import sendRemainderFeesStudent, {
  sendEmail,
} from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import { BACKEND_URL } from "../config/config.js";
import { userModel } from "../models/user.models.js";
import EmailRemainderModel from "../models/email-remainder/email.remainder.models.js";
import EmailTemplateModel from "../models/email-remainder/emailTemplate.models.js";
import moment from "moment";
import admissionFormModel from "../models/addmission_form.models.js";
import { get } from "mongoose";

const router = Router();

router.get("/search", requireSignIn, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const students = await admissionFormModel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        // { lName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { studentId: { $regex: q, $options: 'i' } }
      ]
    }).populate('courseName', 'courseName');

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/sendWarningMail", requireSignIn, async (req, res, next) => {
  try {
    const studentData = req.body;
    // console.log(req.body);
    const templates = await EmailTemplateModel.find({});
    if (templates.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No email templates found" });
    }

    // Assuming you want the first template; adjust as needed.
    let emailContent = templates[0]?.customTemplate;

    // Function to replace placeholders in the template with actual values from studentData
    const generateEmailFromTemplate = (template, data) => {
      return template
        .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>")
        .replace(/\$\{(.*?)\}/g, (_, key) => {
          return (
            key
              .split(".")
              .reduce((obj, keyPart) => obj && obj[keyPart], data) || ""
          );
        });
    };

    // Replace placeholders in the letter template with actual data
    const finalEmailContent = generateEmailFromTemplate(
      emailContent,
      studentData
    );

    // Convert line breaks to <br> tags for HTML formatting
    const formattedEmailContent = finalEmailContent.replace(/\n/g, "<br>");

    // Gather admin emails
    let adminEmails = "";
    const users = await userModel.find({});
    users?.forEach((user) => {
      if (user.role === "SuperAdmin") {
        adminEmails += user.email + ",";
      }
    });
    let sendedBy = `${req.user.fName} ${req.user.lName}`;
    // Send the formatted letter via email
    await sendEmail(
      `${studentData?.studentInfo?.email},${studentData?.companyName?.email}`,
      `Final Notice Regarding Pending Fees for ${studentData?.courseName?.courseName} Course - ${studentData?.companyName?.companyName}`,
      `Dear ${studentData?.studentInfo?.name}, this is a notice regarding unpaid fees.`,
      formattedEmailContent, // Use formatted content with HTML line breaks
      req,
      sendedBy
    );

    res.status(200).json({
      success: true,
      message: "Letter email sent to student successfully!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send the email" });
  }
});

router.post( "/sendAddmissionCancellationMail",requireSignIn,async (req, res, next) => {
    try {
      const studentData = req.body;
      // console.log(req.body);
      const templates = await EmailTemplateModel.find({});
      if (templates.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No email templates found" });
      }

      // Assuming you want the first template; adjust as needed.
      let emailContent = templates[0]?.cancellationTemplate;

      // Function to replace placeholders in the template with actual values from studentData
      const generateEmailFromTemplate = (template, data) => {
        return template
          .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>")
          .replace(/\$\{(.*?)\}/g, (_, key) => {
            return (
              key
                .split(".")
                .reduce((obj, keyPart) => obj && obj[keyPart], data) || ""
            );
          });
      };

      // Replace placeholders in the letter template with actual data
      const finalEmailContent = generateEmailFromTemplate(
        emailContent,
        studentData
      );

      // Convert line breaks to <br> tags for HTML formatting
      const formattedEmailContent = finalEmailContent.replace(/\n/g, "<br>");

      // Gather admin emails
      let adminEmails = "";
      const users = await userModel.find({});
      users?.forEach((user) => {
        if (user.role === "SuperAdmin") {
          adminEmails += user.email + ",";
        }
      });
      let sendedBy = `${req.user.fName} ${req.user.lName}`;
      // Send the formatted letter via email
      await sendEmail(
        `${studentData?.studentInfo?.email},${studentData?.companyName?.email}`,
        `Final Confirmation of Admission Cancellation`,
        `Dear ${studentData?.studentInfo?.name}, this is a notice regarding Confirmation of Admission Cancellation`,
        formattedEmailContent, // Use formatted content with HTML line breaks
        req,
        sendedBy
      );

      return res.status(200).json({
        success: true,
        message: "Letter email sent to student successfully!",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send the email" });
    }
  }
);

router.post("/sendMailStudent", requireSignIn, async (req, res, next) => {
  // console.log(req.body);
  const studentData = req.body;
  // console.log(studentData.gst_percentage);
  // console.log(studentData);
  let companyLogoURL =
    BACKEND_URL + "/api/images/" + studentData.companyName.logo;
  //const studentGSTStatus = await StudentGST_GuggestionModel.find();
  let adminEmails = "";
  const users = await userModel.find({});

  users?.map((user) => {
    //console.log(user.role, user.email);
    if (user.role === "SuperAdmin") {
      adminEmails += user.email + ",";
    }
  });
  const formattedDate = moment(studentData.amountDate).format("DD-MM-YYYY");
  // console.log(adminEmails);
  // console.log(formattedDate)

  let gstAmount =
    studentData.companyName.isGstBased === "Yes"
      ? (Number(studentData.amountPaid) / (studentData?.gst_percentage + 100)) *
        100
      : Number(studentData.amountPaid);
  let cutGSTAmount = studentData.amountPaid - gstAmount;
  let sendedBy = `${req.user.fName} ${req.user.lName}`;
  sendEmail(
    `${studentData.studentInfo.email},${studentData.companyName.email}`,
    `Your Fees Submitted Successfully - ${studentData.companyName.companyName}`,
    `Hello ${studentData.studentInfo.name} you have submitted fees `,
    `<!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Email Receipt</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      /**
             * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
             */
      @media screen {
        @font-face {
          font-family: "Source Sans Pro";
          font-style: normal;
          font-weight: 400;
          src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
            url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
        }

        @font-face {
          font-family: "Source Sans Pro";
          font-style: normal;
          font-weight: 700;
          src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
            url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
        }
      }

      /**
             * Avoid browser level font resizing.
             * 1. Windows Mobile
             * 2. iOS / OSX
             */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%;
        /* 1 */
        -webkit-text-size-adjust: 100%;
        /* 2 */
      }

      /**
             * Remove extra space added to tables and cells in Outlook.
             */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }

      /**
             * Better fluid images in Internet Explorer.
             */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /**
             * Remove blue links for iOS devices.
             */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }

      /**
             * Fix centering issues in Android 4.4.
             */
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }

      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /**
             * Collapse table borders to avoid space between cells.
             */
      table {
        border-collapse: collapse !important;
      }

      a {
        color: #1a82e2;
      }

      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
    </style>
  </head>

  <body style="background-color: #d2c7ba">
    <!-- start preheader -->
    <div class="preheader" style="
                  display: none;
                  max-width: 0;
                  max-height: 0;
                  overflow: hidden;
                  font-size: 1px;
                  line-height: 1px;
                  color: #fff;
                  opacity: 0;
                ">
      A preheader is the short summary text that follows the subject line when
      an email is viewed in the inbox.
    </div>
    <!-- end preheader -->

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- start logo -->
      <tr>
        <td align="center" bgcolor="#D2C7BA">
          <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
            <tr>
              <td align="center" valign="top" style="padding: 36px 24px">
                <a href="http://www.visualmedia.co.in/" target="_blank" style="display: inline-block">
                  <img src=${companyLogoURL} alt="Logo" border="0" width="200px" style="
                                display: block;
                                width: 350px;
                                max-width: 350px;
                                min-width: 300px;
                              " />
                </a>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
        </td>
      </tr>
      <!-- end logo -->

      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#D2C7BA">
          <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
            <tr>
              <td align="left" bgcolor="#ffffff" style="
                            padding: 36px 24px 0;
                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                            border-top: 3px solid #d4dadf;
                          ">
                          <h6 style="
                          margin: 0;
                          font-size: 27px;
                          font-weight: 700;
                          letter-spacing: -1px;
                          line-height: 30px;
                          text-align: left;
                        ">
                        Thank You, Your Fees Submitted Successfully
            </h6>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
        </td>
      </tr>
      <!-- end hero -->
      <!-- start student info block -->
  <tr>
  <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
  <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
    style="max-width: 600px">
    <tr>
      <td align="center" valign="top" style="font-size: 0;">

        <div style="display:inline-block;width:100%;max-width: 30%;vertical-align:top;margin-top: 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
            <tr>
              <td valign="top" style="
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 12px;
                              ">
                <span style="display:block; width:max-content;"><strong>Student Name</strong></span>
                <span style="display:block; width:max-content;"><strong>Father Name</strong></span>
                <span style="display:block; width:max-content;"><strong>Roll Number</strong></span>
                <span style="display:block; width:max-content;"><strong>Course Name</strong></span>
                <span style="display:block; width:max-content;"><strong>Payment Method</strong></span>
                <span style="display:block; width:max-content;"><strong>Payment Date</strong></span>
              </td>
            </tr>
          </table>
        </div>
        <div style="display:inline-block;width:100%;max-width: 50%;vertical-align:top;margin-top: 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
            <tr>
              <td valign="top" style="
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 12px;
                                
                              ">
                <span style="display:block;width:max-content;">${
                  studentData.studentInfo.name
                }</span>
                <span style="display:block;width:max-content;">
                  ${studentData.studentInfo.father_name}
                </span>
                
                  <span style="display:block;width:max-content;">
                  ${studentData.studentInfo.rollNumber}
                </span>
                <span style="display:block;width:max-content;">
                ${studentData.courseName.courseName}
                </span>
                <span style="display:block;width:max-content;">
                ${studentData.paymentOption.name}
                </span>
                <span style="display:block;width:max-content;">
                ${formattedDate}
                </span>
                
              </td>
            
            </tr>
          </table>
        </div>
      </td>
    </tr>
  </table>
  </td>
  </tr>
  <!-- end student info block -->


      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#D2C7BA">
          <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
            <!-- start copy -->
          
            <!-- end copy -->

            <!-- start receipt table -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="
                            padding: 24px;
                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                            font-size: 14px;
                            line-height: 24px;
                          ">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left" bgcolor="#D2C7BA" width="75%" style="
                                  padding: 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 16px;
                                  line-height: 24px;
                                ">
                      <strong>Recipt No</strong>
                    </td>
                    <td align="left" bgcolor="#D2C7BA" width="25%" style="
                                  padding: 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 14px;
                                  line-height: 24px;
                                ">
                      <strong>${studentData?.reciptNumber}</strong>
                    </td>
                  </tr> 
                  <tr>
                    <td align="left" width="75%" style="
                                  padding: 6px 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  line-height: 24px;
                                ">
                      Fees Paid
                    </td>
                   
                   
                    ${
                      studentData.companyName.isGstBased === "Yes"
                        ? ` <td
                          align="left"
                          width="25%"
                          style="
                      padding: 6px 12px;
                      font-family: 'Source Sans Pro', Helvetica, Arial,
                        sans-serif;
                      font-size: 12px;
                      line-height: 24px;
                    "
                        >
                          Rs ${Number(gstAmount.toFixed(2))}
                        </td>`
                        : ` <td
                          align="left"
                          width="25%"
                          style="
                                  padding: 6px 12px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  line-height: 24px;
                                "
                        >
                          Rs ${Number(studentData.amountPaid)}
                        </td>`
                    }
                    
                    
                  </tr>




                  <tr>
                    <td align="left" width="75%" style="
                            padding: 6px 12px;
                            font-family: 'Source Sans Pro', Helvetica, Arial,
                              sans-serif;
                            font-size: 12px;
                            line-height: 24px;
                          ">
                      Late Fees
                    </td>
                    <td align="left" width="25%" style="
                            padding: 6px 12px;
                            font-family: 'Source Sans Pro', Helvetica, Arial,
                              sans-serif;
                            font-size: 12px;
                            line-height: 24px;
                          ">
                     Rs ${studentData.lateFees} 
                    </td>
                  </tr>
                  ${
                    studentData.companyName.isGstBased === "Yes"
                      ? `<tr>
                        <td
                          align="left"
                          width="75%"
                          style="
                  padding: 6px 12px;
                  font-family: 'Source Sans Pro', Helvetica, Arial,
                    sans-serif;
                  font-size: 12px;
                  line-height: 24px;
                "
                        >
                          GST (${studentData?.gst_percentage} %)
                        </td>

                        <td
                          align="left"
                          width="25%"
                          style="
                            padding: 6px 12px;
                            font-family: 'Source Sans Pro', Helvetica, Arial,
                              sans-serif;
                            font-size: 12px;
                            line-height: 24px;
                          "
                        >
                        Rs ${cutGSTAmount.toFixed(2)}
                          
                        </td>
                      </tr>`
                      : ""
                  }
                  
                
                  <tr style='border:2px dotted black;'>
<td align="left" width="75%" style="
      padding: 6px 12px;
      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 24px;
  ">
  Total Amount
</td>
<td align="left" width="25%" style="
      padding: 6px 12px;
      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 24px;
  ">
  Rs ${
    studentData.companyName.isGstBased === "No"
      ? (Number(studentData.lateFees) + Number(studentData.amountPaid)).toFixed(
          2
        )
      : (
          Number(studentData.lateFees) + Number(gstAmount + cutGSTAmount)
        ).toFixed(2)
  } 
</td>
</tr>

                  <!-- end reeipt table -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>

                    

                  </table>
                  <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->

            <!-- start 1 copy block -->
            <!-- end copy block -->

            <!-- start receipt address block -->
            <tr>
              <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
                <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                  style="max-width: 600px">
                  <tr>
                    <td align="center" valign="top" style=" border-bottom: 3px solid #d4dadf">
                      <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="left" valign="top" width="300">
                        <![endif]-->
                    
                      <!--[if (gte mso 9)|(IE)]>
                        </td>
                        <td align="center" valign="top" width="100%">
                        <![endif]-->
                      <div style="
                              display: inline-block;
                              width: 100%;
                              
                              vertical-align: top;
                            ">
                           <p>
                           ${studentData.companyName.companyAddress}
                           </p> 
                           <p>
                           Contact Us : ${studentData.companyName.companyPhone}
                           </p> 
                           <p>
                           website : ${studentData.companyName.companyWebsite} 
                           E-mail: ${studentData.companyName.email}
                       </p> 
                      
                       
                      </div>
                      <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
            </tr>
            <!-- end receipt address block -->

            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
                <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#D2C7BA" style="
                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                            font-size: 14px;
                            line-height: 20px;
                            color: #666;
                          ">
                          <span style="display:block;">
                          CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
                          DEMANDED
                        </span>
                        <span style="display:block;">FEES ONCE PAID ARE NOT REFUNDABLE</span>
                    </td>
                  </tr>
                  <!-- end permission -->

                  <!-- start unsubscribe -->
                  <tr>
                    <td align="center" bgcolor="#D2C7BA" style="
                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                            font-size: 14px;
                            line-height: 20px;
                            color: #666;
                          ">
                      <p style="margin: 0">
                        To stop receiving these emails, you can
                        <a href="http://www.visualmedia.co.in/" target="_blank">unsubscribe</a>
                        at any time.
                      </p>
                    
                    
                    </td>
                  </tr>
                  <!-- end unsubscribe -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
            </tr>
            <!-- end footer -->
          </table>
          <!-- end body -->
  </body>

  </html>`,
    req,
    sendedBy
  );
  res
    .status(200)
    .json({ success: true, message: "send mail to student successfully!" });
});

router.post("/sendMailToSelectedStudents",requireSignIn, async (req, res, next) => {
    try {
      const { userIds, company } = req.body;

      // Ensure company is an object
      if (!company || typeof company !== "object") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid company data" });
      }

      const allEmails = await admissionFormModel.find(
        { _id: { $in: userIds } },
        "email"
      );

      const templates = await EmailTemplateModel.find({});
      if (templates.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No email templates found" });
      }

      let emailContent = templates[0]?.dynamicTemplate;
      if (!emailContent) {
        return res.status(404).json({
          success: false,
          message: "Email template content not found",
        });
      }

      const generateEmailFromTemplate = (template, data) => {
        return template.replace(/\$\{(.*?)\}/g, (_, key) => {
          return (
            key
              .split(".")
              .reduce((obj, keyPart) => (obj ? obj[keyPart] : ""), data) || ""
          );
        });
      };

      const finalEmailContent = generateEmailFromTemplate(
        emailContent,
        company
      );

      // Convert line breaks to <br> tags for HTML formatting
      const formattedEmailContent = finalEmailContent.replace(/\n/g, "<br>");

      const users = allEmails?.map((email) => email.email) || [];

      let adminEmails = [];
      const mainUser = await userModel.find({});
      mainUser?.forEach((mainUser) => {
        if (mainUser.role === "SuperAdmin") {
          adminEmails.push(mainUser.email);
        }
      });

      let sendedBy = `${req.user.fName} ${req.user.lName}`;
      console.log("Company", company);
      console.log("Sent by", sendedBy);

      // Combine all email addresses
      const allRecipients = [...users, ...adminEmails, company?.email]
        .filter(Boolean)
        .join(",");

      await sendEmail(
        allRecipients,
        `Final Confirmation of Admission Cancellation`,
        `Dear Student`,
        formattedEmailContent,
        req,
        sendedBy
      );

      return res.status(200).json({
        success: true,
        message: "Letter email sent to all selected students successfully!",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send the email" });
    }
  }
);

router.post("/sendCourseChangeEmail",requireSignIn, async (req, res) => {
    try {
      //console.log(req.body)
      const { userIds, company, newCourse } = req.body;
        
      if (!company || typeof company !== "object") {
        return res.status(400).json({
          success: false,
          message: "Invalid company data",
        });
      }

      // 1️⃣ Get students
      const students = await admissionFormModel.find(
        { _id: { $in: userIds } },
        "name email father_name mobile_number rollNumber"
      );

      if (!students.length) {
        return res.status(404).json({
          success: false,
          message: "No students found",
        });
      }

      // 2️⃣ Get template
      const templates = await EmailTemplateModel.find({});
      if (!templates.length) {
        return res.status(404).json({
          success: false,
          message: "No email templates found",
        });
      }

      const emailTemplate = templates[0].courseChangeTemplate;
      if (!emailTemplate) {
        return res.status(404).json({
          success: false,
          message: "Course change email template not found",
        });
      }

      // 3️⃣ Template renderer
      const generateEmailFromTemplate = (template, data) => {
        return template.replace(/\$\{(.*?)\}/g, (_, key) => {
          return (
            key
              .split(".")
              .reduce((obj, k) => (obj ? obj[k] : ""), data) || ""
          );
        });
      };

      // 4️⃣ Admin emails
      const admins = await userModel.find({ role: "SuperAdmin" }, "email");
      const adminEmails = admins.map((a) => a.email);

      let sentBy = `${req.user.fName} ${req.user.lName}`;

      // 5️⃣ Send mail to each student
      for (const student of students) {
        const finalContent = generateEmailFromTemplate(emailTemplate, {
          name: student.name,
          companyName: company.companyName,
          courseName: newCourse,
        });

        const htmlContent = finalContent.replace(/\n/g, "<br>");

        const recipients = [
          student.email,
          ...adminEmails,
          company.email,
        ]
          .filter(Boolean)
          .join(",");

        await sendEmail(
          recipients,
          "Course Change Confirmation",
          "Course Update",
          htmlContent,
          req,
          sentBy
        );
      }

      return res.status(200).json({
        success: true,
        message: "Course change email sent successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to send course change email",
      });
    }
  }
);

router.put(
  "/renewStudentCourseFees/:id",
  requireSignIn,
  isAdmin,
  updateStudentRenewCourseFeesController
);

router.put(
  "/dropOutStudents/:id",
  requireSignIn,
  isAdmin,
  updateStudentAsDropOutController
);

// Student Commission Start here -------------------------------------
router.post("/commission", requireSignIn, addStudentComissionController);
router.get("/commissionList", getStudentCommissionListsController);
// Student Commission End here ---------------------------------------

router.post(
  "/createAlertStudentPendingFees/add",
  requireSignIn,
  createAlertStudentPendingFeesController
);
router.get(
  "/getStudentAlertStudentPendingFees",
  requireSignIn,
  getAllStudentsAlertPendingFeesDataController
);
router.get(
  "/createAlertStudentPendingFees/get",
  requireSignIn,
  getAlertStudentPendingFeesController
);

router.delete(
  "/createAlertStudentPendingFees/:id",
  requireSignIn,
  isAdmin,
  deleteAlertStudentPendingFeesController
);

router.put(
  "/createAlertStudentPendingFees/:id",
  requireSignIn,
  isAdmin,
  updateAlertStudentPendingFeesController
);

// get the student According to company wise
router.get("/company/:companyId", getStudentsAccordingToCompanyController);

// get the student According to course wise
router.get('/company/:companyId/course/:courseId',getStudentsAccordingToCourseController)

// get all students
router.route("/").get(requireSignIn, getAllStudentsController);

// Get student by email
router.get("/email/:email", requireSignIn, async (req, res) => {
  try {
    const student = await admissionFormModel.findOne({ email: req.params.email }).populate("courseName");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get student by ID
router
  .route("/:id")
  .get(requireSignIn, getSingleStudentDetailsController)
  .put(requireSignIn, isAdmin, upload.single("image"), updateStudentController)
  .delete(requireSignIn, isAdmin, deleteStudentController);

router
  .route("/feesCollection")
  .get(requireSignIn, getAllStudentsMonthlyCollectionFeesController);

// Search students


export default router;
