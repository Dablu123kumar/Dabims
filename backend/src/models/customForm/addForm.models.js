import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "FormField" }],
  },
  {
    timestamps: true,
  }
);

const addFormModel = mongoose.model("Form", schema);

export default addFormModel;
