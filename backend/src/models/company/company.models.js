import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    companyPhone: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    reciptNumber: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
    },
    isGstBased: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const CompanyModels = mongoose.model("Company", companySchema);
export default CompanyModels;
