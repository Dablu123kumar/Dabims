import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useAuth} from '../../modules/auth'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {KTIcon} from '../../../_metronic/helpers'
import {useCompanyContext} from '../compay/CompanyContext'

const ViewLinkAccount = () => {
  const dayBookAccountCtx = usePaymentOptionContextContext()
  const navigate = useNavigate()
  const {currentUser} = useAuth()
  const studentCTX = useStudentCourseFeesContext()
  const params = useParams()
  //console.log(params.id)
  // console.log(studentCTX.getAllRecieptStatusData?.data?.approvalData)
  const companyCTX = useCompanyContext()
  const result = companyCTX.useGetSingleCompanyData(params.id)
  //   console.log(dayBookAccountCtx.getDayBookAccountsLists.data)

  const accountName = dayBookAccountCtx.getDayBookAccountsLists.data?.filter(
    (cp) => cp?.companyId === params?.id && cp?.accountName === 'Himanshu Walia'
  )

  // console.log(accountName)
  const data = dayBookAccountCtx.getDayBookAccountsLists.data

  const navigateHandler = (accountId) => {
    navigate('/daybook/singleLinkAccount/' + accountId, {state: {data}})
  }

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>
              {result?.data?.companyName} DayBook Accounts
            </span>
          </h3>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add Day Book Account'
          >
            <button
              onClick={() => navigate(`/daybook/addAccount/${params.id}`)}
              className='btn btn-sm btn-light-primary'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add DayBookAccount
            </button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold'>
                  <th className='w-25px'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-150px'>S.NO</th>
                  <th className='min-w-150px'>Account Name</th>
                  <th className='min-w-140px'>Account Type</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {dayBookAccountCtx.getDayBookAccountsLists.isLoading ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <h1 className='text-dark text-center fw-bold text-hover-primary d-block fs-6'>
                        Loading....
                      </h1>
                    </td>
                  </tr>
                ) : (
                  <>
                    {dayBookAccountCtx.getDayBookAccountsLists.data
                      ?.filter((cp) => cp?.companyId === params?.id && cp?.accountType === 'Link')
                      .map((dayBookAccountData, index) => (
                        <tr key={index}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                            </div>
                          </td>
                          <td>
                            <a
                              href='#'
                              className='text-dark fw-bold text-hover-primary d-block fs-6'
                            >
                              {index + 1}
                            </a>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                navigateHandler(dayBookAccountData._id)
                                console.log(dayBookAccountData)
                              }}
                              className='btn  btn-active-color-primary btn-sm text-dark fw-bold text-hover-primary d-block fs-6'
                            >
                              {dayBookAccountData?.accountName}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => navigateHandler(dayBookAccountData._id)}
                              className='btn  btn-active-color-primary btn-sm text-dark fw-bold text-hover-primary d-block fs-6'
                            >
                              {dayBookAccountData?.accountType}
                            </button>
                          </td>

                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <button
                                onClick={() =>
                                  navigate(`/daybook/editAccount/${dayBookAccountData._id}`, {
                                    state: dayBookAccountData,
                                  })
                                }
                                className='btn  btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </button>
                              <button
                                onClick={() =>
                                  dayBookAccountCtx.deleteDayBooksAccountMutation.mutate(
                                    dayBookAccountData._id
                                  )
                                }
                                className='btn  btn-bg-light btn-active-color-primary btn-sm'
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </>
  )
}

export default ViewLinkAccount
