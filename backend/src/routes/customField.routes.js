import { Router } from "express";
import {
  addCustomFieldController,
  deleteSingleFieldById,
  getAllCustomFieldController,
  getSingleFieldById,
  updateCustomFieldController,
} from "../controllers/customField/customField.controllers.js";

const router = Router();

router
  .route("/")
  .post(addCustomFieldController)
  .get(getAllCustomFieldController);

router
  .route("/:id")
  .delete(deleteSingleFieldById)
  .get(getSingleFieldById)
  .put(updateCustomFieldController);

export default router;
