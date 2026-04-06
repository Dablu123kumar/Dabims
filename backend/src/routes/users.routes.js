import { Router } from "express";

import {
  addUsersControllers,
  getUserByTokn,
  editUserController,
  loginUserController,
  verifyOTPAndLoginController,
  resendOTPController,
  requsetUserPasswordController,
  getAllUsersController,
  deleteUserController,
  getUserByIdController,
  registerUserController,
  resetPasswordController,
  refreshTokenController,
} from "../controllers/user.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import { authLimiter, otpLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  addUserSchema,
  registerUserSchema,
} from "../validators/user.validators.js";

let router = Router();

// Specific routes MUST come BEFORE parameterized routes
router.post("/register", authLimiter, validate(registerUserSchema), registerUserController);
router.post("/users/auth", authLimiter, validate(loginSchema), loginUserController);
router.post("/users/verify-otp", otpLimiter, validate(verifyOTPSchema), verifyOTPAndLoginController);
router.post("/users/resend-otp", otpLimiter, validate(resendOTPSchema), resendOTPController);
router.post("/users/refresh-token", authLimiter, refreshTokenController);
router.post("/users/verifyToken", getUserByTokn);
router.post("/users/requestPassword", authLimiter, requsetUserPasswordController);
router.post("/reset-password/:id/:token", resetPasswordController);

// General /users routes
router
  .route("/users")
  .get(requireSignIn, getAllUsersController)
  .post(requireSignIn, isAdmin, validate(addUserSchema), addUsersControllers);

// Parameterized routes MUST come LAST
router
  .route("/users/:id")
  .get(requireSignIn, isAdmin, getUserByIdController)
  .delete(requireSignIn, isAdmin, deleteUserController)
  .post(requireSignIn, isAdmin, editUserController);

export default router;
