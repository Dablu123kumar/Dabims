import {useState, useEffect} from 'react'
import {useBatchContext} from '../../batch/BatchContext'
import { useNavigate } from 'react-router-dom'

const StudentProgressView = ({batch, student}) => {
  const {useGetStudentProgress} = useBatchContext()
  const navigate = useNavigate()
  const {
    data: progressData,
    isLoading,
    error,
  } = useGetStudentProgress(batch._id, student.student?._id || student.student)

  const progress = progressData?.data || {}

  if (isLoading) {
    return (
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    )
  }

  if (error) {
    return <div className='alert alert-danger'>Error loading student progress</div>
  }
  //console.log('progress', progress)

  return (
    <div className='student-progress-container'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4 className='mb-0'>Student Progress</h4>
      </div>
      {/* Student Info */}
      <div className='card mb-5'>
        <div className='card-body'>
          <h5 className='card-title mb-3'>Student Information</h5>
          <div className='row'>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Name</label>
                <p className='form-control-plaintext'>{student.student?.name}</p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Email</label>
                <p className='form-control-plaintext'>{student.student?.email}</p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Phone</label>
                <p className='form-control-plaintext'>{student.student?.phone || 'NA'}</p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Current Software</label>
                <p className='form-control-plaintext'>{student.currentSoftware}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title mb-3'>Course Progress</h5>

          {progress.overallProgress !== undefined && (
            <div className='mb-5'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <span className='fw-bold'>Overall Progress</span>
                <span className='fw-bold'>{progress.overallProgress}%</span>
              </div>
              <div className='progress' style={{height: '25px'}}>
                <div
                  className='progress-bar bg-success'
                  role='progressbar'
                  style={{width: `${progress.overallProgress}%`}}
                  aria-valuenow={progress.overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {progress.overallProgress}%
                </div>
              </div>
            </div>
          )}

          {/* Subjects Progress */}
          {progress.subjects && progress.subjects.length > 0 ? (
            <div className='table-responsive'>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Start Date</th>
                    <th>Completion Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.subjects.map((subject, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{subject.subject?.subjectName || subject.subject}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            subject.status === 'completed'
                              ? 'bg-success'
                              : subject.status === 'in-progress'
                              ? 'bg-info'
                              : 'bg-warning'
                          }`}
                        >
                          {subject.status}
                        </span>
                      </td>
                      <td>
                        <div style={{width: '150px'}}>
                          <div className='progress' style={{height: '20px'}}>
                            <div
                              className='progress-bar bg-primary'
                              role='progressbar'
                              style={{width: `${subject.progress || 0}%`}}
                              aria-valuenow={subject.progress || 0}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              {subject.progress || 0}%
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {subject.startDate ? new Date(subject.startDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        {subject.completionDate
                          ? new Date(subject.completionDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <small className='text-muted'>{subject.notes || '-'}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='alert alert-info'>No subject progress recorded yet.</div>
          )}

          {/* Enrollment Info */}
          {progress.enrollmentDate && (
            <div className='mt-5 pt-5 border-top'>
              <div className='row'>
                <div className='col-md-6'>
                  <label className='form-label fw-bold'>Enrollment Date</label>
                  <p className='form-control-plaintext'>
                    {new Date(progress.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
                {progress.completionDate && (
                  <div className='col-md-6'>
                    <label className='form-label fw-bold'>Completion Date</label>
                    <p className='form-control-plaintext'>
                      {new Date(progress.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProgressView
