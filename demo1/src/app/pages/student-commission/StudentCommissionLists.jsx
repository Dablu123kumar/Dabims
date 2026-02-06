import {useNavigate} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCompanyContext} from '../compay/CompanyContext'
import moment from 'moment'
const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const StudentCommissionLists = ({studentInfoData}) => {
  const navigate = useNavigate()
  const studentCTX = useCompanyContext()
  let studentName = studentInfoData?.name?.split(' ').join('_') + '-' + studentInfoData?.rollNumber

  const {data, isLoading} = studentCTX.useGetStudentCommissionDataQuery(studentName)
  //console.log('studentdata',studentInfoData)
  //console.log('data',data)
  return (
    <div className={`card my-10`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Student Commission</span>
          <span className='mt-1 fw-semibold fs-7'>{studentInfoData?.name}</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a Student Commission'
        >
          <button
            onClick={() =>
              navigate(`/student/commission/${studentInfoData.companyName._id}`, {
                state: {
                  name:studentName,
                },
              })
            }
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Add Student Commission
          </button>
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
              <tr className='fw-bold '>
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
                <th className='min-w-140px'>Commission Person Name</th>
                <th className='min-w-120px'>Commission Amount</th>
                <th className='min-w-120px'>Commission Paid</th>
                <th className='min-w-120px'>Remaining Commission</th>
                <th className='min-w-100px'>Commission Date</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {data?.length === 0 && (
                <tr>
                  <td colSpan={5} className='text-center'>
                    <h2>No Commission Amount Added</h2>
                  </td>
                </tr>
              )}
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='text-center'>
                    <h2>Loading....</h2>
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map((studentCommissionData) => (
                    <tr key={studentCommissionData._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          {/* < input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <img src={BASE_URL_Image + '/' + studentInfoData.image} alt='' />
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <a className='text-dark fw-bold text-hover-primary fs-6'>
                              {studentCommissionData.studentName.split('-')[0]}
                            </a>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                              RollNum : {studentCommissionData.studentName.split('-')[1]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {studentCommissionData.commissionPersonName}
                        </a>
                        <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          {studentCommissionData.commissionNaretion}
                        </span>
                      </td>

                      <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {studentCommissionData.commissionAmount}
                        </a>
                      </td>
                      <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {studentCommissionData.commissionPaid}
                        </a>
                        <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          V.C {studentCommissionData.voucherNumber}
                        </span>
                      </td>
                      <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {studentCommissionData?.commissionRemaining}
                        </a>
                      </td>
                      <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                          {moment(studentCommissionData.commissionDate).format('DD-MM-YYYY')}
                        </a>
                      </td>
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
export default StudentCommissionLists
