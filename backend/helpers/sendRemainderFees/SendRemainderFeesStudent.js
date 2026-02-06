import moment from "moment";
import { userModel } from "../../src/models/user.models.js";
import admissionFormModel from "../../src/models/addmission_form.models.js";
import EmailRemainderModel from "../../src/models/email-remainder/email.remainder.models.js";
import { USER_EMAIL } from "../../src/config/config.js";
import { mailTransporter } from "../../src/utils/mail_helpers.js";
import EmailLogModel from "../../src/models/mail.models.js";

export const sendRemainderFeesStudent = async (req, res, next) => {
  //console.log("req and res", req.url, req.body);
  let superAdminEmail;
  // console.log("sending email reminder");
  try {
    // Fetch admin and super admin emails
    const adminUsers = await userModel.find({});
    adminUsers.forEach((user) => {
      if (user.role === "SuperAdmin") {
        superAdminEmail = user.email;
      }
    });

    //console.log(adminUsers);

    // Fetch student information with populated fields
    const studentInfo = await admissionFormModel
      .find()
      .populate(["courseName", "companyName"]);

    // console.log("students info", studentInfo);
    //console.log(studentInfo);
    for (const student of studentInfo) {
      const installmentExpireDate = moment(
        student?.no_of_installments_expireTimeandAmount
      );
      //console.log(installmentExpireDate);
      const currentTime = moment();

      // Save student's updated information
      await student.save();

      // Fetch email remainder data
      const emailRemainderData = await EmailRemainderModel.findOne({}); // Assuming there's only one document

      //console.log(emailRemainderData);

      // Check if current time is after the installment due date
      if (currentTime.isAfter(installmentExpireDate)) {
        // Calculate days and hours difference
        const daysDifference = currentTime.diff(installmentExpireDate, "days");
        const hoursDifference =
          currentTime.diff(installmentExpireDate, "hours") % 24;

        // Send email based on specific days/hours difference
        let emailContent;
        if (daysDifference === 1 && hoursDifference === 12) {
          emailContent = emailRemainderData.firstRemainder;
          student.remainderSent = false;
        } else if (daysDifference === 10 && hoursDifference === 12) {
          student.remainderSent = false;
          emailContent = emailRemainderData.secondRemainder;
        } else if (daysDifference === 12 && hoursDifference === 12) {
          student.remainderSent = false;
          emailContent = emailRemainderData.thirdRemainder;
        } else if (daysDifference === 15 && hoursDifference === 12) {
          student.remainderSent = false;
          emailContent = emailRemainderData.firstRemainder;
        }

        if (emailContent && !student.remainderSent) {
          // Prepare recipients list for email
          const toEmails = `${student?.email}, ${student?.companyName.email},  ${superAdminEmail}`;

          // Send email
          await sendEmail(
            toEmails,
            "Installment Payment Reminder",
            emailContent
            // studentInfo
          );

          // Update student document to mark remainder as sent
          student.remainderSent = true;
          await student.save();
        }
      }
    }

    // Proceed to next middleware or route handler

    //console.log("send mail");
  } catch (error) {
    console.error("Error in sendRemainderFeesStudent:", error);
    // Handle error appropriately, e.g., send response or log further
  }
};

export const getAllMailsControllers = async (req, res, next) => {
  const { recipientEmail } = req.params;

  try {
    const emailLogs = await EmailLogModel.find({
      recipientEmails: new RegExp(recipientEmail, "i"),
    });
    res.status(200).json(emailLogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve email logs", error });
  }
};

// Function to send email
// Function to send email
export async function sendEmail(toEmails, subject, text, html, req, sendedBy) {
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss"); // Format date and time

  const mailOptions = {
    from: USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text, // Plain text fallback
    html: html, // HTML content
  };
  // console.log("Mail Options before sending:", mailOptions);
  // console.log(currentDateTime);
  try {
    const result = await mailTransporter.sendMail(mailOptions);
    const emailLog = new EmailLogModel({
      recipientEmails: toEmails, // List of recipients
      subject: subject, // Email subject
      content: html, // Email content (optional)
      sentAt: currentDateTime, // Timestamp
      sendedBy: sendedBy,
    });
    await emailLog.save(); // Save the email log

    // console.log("Email sent successfully and logged at", currentDateTime);
    console.log("Email send result:", result);

    return result; // Return the result if you want to use it
  } catch (error) {
    console.log("Email send failed with error:", error);
    throw new Error("Failed to send email");
  }
}

// export async function sendEmail1(toEmails, subject, text, html, req, sendedBy) {
//   const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss"); // Format date and time

//   const mailOptions = {
//     from: USER_EMAIL1,
//     to: toEmails,
//     subject: subject,
//     text: text, // Plain text fallback
//     html: html, // HTML content
//   };
//   // console.log("Mail Options before sending:", mailOptions);
//   // console.log(currentDateTime);
//   try {
//     const result = await mailTransporter1.sendMail(mailOptions);
//     const emailLog = new EmailLogModel({
//       recipientEmails: toEmails, // List of recipients
//       subject: subject, // Email subject
//       content: html, // Email content (optional)
//       sentAt: currentDateTime, // Timestamp
//       sendedBy: sendedBy,
//     });
//     await emailLog.save(); // Save the email log

//     // console.log("Email sent successfully and logged at", currentDateTime);
//     console.log("Email send result:", result);

//     return result; // Return the result if you want to use it
//   } catch (error) {
//     console.log("Email send failed with error:", error);
//     throw new Error("Failed to send email");
//   }
// }

export default sendRemainderFeesStudent;
