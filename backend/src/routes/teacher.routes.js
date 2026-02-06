import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} from "../controllers/teacher.controllers.js";

const router = express.Router();

// Create a new teacher
router.post("/", createTeacher);

// Get all teachers
router.get("/", getAllTeachers);

// Get teacher by ID
router.get("/:id", getTeacherById);

// Update teacher
router.put("/:id", updateTeacher);

// Delete teacher
router.delete("/:id", deleteTeacher);

export default router;  