import mongoose from "mongoose";
import FormFieldValueModel from "../models/customForm/formField.models.js";

const transformRequestBody = (requestBody) => {
  const formId = requestBody.formId;

  const transformedData = Object.keys(requestBody)
    .filter((key) => key !== "formId" && key !== "0") // Exclude formId and any irrelevant keys
    .map((key) => {
      const field = requestBody[key];

      return {
        formId,
        name: key,
        type: field.type || "text", // Default to 'text' if no type is provided
        value: field.newValue === undefined ? field : field.newValue, // Use field.newValue if available, otherwise field itself
      };
    });

  return { formFieldValues: transformedData, formId };
};

export const submitFormController = async (req, res) => {
  try {
    // Transform the incoming request body data
    // console.log(req.user.fName);
    const formattedData = transformRequestBody(req.body);

    // Create and save the new form field values
    const newFormFieldValuesData = new FormFieldValueModel({
      formId: formattedData.formId,
      companyId: req.body.companyId,
      formFiledValue: formattedData.formFieldValues,
      addedBy: req.user.fName,
    });
    await newFormFieldValuesData.save();

    // Find the existing row data based on formId and companyId
    let rowDataExists = await Row.findOne({
      formId: req.body.formId,
      companyId: req.body.companyId,
    });

    // If no row data exists, create a new one
    if (!rowDataExists) {
      rowDataExists = new Row({
        formId: req.body.formId,
        companyId: req.body.companyId,
        rows: [],
      });
    }

    // Iterate over the formatted data and update or add new fields to rows
    formattedData.formFieldValues.forEach((fieldValue, index) => {
      let existingRow = rowDataExists.rows.find(
        (row) => row.id === fieldValue.id
      );

      // If the row does not exist, create a new row and add it
      if (!existingRow) {
        existingRow = {
          id: fieldValue.id || new mongoose.Types.ObjectId(), // Generate an ID if not present
          fields: [],
        };
        rowDataExists.rows.push(existingRow);
      }

      // Find the existing field in the row
      const existingField = existingRow.fields.find(
        (field) => field.name.toLowerCase() === fieldValue.name.toLowerCase()
      );

      // If the field exists, update it; otherwise, add the new field
      if (existingField) {
        existingField.type = fieldValue.type;
        existingField.value = fieldValue.value;
      } else {
        existingRow.fields.push({
          name: fieldValue.name,
          type: fieldValue.type,
          value: fieldValue.value,
        });
      }
    });

    // Save the updated row data to the database
    await rowDataExists.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Form data and rows updated successfully",
    });
  } catch (error) {
    // Handle any errors and send a failure response
    res.status(500).json({ success: false, error: error.message });
  }
};

export const submitUserFormController = async (req, res) => {
  try {
    // Transform the incoming request body data
    // console.log(req.user.fName);
    const formattedData = transformRequestBody(req.body);

    // Create and save the new form field values
    const newFormFieldValuesData = new FormFieldValueModel({
      formId: formattedData.formId,
      companyId: req.body.companyId,
      formFiledValue: formattedData.formFieldValues,
      addedBy: "Form",
    });
    await newFormFieldValuesData.save();

    // Find the existing row data based on formId and companyId
    let rowDataExists = await Row.findOne({
      formId: req.body.formId,
      companyId: req.body.companyId,
    });

    // If no row data exists, create a new one
    if (!rowDataExists) {
      rowDataExists = new Row({
        formId: req.body.formId,
        companyId: req.body.companyId,
        rows: [],
      });
    }

    // Iterate over the formatted data and update or add new fields to rows
    formattedData.formFieldValues.forEach((fieldValue, index) => {
      let existingRow = rowDataExists.rows.find(
        (row) => row.id === fieldValue.id
      );

      // If the row does not exist, create a new row and add it
      if (!existingRow) {
        existingRow = {
          id: fieldValue.id || new mongoose.Types.ObjectId(), // Generate an ID if not present
          fields: [],
        };
        rowDataExists.rows.push(existingRow);
      }

      // Find the existing field in the row
      const existingField = existingRow.fields.find(
        (field) => field.name.toLowerCase() === fieldValue.name.toLowerCase()
      );

      // If the field exists, update it; otherwise, add the new field
      if (existingField) {
        existingField.type = fieldValue.type;
        existingField.value = fieldValue.value;
      } else {
        existingRow.fields.push({
          name: fieldValue.name,
          type: fieldValue.type,
          value: fieldValue.value,
        });
      }
    });

    // Save the updated row data to the database
    await rowDataExists.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Form data and rows updated successfully",
    });
  } catch (error) {
    // Handle any errors and send a failure response
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSubmitFormData = async (req, res, next) => {
  // console.log(req.body);
  try {
    const formFieldValues = await FormFieldValueModel.find({});
    res.status(200).json({ success: true, formFieldValues });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const deleteSingleFormDataController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the form data by its ID
    const formData = await FormFieldValueModel.findById(id);
    if (!formData) {
      return res
        .status(404)
        .json({ success: false, message: "Form data not found" });
    }

    // Delete the form data
    await formData.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Form data deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getSingleFormDataValueByIdController = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.params);
  try {
    const { id } = req.params;
    const formFieldValues = await FormFieldValueModel.findById(id);
    if (!formFieldValues) {
      return res
        .status(404)
        .json({ success: false, message: "Form data not found" });
    }
    res.status(200).json(formFieldValues);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateSingleFormDataValueController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { formFieldValues } = req.body;
    // console.log(req.body);
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    // Find the existing form field values data
    const existingFormFieldValuesData = await FormFieldValueModel.findById(id);
    if (!existingFormFieldValuesData) {
      return res
        .status(404)
        .json({ success: false, message: "Form Field Data not found !!" });
    }

    // Ensure formFieldValues is an array
    if (!Array.isArray(formFieldValues)) {
      return res.status(400).json({
        success: false,
        message: "formFieldValues should be an array",
      });
    }

    // Update the fields
    existingFormFieldValuesData.formFiledValue =
      existingFormFieldValuesData.formFiledValue.map((field) => {
        const updatedField = formFieldValues.find((f) => f.name === field.name);
        if (updatedField) {
          // Update field with new values
          return { ...field, value: updatedField.value };
        }
        return field;
      });
    let leadSource = formFieldValues.find((f) => f.name === "Lead Source");
    let leadStatus = formFieldValues.find((f) => f.name === "Lead Status");
    // console.log(leadSource);
    // console.log(existingFormFieldValuesData);
    // console.log(leadStatus);
    if (leadSource) {
      existingFormFieldValuesData.formFiledValue.push({
        name: leadSource.name,
        type: "select",
        value: leadSource.value,
      });
    }
    if (leadStatus) {
      existingFormFieldValuesData.formFiledValue.push({
        name: leadStatus.name,
        type: "select",
        value: leadStatus.value,
      });
    }

    // Save the updated document
    await existingFormFieldValuesData.save();

    res.status(200).json({ success: true, data: existingFormFieldValuesData });
  } catch (error) {
    console.error("Error updating form data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
