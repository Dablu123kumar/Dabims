import mongoose from "mongoose";

const WelcomeEmailSchema = new mongoose.Schema(
  {
    welcomeemailsuggestion: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WelcomeEmailModel = mongoose.model("WelcomeEmail", WelcomeEmailSchema);

export default WelcomeEmailModel;
