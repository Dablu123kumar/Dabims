import mongoose from "mongoose";

const installmentExpireTimeSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    expiration_date: {
      type: Date,
      required: true,
    },
    installment_number: {
      type: Number,
      required: true,
    },
    installment_amount: {
      type: Number, // Use Number for floating-point numbers
      required: true,
    },
    dropOutStudent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentInstallmentTimeExpireModel = mongoose.model(
  "PaymentInstallmentTime",
  installmentExpireTimeSchema
);

export default PaymentInstallmentTimeExpireModel;
