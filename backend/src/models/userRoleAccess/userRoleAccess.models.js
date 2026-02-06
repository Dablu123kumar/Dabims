import mongoose from "mongoose";

// Define the schema for user role access
const userRoleAccessSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: [
        "Student",
        "Telecaller",
        "Accounts",
        "Counsellor",
        "Admin",
        "SuperAdmin",
      ], // Enum for predefined roles
    },
    companyPermissions: {
      type: Map,
      of: Boolean, // Map of company names with boolean values indicating access
    },
    studentControlAccess: {
      type: Map,
      of: Boolean, // Map of student control actions with boolean values indicating access
    },
    studentFeesAccess: {
      type: Map,
      of: Boolean, // Map of student fees actions with boolean values indicating access
    },
  },
  { timestamps: true }
); // Optionally add timestamps for createdAt and updatedAt

// Create the model
const UserRoleAccessModel = mongoose.model(
  "UserRoleAccess",
  userRoleAccessSchema
);

// Export the model
export default UserRoleAccessModel;
