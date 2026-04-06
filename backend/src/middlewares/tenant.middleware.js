import { userModel } from "../models/user.models.js";

/**
 * Multi-tenant middleware - attaches company filter to request
 * SuperAdmin: no filter (sees all data)
 * Company/Staff: filter by their companyId
 * Student: handled separately in controllers
 */
export const attachCompanyFilter = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = req.user.role;

    if (userRole === "SuperAdmin") {
      // SuperAdmin sees everything - no filter
      req.companyFilter = {};
      req.isSuperAdmin = true;
    } else if (
      userRole === "Company" ||
      userRole === "Admin" ||
      userRole === "Accounts" ||
      userRole === "Counsellor" ||
      userRole === "Telecaller" ||
      userRole === "Trainer"
    ) {
      // Company admin and staff - filter by their companyId
      if (!req.user.companyId) {
        return res
          .status(403)
          .json({ error: "No company assigned to your account" });
      }
      req.companyFilter = { companyId: req.user.companyId };
      req.isSuperAdmin = false;
    } else if (userRole === "Student") {
      // Students only see their own data - handled per controller
      req.companyFilter = {};
      req.isSuperAdmin = false;
    } else {
      return res.status(403).json({ error: "Invalid role" });
    }

    next();
  } catch (error) {
    console.error("Tenant middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Middleware to check if user is Company admin or SuperAdmin
 * Used for staff management endpoints
 */
export const isCompanyAdminOrSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = req.user.role;
    if (role === "SuperAdmin" || role === "Company") {
      next();
    } else {
      return res.status(403).json({
        error: "Only Company Admin or SuperAdmin can perform this action",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
