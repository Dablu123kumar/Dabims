import { useEffect, useState } from 'react'
import { useAttendanceContext } from '../AttendanceContext'
import { useBatchContext } from '../../batch/BatchContext'

const AttendanceRegister = ({ batches, onBack }) => {
  const { saveAttendenceMutation, useGateAttendenceByBatch } =
    useAttendanceContext()
  const { useGetBatchById } = useBatchContext()

  const today = new Date()

  const [batchId, setBatchId] = useState('')
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [register, setRegister] = useState({})
  const [search, setSearch] = useState('')

  /* -------------------------------
     DATE HELPERS
  -------------------------------- */
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const isFutureDay = (day) => {
    const cellDate = new Date(year, month, day)
    return cellDate > todayDate
  }

  /* -------------------------------
     GET BATCH
  -------------------------------- */
  const { data: batchData } = useGetBatchById(batchId, {
    enabled: !!batchId,
  })

  const batch = batchData?.data

  /* -------------------------------
     GET ATTENDANCE
  -------------------------------- */
  const { data: attendanceData } = useGateAttendenceByBatch(
    batchId,
    month,
    year,
    { enabled: !!batchId }
  )

  /* -------------------------------
     LOAD SAVED ATTENDANCE
  -------------------------------- */
 
  useEffect(() => {
    if (!attendanceData?.students ) return

    const temp = {}

    attendanceData.students.forEach((s) => {
      const normalizedDays = {}

      Object.entries(s.days || {}).forEach(([day,value])=>{
        normalizedDays[String(day)] = value
      })

      temp[String(s.student)] = normalizedDays || {}
    })

    setRegister(temp)
  }, [attendanceData])

  /* -------------------------------
     RESET ON FILTER CHANGE
  -------------------------------- */
  useEffect(() => {
    if (!batchId) return
    setRegister({})
  }, [batchId, month, year])

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
     SAVE ATTENDANCE
  -------------------------------- */
  const saveAttendance = () => {
    if (!batch) return

    const students = batch.students.map((item) => ({
      student: item.student._id,
      days: register[item.student._id] || {},
    }))

    saveAttendenceMutation.mutate({
      batchId: batch._id,
      month,
      year,
      students,
    })
  }

  /* -------------------------------
     DAYS OF MONTH
  -------------------------------- */
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  /* -------------------------------
     FILTER STUDENTS
  -------------------------------- */
  const filteredStudents =
    batch?.students?.filter((item) =>
      item.student?.name?.toLowerCase().includes(search.toLowerCase())
    ) || []

  /* -------------------------------
     RENDER
  -------------------------------- */
   //console.log('attendence',attendanceData)
  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Attendance Register</h4>
        <div>
          <button className="btn btn-light me-2" onClick={onBack}>
            Back
          </button>
          {batch && (
            <button
              className="btn btn-success"
              disabled={saveAttendenceMutation.isLoading}
              onClick={saveAttendance}
            >
              {saveAttendenceMutation.isLoading
                ? 'Saving...'
                : 'Save Attendance'}
            </button>
          )}
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
            <option value="" hidden>
              -- Select Batch --
            </option>
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
                {new Date(0, i).toLocaleString('default', {
                  month: 'long',
                })}
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
      {batch && (
        <div className="table-responsive">
          <table className="table table-bordered table-sm text-center">
            <thead className="table-light">
              <tr>
                <th
                  className="sticky-col sticky-col-1 bg-white text-start"
                  style={{ minWidth: 200 }}
                >
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
                const { present, absent } = getAttendanceCount(
                  item.student._id
                )

                return (
                  <tr key={item.student._id}>
                    <td className="sticky-col sticky-col-1 bg-white text-start fw-bold">
                      {item.student.name}
                    </td>

                    {days.map((day) => {
                      const isFuture = isFutureDay(day)
                      const value =
                        register[item.student._id]?.[String(day)] ?? 'A'

                      return (
                        <td key={day}>
                          <button
                            type="button"
                            disabled={isFuture}
                            onClick={() =>
                              toggleAttendance(item.student._id, day)
                            }
                            className={`fw-bold border-0 w-100 ${
                              isFuture
                                ? 'text-muted'
                                : value === 'P'
                                ? 'text-success'
                                : 'text-danger'
                            }`}
                            style={{
                              height: 34,
                              cursor: isFuture
                                ? 'not-allowed'
                                : 'pointer',
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