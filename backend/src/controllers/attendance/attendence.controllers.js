import AttendentcModel from "../../models/attendance/attendence.model.js"
import Batch from "../../models/batch.model.js"

export const markBatchAttendence = async (req, res) => {
  try {
    const { batchId, month, year, students } = req.body

    const batchExist = await Batch.findById(batchId)
    if (!batchExist) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      })
    }

    const today = new Date()
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    // 🔐 FUTURE DATE VALIDATION
    for (const student of students) {
      if (!student.days) continue

      for (const dayKey of Object.keys(student.days)) {
        const day = Number(dayKey)
        const attendanceDate = new Date(year, month, day)

        if (attendanceDate > todayDate) {
          return res.status(400).json({
            success: false,
            message: `Cannot mark attendance for future date`,
          })
        }

        const value = student.days[dayKey]
        if (value !== 'P' && value !== 'A') {
          return res.status(400).json({
            success: false,
            message: 'Invalid attendance value',
          })
        }
      }
    }

    const attendance = await AttendentcModel.findOneAndUpdate(
      { batch: batchId, month, year },
      { batch: batchId, month, year, students },
      { upsert: true, new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Attendance Saved Successfully',
      attendance,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


export const getAttendenceByBatch = async(req,res)=>{
    try {
        const {batchId} = req.params
        const {month,year} = req.query
        if(!month || !year){
            return res.status(400).json({
                success:false,
                message : "Month and Year are required"
            })
        }
        const register = await AttendentcModel.findOne({batch:batchId,month:Number(month),year:Number(year)})
        .populate('students.student', 'name')
        .lean()
        if(!register){
            return res.status(200).json({
                success:true,
                students:[]
            })
        }
        const students = register.students.map((s)=>({
            student : s.student._id,
            name:s.student.name,
            days:s.days || {}
        }))
        
        return res.status(200).json({
            success:true,
            batch:register.batch,
            month:register.month,
            year:register.year,
            students
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required',
      })
    }

    const attendances = await AttendentcModel.find({
      'students.student': studentId,
    })
      .populate('batch', 'name')
      .populate('students.student', 'name')
      .sort({ year: 1, month: 1 })
      .lean()

    let totalPresent = 0
    let totalAbsent = 0
    let studentName = ''

    console.log('attend', attendances)

    const attendance = attendances
      .map((att) => {
        const studentEntry = att.students.find((s) => {
          const id =
            typeof s.student === 'object'
              ? s.student._id.toString()
              : s.student.toString()

          return id === studentId
        })

        if (!studentEntry) return null

        // ✅ FIX: extract days properly
        const days =
          studentEntry.days instanceof Map
            ? Object.fromEntries(studentEntry.days)
            : studentEntry.days || {}

        let present = 0
        let absent = 0

        Object.values(days).forEach((v) => {
          if (v === 'P') present++
          if (v === 'A') absent++
        })

        totalPresent += present
        totalAbsent += absent
        studentName = studentEntry.student?.name || ''

        return {
          batchId: att.batch._id,
          batchName: att.batch.name,
          year: att.year,
          month: att.month,
          monthName: new Date(att.year, att.month).toLocaleString('default', {
            month: 'long',
          }),
          present,
          absent,
          days,
        }
      })
      .filter(Boolean)

    return res.status(200).json({
      success: true,
      studentId,
      studentName,
      totalPresent,
      totalAbsent,
      attendance,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student attendance',
    })
  }
}

