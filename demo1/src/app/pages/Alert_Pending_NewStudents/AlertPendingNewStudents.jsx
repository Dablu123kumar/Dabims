import {useParams} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import AddAlertStudentFees from './AddAlertStudentFees'
import moment from 'moment'
import {Fragment, useState} from 'react'
import ReadOnlyAlertStudentPending from './ReadOnlyAlertStudentPending.jsx'
import EditAlertStudentFees from './EditAlertStudentFees'

const AlertPendingFeesNewStudents = ({studentInfoData}) => {
  const studentCTX = useAdmissionContext()
  const params = useParams()
  const [editAlertStudentId, setEditAlertStudentId] = useState(null)

  const handleEditClick = (e, alertStudentData) => {
    e.preventDefault()
    setEditAlertStudentId(alertStudentData._id)
  }

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Create Alert Student Fees Status</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Student Name : {studentInfoData?.name}
          </span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add Alter Student Fees'
        >
          <a
            href='#'
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className=''>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    {/* <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-9-check'
                    /> */}
                  </div>
                </th>
                <th className='min-w-10px'>Sr. No.</th>
                <th className='min-w-100px'>Date </th>
                <th className='min-w-120px'>Particulars </th>
                <th className='min-w-120px'>Reminder Date & Time </th>
                <th className='min-w-120px'>Status (Pending, Done, Failed) </th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <AddAlertStudentFees />
              {studentCTX.getAlertStudentPendingFeesQuery?.data
                ?.filter((student) => student?.studentId === params?.id)
                ?.map((studentAlertData, index) => {
                  return (
                    <Fragment key={index}>
                      {studentAlertData._id === editAlertStudentId ? (
                        <EditAlertStudentFees
                          studentAlertData={studentAlertData}
                          setEditAlertStudentId={setEditAlertStudentId}
                        />
                      ) : (
                        <ReadOnlyAlertStudentPending
                          index={index}
                          studentAlertData={studentAlertData}
                          handleEditClick={handleEditClick}
                        />
                      )}
                    </Fragment>
                  )
                })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default AlertPendingFeesNewStudents
