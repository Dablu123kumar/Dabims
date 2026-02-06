import {useNavigate, useParams} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCompanyContext} from '../compay/CompanyContext'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import moment from 'moment'
import {useState} from 'react'
import {useAuth} from '../../modules/auth'
import useUserRoleAccessContext from '../userRoleAccessManagement/UserRoleAccessContext'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const PendingFeesStudents = () => {
  const companyCTX = useCompanyContext()
  const studentsCTX = useAdmissionContext()
  const navigate = useNavigate()
  const {currentUser} = useAuth()
  const [searchValue, setSearchValue] = useState('')
  // console.log(searchValue)

  // console.log(studentsCTX.studentsLists.data.users)

  const params = useParams()
  //console.log(params)
  const {data} = companyCTX?.useGetSingleCompanyData(params?.id)
  //console.log(data)
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()

  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData
  const filteredStudents = studentsCTX?.studentsLists?.data?.users
    ?.filter(
      (searchStudent) =>
        searchValue?.trim() === '' ||
        searchStudent?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchStudent?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchStudent.mobile_number.includes(searchValue) ||
        searchStudent?.select_course.toLowerCase().includes(searchValue.toLowerCase())
    )
    ?.filter(
      (student) =>
        student?.companyName === data?._id &&
        student?.no_of_installments > 0 &&
        student?.dropOutStudent === false
    )

  // console.log(filteredStudents?.length)

  const dorpOutStudentHandler = (dropOutStudent, isDropOutStudent) => {
    if (!window.confirm('Are you sure do you want to drop out this student!')) {
      return
    }
    studentsCTX.updateDropOutStudentMutation.mutate({
      studentId: dropOutStudent._id,
      isDropOutStudent,
    })
  }
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{data?.companyName}</span>
          <span className='card-label fw-bold fs-3 mb-1'>Students {filteredStudents?.length}</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Pending Fees Students</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <input
            type='text'
            className='form-control'
            placeholder='search student'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* <a
            href='#'
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a> */}
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
                <th className='w-25px'>
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
                <th className='min-w-150px'>Name</th>
                <th className='min-w-140px'>Mobile</th>
                <th className='min-w-120px'>D.O.J</th>
                {userRoleAccess?.some(
                  (userAccess) =>
                    userAccess.studentControlAccess['Dropout Student'] === true &&
                    userAccess.role === currentUser?.role
                ) && <th className='min-w-120px'>Actions</th>}
                {/* <th className='min-w-100px text-end'>Actions</th>  */}
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {filteredStudents?.length === 0 ? (
                <tr>
                  <td className='text-center' colSpan={5}>
                    <h4>No Pending Fees Students Available</h4>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredStudents?.map((studentData) => (
                    <tr key={studentData?._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          {/* <input
                        className='form-check-input widget-9-check'
                        type='checkbox'
                        value='1'
                      /> */}
                        </div>
                      </td>
                      <td>
                        <div
                          className='d-flex align-items-center'
                          onClick={() => navigate(`/profile/student/${studentData?._id}`)}
                        >
                          <div className='symbol symbol-45px me-5'>
                            <img src={BASE_URL_Image + `/${studentData?.image}`} alt='' />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <div className='text-dark fw-bold text-hover-primary fs-6'>
                              {studentData?.name}
                            </div>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                              {studentData?.courseName?.courseName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td onClick={() => navigate(`/profile/student/${studentData?._id}`)}>
                        <div className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          +91 {studentData.mobile_number}
                        </div>
                        <span className=' fw-semibold  d-block fs-7'>
                          Remaining Fees :{' '}
                          {studentData['remainingCourseFees'] === undefined
                            ? 'Not Paid any fees'
                            : studentData['remainingCourseFees']}
                        </span>
                      </td>
                      <td className=''>
                        {moment(studentData?.date_of_joining).format('DD-MM-YYYY')}
                      </td>
                      {userRoleAccess?.some(
                        (userAccess) =>
                          userAccess.studentControlAccess['Dropout Student'] === true &&
                          userAccess.role === currentUser?.role
                      ) && (
                        <td>
                          <label
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            style={{cursor: 'pointer'}}
                          >
                            <input
                              className='form-check-input me-3'
                              type='checkbox'
                              value=''
                              id='drop-out-student'
                              hidden
                              onChange={(e) => dorpOutStudentHandler(studentData, e.target.checked)}
                              checked={studentData?.dropOutStudent}
                            />
                            <KTIcon iconName='dislike' className='fs-3' />
                          </label>
                        </td>
                      )}
                      {/* <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <a
                            href='#'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTIcon iconName='switch' className='fs-3' />
                          </a>
                          <a
                            href='#'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </a>
                          <a
                            href='#'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </a>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </>
              )}
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
export default PendingFeesStudents
