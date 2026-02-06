import {useEffect, useState} from 'react'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const EditStudentNotes = ({studentNote, studentNoteData, setEditStudentNoteId}) => {
  const [particulars, setParticulars] = useState(studentNoteData.particulars)
  const [startTime, setStartTime] = useState(studentNoteData.startTime)
  const studentNoteCTX = useCustomFormFieldContext()

  function formatDateTime(dateTime) {
    if (!dateTime) return '' // Return empty if no date

    const date = new Date(dateTime)

    // Get the YYYY-MM-DD format
    const formattedDate = date.toISOString().slice(0, 10)

    // Get the hours and minutes
    const hours = date.getHours().toString().padStart(2, '0') // Ensures 2 digits for hours
    const minutes = date.getMinutes().toString().padStart(2, '0') // Ensures 2 digits for minutes

    // Combine the date and time to match the 'YYYY-MM-DDTHH:MM' format
    return `${formattedDate}T${hours}:${minutes}`
  }

  // Convert the current startTime to a formatted value
  const formattedDate = formatDateTime(startTime)

  useEffect(() => {
    setParticulars(studentNoteData.particulars)
    setStartTime(studentNoteData.startTime)
  }, [studentNoteData.particulars, studentNoteData.startTime])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter particulars')
      return
    }
    studentNoteCTX.useUpdateStudentNoteMutation.mutate({
      particulars,
      startTime,
      studentId: studentNote,
      id: studentNoteData._id,
    })
    setParticulars('')
    setEditStudentNoteId(null)
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
          onChange={(e) => setParticulars(e.target.value)}
        />
      </td>
      <td>
        <input
          type='datetime-local'
          value={formattedDate || ''}
          id='dateTime'
          onChange={(e) => setStartTime(e.target.value)} // Update startTime directly from input
          className='form-control'
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            disabled={studentNoteCTX.useUpdateStudentNoteMutation.isLoading}
            onClick={handleSubmit}
            type='submit'
            className='btn btn-bg-dark btn-color-primary btn-active-color-info me-1'
          >
            {studentNoteCTX.useUpdateStudentNoteMutation.isLoading ? 'Editing...' : 'Edit'}
          </button>
          <button
            onClick={() => setEditStudentNoteId(null)}
            className='btn btn-bg-dark btn-color-primary btn-active-color-info'
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EditStudentNotes
