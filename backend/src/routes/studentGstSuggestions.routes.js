import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addStudentGstSuggestionController,
  getStudentGSTSuggestionController,
} from "../controllers/emailremainder.controllers.js";

const router = Router();

router.post("/add", requireSignIn, isAdmin, addStudentGstSuggestionController);
router.get("/", requireSignIn, isAdmin, getStudentGSTSuggestionController);

export default router;
