import {useParams} from 'react-router-dom'
import {KTIcon} from '../../../../_metronic/helpers'
import {useCompanyContext} from '../../compay/CompanyContext'
import {useState} from 'react'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import TimingFields from './TimingFields'
import EditTimings from './EditTimings'
import {useAttendanceContext} from '../AttendanceContext'

const Timings = () => {
  const [openModal, setOpenModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedBatchTime, setSelectedBatchTime] = useState(null)
  const {getAllBatchTimings, deleteBatchTimeMutation} = useAttendanceContext()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id
  const {data: companyInfo} = companyCTX?.useGetSingleCompanyData(companyId)

  const openAddTimingModal = () => {
    setModalMode('add')
    setSelectedBatchTime(null)
    setOpenModal(true)
  }

  const openEditTimingModal = (batchTime) => {
    setModalMode('edit')
    setSelectedBatchTime(batchTime)
    setOpenModal(true)
  }

  const filteredBatchTimings = getAllBatchTimings?.data?.filter(
    (company) => company.companyId === companyId
  )

  const deleteHandler = (batchTimeId) => {
    deleteBatchTimeMutation.mutate(batchTimeId)
  }

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Add Batch Timings</span>
          </h3>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <a href='#' className='btn btn-sm btn-light-primary' onClick={openAddTimingModal}>
              <KTIcon iconName='plus' className='fs-3' />
              Add Timings
            </a>
          </div>
        </div>

        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='1'
                        data-kt-check='true'
                        data-kt-check-target='.widget-9-check'
                      />
                    </div>
                  </th>
                  <th className='min-w-150px'>Start Time</th>
                  <th className='min-w-140px'>End Time</th>
                  <th className='min-w-120px'>Company</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatchTimings?.length > 0 ? (
                  filteredBatchTimings.map((time) => (
                    <tr key={time._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                              {time?.startTime}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {time.endTime}
                        </a>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div className='d-flex flex-stack mb-2'>
                            <span className='text-muted me-2 fs-7 fw-semibold'>
                              {companyInfo?.companyName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <a
                            href='#'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => openEditTimingModal(time)}
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </a>
                          <a
                            href='#'
                            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                            onClick={() => deleteHandler(time?._id)}
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5' className='text-center fw-bold text-muted'>
                      No Batch Timings Found !!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
        {modalMode === 'add' ? (
          <TimingFields setOpenModal={setOpenModal} />
        ) : (
          <EditTimings selectedBatchTime={selectedBatchTime} setOpenModal={setOpenModal} />
        )}
      </PopUpModal>
    </>
  )
}

export default Timings
