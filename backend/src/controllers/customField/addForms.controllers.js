import addFormModel from "../../models/customForm/addForm.models.js";

export const addFormsController = async (req, res, next) => {
  try {
    const { formName } = req.body;

    // Check if a form with the same name already exists
    const existingForm = await addFormModel.findOne({ formName });
    // if (existingForm) {
    //   return res.status(400).json({ message: "Form already exists" });
    // }

    // Create the new form
    const newForm = await addFormModel.create(req.body);
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllAddedFormNames = async (req, res, next) => {
  try {
    const formNames = await addFormModel.find({});
    res.status(200).json(formNames);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSingleFormController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const form = await addFormModel.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editFormName = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { formName } = req.body;

    // Find the form by ID
    const form = await addFormModel.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Update the form name
    form.formName = formName || form.formName;

    // Save the updated form
    await form.save();

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSingleFormById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await addFormModel.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await form.deleteOne();
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
