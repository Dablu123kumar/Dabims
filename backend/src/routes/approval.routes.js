import { Router } from "express";
import {
  postApprovalController,
  getAllApprovalStatusController,
  // deleteSingleApprovalDataController,
} from "../controllers/approval.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, postApprovalController)
  .get(getAllApprovalStatusController);

// router.route("/:id").delete(deleteSingleApprovalDataController);

export default router;
