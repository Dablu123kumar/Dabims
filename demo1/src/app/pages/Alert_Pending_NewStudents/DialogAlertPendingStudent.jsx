import moment from 'moment'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {KTIcon} from '../../../_metronic/helpers'
import {useNavigate} from 'react-router-dom'

// import KTThemeMode from "../../../../src/"

const DialogAlertPendingStudent = ({setShowDialog}) => {
  // let mode = KTThemeMode.getMode();
  // console.log(mode)
  const navigate = useNavigate()

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  document.documentElement.setAttribute('data-bs-theme', themeMode)

  //console.log(themeMode)

  const studentCTX = useAdmissionContext()
  const filteredStudentsAlertData =
    studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter(
      (s) => s.Status === 'pending' && moment(s?.RemainderDateAndTime).diff(moment(), 'days') === 0
    )
  // moment(studentAlertData?.RemainderDateAndTime).diff(moment(), 'days')

  //console.log(filteredStudentsAlertData)

  return (
    <div
      className='card'
      style={{backgroundColor: themeMode === 'light' ? '#f8f9fa' : 'InfoBackground'}}
    >
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Alert Student Pending Fees</h3>
        <button
          className='modal-close'
          style={{top: '15px', right: '5px'}}
          onClick={() => setShowDialog(false)}
        >
          &times;
        </button>
        <div className='card-toolbar'></div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div
        className='card-body pt-2'
        style={{
          maxHeight: filteredStudentsAlertData?.length > 1 ? '90px' : '90px', // Adjust height based on the number of items
          overflowX: 'hidden',
          overflowY: filteredStudentsAlertData?.length > 1 ? 'scroll' : 'hidden', // Show scrollbar if more than 1 alert
        }}
      >
        {filteredStudentsAlertData?.length === 0 ? (
          <div className=''>No Pending Alert Student Available</div>
        ) : (
          <div className='mb-20'>
            {filteredStudentsAlertData?.map((studentAlertData) => {
              return (
                <div className='d-flex align-items-center mb-10' key={studentAlertData?._id}>
                  <span className='bullet bullet-vertical h-40px bg-danger'></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <a
                      onClick={() =>
                        navigate(`/profile/student/${studentAlertData?.studentId?._id}`)
                      }
                      style={{cursor: 'pointer'}}
                      className='text-gray-800 text-hover-primary fw-bold fs-6'
                    >
                      {studentAlertData?.studentId?.name}
                    </a>
                    <span className='text-muted fw-semibold d-block'>
                      {studentAlertData?.particulars}
                    </span>
                    <span className='text-muted fw-semibold d-block'>
                      Due in {moment(studentAlertData?.RemainderDateAndTime).diff(moment(), 'days')}{' '}
                      Days
                    </span>
                  </div>
                  <span className='badge badge-light-danger fs-8 fw-bold'>
                    {studentAlertData?.Status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* end::Body */}
    </div>
  )
}
export default DialogAlertPendingStudent
