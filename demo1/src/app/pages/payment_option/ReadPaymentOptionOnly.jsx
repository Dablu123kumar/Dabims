import moment from 'moment'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {usePaymentOptionContextContext} from './PaymentOption.Context'

const ReadPaymentOptionOnly = ({
  paymentOption,
  index,
  deletePaymentOptionHandler,
  handleEditPaymentOption,
}) => {
  const paymentOptionCtx = usePaymentOptionContextContext()
  // console.log(paymentOptionCtx.getPaymentOptionsData.data)
  return (
    <tr key={paymentOption._id}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td className='fw-bold fs-5'>{index + 1}</td>
      <td className='fw-bold fs-5'>{paymentOption.name}</td>
      <td className='fw-bold fs-5'>{paymentOption.createdBy}</td>
      <td className='fw-bold fs-5'>{moment(paymentOption.date).format('DD/MM/YYYY')}</td>

      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            onClick={() => handleEditPaymentOption(paymentOption._id, paymentOption)}
            type='button'
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTIcon iconName='pencil' className='fs-3' />
          </button>
          <button
            onClick={(e) => deletePaymentOptionHandler(e, paymentOption._id)}
            type='button'
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
          >
            <KTIcon iconName='trash' className='fs-3' />
          </button>
        </div>
      </td>
    </tr>
  )
}
export default ReadPaymentOptionOnly
