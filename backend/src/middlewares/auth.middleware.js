import jwt from "jsonwebtoken";
import { userModel } from "../models/user.models.js";
import { JWT_SECRET } from "../config/config.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
   //console.log('token', req.cookies.jwt);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = await jwt.verify(token, JWT_SECRET);
    req.user = await userModel.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

// SuperAdmin only access
export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req?.user?._id);
    if (user?.role === "SuperAdmin") {
      next();
    } else {
      return res.status(403).json({ error: "Access denied. SuperAdmin only." });
    }
  } catch (error) {
    res.status(401).send({ success: false, error, message: "Error in SuperAdmin middleware" });
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req?.user?._id);
    if (
      user?.role === "Admin" ||
      user.role === "SuperAdmin" ||
      user.role === "Counsellor" ||
      user.role === "Company"
    ) {
      next();
    } else {
      return res.status(401).json({
        error:
          "You are not allowed to perform this action. Only Admin, Company Admin or SuperAdmin can.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
