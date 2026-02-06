import mongoose from "mongoose";

const paymentOptionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      default: "Cash",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentOptionsModel = mongoose.model(
  "PaymentOptions",
  paymentOptionsSchema
);
export default PaymentOptionsModel;
