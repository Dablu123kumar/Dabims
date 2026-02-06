import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createAddMissionController,
  getSingleStudentByIdController,
} from "../controllers/addmission.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

router
  .route("/")
  .post(
    requireSignIn,
    isAdmin,
    upload.single("image"),
    createAddMissionController
  );
router.get("/:id", requireSignIn, getSingleStudentByIdController);

export default router;
