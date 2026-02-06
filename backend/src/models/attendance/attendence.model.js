import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema({
      batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true
    },
    month: {
      type: Number, // 0-11
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
          ref: 'Students',
          required: true
        },
        days: {
          type: Map,
          of: String, // "P" or "A"
          default: {}
        }
      }
    ]
},
{timestamps:true}
)

const AttendentcModel = mongoose.model('attedence',attendenceSchema)

export default AttendentcModel;