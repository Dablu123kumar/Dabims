import moment from 'moment'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCourseContext} from './CourseContext'
import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

const AddCourse: React.FC<Props> = ({className}) => {
  const ctx = useCourseContext()
  // console.log(ctx.getCourseLists)
  const navigate = useNavigate()
  const deleteCourseHandler = (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }
    ctx.deleteCourseMutation.mutate(courseId)
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Course Lists</span>
        </h3>
        <div className='card-toolbar'>
          <button
            onClick={() => navigate('/course/addCourse/add')}
            className='btn btn-sm btn-light-primary'
          >
            <KTIcon iconName='plus' className='fs-2' />
            Add New Course
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-100px rounded-start'>Sr.No</th>
                <th className='min-w-125px'>Course Name</th>
                <th className='min-w-125px'>Course Fees</th>
                <th className='min-w-125px'>Course Type</th>
                <th className='min-w-200px'>Annual</th>
                <th className='min-w-2500px'>Category</th>
                <th className='min-w-200px'>Added By</th>
                <th className='min-w-150px'>Date</th>
                <th className='min-w-200px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {ctx.getCourseLists?.data?.length > 0 ? (
                ctx.getCourseLists?.data?.map((courseData: any, courseIndex: any) => (
                  <tr key={courseData?._id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-50px me-5'></div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                            {courseIndex + 1}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {courseData?.courseName}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {courseData?.courseFees}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {courseData?.courseType?.courseType}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {courseData?.numberOfYears?.numberOfYears}
                      </a>
                    </td>
                    <td>
                      <span className='badge badge-light-primary fs-7 fw-semibold'>
                        {courseData?.category?.category}
                      </span>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {courseData?.createdBy}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {moment(courseData?.createdAt).format('DD/MM/YYYY')}
                      </a>
                    </td>
                    <td className='text-center'>
                      <button
                        onClick={() => navigate('/course/addCourse/update', {state: courseData})}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button
                        onClick={() => deleteCourseHandler(courseData?._id)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='col-12'>
                  <td className='text-center' colSpan={10}>
                    <h2 className='p-5'>No Course Available!</h2>
                    <p>Please Create New Course</p>
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
export default AddCourse
