import { Router } from "express";
import {
  addFormsController,
  deleteSingleFormById,
  editFormName,
  getAllAddedFormNames,
  getSingleFormController,
} from "../controllers/customField/addForms.controllers.js";
import { requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, addFormsController)
  .get(getAllAddedFormNames);
router
  .route("/:id")
  .get(requireSignIn, getSingleFormController)
  .put(requireSignIn, editFormName)
  .delete(requireSignIn, deleteSingleFormById);

export default router;
