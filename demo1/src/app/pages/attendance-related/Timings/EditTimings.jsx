import {useFormik} from 'formik'
import {useAttendanceContext} from '../AttendanceContext'
import * as Yup from 'yup'
import {useEffect} from 'react'
import {useParams} from 'react-router-dom'

// Define the validation schema using Yup
const batchTimingSchema = Yup.object().shape({
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
})

const EditTimings = ({selectedBatchTime, setOpenModal}) => {
  const {useGetSingleBatchTimeById, updateBatchTimeMutation} = useAttendanceContext()
  const batchTime = useGetSingleBatchTimeById(selectedBatchTime?._id)
  const params = useParams()
  // console.log(batchTime)

  // Initialize Formik with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      startTime: batchTime?.data?.timing?.startTime || '',
      endTime: batchTime?.data?.timing?.endTime || '',
    },
    enableReinitialize: true, // To update initial values when batchTime data is fetched
    validationSchema: batchTimingSchema,
    onSubmit: (values) => {
      // Handle form submission
      const data = {
        ...values,
        id: selectedBatchTime?._id,
      }

      updateBatchTimeMutation.mutate(data, {
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
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Start Time</label>
        <input
          type='text'
          name='startTime'
          value={formik.values.startTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Start Time'
        />
        {formik.touched.startTime && formik.errors.startTime && (
          <div className='text-danger'>{formik.errors.startTime}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>End Time</label>
        <input
          type='text'
          name='endTime'
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='End Time'
        />
        {formik.touched.endTime && formik.errors.endTime && (
          <div className='text-danger'>{formik.errors.endTime}</div>
        )}
      </div>

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  )
}

export default EditTimings
