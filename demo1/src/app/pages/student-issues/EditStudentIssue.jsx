import {useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const EditStudentIssue = ({studentInfoData, studentIssueData, setEditStudentIssueId}) => {
  const [particulars, setParticulars] = useState(studentIssueData.particulars)
  //console.log(studentInfoData)
  const studentIssueCTX = useCompanyContext()
  //console.log(studentIssueCTX.useUpdateStudentIssueMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentIssueCTX.useUpdateStudentIssueMutation.mutate({
      particulars,
      studentId: studentInfoData,
      id: studentIssueData._id,
    })
    setParticulars('')
    setEditStudentIssueId(null)
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
      <td></td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            disabled={studentIssueCTX.useUpdateStudentIssueMutation.isLoading}
            onClick={handleSubmit}
            type='submit'
            className='btn  btn-bg-dark btn-color-primary btn-active-color-info  me-1'
          >
            {studentIssueCTX.useUpdateStudentIssueMutation.isLoading ? 'Editing...' : 'Edit'}
          </button>
          <button
            onClick={() => setEditStudentIssueId(null)}
            className='btn btn-bg-dark btn-color-primary btn-active-color-info '
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
export default EditStudentIssue
