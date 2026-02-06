import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {toast} from 'react-toastify'

const addAccountSchema = Yup.object().shape({
  accountName: Yup.string().required('Account Name is required'),
  accountType: Yup.string().required('Account Type is required'),
})

const EditDayBookAccount = () => {
  const navigate = useNavigate()
  const location = useLocation()
  //console.log(location.state)

  let initialValues = {
    accountName: location.state.accountName,
    accountType: location.state.accountType,
  }

  const dayBookAccountCtx = usePaymentOptionContextContext()
  // console.log(dayBookAccountCtx.updateDayBookAccountsMutation)

  const result = dayBookAccountCtx.useGetSingleDayBookAccount(location?.state?._id)
  //console.log(result?.data?.companyId?.companyName)

  const formik = useFormik({
    initialValues,
    validationSchema: addAccountSchema,
    onSubmit: async (values) => {
      //console.log(values)
      dayBookAccountCtx.updateDayBookAccountsMutation.mutate({_id: location.state._id, ...values})
      formik.setFieldValue('accountName', '')
      formik.setFieldValue('accountType', '--select--')
      navigate(`/daybook/viewAccount/${location?.state?.companyId}`)
      toast(`Day book Account Updated successfully`, {
        type: 'success',
        bodyStyle: {
          fontSize: '18px',
        },
      })
    },
  })
  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>
                {result?.data?.companyId?.companyName}
              </span>
              <span className='text-muted mt-1 fw-semibold fs-7'>Edit Account In DayBook</span>
            </h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                {/* -------------------------- Account Name Start here ----------------------------- */}

                <label className='col-6 col-form-label fw-bold fs-6'>
                  Account Name{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Account Name..'
                      {...formik.getFieldProps('accountName')}
                    />
                    {formik.touched.accountName && formik.errors.accountName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.accountName}</div>
                      </div>
                    )}
                  </div>
                </label>

                {/* -------------------------- Account Name End here ----------------------------- */}

                {/* ----------------------- Account Type Start----------------------------- */}
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Account Type{' '}
                  <div className='fv-row mt-5 '>
                    <select
                      className='form-select form-select-solid form-select-lg'
                      {...formik.getFieldProps('accountType')}
                    >
                      <option value=''>--select--</option>
                      <option value={'Expense'}>Expense</option>
                      <option value={'Income'}>Income</option>
                      <option value={'Commission'}>Commission</option>
                      <option value={'Link'}>Link</option>
                    </select>
                    {formik.touched.accountType && formik.errors.accountType && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.accountType}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Account Type End ----------------------------- */}
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={dayBookAccountCtx.updateDayBookAccountsMutation.isLoading}
              >
                Edit Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default EditDayBookAccount
