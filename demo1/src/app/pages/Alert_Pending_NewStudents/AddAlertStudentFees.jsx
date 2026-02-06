import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useParams} from 'react-router-dom'

const AddAlertStudentFees = ({}) => {
  const params = useParams()
  //console.log(params.id)
  const [amountDate, setAmountDate] = useState(Date.now())
  const [dateTime, setDateTime] = useState(null)
  const [status, setStatus] = useState('pending') // State to handle status selection
  const [particulars, setParticulars] = useState('') // State to handle status selection
  const studentCTX = useAdmissionContext()

  const handleSave = () => {
    // Handle save logic here
    if (amountDate === null) {
      alert('Please select the date')
      return
    }
    if (particulars === '') {
      alert('Please enter the particulars')
      return
    }
    if (dateTime === null) {
      alert('Please select the Remainder date and time')
      return
    }

    if (status === '') {
      alert('Please select status')
      return
    }
    try {
      studentCTX.createAlertStudentPendingFeesMutation.mutate({
        Date: amountDate,
        RemainderDateAndTime: dateTime,
        Status: status,
        particulars: particulars,
        studentId: params.id,
      })
    } catch (error) {
      //console.log(error.message)
      return
    }
    //console.log('Save button clicked', amountDate, dateTime, status, particulars)
    setAmountDate(null)
    setParticulars('')
    setDateTime(null)
    setStatus('pending')
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td>
        <DatePicker
          selected={amountDate}
          onChange={(date) => setAmountDate(date)}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td>
        <input
          className='form-control'
          value={particulars}
          onChange={(e) => setParticulars(e.target.value)}
        />
      </td>
      <td>
        <DatePicker
          selected={dateTime}
          onChange={(date) => setDateTime(date)}
          dateFormat='dd/MM/yyyy hh:mm aa'
          showTimeInput
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY HH:mm'
        />
      </td>
      <td>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='form-select form-select-solid form-select-lg'
        >
          <option value=''>Select Status</option>
          <option value='pending'>Pending</option>
          <option value='done'>Done</option>
          <option value='failed'>Failed</option> {/* Corrected "failed" to "Failed" */}
        </select>
      </td>
      <td className='text-end'>
        <button className='btn btn-primary' onClick={handleSave}>
          Save
        </button>
      </td>
    </tr>
  )
}

export default AddAlertStudentFees
