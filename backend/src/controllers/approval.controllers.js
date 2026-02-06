import moment from "moment";
import { BACKEND_URL, USER_EMAIL } from "../config/config.js";
import admissionFormModel from "../models/addmission_form.models.js";
import approvalModel from "../models/approval/approval.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";
import { userModel } from "../models/user.models.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import EmailLogModel from "../models/mail.models.js";
import StudentGST_GuggestionModel from "../models/email-remainder/Student.GST.Suggestion.js";
import EmailSuggestionModel from "../models/email-remainder/EmailSuggestions.models.js";

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

export const postApprovalController = async (req, res, next) => {
  try {
    const { status, reciept, companyId, studentId, check } = req.body;

    // Delete existing approval if present
    const approval = await approvalModel.findOne({ reciept });
    if (approval) {
      await approval.deleteOne();
    }

    // Save new approval status
    const approvalStatus = new approvalModel({
      companyId,
      reciept,
      status,
      studentId,
      check,
    });
    await approvalStatus.save();

    // Run all DB queries in parallel
    const [student, adminUsers, recieptData, emailSuggestionsStatus, status2] =
      await Promise.all([
        admissionFormModel
          .findById(studentId)
          .populate(["courseName", "companyName"]),
        userModel.find({}),
        CourseFeesModel.findById(reciept),
        EmailSuggestionModel.find({}),
        approvalModel.findOne({ reciept }),
      ]);
    const studentGSTStatus = await StudentGST_GuggestionModel.find();
    //console.log(studentGSTStatus[0].studentGST_Guggestion);
    let gstAmount =
      student.companyName.isGstBased === "Yes"
        ? (Number(recieptData.amountPaid) /
            (studentGSTStatus[0]?.gst_percentage + 100)) *
          100
        : Number(recieptData.amountPaid);

    let cutGSTAmount = recieptData.amountPaid - gstAmount;

    const findPaymentOptionName = await PaymentOptionsModel.findById(
      recieptData.paymentOption
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Extract SuperAdmin email
    const superAdminUser = adminUsers.find(
      (user) => user.role === "SuperAdmin"
    );
    const superAdminEmail = superAdminUser?.email || "";

    // Build company logo URL
    let companyLogoURL =
      BACKEND_URL + "/api/images/" + student.companyName?.logo;

    // Send response early (email sending happens afterward)
    res.status(201).json({ success: true, approvalStatus });

    // Proceed with sending email only if status is Approved and suggestion is enabled
    if (
      emailSuggestionsStatus &&
      emailSuggestionsStatus[0]?.emailSuggestionStatus &&
      status2?.status === "Approved"
    ) {
      // console.log("Inside email send condition");

      await sendEmail(
        `${student.email}, ${student.companyName.email},${superAdminEmail}`,
        ` Your Fees Submitted Successfully - ${student.companyName.companyName}`,
        `Hello ${student.name} you have submitted fees `,
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
                                  student.name
                                }</span>
                                <span style="display:block;width:max-content;">
                                  ${student.father_name}
                                </span>
    
                                  <span style="display:block;width:max-content;">
                                  ${student.rollNumber}
                                </span>
                                <span style="display:block;width:max-content;">
                                ${student.courseName.courseName}
                                </span>
                                <span style="display:block;width:max-content;">
                                ${findPaymentOptionName.name}
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
                                      <strong>${
                                        recieptData?.reciptNumber
                                      }</strong>
                                      
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
                                      student.companyName.isGstBased === "Yes"
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
                                          Rs ${Number(recieptData.amountPaid)}
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
                                     Rs ${recieptData.lateFees}
                                    </td>
                                  </tr>
                                  ${
                                    student.companyName.isGstBased === "Yes"
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
                                          GST (${
                                            studentGSTStatus[0]?.gst_percentage
                                          } %)
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
                    student.companyName.isGstBased === "No"
                      ? (
                          Number(recieptData.lateFees) +
                          Number(recieptData.amountPaid)
                        ).toFixed(2)
                      : (
                          Number(recieptData.lateFees) +
                          Number(gstAmount + cutGSTAmount)
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
                                           ${student.companyName.companyAddress}
                                           </p>
                                           <p>
                                           Contact Us : ${
                                             student.companyName.companyPhone
                                           }
                                           </p>
                                           <p>
                                           website : ${
                                             student.companyName.companyWebsite
                                           }
                                           E-mail: ${student.companyName.email}
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
        req
      );
    }
  } catch (error) {
    console.error("Error in postApprovalController:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!!" });
    }
  }
};

export const getAllApprovalStatusController = async (req, res, next) => {
  try {
    const approvalData = await approvalModel
      .find({})
      .populate(["studentId", "reciept"]);
    res.status(200).json({ success: true, approvalData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

// export const deleteSingleApprovalDataController = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     console.log(object)
//     const approvalData = await approvalModel.findByIdAndDelete(id);
//     res.status(200).json({ success: true, approvalData });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Internal Sever Error !!" });
//   }
// };
