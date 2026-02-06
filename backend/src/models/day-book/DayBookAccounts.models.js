import mongoose from "mongoose";

const DayBookAccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
    },
    accountType: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
  },
  { timestamps: true }
);

// ✅ Unique only within the same company
DayBookAccountSchema.index({ accountName: 1, companyId: 1 }, { unique: true });

const DayBookAccountModel = mongoose.model("DayBookAccount", DayBookAccountSchema);

export default DayBookAccountModel;
