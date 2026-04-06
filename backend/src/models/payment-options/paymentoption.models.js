import mongoose from "mongoose";

const paymentOptionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

const PaymentOptionsModel = mongoose.model(
  "PaymentOptions",
  paymentOptionsSchema
);
export default PaymentOptionsModel;
