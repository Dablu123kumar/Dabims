import {useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const EditPaymentOption = ({
  index,
  editPaymentOption,
  setEditPaymentOption,
  setPaymentOptionId,
}) => {
  return (
    <tr key={index}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td>{index + 1}</td>
      <td>
        <input
          type='text'
          value={editPaymentOption.name}
          onChange={(e) => setEditPaymentOption((prev) => ({...prev, name: e.target.value}))}
          className='form-control w-50 '
        />
      </td>
      <td>{editPaymentOption.createdBy}</td>
      <td>
        <DatePicker
          selected={editPaymentOption.date}
          onChange={(date) => setEditPaymentOption((prev) => ({...prev, date: date}))}
          dateFormat='dd/MM/yyyy'
          className='form-control form-control-lg form-control-solid'
          placeholderText='DD/MM/YYYY'
        />
      </td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            Edit
          </button>
          <button
            onClick={() => setPaymentOptionId(null)}
            type='button'
            className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
export default EditPaymentOption
