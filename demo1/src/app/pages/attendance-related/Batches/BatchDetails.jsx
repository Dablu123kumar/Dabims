import { useState } from 'react'
import { useBatchContext } from '../../batch/BatchContext'

const BatchDetails = ({
  batch,
  onAddStudent,
  onViewProgress,
  onUpdateSubject,
  onEdit,
  onBack
}) => {
  const [activeStudentTab, setActiveStudentTab] = useState('all')
  const { useGetBatchById,useRemoveStudentFromBatch  } = useBatchContext()
  const { data: updatedBatch } = useGetBatchById(batch._id)
  const currentBatch = updatedBatch?.data || batch
  const removeStudentMutation = useRemoveStudentFromBatch()

  //  console.log('batch',batch)
  //  console.log('updatedbatch',updatedBatch)
  const handleRemoveStudent = (studentId) => {
    if(!studentId) return;
    if (window.confirm('Are you sure you want to remove this student from the batch?')) {
      // Remove student logic will be called here
      removeStudentMutation.mutate(
        {
          batchId : currentBatch._id,
          studentId : studentId,
        },
       
      )
      // console.log('Remove student:', studentId)
    }
  }
  // currentBatch.students.map((el)=>console.log(el))
  //console.log('currentbatch',currentBatch)

  return (
    <div className='batch-details-container'>
      <div className='d-flex justify-content-between align-items-center mb-5'>
        <h3 className='m-0'>{currentBatch?.name}</h3>
        <div className='btn-group'>
          <button className='btn btn-warning' onClick={() => onEdit(currentBatch)}>
            <i className='ki-duotone ki-pencil fs-6 me-2'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
            Edit Batch
          </button>
          <button className='btn btn-secondary' onClick={onBack}>
            Back to List
          </button>
        </div>
      </div>

      {/* Batch Info Card */}
      <div className='card mb-5'>
        <div className='card-header'>
          <h5 className='card-title'>Batch Information</h5>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Batch Name</label>
                <p className='form-control-plaintext'>{currentBatch?.name}</p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Trainer</label>
                <p className='form-control-plaintext'>{currentBatch?.trainer?.trainerName}</p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Timing</label>
                <p className='form-control-plaintext'>
                  {currentBatch?.startTime} - {currentBatch?.endTime}
                </p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Start Date</label>
                <p className='form-control-plaintext'>
                  {new Date(currentBatch?.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>End Date</label>
                <p className='form-control-plaintext'>
                  {currentBatch?.endDate
                    ? new Date(currentBatch.endDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-3'>
                <label className='form-label fw-bold'>Status</label>
                <p className='form-control-plaintext'>
                  <span className={`badge ${currentBatch?.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                    {currentBatch?.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Card */}
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='card-title'>Enrolled Students ({currentBatch?.students?.length || 0})</h5>
            <button
              className='btn btn-sm btn-success'
              onClick={() => onAddStudent(currentBatch)}
            >
              <i className='ki-duotone ki-plus fs-6 me-2'>
                <span className='path1'></span>
                <span className='path2'></span>
              </i>
              Add Student
            </button>
          </div>
        </div>
        <div className='card-body'>
          {currentBatch?.students && currentBatch.students.length > 0 ? (
            <div className='table-responsive'>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Current Software</th>
                    <th>Enrollment Date</th>
                    {/* <th>Course Duration</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBatch.students.map((enrollment, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>
                          {enrollment.student?.name} 
                        </strong>
                      </td>
                      <td>{enrollment.currentSoftware}</td>
                      <td>{new Date(enrollment.student?.date_of_joining || Date.now()).toLocaleDateString()}</td>
                      <td>
                        <div className='btn-group btn-group-sm'>
                          <button
                            className='btn btn-info'
                            onClick={() => onViewProgress(currentBatch, enrollment)}
                            title='View Progress'
                          >
                            <i className='ki-duotone ki-eye fs-6'>
                              <span className='path1'></span>
                              <span className='path2'></span>
                            </i>
                          </button>
                          <button
                            className='btn btn-primary'
                            onClick={() => onUpdateSubject(currentBatch, enrollment)}
                            title='Update Subject Status'
                          >
                            <i className='ki-duotone ki-file-down fs-6'>
                              <span className='path1'></span>
                              <span className='path2'></span>
                            </i>
                          </button>
                          <button
                            className='btn btn-danger'
                            onClick={() => handleRemoveStudent(enrollment.student?._id)}
                            title='Remove Student'
                          >
                            <i className='ki-duotone ki-trash fs-6'>
                              <span className='path1'></span>
                              <span className='path2'></span>
                            </i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='alert alert-info'>
              No students enrolled in this batch yet.
              <button
                className='btn btn-link ms-2'
                onClick={() => onAddStudent(currentBatch)}
              >
                Add first student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BatchDetails
