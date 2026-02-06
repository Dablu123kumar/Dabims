import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import { getCourseCompleteStudentsController } from "../controllers/completeCourseStudents.controllers.js";

const router = Router();

router.get("/", requireSignIn, isAdmin, getCourseCompleteStudentsController);

export default router;
