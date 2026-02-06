import { Router } from "express";
import {
  addLabDataController,
  getAllLabsDataController,
  getSingleLabDataController,
  updateSingleLabDataController,
  deleteSingleLabDataById,
} from "../controllers/attendance/lab.controllers.js";

const router = Router();

router.route("/").post(addLabDataController).get(getAllLabsDataController);
router
  .route("/:id")
  .get(getSingleLabDataController)
  .put(updateSingleLabDataController)
  .delete(deleteSingleLabDataById);

export default router;
