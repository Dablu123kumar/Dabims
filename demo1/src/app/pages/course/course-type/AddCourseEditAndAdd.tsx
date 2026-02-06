import React, {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useMutation} from 'react-query'
import {useCourseTypesContext} from './CourseTypeContext'
import {useLocation, useNavigate} from 'react-router-dom'

type CourseType = {
  courseType: string
}

let initialValues: CourseType = {
  courseType: '',
}

const profileDetailsSchema = Yup.object().shape({
  courseType: Yup.string().required('Course Type is required'),
})

const AddCourseEditAndAdd: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const ctx = useCourseTypesContext()

  const formik = useFormik<CourseType>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        ctx.createAddCourseTypeMutation.mutate(values)
      } catch (error) {
        //console.log(ctx.createAddCourseTypeMutation.error)
      }
      //console.log(values)
      navigate('/course/course-type')
      // mutation.mutate(values)
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
          <h3 className='fw-bolder m-0'>Add Course Type</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Course Type</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Course Type'
                      {...formik.getFieldProps('courseType')}
                    />
                    {formik.touched.courseType && formik.errors.courseType && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.courseType}</div>
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

export default AddCourseEditAndAdd
