import React, {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {toast} from 'react-toastify'
import {useParams} from 'react-router-dom'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'

const AddDayBookData = ({totalBalance, companyId}) => {
  const params = useParams()
  const [openModal, setOpenModal] = useState(false)

  const [formData, setFormData] = useState({
    dayBookDatadate: new Date(),
    accountName: '',
    linkAccountName: '',
    linkAccountId: '',
    linkAccountType: '',
    naretion: '',
    debit: 0,
    credit: 0,
    dayBookAccountId: '',
    accountType: '',
    companyId: params.id ? params.id : companyId,
  })

  const dayBookAccountCtx = usePaymentOptionContextContext()

  const handleDateChange = (date) => {
    setFormData((prevState) => ({...prevState, dayBookDatadate: date}))
  }

  const handleAccountNameChange = (event) => {
    const selectedAccount = dayBookAccountCtx.getDayBookAccountsLists.data
      ?.filter((cp) => cp.companyId === params?.id)
      ?.find((item) => item.accountName === event.target.value)

    setFormData((prevState) => ({
      ...prevState,
      accountName: event.target.value,
      accountType: selectedAccount ? selectedAccount.accountType : '',
      dayBookAccountId: selectedAccount ? selectedAccount._id : '',
    }))
  }

  const handleLinkAccountNameChange = (event) => {
    const selectedAccount = dayBookAccountCtx.getDayBookAccountsLists.data
      ?.filter((cp) => cp.companyId === params?.id && cp.accountType === 'Link')
      ?.find((item) => item.accountName === event.target.value)

    setFormData((prevState) => ({
      ...prevState,
      linkAccountName: event.target.value,
      linkAccountId: selectedAccount ? selectedAccount._id : '',
      linkAccountType: selectedAccount ? selectedAccount.accountType : '',
    }))
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePopup = () => {
    setOpenModal(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const {accountName, naretion, debit, credit} = formData

    if (!accountName) {
      toast.error('Please select account name', {bodyStyle: {fontSize: '18px'}})
      return
    }

    if (!naretion) {
      toast.error('Please enter narration', {bodyStyle: {fontSize: '18px'}})
      return
    }

    // Check if both debit and credit have values
    if (debit > 0 && credit > 0) {
      toast.error('You can only enter either credit or debit, not both', {
        bodyStyle: {fontSize: '18px'},
      })
      return
    }

    if (credit === 0 && debit === 0) {
      toast.error('Please enter either credit or debit', {bodyStyle: {fontSize: '18px'}})
      return
    }

    try {
      dayBookAccountCtx.createDayBookDataMutation.mutate({
        ...formData,
        companyId: params?.id,
        linkDayBookAccountData: formData.linkAccountId, // Ensure this matches the schema
      })
      setFormData({
        dayBookDatadate: new Date(),
        accountName: '',
        linkAccountName: '',
        linkAccountId: '',
        naretion: '',
        debit: 0,
        credit: 0,
        dayBookAccountId: '',
        accountType: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <tr>
        <td>
          <div className='form-check form-check-sm form-check-custom form-check-solid'>
            {/* Checkbox code (if needed) */}
          </div>
        </td>
        <td></td>
        <td>
          <DatePicker
            selected={formData.dayBookDatadate}
            onChange={handleDateChange}
            dateFormat='dd/MM/yyyy'
            className='form-control form-control-lg form-control-solid'
            placeholderText='DD/MM/YYYY'
          />
        </td>
        <td></td>
        {formData.linkAccountName == '' ? <td></td> : ''}
        <td>
          <input
            type='search'
            className='form-control'
            value={formData.accountName}
            onChange={handleAccountNameChange}
            list='accountNameOptions'
            placeholder='Search account'
          />
          <datalist id='accountNameOptions'>
            {dayBookAccountCtx.getDayBookAccountsLists.data
              ?.filter((cp) => cp.companyId === params.id && cp.accountType !== 'Link')
              .map((item) => (
                <option key={item._id} value={item.accountName}>
                  {item.accountName}
                </option>
              ))}
          </datalist>
        </td>
        {formData.linkAccountName !== '' ? (
          <td>
            <input
              type='search'
              className='form-control'
              value={formData.linkAccountName}
              onChange={handleLinkAccountNameChange}
              list='accountLinkNameOptions'
              placeholder='Search Link account'
            />
            <datalist id='accountLinkNameOptions'>
              {dayBookAccountCtx.getDayBookAccountsLists.data
                ?.filter((cp) => cp.companyId === params.id && cp.accountType == 'Link')
                .map((item) => (
                  <option key={item._id} value={item.accountName}>
                    {item.accountName}
                  </option>
                ))}
            </datalist>
          </td>
        ) : (
          ''
        )}
        <td>
          <input
            type='text'
            className='form-control'
            name='naretion'
            placeholder='Enter narration'
            value={formData.naretion}
            onChange={handleInputChange}
          />
        </td>
        <td>
          <input
            type='number'
            className='form-control'
            name='credit'
            placeholder='Enter credit'
            value={formData.credit}
            onChange={handleInputChange}
            disabled={+formData.debit !== 0}
          />
        </td>
        <td>
          <input
            type='number'
            className='form-control'
            name='debit'
            placeholder='Enter debit'
            value={formData.debit}
            onChange={handleInputChange}
            disabled={+formData.credit !== 0}
          />
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <button
              type='button'
              className='btn btn-danger btn-active-color-info btn-sm me-1 px-5'
              onClick={handlePopup}
            >
              Link
            </button>
            <button
              type='submit'
              className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </td>
      </tr>

      {openModal === true ? (
        <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
          <div className='p-5 my-5'>
            <input
              type='search'
              className='form-control'
              value={formData.linkAccountName}
              onChange={handleLinkAccountNameChange}
              list='accountLinkNameOptions'
              placeholder='Search Link account'
            />
            <datalist id='accountLinkNameOptions'>
              {dayBookAccountCtx.getDayBookAccountsLists.data
                ?.filter((cp) => cp.companyId === params.id && cp.accountType == 'Link')
                .map((item) => (
                  <option key={item._id} value={item.accountName}>
                    {item.accountName}
                  </option>
                ))}
            </datalist>
          </div>
        </PopUpModal>
      ) : (
        ''
      )}
    </>
  )
}

export default AddDayBookData
