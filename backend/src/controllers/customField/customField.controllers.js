import customFieldModel from "../../models/customForm/customForm.models.js";

export const addCustomFieldController = async (req, res, next) => {
  // console.log(req.body);
  try {
    const {
      type,
      name,
      value,
      selectValue,
      mandatory,
      quickCreate,
      keyField,
      headerView,
      options,
      companyName,
      formId,
    } = req.body;
    const customField = new customFieldModel({
      type,
      name,
      value: type === "checkbox" ? value[0] : value,
      selectValue,
      mandatory,
      quickCreate,
      keyField,
      headerView,
      options,
      companyName,
      formId,
    });
    await customField.save();
    res.status(200).json({ success: true, message: "added custom form" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCustomFieldController = async (req, res, next) => {
  try {
    const allfields = await customFieldModel.find({});
    res.status(200).json(allfields);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleFieldById = async (req, res, next) => {
  try {
    // console.log("single", req.params);
    // console.log("single", req.body);
    const { id } = req.params;
    const customField = await customFieldModel.findById(id);
    if (!customField) {
      res
        .status(404)
        .json({ success: false, message: "Custom Field not found !!" });
    }

    // console.log("Options:", customField.options);

    res.status(200).json({ success: true, customField });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error!!" });
  }
};

export const updateCustomFieldController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, name, value, mandatory, options } = req.body.fields;
    // console.log(req.body.fields);

    // Find the existing custom field
    const customField = await customFieldModel.findById(id);
    if (!customField) {
      return res
        .status(404)
        .json({ success: false, message: "Custom Field not found" });
    }

    // Update the custom field properties
    customField.type = type || customField.type;
    customField.name = name || customField.name;
    customField.value = value || customField.value;
    // console.log(mandatory);
    // console.log(customField.mandatory);
    customField.mandatory = mandatory || customField.mandatory;

    // Update options if provided
    if (options !== undefined) {
      customField.options = options;
    }

    // Save the updated custom field
    await customField.save();

    res
      .status(200)
      .json({ success: true, message: "Field Updated Successfully" });
  } catch (error) {
    console.error("Error updating field:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSingleFieldById = async (req, res, next) => {
  try {
    // console.log(req.params);
    const id = req.params.id;
    const field = await customFieldModel.findByIdAndDelete(id);
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "field not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Field Has Been Deleted !!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
