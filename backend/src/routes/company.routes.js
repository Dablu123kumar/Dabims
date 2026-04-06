import { Router } from "express";
import { isAdmin, isSuperAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCompanyController,
  getAllCompanyListsController,
  updateCompanyController,
  deleteCompanyController,
  getSingleCompanyDataController,
  registerCompanyController,
  getPendingCompaniesController,
  approveCompanyController,
  rejectCompanyController,
} from "../controllers/company.controllers.js";
import upload from "../../multer-config/storageConfig.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerCompanySchema, createCompanySchema } from "../validators/company.validators.js";

const router = Router();

// Public route - company self-registration (with logo upload)
router.post("/register", authLimiter, upload.single("logo"), validate(registerCompanySchema), registerCompanyController);

// SuperAdmin: pending company approval
router.get("/pending", requireSignIn, isSuperAdmin, getPendingCompaniesController);
router.patch("/:id/approve", requireSignIn, isSuperAdmin, approveCompanyController);
router.patch("/:id/reject", requireSignIn, isSuperAdmin, rejectCompanyController);

router
  .route("/")
  .post(requireSignIn, isAdmin, upload.single("logo"), createCompanyController)
  .get(requireSignIn, getAllCompanyListsController);

router
  .route("/:id")
  .get(requireSignIn, getSingleCompanyDataController)
  .put(requireSignIn, isAdmin, upload.single("logo"), updateCompanyController)
  .delete(requireSignIn, isAdmin, deleteCompanyController);

export default router;
