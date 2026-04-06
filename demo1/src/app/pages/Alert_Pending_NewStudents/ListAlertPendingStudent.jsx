import moment from 'moment'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useNavigate} from 'react-router-dom'
import {useCompanyContext} from '../compay/CompanyContext'
import {useAuth} from '../../modules/auth'

const ListAlertPendingStudent = () => {
  const navigate = useNavigate()
  const studentCTX = useAdmissionContext()
  const {selectedCompany} = useCompanyContext()
  const {currentUser} = useAuth()
  const filteredStudentsAlertData =
    studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter((s) => {
      if (s.Status !== 'pending') return false
      if (!selectedCompany?._id) return true
      if (currentUser?.role === 'SuperAdmin') return !s?.companyId || s.companyId === selectedCompany._id
      return s?.companyId === selectedCompany._id
    })

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Alert Student Pending Fees</h3>
        <div className='card-toolbar'></div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div
        className='card-body pt-2'
        style={{
          maxHeight: filteredStudentsAlertData?.length > 2 ? 'auto' : 'auto', // Adjust height for multiple students
          minHeight: filteredStudentsAlertData?.length === 0 ? '145px' : 'auto', // Ensures full space when no students
          overflowY: filteredStudentsAlertData?.length > 2 ? 'auto' : 'hidden', // Enable scroll if needed
          overflowX: 'hidden',
        }}
      >
        {filteredStudentsAlertData?.length === 0 ? (
          <div className=''>No Pending Alert Student Available</div>
        ) : (
          <>
            {filteredStudentsAlertData?.map((studentAlertData) => {
              return (
                <div className='d-flex align-items-center mb-8' key={studentAlertData?._id}>
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
          </>
        )}
        {/* end:Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default ListAlertPendingStudent
