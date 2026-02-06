import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBatchContext } from '../../batch/BatchContext'
import BatchList from './BatchList'
import CreateBatchForm from './CreateBatchForm'
import BatchDetails from './BatchDetails'
import AddStudentToBatchForm from './AddStudentToBatchForm'
import StudentProgressView from './StudentProgressView'
import './batch-management.css'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import UpdateSubjectStatusForm from './UpdateSubjectStatusForm'
import BatchReport from './BatchReport'
import AttendanceRegister from './Attendence'

const BatchManagement = () => {
  const { id: companyId } = useParams()
  console.log('companyId',companyId)
  const [activeTab, setActiveTab] = useState('list') // list, create, details, addStudent, progress, report
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // create, edit, addStudent, viewProgress, updateSubject
  const [searchTerm, setSearchTerm] = useState('')

  const { useGetALLbatches } = useBatchContext()
  const { data: batches, isLoading, error } = useGetALLbatches({},companyId)

  const handleCreateBatch = () => {
    setModalType('create')
    setSelectedBatch(null)
    setShowModal(true)
  }

  const handleEditBatch = (batch) => {
    setSelectedBatch(batch)
    setModalType('edit')
    setShowModal(true)
  }

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch)
    setActiveTab('details')
  }

  const handleViewReport = (batch) => {
    // setSelectedBatch(batch)
    setActiveTab('report')
  }
  const handleAttendance = (batch) => {
    // setSelectedBatch(batch)
    setActiveTab('attendance')
  }

  const handleAddStudent = (batch) => {
    setSelectedBatch(batch)
    setModalType('addStudent')
    setShowModal(true)
  }

  const handleViewStudentProgress = (batch, student) => {
    setSelectedBatch(batch)
    setSelectedStudent(student)
    setModalType('viewProgress')
    setShowModal(true)
  }

  const handleUpdateSubjectStatus = (batch, student) => {
    setSelectedBatch(batch)
    setSelectedStudent(student)
    setModalType('updateSubject')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalType('')
    // setSelectedBatch(null)
    setSelectedStudent(null)
  }

  const filteredBatches = batches?.data?.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.trainer?.trainerName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className='batch-management-container'>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Batch Management</h3>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className='card-body'>
          <div className='nav nav-tabs' role='tablist'>
            <button
              className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              All Batches
            </button>
            <button
              className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
              disabled={!selectedBatch}
            >
              Batch Details
            </button>
            <button
              className={`nav-link ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => setActiveTab('report')}
              // disabled={!selectedBatch}
            >
              Batch Report
            </button>
            <button
              className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              // disabled={!selectedBatch}
            >
              Attendance
            </button>
          </div>

          {/* Tab Content */}
          <div className='tab-content mt-5'>
            {activeTab === 'list' && (
              <div>
                <div className='row mb-5'>
                  <div className='col-md-8'>
                    <input
                      type='text'
                      className='form-control form-control-lg'
                      placeholder='Search by batch name or trainer...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className='col-md-4 text-end'>
                    <button
                      className='btn btn-primary'
                      onClick={handleCreateBatch}
                    >
                      <i className='ki-duotone ki-plus fs-2'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                      Create New Batch
                    </button>
                  </div>
                </div>

                {isLoading && <div className='spinner-border' role='status'><span className='visually-hidden'>Loading...</span></div>}
                {error && <div className='alert alert-danger'>Error loading batches</div>}

                {filteredBatches.length > 0 ? (
                  <BatchList
                    batches={filteredBatches}
                    onEdit={handleEditBatch}
                    onView={handleViewBatch}
                    onAddStudent={handleAddStudent}
                    onDelete={(batch) => {
                      setSelectedBatch(batch)
                      setModalType('deleteBatch')
                      setShowModal(true)
                    }}
                  />
                ) : (
                  <div className='alert alert-info'>No batches found</div>
                )}
              </div>
            )}

            {activeTab === 'details' && selectedBatch && (
              <BatchDetails
                batch={selectedBatch}
                onAddStudent={handleAddStudent}
                onViewProgress={handleViewStudentProgress}
                onUpdateSubject={handleUpdateSubjectStatus}
                onEdit={handleEditBatch}
                onBack={() => {
                  setActiveTab('list')
                  setSelectedBatch(null)
                }}
                onViewReport={handleViewReport}
              />
            )}

            {activeTab === 'report' &&  (
              <BatchReport
                batches={batches}
                onBack={() => {
                  setActiveTab('list')
                  setSelectedBatch(null)
                }}
              />
            )}
            {activeTab === 'attendance' &&  (
              <AttendanceRegister
                batches={batches}
                onBack={() => {
                  setActiveTab('list')
                  setSelectedBatch(null)
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PopUpModal
        show={showModal && modalType === 'create'}
        handleClose={handleCloseModal}
        title='Create New Batch'
      >
        <CreateBatchForm
          companyId={companyId}
          onSuccess={handleCloseModal}
        />
      </PopUpModal>

      <PopUpModal
        show={showModal && modalType === 'edit'}
        handleClose={handleCloseModal}
        title='Edit Batch'
      >
        <CreateBatchForm
          batch={selectedBatch}
          companyId={companyId}
          isEdit={true}
          onSuccess={handleCloseModal}
        />
      </PopUpModal>

      <PopUpModal
        show={showModal && modalType === 'addStudent'}
        handleClose={handleCloseModal}
        title='Add Student to Batch'
      >
        <AddStudentToBatchForm
          batch={selectedBatch}
          onSuccess={handleCloseModal}
        />
      </PopUpModal>

      <PopUpModal
        show={showModal && modalType === 'viewProgress'}
        handleClose={handleCloseModal}
        title={`Student Progress - ${selectedStudent?.student?.firstName}`}
      >
        <StudentProgressView
          batch={selectedBatch}
          student={selectedStudent}
        />
      </PopUpModal>

      <PopUpModal
        show={showModal && modalType === 'updateSubject'}
        handleClose={handleCloseModal}
        title='Update Subject Status'
      >
        <UpdateSubjectStatusForm
          batch={selectedBatch}
          student={selectedStudent}
          onSuccess={handleCloseModal}
        />
      </PopUpModal>
    </div>
  )
}

export default BatchManagement
