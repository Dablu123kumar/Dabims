import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCompanyController,
  getAllCompanyListsController,
  updateCompanyController,
  deleteCompanyController,
  getSingleCompanyDataController,
} from "../controllers/company.controllers.js";
import upload from "../../multer-config/storageConfig.js";

const router = Router();

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
