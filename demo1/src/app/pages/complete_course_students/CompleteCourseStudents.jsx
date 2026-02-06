import { useAdmissionContext } from '../../modules/auth/core/Addmission'
import { useCompanyContext } from '../compay/CompanyContext';
import { useNavigate } from 'react-router-dom';


const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const CompleteCourseStudents = () => {
  const studentCTX = useAdmissionContext();
  const {getCompleteCourseStudentsLists} =  useAdmissionContext()
  const filteredStudents = studentCTX.getCompleteCourseStudentsLists?.data
// console.log('comst',getCompleteCourseStudentsLists)
// console.log('filtst',filteredStudents)     
  const companyCtx = useCompanyContext();

  const getSingleCompanyOfStudent = (companyId) => {
    let data = companyCtx.getCompanyLists.data.find(companyData => companyData?._id === companyId)
    return { name: data?.companyName, phone: data?.companyPhone }
  }
  const navigate = useNavigate()

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Complete Course Students</span>
          <span className='mt-1 fw-semibold fs-3'>Students -:- {filteredStudents?.length}</span>
        </h3>
      </div>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive' style={{ height: filteredStudents?.length < 6 ? "auto" : '450px', overflowY: 'auto' }}>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead style={{ position: 'sticky', top: '0', backgroundColor: themeMode === 'dark' ? '' : 'white', zIndex: '1' }}>
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
                <th className='min-w-150px'>Student Name</th>
                <th className='min-w-120px'>Company Name</th>
                <th className='min-w-120px'>Contact Info</th>
                {/* <th className='min-w-100px text-end'>Actions</th> */}
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {
                filteredStudents && filteredStudents.length === 0 ? <tr><td></td><td></td><td className='text-dark fw-bold text-hover-primary fs-6'>No Course Complete Students available...</td></tr> : filteredStudents?.map((student, index) => {
                  const compnayInfo = getSingleCompanyOfStudent(student?.companyName)
                  //console.log(student)
                  return (<tr key={student?._id}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                      </div>
                    </td>
                    <td onClick={() => navigate(`/profile/student/${student?._id}`)}
                      style={{ cursor: 'pointer' }}>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img src={BASE_URL_Image + `/${student?.image}`} alt='' />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a className='text-dark fw-bold text-hover-primary fs-6'>
                            {student?.name}
                          </a>
                          <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {student?.select_course}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td onClick={() => navigate(`/profile/student/${student?._id}`)}
                      style={{ cursor: 'pointer' }}>
                      <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {compnayInfo?.name}
                      </a>
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        +91 {compnayInfo?.phone}
                      </span>
                    </td>
                    <td className='' onClick={() => navigate(`/profile/student/${student?._id}`)}
                      style={{ cursor: 'pointer' }}>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div className='d-flex flex-stack mb-2'>
                          <span className='me-2 fs-7 fw-semibold'>{student?.email}</span>
                        </div>
                        <div className='d-flex flex-stack mb-2'>
                          <span className='me-2 fs-7 fw-semibold'>+91 {student?.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    {/* <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <a
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </a>
                        <a
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </a>
                      </div>
                    </td> */}
                  </tr>)
                })
              }



            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
    </>
  )
}
export default CompleteCourseStudents
