import batchModel from "../../models/attendance/batch.models.js";

export const addBatchFormDataController = async (req, res, next) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};

export const getAllBatchesDataController = async (req, res, next) => {
  try {
    const batches = await batchModel.find({});
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};

export const getSingleBatchByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await batchModel.findById(id);
    if (!batch) {
      return res
        .status(404)
        .json({ success: false, message: "Batch Not Found" });
    }
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};

export const updateSingleBatchDataByIdController = async (req, res, next) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};

export const deleteSingleBatchDataByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await batchModel.findByIdAndDelete(id);
    if (!batch) {
      return res
        .status(404)
        .json({ success: false, message: "Batch Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Batch Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
