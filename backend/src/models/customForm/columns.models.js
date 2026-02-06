import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    columns: [
      {
        name: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
    formFiledValue: {
      type: [mongoose.Schema.Types.Mixed],
      ref: "FormFieldValue",
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model("Column", columnSchema);

export default Column;
