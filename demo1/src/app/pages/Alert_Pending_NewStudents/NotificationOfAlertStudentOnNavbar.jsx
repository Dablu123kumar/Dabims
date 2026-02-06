import moment from 'moment'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useNavigate} from 'react-router-dom'

const NotificationOfAlertStudentOnNavbar = () => {
  const studentCTX = useAdmissionContext()
  const navigate = useNavigate()
  const filteredStudentsAlertData =
    studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter(
      (s) => s.Status === 'pending'
    )

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <div
      style={{
        maxHeight: '180px', // Adjust height to show 4-5 items
        overflowY: 'auto', // Enable vertical scroll
        overflowX: 'hidden', // Disable horizontal scroll
        padding: '10px', // Add padding for aesthetics
        backgroundColor: '#fff', // Ensure consistent background
        background: themeMode === 'dark' ? 'black' : '#fff',
      }}
    >
      {filteredStudentsAlertData?.length === 0 ? (
        <div className=''>No Pending Alert Student Available</div>
      ) : (
        filteredStudentsAlertData?.map((studentAlertData) => {
          return (
            <div className='d-flex align-items-center mb-8' key={studentAlertData?._id}>
              <span className='bullet bullet-vertical h-20px bg-danger mx-2'></span>
              <div className='form-check form-check-custom form-check-solid mx-0'></div>
              <div className='flex-grow-1'>
                <a
                  onClick={() => navigate(`/profile/student/${studentAlertData?.studentId?._id}`)}
                  style={{cursor: 'pointer'}}
                  className='text-gray-800 text-hover-primary fw-bold fs-7'
                >
                  {studentAlertData?.studentId?.name}
                </a>
              </div>
              <span className='badge badge-light-danger fs-8 fw-bold mx-4'>
                {studentAlertData?.Status}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default NotificationOfAlertStudentOnNavbar
