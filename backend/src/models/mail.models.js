import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  recipientEmails: { type: [String], required: true }, // List of recipients
  subject: { type: String, required: true }, // Email subject
  content: { type: String }, // Email content (optional)
  sentAt: { type: Date, default: Date.now }, // Date and time when the email was sent
  sendedBy: { type: String, required: true },
});

const EmailLogModel = mongoose.model("EmailLog", emailLogSchema);

export default EmailLogModel;
