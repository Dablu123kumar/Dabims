import { useEffect, useState } from 'react'
import { useAttendanceContext } from '../AttendanceContext'
import { useBatchContext } from '../../batch/BatchContext'
import { useAdmissionContext } from '../../../modules/auth/core/Addmission'

const AttendanceRegister = ({ batches, onBack }) => {
  const { saveAllStudentsAttendanceMutation, useGetAllAttendance } = useAttendanceContext()
  const { useGetBatchById } = useBatchContext()
  const ctx = useAdmissionContext()

  const today = new Date()

  const [batchId, setBatchId] = useState('')
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [register, setRegister] = useState({})
  const [search, setSearch] = useState('')

  /* -------------------------------
     DATE HELPERS
  -------------------------------- */
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const isFutureDay = (day) => new Date(year, month, day) > todayDate

  /* -------------------------------
     ALL STUDENTS (canonical source — same IDs used everywhere)
  -------------------------------- */
  const allStudents =
    ctx.studentsLists?.data?.users?.map((s) => ({ student: s })) || []

  /* -------------------------------
     BATCH — fetch only for its student ID list
  -------------------------------- */
  const { data: batchData } = useGetBatchById(batchId, { enabled: !!batchId })
  const batch = batchData?.data

  // Build a Set of student IDs that belong to the selected batch
  const batchStudentIds = batchId
    ? new Set((batch?.students || []).map((s) => String(s.student?._id || s.student)))
    : null

  /* -------------------------------
     GET ALL ATTENDANCE (GLOBAL records)
  -------------------------------- */
  const { data: allAttendanceData } = useGetAllAttendance()

  /* -------------------------------
     LOAD SAVED ATTENDANCE INTO REGISTER
  -------------------------------- */
  useEffect(() => {
    if (!allAttendanceData?.attendances) return

    const attendance = allAttendanceData.attendances.find(
      (a) => a.month === month && a.year === year && a.type === 'GLOBAL'
    )
    if (!attendance) {
      setRegister({})
      return
    }

    const temp = {}
    attendance.students.forEach((s) => {
      const normalizedDays = {}
      Object.entries(s.days || {}).forEach(([day, value]) => {
        normalizedDays[String(day)] = value
      })
      const sid = String(s.student?._id || s.student)
      temp[sid] = normalizedDays
    })
    setRegister(temp)
  }, [allAttendanceData, month, year])

  /* -------------------------------
     TOGGLE ATTENDANCE (A ↔ P)
  -------------------------------- */
  const toggleAttendance = (studentId, day) => {
    if (isFutureDay(day)) return
    setRegister((prev) => {
      const prevValue = prev?.[studentId]?.[String(day)] || 'A'
      return {
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [String(day)]: prevValue === 'A' ? 'P' : 'A',
        },
      }
    })
  }

  /* -------------------------------
     COUNT P & A
  -------------------------------- */
  const getAttendanceCount = (studentId) => {
    const daysData = register[studentId] || {}
    let present = 0
    let absent = 0
    Object.values(daysData).forEach((v) => {
      if (v === 'P') present++
      if (v === 'A') absent++
    })
    return { present, absent }
  }

  /* -------------------------------
     SAVE — always saves all students into GLOBAL record
  -------------------------------- */
  const saveAttendance = () => {
    const students = allStudents.map((item) => ({
      student: item.student._id,
      days: register[item.student._id] || {},
    }))
    saveAllStudentsAttendanceMutation.mutate({ month, year, students })
  }

  /* -------------------------------
     DAYS OF MONTH
  -------------------------------- */
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  /* -------------------------------
     FILTER STUDENTS
     - No batch: show all students
     - Batch selected: filter allStudents to only those in the batch
       (uses same student objects & IDs as the register)
  -------------------------------- */
  const studentList = batchId
    ? allStudents.filter((s) => batchStudentIds?.has(String(s.student?._id || s.student._id)))
    : allStudents

  const filteredStudents = studentList.filter((item) =>
    item.student?.name?.toLowerCase().includes(search.toLowerCase())
  )

  /* -------------------------------
     RENDER
  -------------------------------- */
  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Attendance Register</h4>
        <div>
          <button className="btn btn-light me-2" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-success"
            disabled={saveAllStudentsAttendanceMutation.isLoading}
            onClick={saveAttendance}
          >
            {saveAllStudentsAttendanceMutation.isLoading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Select Batch</label>
          <select
            className="form-select"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          >
            <option value="">-- All Students --</option>
            {batches?.data?.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Month</label>
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label fw-bold">Year</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Search Student</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      {allStudents.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-sm text-center">
            <thead className="table-light">
              <tr>
                <th className="sticky-col sticky-col-1 bg-white text-start" style={{ minWidth: 200 }}>
                  Student Name
                </th>
                {days.map((d) => (
                  <th key={d}>{d}</th>
                ))}
                <th>Total P</th>
                <th>Total A</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((item) => {
                const { present, absent } = getAttendanceCount(item.student._id)
                return (
                  <tr key={item.student._id}>
                    <td className="sticky-col sticky-col-1 bg-white text-start fw-bold">
                      {item.student.name}
                    </td>
                    {days.map((day) => {
                      const isFuture = isFutureDay(day)
                      const value = register[item.student._id]?.[String(day)] ?? 'A'
                      return (
                        <td key={day}>
                          <button
                            type="button"
                            disabled={isFuture}
                            onClick={() => toggleAttendance(item.student._id, day)}
                            className={`fw-bold border-0 w-100 ${
                              isFuture ? 'text-muted' : value === 'P' ? 'text-success' : 'text-danger'
                            }`}
                            style={{
                              height: 34,
                              cursor: isFuture ? 'not-allowed' : 'pointer',
                              background: 'transparent',
                            }}
                          >
                            {value}
                          </button>
                        </td>
                      )
                    })}
                    <td className="fw-bold text-success">{present}</td>
                    <td className="fw-bold text-danger">{absent}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AttendanceRegister