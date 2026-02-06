import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const PaymentOptionForm = ({addPaymentOption, setAddPaymentOption, setPaymentOptionForm}) => {
  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td></td>
      <td>
        <input
          type='text'
          className='form-control w-50 '
          value={addPaymentOption.name}
          onChange={(e) => setAddPaymentOption({...addPaymentOption, name: e.target.value})}
        />
      </td>
      <td></td>
      <td>
        <DatePicker
          selected={addPaymentOption.date}
          onChange={(date) => setAddPaymentOption({...addPaymentOption, date: date})}
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
            Add
          </button>
          <button
            onClick={() => setPaymentOptionForm(false)}
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
export default PaymentOptionForm
