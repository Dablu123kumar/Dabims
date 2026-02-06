import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useMutation} from 'react-query'
import {useLocation, useNavigate} from 'react-router-dom'
import {useGetCourseCategoryContextContext} from './CourseCategoryContext'
const CourseCategorySchema = Yup.object().shape({
  category: Yup.string().required('Course Category is required'),
})
const AddCourseCategory = () => {
  const resLocation = useLocation()
  //console.log(resLocation.state)
  const ctx = useGetCourseCategoryContextContext()
  const [editcategoryCourse, setEditcategoryCourse] = useState(resLocation.state)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  let initialValues = editcategoryCourse ? editcategoryCourse : {category: ''}
  const formik = useFormik({
    initialValues,
    validationSchema: CourseCategorySchema,
    onSubmit: async (values) => {
      setLoading(true)
      if (editcategoryCourse) {
        ctx.updateCourseCategoryMutation.mutate({...values, id: editcategoryCourse._id})
      } else {
        ctx.createCourseCategoryMutation.mutate(values)
      }
      navigate('/course/category')
    },
  })
  return (
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
          <h3 className='fw-bolder m-0'>Add Course Category</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Add Course Category
              </label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Course Category...'
                      {...formik.getFieldProps('category')}
                    />
                    {formik.touched.category && formik.errors.category && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.category}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddCourseCategory
