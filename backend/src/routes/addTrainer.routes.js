import { Router } from "express";
import {
  addTrainerDataController,
  deleteSingleTrainerByIdController,
  getAllTrainersDataController,
  getSingleTrainerDataByIdController,
  updateSingleTrainerDataByIdController,
} from "../controllers/attendance/addTrainers.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

router
  .route("/")
  .post(upload.single("trainerImage"), addTrainerDataController)
  .get(getAllTrainersDataController);

router
  .route("/:id")
  .get(getSingleTrainerDataByIdController)
  .put(upload.single("trainerImage"), updateSingleTrainerDataByIdController)
  .delete(deleteSingleTrainerByIdController);

export default router;
