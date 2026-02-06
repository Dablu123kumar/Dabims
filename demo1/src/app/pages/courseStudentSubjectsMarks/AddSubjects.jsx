import {useState} from 'react'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'

const AddSubjects = ({setOpenModal, studentId, semYear}) => {
  const courseSubjectsCtx = useCourseSubjectContext()
  const [loading, setLoading] = useState(false)
  const [newSubject, setNewSubject] = useState({
    subjectName: '',
    subjectCode: '',
    fullMarks: 0,
    passMarks: 0,
  })

  const handleAddSubject = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Add the subject using mutation
      courseSubjectsCtx.createCourseSubjectMutation.mutate(
        {
          ...newSubject,
          studentInfo: studentId,
          AddOnSubjects: 'AddOnSubject',
          course: JSON.parse(localStorage.getItem('AddedNewCourse'))?._id,
          courseType: JSON.parse(localStorage.getItem('AddedNewCourse'))?.courseType,
          semYear: semYear[0],
        },
        {
          // Success callback
          onSuccess: () => {
            setLoading(false)
            setOpenModal(false)
            setNewSubject({subjectName: '', subjectCode: '', fullMarks: 0, passMarks: 0})
            toast.success('Subject added successfully! 🎉', {
              autoClose: 3000, // 3 seconds
            })
          },
          // Error callback
          onError: (error) => {
            setLoading(false)
            toast.error(`Failed to add subject: ${error.message}`, {
              autoClose: 3000,
            })
          },
        }
      )
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  //   console.log(semYear[0])

  return (
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
              value={newSubject.subjectName}
              onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
              placeholder='Enter subject name...'
              className='form-control w-75'
              required={'required'}
            />
          </td>
          <td>
            <input
              type='text'
              value={newSubject.subjectCode}
              onChange={(e) => setNewSubject({...newSubject, subjectCode: e.target.value})}
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
              value={newSubject.fullMarks}
              onChange={(e) => setNewSubject({...newSubject, fullMarks: e.target.value})}
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
              value={newSubject.passMarks}
              onChange={(e) => setNewSubject({...newSubject, passMarks: e.target.value})}
              placeholder='Enter pass Marks...'
            />
          </td>
          {/* <td></td> */}
          <td></td>

          <td>
            <div className='d-flex justify-content-end flex-shrink-0'>
              <button
                type='button'
                onClick={handleAddSubject}
                disabled={loading === true}
                className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
              >
                {loading === true ? 'Adding' : 'Add'}
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
  )
}

export default AddSubjects
