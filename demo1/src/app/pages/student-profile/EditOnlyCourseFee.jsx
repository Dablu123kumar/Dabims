import {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const EditOnlyCourseFee = ({
  StudentFee,
  setStudentCourseFeesEditId,
  setEditStudentCourseFees,
  editStudentCourseFees,
}) => {
  //console.log(StudentFee)
  useEffect(() => {
    setEditStudentCourseFees(StudentFee)
    setEditStudentCourseFees((prev) => ({
      ...prev,
      paymentOption: StudentFee.paymentOption._id,
    }))
  }, [])

  const remainingFeesHandler = (e) => {
    setEditStudentCourseFees((prev) => {
      return {
        ...prev,
        amountPaid: Number(e.target.value),
        remainingFees: Number(prev.netCourseFees) - Number(e.target.value),
      }
    })
  }

  const paymentOptionCtx = usePaymentOptionContextContext()
  // console.log(paymentOptionCtx.getPaymentOptionsData.data)

  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control w-min-150px'
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              netCourseFees: Number(e.target.value),
            })
          }
          value={editStudentCourseFees.netCourseFees}
          readOnly
        />
      </td>
      <td>
        <input
          type='text'
          className='form-control w-min-150px'
          onChange={remainingFeesHandler}
          value={editStudentCourseFees.amountPaid}
        />
        <input
          type='text'
          placeholder='Enter Narration...'
          className='form-control min-w-150px '
          value={editStudentCourseFees.narration}
          onChange={(e) =>
            setEditStudentCourseFees({...editStudentCourseFees, narration: e.target.value})
          }
        />
      </td>
      <td>
        <input
          className='form-control w-min-150px'
          type='text'
          value={editStudentCourseFees.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={editStudentCourseFees.amountDate} // Should match the structure of editStudentCourseFees
          onChange={(date) =>
            setEditStudentCourseFees({...editStudentCourseFees, amountDate: date})
          }
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid w-min-140px'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td>
        <input
          type='text'
          value={editStudentCourseFees.reciptNumber}
          className='form-control w-min-150px'
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              reciptNumber: e.target.value,
            })
          }
        />
      </td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg'
          value={editStudentCourseFees.paymentOption}
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              paymentOption: e.target.value,
            })
          }
        >
          <option value=''>select payment option</option>
          {/* <option value='cash'>Cash</option>
          <option value='google pay'>Google Pay</option>
          <option value='paytm'>Paytm</option>
          <option value='card'>Card</option>
          <option value='debit card'>Debit Card</option> */}

          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
            <option key={paymentOpt._id} value={paymentOpt._id}>
              {paymentOpt.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type='text'
          className='form-control w-min-150px'
          value={editStudentCourseFees.lateFees}
          onChange={(e) =>
            setEditStudentCourseFees({
              ...editStudentCourseFees,
              lateFees: Number(e.target.value),
            })
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn btn-success btn-active-color-primary text-white btn-sm me-1 px-5'
          >
            Save
          </button>
          <button
            type='button'
            onClick={() => setStudentCourseFeesEditId(null)}
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EditOnlyCourseFee
