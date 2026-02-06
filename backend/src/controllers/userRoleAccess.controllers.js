import asyncHandler from "../middlewares/asyncHandler.js";
import UserRoleAccessModel from "../models/userRoleAccess/userRoleAccess.models.js";

export const addUserRolePermissionAccessController = asyncHandler(
  async (req, res, next) => {
    try {
      // console.log(req.body);
      const {
        role,
        companyPermissions,
        studentControlAccess,
        studentFeesAccess,
      } = req.body;

      // Check if the role already exists in the database
      const existingRoleAccess = await UserRoleAccessModel.findOne({ role });

      if (existingRoleAccess) {
        // Update the existing role access with new permissions
        existingRoleAccess.companyPermissions =
          companyPermissions || existingRoleAccess.companyPermissions;
        existingRoleAccess.studentControlAccess =
          studentControlAccess !== undefined
            ? studentControlAccess
            : existingRoleAccess.studentControlAccess;
        existingRoleAccess.studentFeesAccess =
          studentFeesAccess !== undefined
            ? studentFeesAccess
            : existingRoleAccess.studentFeesAccess;

        // Save the updated role access
        await existingRoleAccess.save();
        return res
          .status(200)
          .json({ success: true, roleAccess: existingRoleAccess });
      } else {
        // If the role does not exist, create a new one
        const roleAccess = new UserRoleAccessModel({
          role,
          companyPermissions,
          studentControlAccess,
          studentFeesAccess,
        });
        await roleAccess.save();
        return res.status(201).json({ success: true, roleAccess });
      }
    } catch (error) {
      console.error(error); // Added for better error tracking
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!!" });
    }
  }
);

export const getAllUserAccessRoleDataController = asyncHandler(
  async (req, res, next) => {
    try {
      // console.log(req.body);
      const allRoles = await UserRoleAccessModel.find({});
      return res.status(200).json({ success: true, roleAccessData: allRoles });
    } catch (error) {
      console.error(error); // Added for better error tracking
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!!" });
    }
  }
);
