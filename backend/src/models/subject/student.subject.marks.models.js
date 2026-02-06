import mongoose from "mongoose";


const studentSubjectMarksSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },

        theory: {
          type: Number,
          default: null, // null = not added yet
        },

        practical: {
          type: Number,
          default: null,
        },

        totalMarks: {
          type: Number,
          default: null,
        },

        isActive: {
          type: Boolean,
          default: true, // subject assigned or not
        },
      },
    ],

    resultStatus: {
      type: String,
      enum: ["NotStarted", "InProgress", "Completed"],
      default: "NotStarted",
    },
  },
  { timestamps: true }
);

const studentSubjectMarksModel =  mongoose.model(
  "StudentSubjectMarks",
  studentSubjectMarksSchema
);
export default studentSubjectMarksModel

// const studentSubjectMarksSchema = new mongoose.Schema(
//   {
//     studentInfo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Students",
//       required: true,
//     },
//     Subjects: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: true,
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     companyName: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//     theory: {
//       type: Number,
//       default: 0,
//     },
//     practical: {
//       type: Number,
//       default: 0,
//     },
//     subjects:[
//       {
//        type: Map,
//        of: Boolean,
//      },

//     ],
//     totalMarks: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );
// const studentSubjectMarksModel = mongoose.model(
//   "StudentSubjectMarks",
//   studentSubjectMarksSchema
// );
// export default studentSubjectMarksModel;
