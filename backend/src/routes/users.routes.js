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
} from "../controllers/user.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";

let router = Router();

// Specific routes MUST come BEFORE parameterized routes
router.post("/register", registerUserController);
router.post("/users/auth", loginUserController);
router.post("/users/verify-otp", verifyOTPAndLoginController);
router.post("/users/resend-otp", resendOTPController);
router.post("/users/verifyToken", getUserByTokn);
router.post("/users/requestPassword", requsetUserPasswordController);
router.post("/reset-password/:id/:token", resetPasswordController);

// General /users routes
router
  .route("/users")
  .get(requireSignIn, getAllUsersController)
  .post(requireSignIn, isAdmin, addUsersControllers);

// Parameterized routes MUST come LAST
router
  .route("/users/:id")
  .get(requireSignIn, isAdmin, getUserByIdController)
  .delete(requireSignIn, isAdmin, deleteUserController)
  .post(requireSignIn, isAdmin, editUserController);

export default router;
