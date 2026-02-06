import React from 'react'
import {useFormik} from 'formik'
import {useAttendanceContext} from '../AttendanceContext'
import {useParams} from 'react-router-dom'
import * as Yup from 'yup'

// Define the validation schema using Yup
const batchTimingSchema = Yup.object().shape({
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
})

const TimingFields = ({setOpenModal}) => {
  const {createBatchTiming} = useAttendanceContext()
  const params = useParams()

  // Initialize Formik with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      startTime: '',
      endTime: '',
    },
    validationSchema: batchTimingSchema,
    onSubmit: (values) => {
      // Handle form submission
      const data = {
        ...values,
        companyId: params?.id,
      }

      createBatchTiming.mutate(data, {
        onSuccess: () => {
          setOpenModal(false)
        },
        onError: (error) => {
          console.error('Error saving timings:', error)
        },
      })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className='dynamic-form'>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Start Time</label>
      <input
        type='text'
        name='startTime'
        value={formik.values.startTime}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`form-control form-control-lg form-control-solid ${
          formik.touched.startTime && formik.errors.startTime ? 'is-invalid' : ''
        }`}
        placeholder='Start Time'
      />
      {formik.touched.startTime && formik.errors.startTime ? (
        <div className='invalid-feedback'>{formik.errors.startTime}</div>
      ) : null}

      <label className='col-lg-4 col-form-label required fw-bold fs-6'>End Time</label>
      <input
        type='text'
        name='endTime'
        value={formik.values.endTime}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`form-control form-control-lg form-control-solid ${
          formik.touched.endTime && formik.errors.endTime ? 'is-invalid' : ''
        }`}
        placeholder='End Time'
      />
      {formik.touched.endTime && formik.errors.endTime ? (
        <div className='invalid-feedback'>{formik.errors.endTime}</div>
      ) : null}

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Save
        </button>
      </div>
    </form>
  )
}

export default TimingFields
