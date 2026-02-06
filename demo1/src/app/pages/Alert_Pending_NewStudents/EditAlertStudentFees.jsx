import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useParams} from 'react-router-dom'

const EditAlertStudentFees = ({studentAlertData, setEditAlertStudentId}) => {
  const params = useParams()
  //console.log(params.id)
  const [amountDate, setAmountDate] = useState(studentAlertData.Date)
  const [dateTime, setDateTime] = useState(studentAlertData.RemainderDateAndTime)
  const [status, setStatus] = useState(studentAlertData.Status) // State to handle status selection
  const [particulars, setParticulars] = useState(studentAlertData.particulars) // State to handle status selection
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
      studentCTX.updateAlertPendingStudentFeesMutation.mutate({
        id: studentAlertData?._id,
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
    setEditAlertStudentId(null)
    setAmountDate(null)
    setParticulars('')
    setDateTime(null)
    setStatus('')
  }

  const handleCancel = () => {
    setEditAlertStudentId(null)
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
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            onClick={handleSave}
            className='btn btn-success btn btn-success btn-active-color-primary text-white btn-sm me-1 px-5'
          >
            Save
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EditAlertStudentFees
