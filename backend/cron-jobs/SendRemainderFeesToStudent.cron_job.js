import cron from "node-cron";
import admissionFormModel from "../src/models/addmission_form.models.js";
import { userModel } from "../src/models/user.models.js";
import EmailRemainderModel from "../src/models/email-remainder/email.remainder.models.js";
import { sendEmail } from "../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import EmailLogModel from "../src/models/mail.models.js";
import moment from "moment";
import emailRemainderDatesModel from "../src/models/email-remainder/email.remainderDates.js";

const calculateReminderDates = async (installmentDurationDate) => {
  try {
    const dueDays = await emailRemainderDatesModel.findOne({});
    if (!dueDays) {
      throw new Error("No dueDays configuration found in the database.");
    }

    const { firstDueDay, secondDueDay, thirdDueDay } = dueDays;

    if (
      [firstDueDay, secondDueDay, thirdDueDay].some(
        (day) => day === undefined || isNaN(Number(day))
      )
    ) {
      throw new Error("Invalid dueDays configuration.");
    }

    const beforeDates = [
      moment(installmentDurationDate).subtract(6, "days").toDate(),
      moment(installmentDurationDate).subtract(3, "days").toDate(),
      moment(installmentDurationDate).subtract(1, "days").toDate(),
    ];

    const afterDates = [
      moment(installmentDurationDate).add(Number(firstDueDay), "days").toDate(),
      moment(installmentDurationDate)
        .add(Number(secondDueDay), "days")
        .toDate(),
      moment(installmentDurationDate).add(Number(thirdDueDay), "days").toDate(),
    ];

    return { beforeDates, afterDates };
  } catch (error) {
    console.error("Error in calculateReminderDates:", error.message);
    return { beforeDates: [], afterDates: [] };
  }
};

const sendReminderEmails = async (
  toEmail,
  student,
  template,
  lateFees,
  dueDateDifference,
  req,
  sendedBy,
  totalInstallmentAmount
) => {
  const personalizedContent = template
    .replace("${studentName}", student.name || "Student")
    .replace(
      "${installment_date}",
      moment(student.installment_duration).format("DD")
    )
    .replace(
      "${DueDates}",
      moment(student.installment_duration).format("DD-MM-YYYY")
    )
    .replace(/\n/g, "<br>") // Handle newlines for HTML email format
    .replace("${LateFees}", lateFees ? `Rs. ${lateFees}` : "No late fees")
    .replace(
      "${InstallmentAmount}",
      student.no_of_installments_amount.toFixed(2)
    )
    .replace(
      "${TotalPendingAmount}",
      `Rs. ${totalInstallmentAmount.toFixed(2)}`
    )
    .replace(
      "${RemainingFees}",
      student.remainingCourseFees
        ? `Rs. ${student.remainingCourseFees}`
        : "No remaining fees"
    )
    .replace(
      "${DueDateDifference}",
      dueDateDifference > 0 ? `${dueDateDifference} days overdue` : "On time"
    );

  const subject = `Installment Payment Reminder - ${student.name || "Student"}`;
  const text = `This is a formal notice regarding your fees installment.`;

  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

  // Send the email
  await sendEmail(toEmail, subject, text, personalizedContent, req, sendedBy);

  // Save the email log
  const emailLog = new EmailLogModel({
    recipientEmails: [toEmail],
    subject,
    content: personalizedContent,
    sentAt: currentDateTime,
    sendedBy,
  });

  await emailLog.save();
};

const studentInfoToSendMailToStudent = async (req, res, next) => {
  try {
    const students = await admissionFormModel
      .find({ remainingCourseFees: { $gt: 0 }, dropOutStudent: { $ne: true } })
      .populate(["courseName", "companyName"]);

    const currentDate = new Date();
    const adminUsers = await userModel.find({ role: "SuperAdmin" });

    let sendedBy = adminUsers
      .map((user) => `${user.fName} ${user.lName}`)
      .join(", ");

    const emailRemainderData = await EmailRemainderModel.findOne({});
    const firstRemainderTemplate = emailRemainderData?.firstRemainder || "";
    const thirdRemainderTemplate = emailRemainderData?.thirdRemainder || "";

    for (const student of students) {
      const installmentDurationDate = new Date(student.installment_duration);
      if (isNaN(installmentDurationDate)) {
        console.warn(
          `Invalid installment_duration for student: ${student.email}`
        );
        continue;
      }

      const { beforeDates, afterDates } = await calculateReminderDates(
        installmentDurationDate
      );

      let template = "";
      let lateFees = 0;
      let emails = [student.email];
      let totalInstallmentAmount = student.no_of_installments_amount;

      if (student.companyName?.email) {
        emails.push(student.companyName.email);
      }
      emails.push(...adminUsers.map((user) => user.email));

      if (beforeDates.some((date) => moment(date).isSame(currentDate, "day"))) {
        template = firstRemainderTemplate;
      } else if (
        afterDates.some((date) => moment(date).isSame(currentDate, "day"))
      ) {
        const overdueDays = moment(currentDate).diff(
          moment(installmentDurationDate),
          "days"
        );
        if (overdueDays > 0) {
          lateFees = overdueDays * 100; // Late fee calculation
        }
        template = thirdRemainderTemplate;
      } else {
        continue;
      }

      // totalInstallmentAmount += lateFees;

      // Loop through each email (sender or recipient) and find corresponding student
      for (const email of emails) {
        // Find student by email
        const studentData = await admissionFormModel.findOne({ email });
        if (!studentData) {
          console.warn(`No student found with email: ${email}`);
          continue;
        }

        // Send the reminder email for the specific student
        await sendReminderEmails(
          email,
          studentData,
          template,
          lateFees,
          moment(installmentDurationDate).diff(currentDate, "days"),
          req,
          sendedBy,
          totalInstallmentAmount
        );
      }
    }

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error processing and sending emails:", error);
  }
};

export default async function startSchedulerStudentRemainderFeesToStudents() {
  try {
    const cronSchedule = "0 9 * * *"; // Run daily at 9:00 AM
    cron.schedule(cronSchedule, studentInfoToSendMailToStudent);
    console.log("Scheduler for sending reminder fees to students has started.");
  } catch (error) {
    console.error("Error setting up scheduler:", error);
  }
}
