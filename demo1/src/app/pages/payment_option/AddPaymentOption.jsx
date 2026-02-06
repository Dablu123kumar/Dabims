/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'

import PaymentOptionForm from './PaymentOptionForm'
import {usePaymentOptionContextContext} from './PaymentOption.Context'
import ReadPaymentOptionOnly from './ReadPaymentOptionOnly'
import EditPaymentOption from './EditPaymentOption'

const AddPaymentOption = ({}) => {
  const paymentOptionCtx = usePaymentOptionContextContext()

  //console.log(paymentOptionCtx.getPaymentOptionsData.data)

  const [paymentOptionForm, setPaymentOptionForm] = useState(false)

  const [addPaymentOption, setAddPaymentOption] = useState({
    name: '',
    date: Date.now(),
  })

  const paymentOptionformToggleHandler = () => {
    setPaymentOptionForm((prev) => !prev)
  }

  const addPaymentOptionSubmitHandler = (e) => {
    e.preventDefault()
    paymentOptionCtx.createNewPaymentOptionMutation.mutate(addPaymentOption)
    setPaymentOptionForm(false)
    setAddPaymentOption({name: '', date: Date.now()})
  }

  const [paymentOptionId, setPaymentOptionId] = useState(null)

  const [editPaymentOption, setEditPaymentOption] = useState({
    name: '',
    date: '',
    createdBy: '',
  })

  const handleEditPaymentOption = (id, editData) => {
    setPaymentOptionId(id)
    setEditPaymentOption({
      _id: id,
      name: editData.name,
      date: editData.date,
      createdBy: editData.createdBy,
    })
  }

  const editPaymentOptionSubmitHandler = (e) => {
    e.preventDefault()
    //console.log(editPaymentOption)
    paymentOptionCtx.updatePaymentOptionsMutation.mutate(editPaymentOption)
    setPaymentOptionId(null)
  }

  const deletePaymentOptionHandler = (e, id) => {
    if (!window.confirm('Are you sure you want to delete this payment option?')) {
      return
    }
    e.preventDefault()
    paymentOptionCtx.deletePaymentOptionMutation.mutate(id)
    setPaymentOptionId(null)
  }

  return (
    <div className={`card `}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Payment Options</span>
          <span className='text-muted mt-1 fw-semibold fs-7'></span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a payment that you want'
        >
          <button onClick={paymentOptionformToggleHandler} className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-3' />
            New Payment
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <form
            onSubmit={
              paymentOptionId ? editPaymentOptionSubmitHandler : addPaymentOptionSubmitHandler
            }
          >
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold fs-4'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-150px'>Sr.No</th>
                  <th className='min-w-140px'>Payment Name</th>
                  <th className='min-w-120px'>Created By </th>
                  <th className='min-w-120px'>Date </th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {paymentOptionForm && (
                  <PaymentOptionForm
                    addPaymentOption={addPaymentOption}
                    setAddPaymentOption={setAddPaymentOption}
                    setPaymentOptionForm={setPaymentOptionForm}
                  />
                )}
                {paymentOptionCtx.getPaymentOptionsData.data &&
                  paymentOptionCtx.getPaymentOptionsData.data.map((paymentOption, index) => (
                    <React.Fragment key={paymentOption._id}>
                      {paymentOption._id === paymentOptionId ? (
                        <EditPaymentOption
                          paymentOption={paymentOption}
                          index={index}
                          editPaymentOption={editPaymentOption}
                          setEditPaymentOption={setEditPaymentOption}
                          setPaymentOptionId={setPaymentOptionId}
                        />
                      ) : (
                        <ReadPaymentOptionOnly
                          paymentOption={paymentOption}
                          index={index}
                          deletePaymentOptionHandler={deletePaymentOptionHandler}
                          handleEditPaymentOption={handleEditPaymentOption}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
              {/* end::Table body */}
            </table>
          </form>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export default AddPaymentOption
