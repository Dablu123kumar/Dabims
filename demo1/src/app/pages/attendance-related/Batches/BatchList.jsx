import { useState } from 'react'
import { useBatchContext } from '../../batch/BatchContext'
import DeleteConfirmationModal from '../../../modules/auth/components/DeleteConfirmationModal'

const BatchList = ({
  batches,
  onEdit,
  onView,
  onAddStudent,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [batchToDelete, setBatchToDelete] = useState(null)
  
  const { useDeleteBatch, useUpdateBatchStatus } = useBatchContext()
  const deleteMutation = useDeleteBatch()
  const updateStatusMutation = useUpdateBatchStatus()

  const handleDeleteClick = (batch) => {
    setBatchToDelete(batch)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (batchToDelete) {
      deleteMutation.mutate(batchToDelete._id, {
        onSuccess: () => {
          setShowDeleteConfirm(false)
          setBatchToDelete(null)
        }
      })
    }
  }

  const handleStatusToggle = (batch) => {
    const newStatus = batch.status === 'inProgress' ? 'completed' : 'inProgress'
    updateStatusMutation.mutate(
      { id: batch._id, status: newStatus }
    )
  }
  console.log('batch', batches)

  return (
    <>
      <div className='table-responsive'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Trainer</th>
              <th>Time</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch._id}>
                <td>
                  <strong>{batch.name}</strong>
                </td>
                <td>{batch.trainer?.trainerName}</td>
                <td>{batch.startTime} - {batch.endTime}</td>
                <td>{new Date(batch.startDate).toLocaleDateString()}</td>
                <td>{batch.endDate ? new Date(batch.endDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className='badge bg-info'>{batch.students?.length || 0}</span>
                </td>
                <td>
                  <button
                    className={`badge ${batch.status === 'inProgress' ? 'bg-warning' : 'bg-success'}`}
                    onClick={() => handleStatusToggle(batch)}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {batch.status}
                  </button>
                </td>
                <td>
                  <div className='btn-group' role='group'>
                    <button
                      className='btn btn-sm btn-info'
                      onClick={() => onView(batch)}
                      title='View Details'
                    >
                      <i className='ki-duotone ki-eye fs-6'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                    </button>
                    <button
                      className='btn btn-sm btn-primary'
                      onClick={() => onEdit(batch)}
                      title='Edit'
                    >
                      <i className='ki-duotone ki-pencil fs-6'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                    </button>
                    <button
                      className='btn btn-sm btn-success'
                      onClick={() => onAddStudent(batch)}
                      title='Add Student'
                    >
                      <i className='ki-duotone ki-plus fs-6'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                    </button>
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDeleteClick(batch)}
                      title='Delete'
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

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        title={`Delete Batch: ${batchToDelete?.name}`}
        message={`Are you sure you want to delete the batch "${batchToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setBatchToDelete(null)
        }}
        isLoading={deleteMutation.isLoading}
      />
    </>
  )
}

export default BatchList
