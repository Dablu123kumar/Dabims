import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema(
{
  type: {
    type: String,
    enum: ["BATCH", "GLOBAL"],
    default: "GLOBAL"
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    default: null
  },

  month: {
    type: Number,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
        required: true
      },

      days: {
        type: Map,
        of: {
          type: String,
          enum: ["P","A"]
        },
        default: {}
      }
    }
  ]
},
{ timestamps:true }
)

// prevent duplicates
attendenceSchema.index({ type:1, batch:1, month:1, year:1 }, { unique:true })

const AttendanceModel = mongoose.model("attendance", attendenceSchema)

export default AttendanceModel



// import mongoose from "mongoose";

// const attendenceSchema = new mongoose.Schema({
//       batch: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Batch',
//       default: null,
//       //required: true
//     },
//     month: {
//       type: Number, // 0-11
//       required: true
//     },
//     year: {
//       type: Number,
//       required: true
//     },
//     students: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Students',
//           required: true
//         },
//         days: {
//           type: Map,
//           of: String, // "P" or "A"
//           default: {}
//         }
//       }
//     ]
// },
// {timestamps:true}
// )

// const AttendentcModel = mongoose.model('attedence',attendenceSchema)

// export default AttendentcModel;