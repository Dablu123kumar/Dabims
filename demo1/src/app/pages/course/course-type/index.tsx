import React, {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useCourseTypesContext} from './CourseTypeContext'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

const CourseTypes: React.FC<Props> = ({className}) => {
  const ctx = useCourseTypesContext()
  const navigate = useNavigate()

  const deleteCourseTypeHandler = (courseTypeId: string) => {
    if (!window.confirm('Are you sure you want to delete this course type?')) {
      return
    }
    ctx.deleteCourseTypeMutation.mutate(courseTypeId)
  }

  return (
    <div>
      <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Course Types</span>
          </h3>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <button
              onClick={() => navigate('/course/course-type/editAdd/:id')}
              className='btn btn-sm btn-light-primary'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add New Course Types
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
                  <th className='min-w-150px'>Course Type</th>
                  <th className='min-w-140px'>Created By</th>
                  <th className='min-w-120px'>Date</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {ctx.courseTypesLists.data?.map((course: any) => (
                  <tr key={course._id}>
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
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {course.courseType}
                          </a>
                          {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            HTML, JS, ReactJS
                          </span> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {course.createdBy}
                      </a>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div className='d-flex flex-stack mb-2'>
                          <span className='text-muted me-2 fs-7 fw-semibold'>
                            {moment(course.createdAt).format('DD-MM-YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <button
                          onClick={() =>
                            navigate(`/course/course-type/edit/${course._id}`, {state: course})
                          }
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button>
                        <button
                          onClick={() => deleteCourseTypeHandler(course._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </div>
  )
}
export default CourseTypes
