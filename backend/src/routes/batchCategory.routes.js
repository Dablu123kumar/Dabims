import express from 'express';
import {
  getAllBatchCategories,
  createBatchCategory,
  updateBatchCategory,
  deleteBatchCategory,
  getBatchCategoryById
} from '../controllers/batchCategory.controllers.js';
import { requireSignIn } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireSignIn);

// Get all batch categories
router.get('/', getAllBatchCategories);

// Get a single batch category
router.get('/:id', getBatchCategoryById);

// Create a new batch category
router.post('/', createBatchCategory);

// Update a batch category
router.put('/:id', updateBatchCategory);

// Delete a batch category
router.delete('/:id', deleteBatchCategory);

export default router; 