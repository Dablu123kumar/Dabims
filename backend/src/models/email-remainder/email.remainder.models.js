import mongoose from "mongoose";

const emailRemainderSchema = new mongoose.Schema(
  {
    firstRemainder: {
      type: String,
      required: true,
    },
    thirdRemainder: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmailRemainderModel = mongoose.model(
  "EmailRemainder",
  emailRemainderSchema
);

export default EmailRemainderModel;
