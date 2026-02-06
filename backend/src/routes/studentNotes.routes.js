import { Router } from "express";
import {
  addStudentNotesController,
  deleteSingleStudentNoteByIdController,
  getAllStudentNotesController,
  getSingleStudentNoteByIdController,
  updateSingleStudentNoteByIdController,
} from "../controllers/studentNotesAndRemainder/studentNotes.controllers.js";
import { requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(requireSignIn, addStudentNotesController)
  .get(requireSignIn, getAllStudentNotesController);
router
  .route("/:id")
  .get(requireSignIn, getSingleStudentNoteByIdController)
  .put(requireSignIn, updateSingleStudentNoteByIdController)
  .delete(requireSignIn, deleteSingleStudentNoteByIdController);

export default router;
