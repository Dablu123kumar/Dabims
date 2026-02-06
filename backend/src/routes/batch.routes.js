import express from "express";
import {
  createBatch,
  getBatchById,
  updateBatch,
  deleteBatch,
  updateBatchStatus,
  getPendingBatches,
  addStudentToBatch,
  removeStudentFromBatch,
  getStudentProgress,
  updateStudentSubjectStatus,
  getAllBatchesByCompany
} from "../controllers/batch.controllers.js";
import { requireSignIn, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireSignIn);

// Create a new batch
router.post("/", createBatch);

// Get all batches with filters
router.get("/company/:companyId", getAllBatchesByCompany);

// Get pending batches (Super Admin only)
router.get("/pending/all", isAdmin, getPendingBatches);

// Get batch by ID
router.get("/:id", getBatchById);

// Update batch
router.put("/:id", updateBatch);

// Update batch status (Admin only)
router.patch("/:id/status", isAdmin, updateBatchStatus);

// Delete batch
router.delete("/:id", deleteBatch);

// add student to a batch 
router.post('/:batchId/student',addStudentToBatch)

// remove or delete student from batch
router.delete('/:batchId/student/:studentId',removeStudentFromBatch)

// get student's progress in a batch
router.get('/:batchId/student/:studentId/progress',getStudentProgress)

// update student subject status
router.put('/:batchId/student/:studentId/subject/:subjectId',updateStudentSubjectStatus)

export default router; 
