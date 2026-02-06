import asyncHandler from "../middlewares/asyncHandler.js";
import EmailTemplateModel from "../models/email-remainder/emailTemplate.models.js";

export const addEmailTemplateController = asyncHandler(
  async (req, res, next) => {
    try {
       //console.log(req.body)
      const {
        customTemplate,
        cancellationTemplate,
        dynamicTemplate,
        courseSubjectTemplate,
        courseChangeTemplate
      } = req.body;

      if (!customTemplate) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }
      if (!cancellationTemplate) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }
      if (!dynamicTemplate) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }
      if (!courseSubjectTemplate) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }
      if (!courseChangeTemplate) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      const emailsTemplates = await EmailTemplateModel.find({});
      emailsTemplates.forEach(
        async (emailsTemplates) => await emailsTemplates.deleteOne()
      );
      const emailTemplate = new EmailTemplateModel({
        customTemplate,
        cancellationTemplate,
        dynamicTemplate,
        courseSubjectTemplate,
        courseChangeTemplate,
      });
      //console.log(emailTemplate)
      await emailTemplate.save();
      res.status(200).json({ message: "Email Template Added" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error !!" });
    }
  }
);

export const getEmailTemplateController = asyncHandler(async (req, res) => {
  try {
    const data = await EmailTemplateModel.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
