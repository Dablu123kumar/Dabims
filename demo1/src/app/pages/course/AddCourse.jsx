import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useMutation} from 'react-query'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCourseTypesContext} from './course-type/CourseTypeContext'
import {useNumberOfYearsCourseTypesContext} from './Number Of Years/NumberOfYearsContext'
import {useGetCourseCategoryContextContext} from './category/CourseCategoryContext'
import {useCourseContext} from './CourseContext'
import AddSubject from './AddSubject'

const CourseSchema = Yup.object().shape({
  courseName: Yup.string().required('Course Name is required'),
  courseType: Yup.string().required('Course Type is required'),
  numberOfYears: Yup.string().required('Course Number Of Years is required'),
  category: Yup.string().required('Course Category is required'),
  courseFees: Yup.number().required('Course Fees is required'),
})

const AddCourseUpdateAndAdd = () => {
  const {courseTypesLists} = useCourseTypesContext()
  const {numberOfCourseYearsTypesLists} = useNumberOfYearsCourseTypesContext()
  const {getCourseCategoryLists} = useGetCourseCategoryContextContext()
  const {createCourseMutation} = useCourseContext()
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  //console.log(getCourseCategoryLists)

  let initialValues = {
    courseName: '',
    courseType: '',
    numberOfYears: 0,
    category: '',
    courseFees: 0,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      setLoading(true)
      createCourseMutation.mutate(values)
      // navigate('/course/addCourse')
      //console.log(values)
      localStorage.setItem('AddSubjectRelatedData', JSON.stringify(values))
    },
  })
  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Add Course</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Course Name{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Course Name..'
                      {...formik.getFieldProps('courseName')}
                    />
                    {formik.touched.courseName && formik.errors.courseName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.courseName}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ Start course fees==================== */}
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Course Fees{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='number'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Course Fees..'
                      {...formik.getFieldProps('courseFees')}
                    />
                    {formik.touched.courseFees && formik.errors.courseFees && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.courseFees}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ End course fees==================== */}
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Course Type{' '}
                  <div className='fv-row mt-5 '>
                    <select
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('courseType')}
                    >
                      <option value=''>select--</option>
                      {courseTypesLists?.data?.map((courseTypeData) => (
                        <option key={courseTypeData?._id} value={courseTypeData?._id}>
                          {courseTypeData?.courseType}
                        </option>
                      ))}
                    </select>
                    {formik.touched.courseType && formik.errors.courseType && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.courseType}</div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <div className='row mb-6'>
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Number Of Years/Semester{' '}
                  <div className='fv-row mt-5 '>
                    <select
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('numberOfYears')}
                    >
                      <option value=''>select--</option>
                      {numberOfCourseYearsTypesLists?.data?.map((courseNumberOfYearsTypeData) => (
                        <option
                          key={courseNumberOfYearsTypeData?._id}
                          value={courseNumberOfYearsTypeData?._id}
                        >
                          {courseNumberOfYearsTypeData?.numberOfYears}
                        </option>
                      ))}
                    </select>
                    {formik.touched.numberOfYears && formik.errors.numberOfYears && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.numberOfYears}</div>
                      </div>
                    )}
                  </div>
                </label>
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Course Category{' '}
                  <div className='fv-row mt-5 '>
                    <select
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('category')}
                    >
                      <option value=''>select--</option>
                      {getCourseCategoryLists?.data?.map((courseCategoryData) => (
                        <option key={courseCategoryData?._id} value={courseCategoryData?._id}>
                          {courseCategoryData?.category}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.category}</div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save Changes'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    {/* Please wait...{' '} */}
                    Added
                    {/* <span className='spinner-border spinner-border-sm align-middle ms-2'></span> */}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <AddSubject />}
    </>
  )
}
export default AddCourseUpdateAndAdd
