import mongoose from "mongoose";

const dayBookDataSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    rollNo: {
      type: String,
    },
    StudentName: {
      type: String,
    },
    reciptNumber: {
      type: String,
    },

    studentLateFees: {
      type: Number,
      default: 0,
    },
    narration: {
      type: String,
    },
    dayBookDatadate: {
      type: Date,
      default: Date.now(),
    },
    accountName: {
      type: String,
    },
    commissionPersonName: {
      type: String,
    },
    naretion: {
      type: String,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    dayBookAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayBookAccount",
    },
    linkDayBookAccountData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayBookAccount",
      required: false,
    },
    linkAccountType: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

const DayBookDataModel = mongoose.model("DayBookData", dayBookDataSchema);
export default DayBookDataModel;
