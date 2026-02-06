import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import moment from 'moment'
import {useNumberOfYearsCourseTypesContext} from './NumberOfYearsContext'
import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

const NumberOfYearsCourse: React.FC<Props> = ({className}) => {
  const ctx = useNumberOfYearsCourseTypesContext()
  // console.log(ctx.numberOfCourseYearsTypesLists.data)
  const navigate = useNavigate()

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Add Number Of Years Course</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <button
            onClick={() => navigate('/course/no_of_years_course/add')}
            className='btn btn-sm btn-light-primary'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
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
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-150px'>Number Of Years</th>
                <th className='min-w-140px'>Created By</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {ctx.numberOfCourseYearsTypesLists.data?.length > 0 ? (
                ctx.numberOfCourseYearsTypesLists?.data?.map((ele: any) => (
                  <tr>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'></div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a className='text-dark fw-bold text-hover-primary fs-6'>
                            {ele?.numberOfYears}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {ele?.createdBy}
                      </a>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div className='d-flex flex-stack mb-2'>
                          <span className='text-muted me-2 fs-7 fw-semibold'>
                            {moment(ele?.createdAt).format('DD-MM-YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <button
                          onClick={() => navigate('/course/no_of_years_course/add', {state: ele})}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure do you want to delete')) {
                              ctx?.deleteNumberOfYearsCourseTypeMutation.mutate(ele?._id)
                            }
                          }}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='col-12'>
                  <td className='text-center' colSpan={5}>
                    <h2 className='p-5'>Number Of Years Course Types Not Available!</h2>
                    <p>Please Create New Number Of Years Course Type</p>
                  </td>
                </tr>
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
export default NumberOfYearsCourse
