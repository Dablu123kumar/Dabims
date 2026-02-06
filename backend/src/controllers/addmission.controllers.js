// import { sendEmail } from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import moment from "moment";
import { USER_EMAIL } from "../config/config.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import addMissionFormModel from "../models/addmission_form.models.js";
import CompanyModels from "../models/company/company.models.js";
import EmailLogModel from "../models/mail.models.js";
import { userModel } from "../models/user.models.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import WelcomeEmailModel from "../models/email-remainder/welcomeEmailSuggestion.models.js";

export const createAddMissionController = asyncHandler(
  async (req, res, next) => {
    const {
      //rollNumber,
      companyName,
      name,
      father_name,
      installment_duration,
      mobile_number,
      phone_number,
      present_address,
      //permanent_address,
      date_of_birth,
      city,
      email,
      education_qualification,
      //professional_qualification,
      select_course,
      //document_attached,
      //select_software,
      // name_of_person_for_commision,
      // commision_paid,
      // commision_date,
      // commision_voucher_number,
      course_fees,
      discount,
      netCourseFees,
      //remainingCourseFees,
      //down_payment,
      date_of_joining,
      no_of_installments,
      courseRemainderDuration,
    } = req.body;

    const data = await WelcomeEmailModel.find({});
    // console.log(req.body);
    const file = req?.file?.filename;
    switch (true) {
      case !companyName:
        res.status(400);
        throw new Error("Please provide company Name field!");
        return;
      case !installment_duration:
        throw new Error("Please provide installment duration field!");
        return;
      case !file:
        res.status(400);
        throw new Error("Please provide image field!");
        return;
      case !name:
        res.status(400);
        throw new Error("Please provide name field!");
        return;
      case !father_name:
        res.status(400);
        throw new Error("Please provide father Name field!");
        return;
      case !mobile_number:
        res.status(400);
        throw new Error("Please provide mobile number field!");
        return;
      case !phone_number:
        res.status(400);
        throw new Error("Please provide phone number field!");
        return;
      case !present_address:
        res.status(400);
        throw new Error("Please provide present address field!");
        return;

      case !date_of_birth:
        res.status(400);
        throw new Error("Please provide date of birth field!");
        return;
      case !city:
        res.status(400);
        throw new Error("Please provide city field!");
        return;
      case !email:
        res.status(400);
        throw new Error("Please provide email field!");
        return;

      case !education_qualification:
        res.status(400);
        throw new Error("Please provide education qualification field!");
        return;

      case !select_course:
        res.status(400);
        throw new Error("Please provide select course field!");
        return;

      case !course_fees:
        res.status(400);
        throw new Error("Please provide course fees field!");
        return;
      case !discount:
        res.status(400);
        throw new Error("Please provide  course fees discount field!");
        return;
      case !netCourseFees:
        res.status(400);
        throw new Error("Please provide  course net fees field!");
        return;

      case !date_of_joining:
        res.status(400);
        throw new Error("Please provide date of joining field!");
        return;
      case !no_of_installments:
        res.status(400);
        throw new Error("Please provide number of installements  field!");
        return;

      default:
        break;
    }

    const companyData = await CompanyModels.findById(companyName);

    const existedAddmission = await addMissionFormModel.findOne({
      mobile_number,
    });

    if (existedAddmission) {
      return res.status(400).json({
        success: false,
        message: "Admission already done with this mobile_number!",
      });
      // throw new Error("with this email addmission already done!");
    }

    let date = moment(date_of_joining).format("DD-MM-YYYY");
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

    let newAddmission = await addMissionFormModel.create({
      ...req.body,
      image: file,
      courseDuration: courseRemainderDuration,
    });

    if (data?.[0]?.welcomeemailsuggestion) {
      sendEmail(
        `${email}, ${companyData.email},${superAdminEmail}`,
        ` Welcome to the  ${companyData.companyName}`,
        `Hello ${name} welcome here`,
        `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Letter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007bff;
          }
          .details {
            margin: 20px 0;
          }
          .details p {
            margin: 5px 0;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to ${companyData.companyName}</h1>
          <p>Dear ${name},</p>
          <p>
            Congratulations on your admission in <strong>${select_course}</strong>! We are thrilled to welcome you to our community of creative learners and professionals dedicated to excellence in web design.
          </p>
  
          <div class="details">
            <h2>Student Details:</h2>
            <p><strong>Student Name:</strong> ${name}</p>
            <p><strong>Father’s Name:</strong> ${father_name}</p>
            <p><strong>Mobile:</strong> ${mobile_number}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Course Start Date:</strong> ${date}</p>
            <p><strong>Course Name:</strong> ${select_course}</p>
          </div>
  
          <p>
            Our instructors are industry experts committed to guiding you through each step of your learning journey. We encourage you to ask questions, share ideas, and collaborate with your peers to maximize your learning experience.
          </p>
  
          <p>
            Should you have any questions or need assistance, please don’t hesitate to contact us at
            <strong>${companyData.email}</strong> or <strong>${companyData.companyPhone}</strong>.
          </p>
  
          <p>
            Once again, welcome to <strong>${companyData.companyName}</strong>. We’re excited to have you on board and look forward to seeing the innovative designs and projects you’ll create!
          </p>
  
          <div class="footer">
            <p>Warm regards,</p>
            <p><strong>Centre Manager</strong></p>
            <p><strong>${companyData.companyName}</strong></p>
            <p>Contact: ${companyData.companyPhone}</p>
          </div>
        </div>
      </body>
      </html>
      `,
        req
      );
    }

    res.status(200).json({
      success: true,
      message: "Addmission done successfully!!",
    });
  }
);

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

export const getSingleStudentByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const student = await addMissionFormModel.findById(req.params.id).populate("companyName", "companyName");
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found!" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
