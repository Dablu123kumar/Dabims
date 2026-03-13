import express from 'express'
import { requireSignIn } from '../middlewares/auth.middleware.js'
import { createAttendence, getAllAttendance, getAttendanceByStudentId, getAttendenceByBatch, markBatchAttendence } from '../controllers/attendance/attendence.controllers.js'

const router = express.Router()


router
.post('/',requireSignIn,markBatchAttendence)
.post('/all-stu-attendance',requireSignIn,createAttendence)
.get('/',requireSignIn,getAllAttendance)
.get('/:batchId',requireSignIn,getAttendenceByBatch)
.get('/student/:studentId',requireSignIn,getAttendanceByStudentId)



export default router