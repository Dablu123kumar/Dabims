import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createPaymentOptionController,
  getAllPaymentOptionsListController,
  updatePaymentOptionController,
  deletePaymentOptionController,
} from "../controllers/paymentoptions.controllers.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, createPaymentOptionController)
  .get(requireSignIn, getAllPaymentOptionsListController);
router
  .route("/:id")
  .put(requireSignIn, isAdmin, updatePaymentOptionController)
  .delete(requireSignIn, isAdmin, deletePaymentOptionController);

export default router;
