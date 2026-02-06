import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
  },
  subjects: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      status: {
        type: String,
        enum: ["notStarted", "inProgress", "completed"],
        default: "notStarted",
      },

      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      startDate: {
        type: Date,
      },

      completionDate: {
        type: Date,
      },

      notes: {
        type: String,
        trim: true,
      },
    },
  ],
  currentSoftware: {
    type: String,
    trim: true,
  },
});

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    courseCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
     
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainers",
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["completed", "inProgress"],
      default: "inProgress",
    },
    students: [studentSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
batchSchema.index({ trainer: 1, startTime: 1, endTime: 1 });

// Add method to check if student exists in batch
batchSchema.methods.hasStudent = function (studentId) {
  return this.students.some((s) => s.student.toString() === studentId);
};

// Add method to get student details
batchSchema.methods.getStudentDetails = function (studentId) {
  return this.students.find((s) => s.student.toString() === studentId);
};

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
