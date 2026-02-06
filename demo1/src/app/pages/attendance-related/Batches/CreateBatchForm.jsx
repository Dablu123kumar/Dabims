import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { useBatchContext } from '../../batch/BatchContext'
import { useAttendanceContext } from '../AttendanceContext'
import { useCourseContext } from '../../course/CourseContext'
import { toast } from 'react-toastify'
import { useGetCourseCategoryContextContext } from '../../course/category/CourseCategoryContext'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Batch name is required').min(3, 'Batch name must be at least 3 characters'),
  // courseCategory: Yup.string().required('Course Category is required'),
  // course: Yup.string().required('Course is required'),
  trainer: Yup.string().required('Trainer is required'),
  category: Yup.string(),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string(),
  students: Yup.array().of(
    Yup.object().shape({
      student: Yup.string().required('Student is required'),
      currentSoftware: Yup.string().required('Current software is required')
    })
  )
})

const CreateBatchForm = ({ batch, companyId, isEdit = false, onSuccess }) => {
  const {
    useCreateBatch,
    useUpdateBatch,
    useGetBatchById
  } = useBatchContext()

  const {getCourseCategoryLists} = useGetCourseCategoryContextContext()
  const {getCourseLists} = useCourseContext()
  //console.log('allcourse',getCourseLists.data)

  const { getAllTrainersData, getAllBatchTimings } = useAttendanceContext()

  const createMutation = useCreateBatch()
  const updateMutation = useUpdateBatch()
  const [selectedCourseCategory,setSelectedCourseCategory] = useState(null)
//   const { data: batchDetails } = isEdit && batch ? useGetBatchById(batch._id) : {}


    // ✅ Correct Hook usage
  const { data: batchDetails } = useGetBatchById(batch?._id, {
    enabled: isEdit && !!batch?._id,
  })

  const editData = isEdit && batchDetails?.data ? batchDetails.data : batch
  console.log('editdata',editData)

  const formik = useFormik({
    // initialValues: {
    //   name: batch?.name || '',
    //   trainer: batch?.trainer?._id || '',
    //   category: batch?.category?._id || '',
    //   startTime: batch?.startTime || '',
    //   endTime: batch?.endTime || '',
    //   startDate: batch?.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
    //   endDate: batch?.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
    //   students: batch?.students || []
    // },
    initialValues: {
  name: editData?.name || '',
  // courseCategory: editData?.courseCategory || '',
  // course: editData?.course || '',
  trainer: editData?.trainer?._id || '',
  category: editData?.category?._id || '',
  startTime: editData?.startTime || '',
  endTime: editData?.endTime || '',
  startDate: editData?.startDate
    ? new Date(editData.startDate).toISOString().split('T')[0]
    : '',
  endDate: editData?.endDate
    ? new Date(editData.endDate).toISOString().split('T')[0]
    : '',
  students: Array.isArray(editData?.students)
    ? editData.students.map(s => ({
        student: s.student?._id || s.student,
        currentSoftware: s.currentSoftware || ''
      }))
    : []
},
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        ...values,
        companyId
      }

      console.log('payload',payload)
      // if (isEdit && batch) {
      //   updateMutation.mutate(
      //     { id: batch._id, payload },
      //     {
      //       onSuccess: () => {
      //         formik.resetForm()
      //         onSuccess?.()
      //       }
      //     }
      //   )
      // }
      if (isEdit && editData?._id) {
        updateMutation.mutate(
          { id: editData._id, payload },
          {
            onSuccess: () => {
              formik.resetForm()
              onSuccess?.()
            },
            onError : (error)=>{
              toast.error(error?.response?.data?.message )
            }
          }
        )
      }
       else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            formik.resetForm()
            onSuccess?.()
          }
        })
      }
    }
  })

