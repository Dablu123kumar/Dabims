import timingModal from "../../models/attendance/timing.models.js";

export const addTimingController = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { startTime, endTime, companyId } = req.body;
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: " startTime and endTime are required" });
    }
    const timing = new timingModal({ startTime, endTime, companyId });
    await timing.save();
    res
      .status(201)
      .json({ success: true, message: "Timing added successfully", timing });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};

export const getAllTimingController = async (req, res, next) => {
  try {
    const timings = await timingModal.find({});
    res.status(200).json(timings);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};
export const getSingleTimingByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timing = await timingModal.findById(id);
    if (!timing) {
      res.status(404).json({ success: false, message: "Timing Not Found !!" });
    }
    res.status(200).json({ success: true, timing });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateTimingByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(req.body);
    const { startTime, endTime, companyId } = req.body;
    const timing = await timingModal.findById(id);
    if (!timing) {
      res.status(404).json({ success: false, message: "Timing Not Found !!" });
    }
    timing.startTime = startTime || timing.startTime;
    timing.endTime = endTime || timing.endTime;

    await timing.save();
    res.status(200).json({ success: true, timing });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const deleteSingleTimingByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timing = await timingModal.findByIdAndDelete(id);
    if (!timing) {
      res.status(404).json({ success: false, message: "Timing Not Found !!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Timing deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};
