import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "Accounts",
        "Counsellor",
        "Telecaller",
        "Trainer",
        "Admin",
        "SuperAdmin",
        "Student",
        "Company",
      ],
      default: "Student",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    api_token: {
      type: String,
    },
    studentId: {
      type: String,
    },
    // OTP fields for two-factor authentication
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("User", userSchema);
