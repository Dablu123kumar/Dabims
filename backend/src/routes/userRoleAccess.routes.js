import { Router } from "express";
import {
  addUserRolePermissionAccessController,
  getAllUserAccessRoleDataController,
} from "../controllers/userRoleAccess.controllers.js";

const router = Router();

router
  .route("/")
  .post(addUserRolePermissionAccessController)
  .get(getAllUserAccessRoleDataController);

export default router;
