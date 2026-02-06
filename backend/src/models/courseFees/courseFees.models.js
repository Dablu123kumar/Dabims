import mongoose from "mongoose";
import reciptNumberModel from "./reciptFees.models.js";

const courseFeesSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    netCourseFees: {
      type: Number,
      required: true,
    },

    remainingFees: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    amountDate: {
      type: String,
      //required: true,
      default: Date.now(),
    },
    no_of_installments: {
      type: Number,
    },
    no_of_installments_amount: {
      type: Number,
    },
    reciptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentOption: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentOptions",
    },
    narration: {
      type: String,
    },
    lateFees: {
      type: Number,
    },
    gst_percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// courseFeesSchema.pre("save", function (next) {
//   const doc = this;
//   // Check if the document is new or rollNumber is being modified
//   if (doc.isNew || doc.isModified("reciptNumber")) {
//     // Find and increment the counter for rollNumber
//     reciptNumberModel
//       .findByIdAndUpdate(
//         { _id: "reciptNumber" },
//         { $inc: { sequence_value: 1 } },
//         { new: true, upsert: true }
//       )
//       .then((counter) => {
//         doc.reciptNumber = counter.sequence_value + 100;
//         next();
//       })
//       .catch((err) => next(err));
//   } else {
//     next();
//   }
// });

const CourseFeesModel = mongoose.model("CourseFees", courseFeesSchema);
export default CourseFeesModel;
