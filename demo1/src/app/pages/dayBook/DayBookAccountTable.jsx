import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useAuth} from '../../modules/auth'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {useCompanyContext} from '../compay/CompanyContext'
import moment from 'moment'

const DayBookAccountTable = () => {
  const dayBookAccountCtx = usePaymentOptionContextContext()
  const navigate = useNavigate()
  const {currentUser} = useAuth()
  const studentCTX = useStudentCourseFeesContext()
  const params = useParams()
  //console.log(params.id)
  // console.log(studentCTX.getAllRecieptStatusData?.data?.approvalData)
  const companyCTX = useCompanyContext()
  const result = companyCTX.useGetSingleCompanyData(params.id)
  //console.log(dayBookAccountCtx.getDayBookAccountsLists.data[0].companyId === params.id)

  const accountName = dayBookAccountCtx.getDayBookAccountsLists.data?.filter(
    (cp) => cp?.companyId === params?.id && cp?.accountName === 'Himanshu Walia'
  )

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  let credit = 0

  return (
    <>
      {(currentUser?.role === 'SuperAdmin' || 'Admin') && (
        <div className={`card`}>
          {/* begin::Header */}
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>
                {' '}
                Fees Paid to Partner Himanshu Walia
              </span>
              <span className='text-muted mt-1 fw-semibold fs-7'>
                {' '}
                {/* {result.data?.companyId?.companyName} */}
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
                    <th className='min-w-50px'>Reciept No.</th>
                    <th className='min-w-50px'>Student Name</th>
                    <th className='min-w-50px'>Amount Date</th>
                    {/* <th className='min-w-80px'>Account Name</th> */}
                    <th className='min-w-200px'>Narration</th>
                    <th className='min-w-50px'>Credit</th>
                    {/* <th className='min-w-50px'>Debit</th> */}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {studentCTX.getAllRecieptStatusData?.isLoading ? (
                    <tr>
                      <td className='text-center' colSpan={7}>
                        <h1 className='fw-semibold'>Loading....</h1>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {studentCTX?.getAllRecieptStatusData?.data?.approvalData
                        ?.filter((data) => data.companyId === params.id && data.check === true)
                        .map((reciept, index) => {
                          credit = credit + reciept.reciept.amountPaid
                          return (
                            <tr key={index}>
                              <td></td>
                              <td className='fw-bold'>{index + 1}</td>
                              <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {reciept.reciept.reciptNumber}
                                </a>
                              </td>
                              <td>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {reciept.studentId.name}
                                </a>
                              </td>
                              <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {moment(reciept.reciept.amountDate).format('DD-MM-YYYY')}
                                </a>
                              </td>
                              {/* <td>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {accountName?.[0]?.accountName}
                                </a>
                              </td> */}
                              <td>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {reciept.reciept.narration}
                                </a>
                              </td>
                              <td style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                                <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                  {reciept.reciept.amountPaid || 0}
                                </a>
                              </td>
                              {/* <td>
                              <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                                {reciept.reciept.debit || 0}
                              </a>
                            </td> */}
                            </tr>
                          )
                        })}
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
                        <td></td>
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                            {' '}
                            {credit || 0}
                          </a>
                        </td>
                        {/* <td>
                        <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                          {' '}
                          {debit || 0}
                        </a>
                      </td> */}
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-3'>
                            {' '}
                            {/* {reciept.reciept.debit || 0} */}
                          </a>
                        </td>
                      </tr>
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
      )}
    </>
  )
}

export default DayBookAccountTable
