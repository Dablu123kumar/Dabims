import {useState} from 'react'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import {useParams} from 'react-router-dom'

const AddUserNotes = ({userId}) => {
  const params = useParams()
  // console.log(params.id)
  const [particulars, setParticulars] = useState('')
  const [startTime, setStartTime] = useState('')
  // const [endTime, setEndTime] = useState('')
  const studentNotesCTX = useCustomFormFieldContext()
  // console.log(remainder)
  // console.log(particulars)
  //   console.log(studentNotesCTX.createStudentNoteMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentNotesCTX.createStudentNoteMutation.mutate({
      particulars,
      startTime,
      // endTime,
      companyId: params?.id,
      userId: userId,
    })
    setParticulars('')
    setStartTime('')
    // setEndTime('')
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control'
          value={particulars}
          placeholder='Add Particulars...'
          onChange={(e) => setParticulars(e.target.value)}
        />
      </td>
      <td>
        {/* <small className='text-muted fw-bold'>Start Date And Time</small> */}
        <input
          type='datetime-local'
          value={startTime}
          placeholder='DD/MM/YYYY HH:MM'
          onChange={(e) => setStartTime(e.target.value)}
          className='form-control'
        />
        {/* <small className='text-muted fw-bold'>End Date And Time</small> */}
        {/* <input
          type='datetime-local'
          value={endTime}
          placeholder='DD/MM/YYYY HH:MM'
          onChange={(e) => setEndTime(e.target.value)}
          className='form-control'
        /> */}
      </td>
      <td></td>
      <td>
        <button
          disabled={studentNotesCTX.createStudentNoteMutation.isLoading}
          onClick={handleSubmit}
          type='submit'
          className='btn btn-success'
        >
          {studentNotesCTX.createStudentNoteMutation.isLoading ? 'Adding...' : 'Add'}
        </button>
      </td>
    </tr>
  )
}
export default AddUserNotes
