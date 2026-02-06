import {useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCourseContext} from './CourseContext'
import {useCourseTypesContext} from './course-type/CourseTypeContext'
import axios from 'axios'
import {NavLink} from 'react-router-dom'
import SubjectTable from './course_subject/SubjectTable'

const BASE_URL = process.env.REACT_APP_BASE_URL

const AddSubject = ({className, editCourse = {}}) => {
  const [courseSubjectRef, setCourseSubjectRef] = useState({})
  const [activeTab, setActiveTab] = useState(1)
  // console.log(editCourse)

  const handleTabClick = (index) => {
    //console.log(index)
    setActiveTab(index)
  }
  //console.log(courseSubjectRef)

  useEffect(() => {
    const fetchData = async () => {
      // Check if editCourse is empty or not
      if (Object?.keys(editCourse)?.length === 0) {
        // If editCourse is empty, perform add functionality
        // Fetch data from localStorage or default values
        let courseTypeId = JSON?.parse(localStorage?.getItem('AddSubjectRelatedData'))?.courseType
        let numberOfYearId = JSON?.parse(
          localStorage?.getItem('AddSubjectRelatedData')
        )?.numberOfYears

        try {
          const courseTypeRes = await axios.get(
            `${BASE_URL}/api/courses/courseType/${courseTypeId}`
          )
          const numberOfYearsRes = await axios.get(
            `${BASE_URL}/api/courses/numberOfYears/${numberOfYearId}`
          )

          setCourseSubjectRef({
            ...courseSubjectRef,
            courseType: courseTypeRes?.data?.courseType,
            numberOfYears: numberOfYearsRes?.data?.numberOfYears,
          })
        } catch (error) {
          //console.log(error)
        }
      } else {
        // If editCourse is not empty, perform edit functionality
        // Fetch data related to the editCourse
        let courseTypeId = editCourse?.courseType
        let numberOfYearId = editCourse?.numberOfYears

        try {
          const courseTypeRes = await axios.get(
            `${BASE_URL}/api/courses/courseType/${courseTypeId}`
          )
          const numberOfYearsRes = await axios.get(
            `${BASE_URL}/api/courses/numberOfYears/${numberOfYearId}`
          )

          setCourseSubjectRef({
            ...courseSubjectRef,
            courseType: courseTypeRes?.data?.courseType,
            numberOfYears: numberOfYearsRes?.data?.numberOfYears,
          })
        } catch (error) {
          // console.log(error)
        }
      }
    }

    fetchData()
  }, [Object?.keys(editCourse)?.length > 0, editCourse]) // Ensure useEffect runs when editCourse changes
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Subject Information</span>
        </h3>
        <div className='card-toolbar'>
          <ul className='nav p-5'>
            {courseSubjectRef && (
              <>
                {Array?.from({length: courseSubjectRef?.numberOfYears}, (_, i) => (
                  <li
                    // className={`nav-item`}
                    key={i}
                    style={{borderBottom: activeTab === i + 1 ? '2px solid red' : ''}}
                  >
                    <NavLink
                      className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1 ${
                        activeTab === i + 1 ? 'active bg-red' : ''
                      }`}
                      data-bs-toggle='tab'
                      to={`#kt_table_widget_5_tab_${i + 1}`}
                      onClick={() => handleTabClick(i + 1)}
                    >
                      {courseSubjectRef?.courseType === 'Annual'
                        ? `Year ${i + 1}`
                        : `Semester ${i + 1}`}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
      {/* End :: Header */}
      {/* Start :: Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {/* begin::Tap pane */}
          {Array.from({length: courseSubjectRef?.numberOfYears}, (_, i) => (
            <div
              key={i}
              className={`tab-pane fade ${activeTab === i + 1 ? 'show active' : ''}`}
              id={`kt_table_widget_5_tab_${i + 1}`}
            >
              {/* begin::Table container */}
              <SubjectTable
                editCourse={editCourse}
                activeTab={activeTab}
                yearWiseAndSemster={
                  courseSubjectRef?.courseType === 'Annual' ? `Year ${i + 1}` : `Semester ${i + 1}`
                }
              />
              {/* end::Table */}
            </div>
          ))}
          {/* end::Tap pane */}
        </div>
      </div>
      {/* End :: Body */}
    </div>
  )
}
export default AddSubject
