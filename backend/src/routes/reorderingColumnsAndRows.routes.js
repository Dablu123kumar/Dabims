import { Router } from "express";
import {
  saveReorderedColumns,
  getColumns,
  deleteColumnsController,
} from "../controllers/customField/columns.controller.js";
import {
  saveReorderedRows,
  getRows,
  deleteRow,
} from "../controllers/customField/rows.controller.js";
import { requireSignIn } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for saving reordered columns
router
  .post("/columns/save", requireSignIn, saveReorderedColumns)
  .get("/columns", requireSignIn, getColumns);
router.route("/:id").delete(deleteColumnsController);
router
  .post("/rows/save", requireSignIn, saveReorderedRows)
  .get("/rows", requireSignIn, getRows);
router.route("/rows/:id").delete(deleteRow);
export default router;
