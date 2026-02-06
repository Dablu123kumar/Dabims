import express from 'express'
import { requireSignIn } from '../middlewares/auth.middleware.js'
import { getAttendanceByStudentId, getAttendenceByBatch, markBatchAttendence } from '../controllers/attendance/attendence.controllers.js'

const router = express.Router()


router
.post('/',requireSignIn,markBatchAttendence)
.get('/:batchId',requireSignIn,getAttendenceByBatch)
.get('/student/:studentId',requireSignIn,getAttendanceByStudentId)



export default router