import selectDefaultModel from "../../models/customForm/selectDefaultField.models.js";

export const addDefaultSelectController = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { selectName, options, mandatory } = req.body;
    const newDefaultSelect = await selectDefaultModel.findOne({ selectName });
    if (newDefaultSelect) {
      return res
        .status(400)
        .json({ success: false, message: "Select Name already exists" });
    }
    const newDefaultSelectPost = await selectDefaultModel.create(req.body);
    res.json({ success: true, newDefaultSelectPost });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server ${error} !!` });
  }
};

export const getAllDefaultSelectController = async (req, res, next) => {
  try {
    const defaultSelects = await selectDefaultModel.find({});
    res.json({ success: true, defaultSelects });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getSingleDefaultSelectByIdController = async (req, res, next) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const defaultSelect = await selectDefaultModel.findById(id);
    if (!defaultSelect) {
      return res
        .status(404)
        .json({ success: false, message: "Default Select not found" });
    }
    res.json({ success: true, defaultSelect });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateSingleDefaultSelectController = async (req, res, next) => {
  try {
    // console.log("Request Body:", req.body);

    // No need to destructure as an array, just access the object
    const { selectName, options, mandatory } = req.body.data;

    // Log destructured values
    // console.log("Destructured Values:", { selectName, options, mandatory });

    // Use the ID from params
    const { id } = req.params;

    // Find the document by ID
    const updateDefaultSelect = await selectDefaultModel.findById(id);
    if (!updateDefaultSelect) {
      return res
        .status(404)
        .json({ success: false, message: "Default Select not found" });
    }

    // Update fields
    updateDefaultSelect.selectName =
      selectName || updateDefaultSelect.selectName;
    if (options !== undefined) {
      updateDefaultSelect.options = options;
    }
    if (mandatory !== undefined) {
      updateDefaultSelect.mandatory = mandatory;
    }

    // Save the updated document
    await updateDefaultSelect.save();

    // Respond with success
    res.json({
      success: true,
      message: "Default Select updated Successfully",
      updateDefaultSelect,
    });
  } catch (error) {
    // Log the error and respond with failure
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
