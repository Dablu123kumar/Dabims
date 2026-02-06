import {useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const AddStudentIssue = ({studentInfoData}) => {
  const [particulars, setParticulars] = useState('')
  const studentIssueCTX = useCompanyContext()
  //console.log(studentIssueCTX.createStudentIssueMutation.isLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!particulars) {
      alert('Please enter a particulars')
      return
    }
    studentIssueCTX.createStudentIssueMutation.mutate({particulars, studentId: studentInfoData})
    setParticulars('')
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
        <button
          disabled={studentIssueCTX.createStudentIssueMutation.isLoading}
          onClick={handleSubmit}
          type='submit'
          className='btn btn-success'
        >
          {studentIssueCTX.createStudentIssueMutation.isLoading ? 'Adding...' : 'Add'}
        </button>
      </td>
    </tr>
  )
}
export default AddStudentIssue
