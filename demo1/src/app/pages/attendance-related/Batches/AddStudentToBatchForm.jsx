import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useEffect, useState} from 'react'
import {useBatchContext} from '../../batch/BatchContext'
import {useAdmissionContext} from '../../../modules/auth/core/Addmission'
import {useCourseSubjectContext} from '../../course/course_subject/CourseSubjectContext'
import {useQueryClient} from 'react-query'
import {toast} from 'react-toastify'
import Select from 'react-select'

const validationSchema = Yup.object().shape({
  student: Yup.string().required('Student is required'),
  // currentSoftware: Yup.string().required('Current software is required'),
  subject: Yup.array().min(1, 'Select at least one subject').required(),
})

const AddStudentToBatchForm = ({batch, onSuccess}) => {
  const [existingStudents, setExistingStudents] = useState()
  const {useAddStudentToBatch, useGetALLbatches} = useBatchContext()
  const {studentsLists} = useAdmissionContext()
  const addStudentMutation = useAddStudentToBatch()
  const ctx = useCourseSubjectContext()
  const queryClient = useQueryClient()
  const {data: allBatchesData} = useGetALLbatches({})
  const allBatches = allBatchesData?.data || []

  //console.log('batch', allBatches)
  //console.log('id',selectedStudentId)

  // filter students by courseId
  const allStudents = studentsLists.data.users

  // const allStudents = studentsLists.data.users?.filter((stu)=> stu.courseName.category ===courseCategoryId) || []
  // console.log('filter',allStudents)
  useEffect(() => {
    if (batch?.students) {
      setExistingStudents(batch.students.map((s) => s.student?._id || s.student))
    }
  }, [batch])
  const availableStudents =
    allStudents?.filter((student) => !existingStudents?.includes(student._id)) || []
  //console.log('available stu', availableStudents)
  const studentOptions = availableStudents.map((student) => ({
    value: student._id,
    label: student.name,
  }))

  const formik = useFormik({
    initialValues: {
      student: '',
      subject: [],
      currentSoftware: '',
    },
    validationSchema,
    onSubmit: (values) => {
      //console.log('values', values)
      const payload = {
        studentId: values.student,
        currentSoftware: values.currentSoftware,
        subjects: formik.values.subject.map((id) => ({subject: id})),
        // subjects: [
        //   {
        //     subject: values.subject,
        //   },
        // ],
        // currentSoftware:
      }

      addStudentMutation.mutate(
        {batchId: batch._id, payload},
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['batches'])
            queryClient.invalidateQueries(['batch', batch._id])
            formik.resetForm()
            onSuccess?.()
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message)
          },
        }
      )
    },
  })

  const getAlreadyAssignedSubjects = (studentId, allBatches) => {
    const assignedSubjectIds = new Set()

    allBatches.forEach((batch) => {
      batch.students?.forEach((s) => {
        const sid = s.student?._id || s.student
        if (sid === studentId) {
          s.subjects?.forEach((sub) => {
            assignedSubjectIds.add(sub.subject?._id || sub.subject)
          })
        }
      })
    })

    return [...assignedSubjectIds]
  }

  const {data: subjects = []} = ctx.useGetStudentSubjectsBasedOnCategory(formik.values.student)

  const alreadyAssignedSubjectIds = getAlreadyAssignedSubjects(formik.values.student, allBatches)

  const filteredSubjects =
    subjects?.data?.map((group) => ({
      ...group,
      subjects: group.subjects.filter(
        (item) => !alreadyAssignedSubjectIds.includes(item.subject._id)
      ),
    })) || []
  //console.log('sub',subjects)
  //console.log('sub1',subjects)
  //console.log('availstu',availableStudents)
  //console.log('subjects',filteredSubjects)
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>Select Student</label>

        <div className='col-12 fv-row'>
          <Select
            options={studentOptions}
            placeholder='Search & select student...'
            isSearchable
            openMenuOnFocus
            openMenuOnClick
            controlShouldRenderValue={false} // keeps search visible
            value={studentOptions.find((opt) => opt.value === formik.values.student)}
            onChange={(option) => formik.setFieldValue('student', option.value)}
            onBlur={() => formik.setFieldTouched('student', true)}
            classNamePrefix='react-select'
            styles={{
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />

          {formik.touched.student && formik.errors.student && (
            <div className='text-danger mt-1'>{formik.errors.student}</div>
          )}
        </div>
      </div>
      {/* <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>Select Student</label>
        <div className='col-12 fv-row'>
          <select
            className={`form-select form-select-lg form-select-solid ${
              formik.touched.student && formik.errors.student ? 'is-invalid' : ''
            }`}
            {...formik.getFieldProps('student')}
            
          >
            <option value='' hidden>Select Student</option>
            {availableStudents.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
          {formik.touched.student && formik.errors.student && (
            <div className='invalid-feedback'>{formik.errors.student}</div>
          )}
          {availableStudents.length === 0 && (
            <small className='text-warning d-block mt-2'>
              All available students are already enrolled in this batch.
            </small>
          )}
        </div>
      </div> */}
      {/* select subject  */}
      <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>Subjects</label>

        <div className='d-flex flex-column '>
          {filteredSubjects.map((sub, i) => (
            <div
              key={sub?.Subjects?._id + i}
              className=' d-flex flex-column align-items-start form-check mb-2'
            >
              {sub?.subjects?.map((item, i) => (
                <div key={item.subject?._id}>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    id={item?.subject?._id}
                    checked={formik.values.subject.includes(item?.subject?._id)}
                    onChange={(e) => {
                      let updated = [...formik.values.subject]

                      if (e.target.checked) {
                        updated.push(item?.subject?._id)
                      } else {
                        updated = updated.filter((id) => id !== item?.subject?._id)
                      }

                      formik.setFieldValue('subject', updated)
                    }}
                  />
                  <label className='form-check-label' htmlFor={item?.subject?._id}>
                    {item?.subject?.subjectName}
                  </label>
                </div>
              ))}
            </div>
          ))}

          {formik.touched.subject && formik.errors.subject && (
            <div className='invalid-feedback d-block'>{formik.errors.subject}</div>
          )}

          <small className='text-muted d-block mt-2'>Select one or more subjects.</small>
        </div>
      </div>

      {/* current software  */}
      {/* <div className='row mb-6'>
        <label className='col-12 col-form-label required fw-bold fs-6'>Current Software</label>
        <div className='col-12 fv-row'>
          <input
            type='text'
            className={`form-control form-control-lg form-control-solid ${
              formik.touched.currentSoftware && formik.errors.currentSoftware ? 'is-invalid' : ''
            }`}
            placeholder='Enter current software name (e.g., Adobe Photoshop)'
            {...formik.getFieldProps('currentSoftware')}
          />
          {formik.touched.currentSoftware && formik.errors.currentSoftware && (
            <div className='invalid-feedback'>{formik.errors.currentSoftware}</div>
          )}
          <small className='text-muted d-block mt-2'>
            This is the software the student will be learning in this batch.
          </small>
        </div>
      </div> */}

      <div className='row'>
        <div className='col-12'>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={addStudentMutation.isLoading || availableStudents.length === 0}
          >
            {addStudentMutation.isLoading ? (
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
            ) : null}
            Add Student to Batch
          </button>
        </div>
      </div>

      {addStudentMutation.error && (
        <div className='alert alert-danger mt-3'>
          {addStudentMutation.error?.message || 'Error adding student to batch'}
        </div>
      )}
    </form>
  )
}

export default AddStudentToBatchForm
