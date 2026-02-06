import {useState} from 'react'
import {useAttendanceContext} from '../AttendanceContext'
import {useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import * as Yup from 'yup'

const LabFormFields = ({setOpenModal}) => {
  const {createLabData} = useAttendanceContext()
  const params = useParams()

  const formik = useFormik({
    initialValues: {
      labName: '',
    },
    validationSchema: Yup.object({
      labName: Yup.string().required('Lab Name is required'),
    }),
    onSubmit: (values) => {
      const data = {
        labName: values.labName,
        companyId: params?.id,
      }

      createLabData.mutate(data, {
        onSuccess: () => {
          setOpenModal(false)
        },
        onError: (error) => {
          console.error('Error saving lab data:', error)
        },
      })
    },
  })

  return (
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Lab Name</label>
      <input
        type='text'
        name='labName'
        value={formik.values.labName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className='form-control form-control-lg form-control-solid'
        placeholder='Lab Name'
      />
      {formik.touched.labName && formik.errors.labName ? (
        <div className='text-danger'>{formik.errors.labName}</div>
      ) : null}

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Save
        </button>
      </div>
    </form>
  )
}

export default LabFormFields
