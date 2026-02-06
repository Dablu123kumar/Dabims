import asyncHandler from '../middlewares/asyncHandler.js';
import BatchCategory from '../models/batchCategory.model.js';

// Get all batch categories
export const getAllBatchCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BatchCategory.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories,
      message: 'Batch categories fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching batch categories',
      error: error.message
    });
  }
});

// Create a new batch category
export const createBatchCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await BatchCategory.findOne({ 
      categoryName: categoryName.trim() 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const newCategory = new BatchCategory({
      categoryName: categoryName.trim()
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      data: savedCategory,
      message: 'Batch category created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating batch category',
      error: error.message
    });
  }
});

// Update a batch category
export const updateBatchCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category exists
    const existingCategory = await BatchCategory.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Batch category not found'
      });
    }

    // Check if new name already exists (excluding current category)
    const duplicateCategory = await BatchCategory.findOne({
      categoryName: categoryName.trim(),
      _id: { $ne: id }
    });

    if (duplicateCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const updatedCategory = await BatchCategory.findByIdAndUpdate(
      id,
      { categoryName: categoryName.trim() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Batch category updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating batch category',
      error: error.message
    });
  }
});

// Delete a batch category
export const deleteBatchCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BatchCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Batch category not found'
      });
    }

    await BatchCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Batch category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting batch category',
      error: error.message
    });
  }
});

// Get a single batch category
export const getBatchCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BatchCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Batch category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      message: 'Batch category fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching batch category',
      error: error.message
    });
  }
}); 