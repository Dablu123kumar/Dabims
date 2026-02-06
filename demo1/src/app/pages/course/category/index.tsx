import {useNavigate} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useGetCourseCategoryContextContext} from './CourseCategoryContext'
import moment from 'moment'
import {useCourseContext} from '../CourseContext'
import {useAdmissionContext} from '../../../modules/auth/core/Addmission'
import ExcelSheetDownload from './ExcelSheetDownload'

type Props = {
  className: string
}

const CourseCategory: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()
  const courseCTX = useCourseContext()
  const studentCTX = useAdmissionContext()
  const ctx = useGetCourseCategoryContextContext()

  // console.log(ctx.getCourseCategoryLists?.data)
  // Get all categories
  const allCategories = ctx.getCourseCategoryLists?.data || []

  // Get all courses
  const allCourses = courseCTX.getCourseLists?.data || []

  // Map each category to the count of courses it contains
  const courseCountsByCategory = allCategories.reduce((acc: Record<string, number>, category) => {
    acc[category.category] = allCourses.filter(
      (course) => course.category.category === category.category
    ).length
    return acc
  }, {})

  const students = studentCTX?.studentsLists?.data?.users || []

  // Group students by category
  const studentCountsByCategory = allCategories.reduce((acc, category) => {
    // Assuming category has a unique _id property
    const studentsInCategory = students.filter(
      (student) => student?.courseName?.category === category?._id // Compare category IDs
    )

    acc[category.category] = studentsInCategory.length // Use category._id as the key
    return acc
  }, {})

  // console.log(studentCountsByCategory)
  // Log the result to verify
  // console.log(courseCountsByCategory)

  const deleteCourseCategoryHandler = (courseCategoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this course category?')) {
      return
    }
    ctx.deleteCourseCategoryMutation.mutate(courseCategoryId)
  }
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Course Category</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <button
            onClick={() => navigate('/course/category/add')}
            className='btn btn-sm btn-light-primary'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Add New Category
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
              <tr className='fw-bold'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-150px'>Category Name</th>
                <th className='min-w-150px'>Students</th>
                <th className='min-w-150px'>Courses</th>
                <th className='min-w-140px'>Created By</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {ctx.getCourseCategoryLists?.data?.length > 0 ? (
                ctx.getCourseCategoryLists?.data?.map((category: any) => (
                  <tr key={category?._id}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {category?.category}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentCountsByCategory[category.category]
                              ? studentCountsByCategory[category.category]
                              : 0}
                          </a>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {courseCountsByCategory[category.category] || 0}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {category?.createdBy}
                      </a>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div className='d-flex flex-stack mb-2'>
                          <span className=' me-2 fs-7 fw-semibold'>
                            {moment(category?.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        {/* <ExcelSheetDownload /> */}
                        <button
                          onClick={() => navigate('/course/category/add', {state: category})}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button>
                        <button
                          onClick={() => deleteCourseCategoryHandler(category._id)}
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
                    <h2 className='p-5'>Course Category Not Available!</h2>
                    <p>Please Create New Course Category</p>
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
export default CourseCategory
