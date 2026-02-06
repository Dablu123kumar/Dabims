import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { useBatchContext } from '../../batch/BatchContext'
import { toast } from 'react-toastify'

const validationSchema = Yup.object().shape({
  subject: Yup.string().required('Subject is required'),
  status: Yup.string().required('Status is required').oneOf(['notStarted', 'inProgress', 'completed']),
  progress: Yup.number().min(0).max(100).required('Progress is required'),
  startDate: Yup.string(),
  completionDate: Yup.string(),
  notes: Yup.string()
})

const UpdateSubjectStatusForm = ({ batch, student, onSuccess }) => {
  const [subjects, setSubjects] = useState([])
  const { useUpdateSubjectStatus } = useBatchContext()
  const updateMutation = useUpdateSubjectStatus()
  // console.log('batch',batch)

  useEffect(() => {
    // Get available subjects from batch or fetch from API
    batch.students.forEach((s)=>{
      //console.log('subject',s)
      setSubjects(s.subjects)
    })
  }, [batch])

  const formik = useFormik({
    initialValues: {
      subject: '',
      status: 'not-started',
      progress: 0,
      startDate: '',
      completionDate: '',
      notes: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('values',values)
      const payload = {
        subject: values.subject,
        status: values.status,
        progress: parseInt(values.progress),
        startDate: values.startDate,
        completionDate: values.completionDate,
        notes: values.notes
      }

      updateMutation.mutate(
        {
          batchId: batch._id,
          studentId: student.student?._id || student.student,
          subjectId: values.subject,
          payload
        },
        {
          onSuccess: () => {
            formik.resetForm()
            onSuccess?.()
            
          },
          onError: (error)=>{
            toast.error(error?.response?.data?.message)
          }
        }
      )
    }
  })

   //console.log('subjects',subjects)
   //console.log('batch',batch)


  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Select Subject
        </label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.subject && formik.errors.subject ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('subject')}
          >
            <option value='' hidden>Select Subject</option>
            {subjects.map(subject => (
              // console.log('subject',subject)
              <option key={subject._id} value={subject.subject._id}>
                {subject.subject.subjectName}
              </option>
            ))}
          </select>
          {formik.touched.subject && formik.errors.subject && (
            <div className='invalid-feedback'>{formik.errors.subject}</div>
          )}
        </div>
      </div>

      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Status
        </label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.status && formik.errors.status ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('status')}
          >
            <option value='notStarted'>Not Started</option>
            <option value='inProgress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className='invalid-feedback'>{formik.errors.status}</div>
          )}
        </div>
      </div>

      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Progress (%)
        </label>
        <div className='col-12 fv-row'>
          <div className='d-flex align-items-center gap-3'>
            <input
              type='range'
              className='form-range'
              min='0'
              max='100'
              {...formik.getFieldProps('progress')}
              style={{ flex: 1 }}
            />
            <input
              type='number'
              className={`form-control ${
                formik.touched.progress && formik.errors.progress ? 'is-invalid' : ''
              }`}
              min='0'
              max='100'
              style={{ width: '80px' }}
              {...formik.getFieldProps('progress')}
            />
          </div>
          {formik.touched.progress && formik.errors.progress && (
            <div className='invalid-feedback'>{formik.errors.progress}</div>
          )}
        </div>
      </div>

      <div className='row mb-6'>
        <label className='col-md-6 col-form-label fw-bold fs-6'>
          Start Date
        </label>
        <label className='col-md-6 col-form-label fw-bold fs-6'>
          Completion Date
        </label>
        <div className='col-md-6 fv-row'>
          <input
            type='date'
            className='form-control form-control-lg form-control-solid'
            {...formik.getFieldProps('startDate')}
          />
        </div>
        <div className='col-md-6 fv-row'>
          <input
            type='date'
            className='form-control form-control-lg form-control-solid'
            {...formik.getFieldProps('completionDate')}
          />
        </div>
      </div>

      <div className='row mb-6'>
        <label className='col-12 col-form-label fw-bold fs-6'>
          Notes
        </label>
        <div className='col-12 fv-row'>
          <textarea
            className='form-control form-control-lg form-control-solid'
            rows='4'
            placeholder='Add any notes or comments about the student progress'
            {...formik.getFieldProps('notes')}
          ></textarea>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? (
              <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
            ) : null}
            Update Subject Status
          </button>
        </div>
      </div>

      {updateMutation.error && (
        <div className='alert alert-danger mt-3'>
          {updateMutation.error?.message || 'Error updating subject status'}
        </div>
      )}
    </form>
  )
}

export default UpdateSubjectStatusForm
