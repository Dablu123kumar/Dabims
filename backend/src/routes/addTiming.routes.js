import { Router } from "express";
import {
  addTimingController,
  getAllTimingController,
  getSingleTimingByIdController,
  updateTimingByIdController,
  deleteSingleTimingByIdController,
} from "../controllers/attendance/addTimings.controllers.js";

const router = Router();

router.route("/").post(addTimingController).get(getAllTimingController);
router
  .route("/:id")
  .get(getSingleTimingByIdController)
  .put(updateTimingByIdController)
  .delete(deleteSingleTimingByIdController);

export default router;
