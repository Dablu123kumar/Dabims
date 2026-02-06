import { useState } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import TrainerFormField from './TrainerFormField'
import { useAttendanceContext } from '../AttendanceContext'
import { useCompanyContext } from '../../compay/CompanyContext'
import { useNavigate, useParams } from 'react-router-dom'
import EditTrainer from './EditTrainer'

const BASE_URL_IMAGE = `${process.env.REACT_APP_BASE_URL}/api/images/default-image.jpg`

const TrainersList = () => {
  const [openModal, setOpenModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { getAllTrainersData, deleteTrainerDataMutation } = useAttendanceContext()
  const companyCTX = useCompanyContext()
  const navigate = useNavigate()
  const params = useParams()
  const companyId = params?.id

  const getTrainerImageUrl = (image) => {
    return image ? `${process.env.REACT_APP_BASE_URL}/api/images/${image}` : BASE_URL_IMAGE
  }

  const { data: companyInfo } = companyCTX?.useGetSingleCompanyData(companyId)

  const filteredTrainers = getAllTrainersData?.data?.filter(trainer => searchTerm.trim() === "" ||
    trainer?.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer?.trainerDesignation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer?.trainerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((company) => company.companyId === companyId)

  const deleteHandler = (trainerId) => {
    deleteTrainerDataMutation.mutate(trainerId)
  }

  const openAddTrainerModal = () => {
    setModalMode('add')
    setSelectedTrainer(null)
    setOpenModal(true)
  }

  const openEditTrainerModal = (trainer) => {
    setModalMode('edit')
    setSelectedTrainer(trainer)
    setOpenModal(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Trainers</span>
          </h3>
          <div className='search-bar'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Trainer'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='card-toolbar'>
            <button
              className='btn btn-sm btn-light-primary'
              onClick={openAddTrainerModal}
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add New Trainer
            </button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'></th>
                  <th className='min-w-150px'>Trainer's Name</th>
                  <th className='min-w-140px'>Trainer Designation</th>
                  <th className='min-w-140px'>Trainer Email</th>
                  <th className='min-w-120px'>Company</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {filteredTrainers && filteredTrainers.length > 0 ? (
                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer?._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img src={getTrainerImageUrl(trainer?.trainerImage)} alt='image' className='w-100' />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <div
                              style={{ cursor: 'pointer' }}
                              className='text-dark fw-bold text-hover-primary fs-6'
                            >
                              {trainer?.trainerName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {trainer?.trainerDesignation}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {trainer?.trainerEmail}
                        </div>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div style={{ cursor: 'pointer' }} className='d-flex flex-stack mb-2'>
                            <span className='text-muted me-2 fs-7 fw-semibold'>{companyInfo?.companyName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => openEditTrainerModal(trainer)}
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </button>
                          <button
                            onClick={() => deleteHandler(trainer?._id)}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center fw-bold text-muted">
                    No Trainer Data Found !!
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>
      <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
        {modalMode === 'add' ? (
          <TrainerFormField setOpenModal={setOpenModal} />
        ) : (
          <EditTrainer setOpenModal={setOpenModal} trainer={selectedTrainer?._id} />
        )}
      </PopUpModal>
    </>
  )
}

export default TrainersList
