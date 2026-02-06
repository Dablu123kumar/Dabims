import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const FormFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "text",
      "checkbox",
      "radio",
      "select",
      "number",
      "email",
      "date",
      "datetime-local",
      "url",
      "currency",
      "textarea",
    ],
    required: true,
  },
  options: [OptionSchema],
  value: { type: mongoose.Schema.Types.Mixed },
  mandatory: { type: Boolean, default: false },
});

const FormFieldValuesStore = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    formFiledValue: [FormFieldSchema],
    addedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FormFieldValueModel = mongoose.model(
  "FormFieldValue",
  FormFieldValuesStore
);

export default FormFieldValueModel;
