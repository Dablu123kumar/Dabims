import mongoose from "mongoose";

const emailSuggestionSchema = new mongoose.Schema(
  {
    emailSuggestionStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const EmailSuggestionModel = mongoose.model(
  "EmailSuggestion",
  emailSuggestionSchema
);

export default EmailSuggestionModel;
