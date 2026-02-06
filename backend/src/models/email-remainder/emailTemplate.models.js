import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    customTemplate: {
      type: String,
      required: true,
    },
    cancellationTemplate: {
      type: String,
      required: true,
    },
    dynamicTemplate: {
      type: String,
      required: true,
    },
    courseSubjectTemplate: {
      type: String,
      required: true,
    },
    courseChangeTemplate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmailTemplateModel = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplateModel;
