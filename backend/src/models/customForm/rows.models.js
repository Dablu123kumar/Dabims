import mongoose from "mongoose";

const rowSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rows: [
      {
        id: { type: String, required: true },
        fields: { type: [mongoose.Schema.Types.Mixed], required: true }, // Adapt this to your fields structure
      },
    ],
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Row = mongoose.model("Row", rowSchema);

export default Row;
