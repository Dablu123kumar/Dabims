import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAttendanceContext } from '../AttendanceContext'

const AttendanceOfSingleStudent = () => {
    const params = useParams()
    const id = params.id
    const { useGateAttendanceByStudentId } = useAttendanceContext()
    const {data : attendanceData} = useGateAttendanceByStudentId(id)
    //console.log('attendata',attendanceData)
    return (
    <div>
      {
        attendanceData?.attendance?.length > 0 ? (
          <div>
            {/* HEADER */}
         <div className="d-flex justify-content-between align-items-center mb-4">
           <h4>Student Attendance ({attendanceData?.studentName}) </h4>
           <button className="btn btn-light" >
               <Link to={`/profile/student/${id}`}>Back</Link>
             
           </button>
         </div>
    
         {/* SUMMARY */}
         <div className="row mb-4">
           <div className="col-md-3">
             <div className="card text-center">
               <div className="card-body">
                 <h6>Total Present</h6>
                 <h4 className="text-success fw-bold">
                   {attendanceData?.totalPresent}
                 </h4>
               </div>
             </div>
           </div>
    
           <div className="col-md-3">
             <div className="card text-center">
               <div className="card-body">
                 <h6>Total Absent</h6>
                 <h4 className="text-danger fw-bold">
                   {attendanceData?.totalAbsent}
                 </h4>
               </div>
             </div>
           </div>
         </div>
    
         {/* MONTHLY ATTENDANCE */}
         {attendanceData?.attendance.map((item, index) => {
           const days = Object.keys(item.days || {}).map(Number).sort((a, b) => a - b)
    
           return (
             <div key={index} className="card mb-4">
               <div className="card-header fw-bold">
                 {item.monthName} {item.year} — {item.batchName}
               </div>
    
               <div className="card-body table-responsive">
                 <table className="table table-bordered text-center">
                   <thead className="table-light">
                     <tr>
                       {days.map((day) => (
                         <th key={day}>Day {day}</th>
                       ))}
                       <th>Total P</th>
                       <th>Total A</th>
                     </tr>
                   </thead>
    
                   <tbody>
                     <tr>
                       {days.map((day) => {
                         const value = item.days[String(day)]
    
                         return (
                           <td
                             key={day}
                             className={`fw-bold ${
                               value === 'P'
                                 ? 'text-success'
                                 : 'text-danger'
                             }`}
                           >
                             {value}
                           </td>
                         )
                       })}
    
                       <td className="fw-bold text-success">{item.present}</td>
                       <td className="fw-bold text-danger">{item.absent}</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>
           )
         })}
          </div>

        )
        :
        (
          <div>
            <h2>Attendance not found please add!</h2>
          </div>
        )
      }
    </div>
  )
}

export default AttendanceOfSingleStudent