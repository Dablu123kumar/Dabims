import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {toast} from 'react-toastify'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {useState} from 'react'

const AddDayBookAccountFromDayBook = ({setShowAddAccountBtn}) => {
  const params = useParams()
  const [initialValues, setInitialValues] = useState({
    accountName: '',
    accountType: '',
    companyId: params?.id,
  })

  const dayBookAccountCtx = usePaymentOptionContextContext()

  const addDayBookAccountHandler = async () => {
    try {
      if (initialValues.accountName === '') {
        toast.error('Account Name is required')
        return
      }
      if (initialValues.accountType === '') {
        toast.error('Account Type is required')
        return
      }
      await dayBookAccountCtx.createDayBookAccountMutation.mutateAsync(initialValues)
      toast.success('Day Book Account Created Successfully!!', {
        bodyStyle: {
          fontSize: '18px',
        },
      })
      setShowAddAccountBtn(false)
    } catch (error) {
      toast.error('Failed to create Day Book Account')
    }
  }

  return (
    <tr>
      <td></td>
      <td></td>
      {/* -------------------------- Account Name Start here ----------------------------- */}
      <td>
        <input
          type='text'
          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
          placeholder='Enter Account Name..'
          value={initialValues.accountName}
          onChange={(e) => setInitialValues((prev) => ({...prev, accountName: e.target.value}))}
        />
      </td>
      {/* -------------------------- Account Name End here ----------------------------- */}
      <td>
        {/* ----------------------- Account Type Start----------------------------- */}
        <select
          className='form-select form-select-solid form-select-lg'
          value={initialValues.accountType}
          onChange={(e) => setInitialValues((prev) => ({...prev, accountType: e.target.value}))}
        >
          <option value=''>--select--</option>
          <option value='Expense'>Expense</option>
          <option value='Income'>Income</option>
          <option value='Commission'>Commission</option>
          <option value='Link'>Link</option>
        </select>
        {/* ----------------------- Account Type End ----------------------------- */}
      </td>
      <td>
        <button
          onClick={addDayBookAccountHandler}
          type='submit'
          className='btn btn-success'
          disabled={dayBookAccountCtx.createDayBookAccountMutation.isLoading}
        >
          Add Account
        </button>
      </td>
    </tr>
  )
}

export default AddDayBookAccountFromDayBook
