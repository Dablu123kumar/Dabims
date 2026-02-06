import mongoose from "mongoose";

const whatsappSuggestionSchema = new mongoose.Schema(
  {
    whatsappSuggestionStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const WhatsAppSuggestionModel = mongoose.model(
  "WhatsAppMessageSuggestion",
  whatsappSuggestionSchema
);

export default WhatsAppSuggestionModel;
