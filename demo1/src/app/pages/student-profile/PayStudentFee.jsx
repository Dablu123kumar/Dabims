import React, {useState, useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {Fragment} from 'react'
import {toast} from 'react-toastify'

const PayStudentFee = ({
  payStudentFeesAdd,
  setPayStudentFeesAdd,
  setAddStudentFeeFormToggle,
  studentInfoData,
}) => {
  const paymentOptionCtx = usePaymentOptionContextContext()
  // console.log(studentInfoData)
  // Set initial date to current date if not already set
  useEffect(() => {
    if (!payStudentFeesAdd.amountDate) {
      setPayStudentFeesAdd((prev) => ({...prev, amountDate: new Date()}))
    }
  }, [payStudentFeesAdd.amountDate, setPayStudentFeesAdd])

  useEffect(() => {
    if (!studentInfoData?.installment_duration) {
      toast.info('First add the installment due date of student !!')
    } else {
      const installmentDuration = new Date(studentInfoData.installment_duration)
      const amountDate = payStudentFeesAdd.amountDate || new Date()

      // Set the time to 00:00:00 to avoid any time differences
      installmentDuration.setHours(0, 0, 0, 0)
      amountDate.setHours(0, 0, 0, 0)

      // Check if the payment is for the current month
      const isCurrentMonthPayment =
        amountDate.getFullYear() === installmentDuration.getFullYear() &&
        amountDate.getMonth() === installmentDuration.getMonth()

      // Calculate the difference in days
      let overdueDays = 0
      if (isCurrentMonthPayment) {
        // If payment is for the current month, calculate overdue days from installment duration
        overdueDays = Math.ceil((amountDate - installmentDuration) / (1000 * 60 * 60 * 24))
      }

      const lateFees = overdueDays > 0 ? overdueDays * 100 : 0

      setPayStudentFeesAdd((prev) => ({...prev, lateFees}))
    }
  }, [studentInfoData?.installment_duration, payStudentFeesAdd.amountDate])

  const remainingFeesHandler = (e) => {
    setPayStudentFeesAdd((prev) => ({
      ...prev,
      amountPaid: Number(e.target.value),
      remainingFees: (Number(prev.netCourseFees) - Number(e.target.value)).toFixed(2),
    }))
  }

  const handleDateChange = (date) => {
    setPayStudentFeesAdd((prevState) => ({
      ...prevState,
      amountDate: date,
    }))
  }

  return (
    <tr>
      <td></td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control min-w-150px'
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, netCourseFees: Number(e.target.value)})
          }
          value={payStudentFeesAdd.netCourseFees}
          readOnly
        />
      </td>
      <td>
        <input
          type='number'
          placeholder='Enter Amount...'
          className='form-control min-w-150px'
          onChange={remainingFeesHandler}
          value={payStudentFeesAdd.amountPaid}
        />
        <input
          type='text'
          placeholder='Enter Narration...'
          onChange={(e) => setPayStudentFeesAdd({...payStudentFeesAdd, narration: e.target.value})}
          value={payStudentFeesAdd.narration}
          className='form-control min-w-150px'
        />
      </td>
      <td>
        <input
          className='form-control min-w-150px'
          type='text'
          value={payStudentFeesAdd.remainingFees}
          readOnly
        />
      </td>
      <td>
        <DatePicker
          selected={payStudentFeesAdd.amountDate}
          onChange={handleDateChange}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid min-w-150px'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td className='min-w-0px'></td>
      <td>
        <select
          className='form-select form-select-solid form-select-lg min-w-150px'
          value={payStudentFeesAdd.paymentOption}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, paymentOption: e.target.value})
          }
        >
          <option>select payment option</option>
          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
            <Fragment key={paymentOpt._id}>
              <option key={paymentOpt._id} value={paymentOpt._id}>
                {paymentOpt.name}
              </option>
            </Fragment>
          ))}
        </select>
      </td>
      <td>
        <input
          type='text'
          className='form-control w-min-100px'
          value={payStudentFeesAdd.lateFees}
          onChange={(e) =>
            setPayStudentFeesAdd({...payStudentFeesAdd, lateFees: Number(e.target.value)})
          }
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          {!studentInfoData?.installment_duration ? null : ( // No toast here, handled in useEffect
            <button
              type='submit'
              className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            >
              Pay
            </button>
          )}
          <button
            type='button'
            onClick={() => setAddStudentFeeFormToggle(false)}
            className='btn btn-danger btn-active-color-primary btn-sm me-1 px-5'
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PayStudentFee
