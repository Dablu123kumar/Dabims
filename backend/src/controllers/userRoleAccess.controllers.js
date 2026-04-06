import asyncHandler from "../middlewares/asyncHandler.js";
import UserRoleAccessModel from "../models/userRoleAccess/userRoleAccess.models.js";

export const addUserRolePermissionAccessController = asyncHandler(
  async (req, res, next) => {
    try {
      const {
        role,
        companyPermissions,
        studentControlAccess,
        studentFeesAccess,
      } = req.body;

      const userCompanyId = req.user?.companyId || null;

      // Check if the role already exists for this company
      const findQuery = { role };
      if (userCompanyId) {
        findQuery.companyId = userCompanyId;
      } else {
        findQuery.companyId = null;
      }
      const existingRoleAccess = await UserRoleAccessModel.findOne(findQuery);

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
          companyId: userCompanyId,
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
  },
);

export const getAllUserAccessRoleDataController = asyncHandler(
  async (req, res, next) => {
    try {
      let filter = {};
      if (req.user && req.user.role !== "SuperAdmin" && req.user.companyId) {
        filter.companyId = req.user.companyId;
      }
      const allRoles = await UserRoleAccessModel.find(filter);
      return res.status(200).json({ success: true, roleAccessData: allRoles });
    } catch (error) {
      console.error(error); // Added for better error tracking
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!!" });
    }
  },
);
