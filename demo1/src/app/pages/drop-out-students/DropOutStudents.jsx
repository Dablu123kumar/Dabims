import {useNavigate, useParams} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCompanyContext} from '../compay/CompanyContext'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import moment from 'moment'
import {useState} from 'react'
import useUserRoleAccessContext from '../userRoleAccessManagement/UserRoleAccessContext'
import {useAuth} from '../../modules/auth'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`
const DropOutStudents = () => {
  const params = useParams()
  const {currentUser} = useAuth()
  //console.log(params.id)
  const companyCTX = useCompanyContext()
  const ctx = useAdmissionContext()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(params?.id)
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()

  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData
  const filteredStudents = ctx.studentsLists?.data?.users.filter(
    (st) => st.companyName === params.id && st.dropOutStudent === true
  )
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const searchValueHandler = (value) => {
    setSearchValue(value)
    //console.log(value)
  }
  const dorpOutStudentHandler = (dropOutStudent, isDropOutStudent) => {
    if (!window.confirm('Are you sure do you want to drop out this student!')) {
      return
    }
    ctx.updateDropOutStudentMutation.mutate({studentId: dropOutStudent._id, isDropOutStudent})
  }

  const studentDeleteHandler = (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }
    ctx.deleteStudentMutation.mutateAsync(studentId)
  }

  //console.log(filteredStudents)
  return (
    <div className={`card `}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{singleComapnyData?.companyName}</span>
          <span className='mt-1 fw-semibold fs-7'>
            Drop Out Students {filteredStudents?.length}
          </span>
        </h3>
        <div className='search-bar'>
          <input
            type='text'
            value={searchValue}
            onChange={(e) => searchValueHandler(e.target.value)}
            className='form-control'
            placeholder='Search Student'
          />
        </div>
        {/* <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
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
        </div> */}
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
                <th className='min-w-140px'>Mobile Number</th>
                <th className='min-w-120px'>D.O.J</th>
                {userRoleAccess?.some(
                  (userAccess) =>
                    (userAccess.studentControlAccess['Edit Student'] === true ||
                      userAccess.studentControlAccess['Delete Student'] === true ||
                      userAccess.studentControlAccess['Dropout Student'] === true) &&
                    userAccess.role === currentUser?.role
                ) && <th className='min-w-100px text-end'>Actions</th>}
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {filteredStudents
                ?.filter(
                  (searchStudent) =>
                    searchValue.trim() === '' ||
                    searchStudent?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    searchStudent?.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                    searchStudent?.select_course.toLowerCase().includes(searchValue.toLowerCase())
                )
                ?.map((student) => {
                  return (
                    <tr key={student?._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img src={BASE_URL_Image + `/${student?.image}`} alt='' />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <div
                              onClick={() => navigate(`/profile/student/${student?._id}`)}
                              style={{cursor: 'pointer'}}
                              className='text-dark fw-bold text-hover-primary fs-6'
                            >
                              {student?.name}
                            </div>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                              {student?.select_course}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          onClick={() => navigate(`/profile/student/${student?._id}`)}
                          style={{cursor: 'pointer'}}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          +91 {student?.mobile_number}
                        </div>
                        <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          {student?.email}
                        </span>
                      </td>
                      <td>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div
                            onClick={() => navigate(`/profile/student/${student?._id}`)}
                            style={{cursor: 'pointer'}}
                            className='d-flex flex-stack mb-2'
                          >
                            <span className='text-muted me-2 fs-7 fw-semibold'>
                              {moment(student?.date_of_joining).format('DD-MM-YYYY')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          {userRoleAccess?.some(
                            (userAccess) =>
                              userAccess.studentControlAccess['Dropout Student'] === true &&
                              userAccess.role === currentUser?.role
                          ) && (
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
                                onChange={(e) => dorpOutStudentHandler(student, e.target.checked)}
                                checked={student?.dropOutStudent}
                              />
                              <KTIcon iconName='dislike' className='fs-3' />
                            </label>
                          )}
                          {userRoleAccess?.some(
                            (userAccess) =>
                              userAccess.studentControlAccess['Edit Student'] === true &&
                              userAccess.role === currentUser?.role
                          ) && (
                            <button
                              onClick={() =>
                                navigate(`/update-addmission-form/${student?._id}`, {
                                  state: student,
                                })
                              }
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                              <KTIcon iconName='pencil' className='fs-3' />
                            </button>
                          )}
                          {userRoleAccess?.some(
                            (userAccess) =>
                              userAccess.studentControlAccess['Delete Student'] === true &&
                              userAccess.role === currentUser?.role
                          ) && (
                            <button
                              onClick={() => studentDeleteHandler(student?._id)}
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                            >
                              <KTIcon iconName='trash' className='fs-3' />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
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
export default DropOutStudents
