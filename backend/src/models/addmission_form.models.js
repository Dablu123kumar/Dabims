import mongoose from "mongoose";
import CounterRollNumberModel from "./student-rollNumber/CounterRollNumber.model.js";

const admissionFormSchema = new mongoose.Schema(
  {
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    rollNumber: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    father_name: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    present_address: {
      type: String,
      required: true,
    },

    date_of_birth: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    student_status: {
      type: String,
    },
    education_qualification: {
      type: String,
      required: true,
    },

    select_course: {
      type: String,
      required: true,
    },
    course_fees: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    netCourseFees: {
      type: Number,
      required: true,
    },
    remainingCourseFees: {
      type: Number,
    },

    down_payment: {
      type: String,
    },
    date_of_joining: {
      type: Date,
      required: true,
    },
    installment_duration: {
      type: Date,
      required: true,
    },
    no_of_installments: {
      type: Number,
      required: true,
    },
    no_of_installments_amount: {
      type: Number,
    },
    no_of_installments_expireTimeandAmount: {
      type: Date,
    },
    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    installmentPaymentSkipMonth: {
      type: Number,
      default: 0,
    },
    skipMonthIncremented: {
      type: Boolean,
      default: false,
    },
    remainderSent: {
      type: Boolean,
      default: false,
    },
    courseduration: { type: Date, default: () => new Date() },

    dropOutStudent: {
      type: Boolean,
      default: false,
    },
    message:{
      type:String,
      
    },
    updatedBy:{
      type:String
    },
  },
  {
    timestamps: true,
  }
);

admissionFormSchema.pre("save", function (next) {
  const doc = this;
  // Check if the document is new or rollNumber is being modified
  if (doc.isNew || doc.isModified("rollNumber")) {
    // Find and increment the counter for rollNumber
    CounterRollNumberModel.findByIdAndUpdate(
      { _id: "rollNumber" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    )
      .then((counter) => {
        doc.rollNumber = counter.sequence_value + 1000;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

const admissionFormModel = mongoose.model("Students", admissionFormSchema);
export default admissionFormModel;