//   const availableCourses = getCourseLists?.data?.filter((course)=> course.category._id === formik.values.courseCategory) || []
// console.log('abaicours',availableCourses)

  //console.log('alltimings', getAllBatchTimings.data)
  //console.log('allcourse', getCourseLists.data)
  //console.log('allcoursecategory', getCourseCategoryLists?.data)

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Batch Name
        </label>
        <div className='col-12 fv-row'>
          <input
            type='text'
            className={`form-control form-control-lg form-control-solid ${
              formik.touched.name && formik.errors.name ? 'is-invalid' : ''
            }`}
            placeholder='Enter batch name'
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <div className='invalid-feedback'>{formik.errors.name}</div>
          )}
        </div>
      </div>

       {/* course category  */}
      {/* <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Course Category
        </label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.courseCategory && formik.errors.courseCategory ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('courseCategory')}
            
          >
            <option value='' hidden>Select Course Category</option>
            {getCourseCategoryLists?.data?.map(c => (
              <option key={c._id} value={c._id}>
                {c.category}
              </option>
            ))}
          </select>
          {formik.touched.courseCategory && formik.errors.courseCategory && (
            <div className='invalid-feedback'>{formik.errors.courseCategory}</div>
          )}
        </div>
      </div> */}

       {/* course   */}
      {/* <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Course 
        </label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.course && formik.errors.course ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('course')}
          >
            <option value='' hidden>Select Course </option>
            {availableCourses?.map(c => (
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))}
          </select>
          {formik.touched.course && formik.errors.course && (
            <div className='invalid-feedback'>{formik.errors.course}</div>
          )}
        </div>
      </div> */}

      {/* Trainer  */}
      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>
          Trainer
        </label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.trainer && formik.errors.trainer ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('trainer')}
          >
            <option value='' hidden>Select Trainer</option>
            {getAllTrainersData?.data?.map(trainer => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.trainerName}
              </option>
            ))}
          </select>
          {formik.touched.trainer && formik.errors.trainer && (
            <div className='invalid-feedback'>{formik.errors.trainer}</div>
          )}
        </div>
      </div>

      {/* <div className='row mb-6'>
        <label className='col-12 col-form-label fw-bold fs-6'>
          Category
        </label>
        <div className='col-12 fv-row'>
          <select
            className='form-select form-select-lg form-select-solid'
            {...formik.getFieldProps('category')}
          >
            <option value=''>Select Category</option>
            
          </select>
        </div>
      </div> */}

      <div className='row mb-6'>
        <label className='col-md-6 col-form-label required fw-bold fs-6'>
           Batch Time
        </label>
       
         <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.startTime && formik.errors.startTime ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('startTime')}
          >
            <option value=''>Starting Time</option>
            {getAllBatchTimings?.data?.map(timing => (
              <option key={timing._id} value={timing.startTime}>
                {timing.startTime}
              </option>
            ))}
          </select>
          {formik.touched.startTime && formik.errors.startTime && (
            <div className='invalid-feedback'>{formik.errors.startTime}</div>
          )}
        </div>
         <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.endTime && formik.errors.endTime ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('endTime')}
          >
            <option value=''>Ending Time</option>
            {getAllBatchTimings?.data?.map(timing => (
              <option key={timing._id} value={timing.endTime}>
                {timing.endTime}
              </option>
            ))}
          </select>
          {formik.touched.endTime && formik.errors.endTime && (
            <div className='invalid-feedback'>{formik.errors.endTime}</div>
          )}
        </div>
        
        {/* <div className='col-md-6 fv-row'>
          <input
            type='time'
            className={`form-control form-control-lg form-control-solid ${
              formik.touched.startTime && formik.errors.startTime ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('startTime')}
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <div className='invalid-feedback'>{formik.errors.startTime}</div>
          )}
        </div>
        <div className='col-md-6 fv-row'>
          <input
            type='time'
            className={`form-control form-control-lg form-control-solid ${
              formik.touched.endTime && formik.errors.endTime ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('endTime')}
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <div className='invalid-feedback'>{formik.errors.endTime}</div>
          )}
        </div> */}
      </div>

      <div className='row mb-6'>
        <label className='col-md-6 col-form-label required fw-bold fs-6'>
          Start Date
        </label>
        <label className='col-md-6 col-form-label fw-bold fs-6'>
          End Date
        </label>
        <div className='col-md-6 fv-row'>
          <input
            type='date'
            className={`form-control form-control-lg form-control-solid ${
              formik.touched.startDate && formik.errors.startDate ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('startDate')}
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div className='invalid-feedback'>{formik.errors.startDate}</div>
          )}
        </div>
        <div className='col-md-6 fv-row'>
          <input
            type='date'
            className='form-control form-control-lg form-control-solid'
            {...formik.getFieldProps('endDate')}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? (
              <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
            ) : null}
            {isEdit ? 'Update Batch' : 'Create Batch'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CreateBatchForm
