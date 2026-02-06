import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCourseContext} from './CourseContext'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'

const ViewCourse = () => {
  const courseCtx = useCourseContext()
  const navigate = useNavigate()
  //console.log(courseCtx.getCourseLists.data)

  const deleteCourseHandler = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }
    courseCtx.deleteCourseMutation.mutate(courseId)
  }

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Courses Lists</span>
          <span className=' mt-1 fw-semibold fs-7'></span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <button
            onClick={() => navigate('/course/addCourse/add')}
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Course
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
                <th className='min-w-150px'>Sr.No</th>
                <th className='min-w-140px'>Course Name</th>
                <th className='min-w-120px'>Course Fees</th>
                <th className='min-w-120px'>Course Type</th>
                <th className='min-w-120px'>Annual</th>
                <th className='min-w-120px'>Category</th>
                <th className='min-w-120px'>Added By</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {courseCtx?.getCourseLists?.data?.map((course, index) => (
                <tr key={course._id}>
                  <td></td>
                  <td className='fw-bold fs-5'>{index + 1}</td>
                  <td className='fw-bold fs-5'>{course?.courseName}</td>
                  <td className='fw-bold fs-5'>{course?.courseFees}</td>
                  <td className='fw-bold fs-5'>{course?.courseType?.courseType}</td>
                  <td className='fw-bold fs-5'>{course?.numberOfYears?.numberOfYears}</td>
                  <td className='fw-bold fs-5'>{course?.category?.category}</td>
                  <td className='fw-bold fs-5'>{course?.createdBy}</td>
                  <td className='fw-bold fs-5'>{moment(course.createdAt).format('DD/MM/YYYY')}</td>
                  <td>
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <button
                        onClick={() => navigate('/course/addCourse/update', {state: course})}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button
                        onClick={() => deleteCourseHandler(course?._id)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courseCtx?.getCourseLists?.data?.length === 0 && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    No Course Available ? <b>Create Course</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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

export default ViewCourse
