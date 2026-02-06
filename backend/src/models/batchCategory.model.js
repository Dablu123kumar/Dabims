import mongoose from "mongoose";

const batchCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

const BatchCategory = mongoose.model('BatchCategory', batchCategorySchema);

export default BatchCategory; 