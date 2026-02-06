import axios from 'axios'
import React from 'react'
import {useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import moment from 'moment'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const BASE_URL = process.env.REACT_APP_BASE_URL

const ShowSingleLinkAccountData = () => {
  const {auth, currentUser} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }
  const params = useParams()
  const studentCTX = useStudentCourseFeesContext()
  const dayBookAccountCtx = usePaymentOptionContextContext()
  const navigate = useNavigate()
  const {id} = useParams()
  const location = useLocation()

  const {data, isLoading} = useQuery({
    queryKey: ['getDayBookDataLists', id],
    queryFn: async () => {
      return axios
        .get(`${BASE_URL}/api/dayBook/singleAccountDayBookLists/${id}`, config)
        .then((res) => res.data)
    },
  })
  //   console.log(
  //     dayBookAccountCtx?.getDayBookDataQuery?.data?.filter(
  //       (cp) => cp.linkAccountType === 'Link' && cp.linkDayBookAccountData === params?.id
  //     )
  //   )
  const linkedAccountData = dayBookAccountCtx?.getDayBookDataQuery?.data?.filter(
    (cp) => cp.linkAccountType === 'Link' && cp?.linkDayBookAccountData?._id == params?.id
  )
  //   console.log(location?.state?.data)
  console.log(linkedAccountData)
  // console.log(params?.id)
  let credit = 0
  // const result = dayBookAccountCtx.useGetSingleDayBookAccount(id)

  const result = useQuery({
    queryKey: ['getDayBookAccountsLists', id],
    queryFn: async () => {
      return axios.get(`${BASE_URL}/api/dayBook/singleAccountAccount/${id}`).then((res) => res.data)
    },
  })
  //   console.log(result.data)
  let debitAmount = 0
  let creditAmount = 0

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
              {linkedAccountData && linkedAccountData?.[0]?.linkDayBookAccountData?.accountName}
            </span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              {' '}
              {result.data?.companyId?.companyName}
            </span>
          </h3>
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
                  <th className='min-w-50px'>SR.NO</th>
                  <th className='min-w-50px'>Created At</th>
                  <th className='min-w-80px'>Actual Account</th>
                  <th className='min-w-200px'>Narration</th>
                  <th className='min-w-50px'>Credit</th>
                  <th className='min-w-50px'>Debit</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className='text-center' colSpan={5}>
                      <h1 className=' fw-semibold'>Loading....</h1>
                    </td>
                  </tr>
                ) : (
                  <>
                    {linkedAccountData?.map((dayBookAccountData, index) => {
                      debitAmount = debitAmount + dayBookAccountData?.debit
                      creditAmount = creditAmount + dayBookAccountData?.credit
                      return (
                        <tr key={index}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                            </div>
                          </td>
                          <td className='fw-bold'>{index + 1}</td>
                          <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {moment(dayBookAccountData?.dayBookDatadate).format('DD-MM-YYYY')}
                            </a>
                          </td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {dayBookAccountData?.accountName ||
                                dayBookAccountData?.commissionPersonName}
                            </a>
                          </td>
                          <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {dayBookAccountData?.naretion}
                            </a>
                          </td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {dayBookAccountData?.credit}
                            </a>
                          </td>
                          <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {dayBookAccountData?.debit}
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </>
                )}
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                      Total Balance
                    </a>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                      {creditAmount}
                    </a>
                  </td>
                  <td>
                    <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                      {debitAmount}
                    </a>
                  </td>
                  <td>
                    <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                      {creditAmount > 0 ? creditAmount - debitAmount : null}
                    </a>
                  </td>
                </tr>
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

export default ShowSingleLinkAccountData
