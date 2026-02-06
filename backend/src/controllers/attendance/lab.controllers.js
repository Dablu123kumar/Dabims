import labModel from "../../models/attendance/lab.models.js";

export const addLabDataController = async (req, res, next) => {
  try {
    const { labName, companyId } = req.body;
    const labExist = await labModel.findOne({ labName });

    if (labExist) {
      return res.status(400).json({ message: "Lab already exists" });
    }

    const newLab = new labModel({ labName, companyId });
    await newLab.save();

    res.status(201).json({
      success: true,
      message: `Lab has been created successfully!`,
      lab: newLab,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
    });
  }
};

export const getAllLabsDataController = async (req, res, next) => {
  try {
    const labs = await labModel.find({});
    res.status(200).json(labs);
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
export const getSingleLabDataController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lab = await labModel.findById(id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    res.status(200).json(lab);
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
export const updateSingleLabDataController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { labName } = req.body;
    // console.log(labName);
    const lab = await labModel.findById(id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    lab.labName = labName || lab.labName;
    await lab.save();
    res.status(200).json({
      success: true,
      message: "Lab Name Has Been Successfully Updated !!",
      lab: lab,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
export const deleteSingleLabDataById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await labModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Lab Has Been Successfully Deleted !!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
