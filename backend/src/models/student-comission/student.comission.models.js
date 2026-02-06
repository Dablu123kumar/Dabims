import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    commissionPersonName: {
      type: String,
      required: true,
    },
    voucherNumber: {
      type: String,
    },
    commissionAmount: {
      type: String,
      required: true,
    },
    commissionRemaining: {
      type: String,
    },
    commissionPaid: {
      type: String,
      required: true,
    },
    commissionDate: {
      type: String,
      required: true,
    },
    commissionNaretion: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentComissionModel = mongoose.model(
  "StudentComission",
  commissionSchema
);

export default StudentComissionModel;
