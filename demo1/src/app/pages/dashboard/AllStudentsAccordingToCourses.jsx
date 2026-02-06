import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCourseContext} from '../course/CourseContext'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import { useCompanyContext } from '../compay/CompanyContext'

const AllStudentsAccordingToCourses = ({className}) => {
  const courseCtx = useCourseContext()
  //const ctx = useAdmissionContext()
  const {GetStudentsByCompanyAndCourse} = useAdmissionContext()


  // start here 
  const {selectedCompany , useGetStudentsAccordingToCompanyQuery} = useCompanyContext()
const companyId = selectedCompany?._id
// console.log('selectedcomp',selectedCompany)
// console.log('compid',companyId)
//const { data: companyStudentsData,isLoading,} = useGetStudentsAccordingToCompanyQuery(companyId)



  const courseName = courseCtx?.getCourseLists?.data || []

    if (!companyId) {
    return (
      <div className={`card card-xl ${className || ''}`}>
        <div className='card-body text-center text-muted'>
          Please select a company
        </div>
      </div>
    )
  }
 //const students = companyStudentsData?.users || []
  //const students = ctx?.studentsLists?.data?.users || []

  // Count students by course ID

  // const studentCounts = students.reduce((acc, student) => {
  //   const courseId = student?.courseName?._id
  //   // console.log(acc)
  //   // console.log(student)
  //   if (courseId) {
  //     acc[courseId] = (acc[courseId] || 0) + 1
  //   }
  //   return acc
  // }, {})

  return (
    <div className={`card card-xl ${className || ''}`}>
      {/* Header (Non-scrollable) */}
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

      {/* Body (Scrollable List) */}
      <div className='card-body pt-0' style={{maxHeight: '550px', overflowY: 'auto'}}>
        {courseName.map((course) => {
          //console.log('corse',course)
          const { data: students = [], isLoading} = GetStudentsByCompanyAndCourse(companyId,course._id)

          return (
            <div
              key={course._id}
              className='d-flex align-items-center bg-light-success rounded p-5 mb-7'
            >
              {/* Icon */}
              <span className='text-success me-5'>
                <KTIcon iconName='abstract-26' className='text-success fs-1 me-5' />
              </span>
              {/* Title */}
              <div className='flex-grow-1 me-2'>
                <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                  {course.courseName}
                </a>
              </div>
              {/* Student Count */}
              <span className='fw-bold text-danger py-1'>{students.length} Students</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllStudentsAccordingToCourses
