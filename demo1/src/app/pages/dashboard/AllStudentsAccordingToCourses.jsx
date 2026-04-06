import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCourseContext} from '../course/CourseContext'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import { useCompanyContext } from '../compay/CompanyContext'

const AllStudentsAccordingToCourses = ({className}) => {
  const courseCtx = useCourseContext()
  const {GetStudentsByCompanyAndCourse} = useAdmissionContext()
  const {selectedCompany} = useCompanyContext()
  const companyId = selectedCompany?._id

  const courseName = courseCtx?.getCourseLists?.data || []

  if (!companyId) {
    return (
      <div className={`card card-xl ${className || ''}`}>
        <div className='card-body text-center text-muted'>Loading...</div>
      </div>
    )
  }

  return (
    <div className={`card card-xl ${className || ''}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Over All Students</h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
        </div>
      </div>

      <div className='card-body pt-0' style={{maxHeight: '550px', overflowY: 'auto'}}>
        {courseName.map((course) => (
          <CourseStudentRow
            key={course._id}
            course={course}
            companyId={companyId}
            GetStudentsByCompanyAndCourse={GetStudentsByCompanyAndCourse}
          />
        ))}
      </div>
    </div>
  )
}

const CourseStudentRow = ({course, companyId, GetStudentsByCompanyAndCourse}) => {
  const {data: students = []} = GetStudentsByCompanyAndCourse(companyId, course._id)
  return (
    <div className='d-flex align-items-center bg-light-success rounded p-5 mb-7'>
      <span className='text-success me-5'>
        <KTIcon iconName='abstract-26' className='text-success fs-1 me-5' />
      </span>
      <div className='flex-grow-1 me-2'>
        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
          {course.courseName}
        </a>
      </div>
      <span className='fw-bold text-danger py-1'>{students.length} Students</span>
    </div>
  )
}

export default AllStudentsAccordingToCourses
