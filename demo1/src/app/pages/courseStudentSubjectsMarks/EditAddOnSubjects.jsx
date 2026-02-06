import {useEffect, useState} from 'react'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {toast} from 'react-toastify'

const EditAddOnSubjects = ({setOpenModal, editSubjectId, semYear, subjects, setSubjects}) => {
  const ctx = useCourseSubjectContext()
  const [loading, setLoading] = useState(false)

  //   console.log(subjects)

  const handleEditSubject = () => {
    setLoading(true)
    let updatedData = {
      _id: editSubjectId,
      subjectName: subjects.subjectName,
      subjectCode: subjects.subjectCode,
      fullMarks: subjects.fullMarks,
      passMarks: subjects.passMarks,
      course: subjects?.course?._id,
      courseType: subjects?.courseType?._id,
      semYear: semYear,
    }
    ctx.updateCourseCategoryMutation.mutate(updatedData, {
      onSuccess: () => {
        toast.success('Subject Updated successfully!! 🎉', {
          autoClose: 3000, // 3 seconds
          style: {
            fontSize: '1rem',
          },
        })
      },
    })
    window.location.reload()
    setOpenModal(false)
  }

  return (
    <>
      <table>
        <thead>
          <th>Subject Name</th>
          <th>Subject Code</th>
          <th>Full Marks</th>
          <th>Pass Marks</th>
          {/* <th>Actions</th> */}
        </thead>
        <tbody>
          <tr>
            {/* <td>
          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
        </td> */}
            {/* <td></td> */}
            <td>
              <input
                type='text'
                value={subjects.subjectName}
                onChange={(e) => setSubjects({...subjects, subjectName: e.target.value})}
                placeholder='Enter subject name...'
                className='form-control w-75'
                required={'required'}
              />
            </td>
            <td>
              <input
                type='text'
                value={subjects.subjectCode}
                onChange={(e) => setSubjects({...subjects, subjectCode: e.target.value})}
                placeholder='Enter subject code...'
                className='form-control w-75'
                required={'required'}
              />
            </td>
            <td>
              <input
                type='number'
                min={1}
                max={5000}
                value={subjects.fullMarks}
                onChange={(e) => setSubjects({...subjects, fullMarks: e.target.value})}
                placeholder='Enter full Marks...'
                className='form-control w-75'
              />
            </td>
            <td>
              <input
                className='form-control w-75'
                type='number'
                min={1}
                max={5000}
                value={subjects.passMarks}
                onChange={(e) => setSubjects({...subjects, passMarks: e.target.value})}
                placeholder='Enter pass Marks...'
              />
            </td>
            {/* <td></td> */}
            <td></td>

            <td>
              <div className='d-flex justify-content-end flex-shrink-0'>
                <button
                  type='button'
                  onClick={handleEditSubject}
                  disabled={loading === true}
                  className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
                >
                  {loading ? 'Updating' : 'Update'}
                </button>
                <button
                  type='button'
                  onClick={() => setOpenModal(false)}
                  className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default EditAddOnSubjects
