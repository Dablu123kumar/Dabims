import { Router } from "express";
import {
  createCourseController,
  createCourseCategoryController,
  createCourseTypeController,
  getCourseTypeController,
  updateCourseTypeController,
  deleteCourseTypeController,
  createCourseNumberOfYearController,
  getSingleNumberOfYearsController,
  updateNumberOfYearsCourseController,
  deleteNumberOfYearsCourseController,
  getNumberOfYearsController,
  getAllCourseTypeController,
  getAllCourseCategoryController,
  getSingleCourseCategoryController,
  deleteSingleCourseCategoryController,
  updateCourseCategoryController,
  getAllCourseController,
  updateCourseController,
  getSingleCourseController,
  deleteCourseController,
} from "../controllers/course.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/categories", requireSignIn, getAllCourseCategoryController);
router.get("/courseType", requireSignIn, getAllCourseTypeController);
router.get("/numberOfYears", requireSignIn, getNumberOfYearsController);
// course start here ...
router
  .route("/")
  .post(requireSignIn, createCourseController)
  .get(requireSignIn, getAllCourseController);
router
  .route("/:id")
  .put(requireSignIn, updateCourseController)
  .get(requireSignIn, getSingleCourseController)
  .delete(requireSignIn, isAdmin, deleteCourseController);

//  Add Course Category

router
  .route("/addCategory")
  .post(requireSignIn, createCourseCategoryController);
router
  .route("/category/:id")
  .get(requireSignIn, getSingleCourseCategoryController)
  .put(requireSignIn, isAdmin, updateCourseCategoryController)
  .delete(requireSignIn, isAdmin, deleteSingleCourseCategoryController);

// Add course Type
router.route("/courseType").post(requireSignIn, createCourseTypeController);
router
  .route("/courseType/:id")
  .get(getCourseTypeController)
  .put(requireSignIn, isAdmin, updateCourseTypeController)
  .delete(requireSignIn, isAdmin, deleteCourseTypeController);

// Add Course Number of Years

router.post(
  "/numberOfYears",
  requireSignIn,
  createCourseNumberOfYearController
);
router
  .route("/numberOfYears/:id")
  .get(getSingleNumberOfYearsController)
  .put(requireSignIn, isAdmin, updateNumberOfYearsCourseController)
  .delete(requireSignIn, isAdmin, deleteNumberOfYearsCourseController);

export default router;
