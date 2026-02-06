import React, {useState, useEffect, Fragment} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AddDayBookData from './AddDayBookData'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {Link, useParams} from 'react-router-dom'
import {useCompanyContext} from '../compay/CompanyContext'
import AddDayBookAccountFromDayBook from './AddDayBookAccountFromDayBook'
import EditDayBookData from './EditDayBookData'

const ViewDayBook = () => {
  const [fromDate, setFromDate] = useState(moment().startOf('month').toDate())
  const [toDate, setToDate] = useState(moment().endOf('month').toDate())
  const [showAddAccountBtn, setShowAddAccountBtn] = useState(false)
  const [editBayBookDataId, setEditBayBookDataId] = useState(null)
  const params = useParams()
  const companyCTX = useCompanyContext()
  const result = companyCTX.useGetSingleCompanyData(params?.id)
  //console.log(result)

  let balanceOfDayBookData = 0

  const dayBookDataCtx = usePaymentOptionContextContext()

  let previousTotalOfDayBookData = dayBookDataCtx?.getDayBookDataQuery?.data
    ?.filter((item) => {
      const itemDate = new Date(item.dayBookDatadate)
      const currentYear = toDate.getFullYear()
      const currentMonth = toDate.getMonth()

      // Only include data where:
      // - The year is less than the current year
      // - OR the year is the same, but the month is less than the current month
      return (
        item.companyId === params?.id &&
        (itemDate.getFullYear() < currentYear ||
          (itemDate.getFullYear() === currentYear && itemDate.getMonth() < currentMonth))
      )
    })
    .reduce((acc, cur) => {
      // Summing up credit, subtracting debit, and adding late fees
      return acc + cur.credit - cur.debit + cur.studentLateFees
    }, 0) // Initial value is 0

  // console.log(previousTotalOfDayBookData)

  // const data = dayBookDataCtx?.getDayBookDataQuery?.data?.map((data) => data)
  // console.log(data)

  const grossTotalOfDayBookData = dayBookDataCtx?.getDayBookDataQuery?.data
    ?.filter((item) => item?.companyId === params?.id)
    .reduce((acc, cur) => {
      // console.log(acc)
      return acc + cur.credit - cur.debit + cur.studentLateFees
    }, 0)
  // console.log(previousTotalOfDayBookData)

  // console.log(dayBookDataCtx.getDayBookDataQuery?.data)

  const filteredData =
    dayBookDataCtx?.getDayBookDataQuery?.data
      ?.filter((item) => item?.companyId === params?.id)
      ?.filter((item) => {
        const createdAt = moment(item.dayBookDatadate)
        const startDate = moment(fromDate).startOf('day')
        // const previousDate = moment(toPreviousDate).startOf('')
        const endDate = moment(toDate).endOf('day')
        return createdAt.isBetween(startDate, endDate, null, '[]')
      }) || []

  const deleteDayBookSingleDataHandler = (dayBookDataId) => {
    if (window.confirm('Are you sure you want to delete')) {
      dayBookDataCtx.deleteSingleDayBookDataById.mutate(dayBookDataId)
    }
    return
  }
  const editDayBookSingleDataHandler = (dayBookDataId) => {
    setEditBayBookDataId(dayBookDataId)
  }

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // console.log(themeMode)

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5 d-flex align-items-center'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{result?.data?.companyName} Day Book</span>
          <span className=' mt-1 fw-semibold fs-7'>Fees and Expense, Income</span>
          <span className=' mt-1  fs-1'>Total Balance : {grossTotalOfDayBookData?.toFixed(2)}</span>

          <span className='mt-3'>
            <button
              onClick={() => setShowAddAccountBtn((prev) => !prev)}
              className='btn btn-primary btn-hover btn-sm'
            >
              Add DayBook Account
            </button>
          </span>
        </h3>
        {/* 
        <div className=''>
          <input
            type='text'
            placeholder='search student'
            className='form-control'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div> */}

        <div className='d-flex gap-5'>
          <label className='col-6 col-form-label fw-bold fs-6 flex-4'>
            From
            <div className='fv-row'>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat='dd/MM/yyyy'
                className='form-control form-control-lg form-control-solid'
                placeholderText='DD/MM/YYYY'
              />
            </div>
          </label>
          <label className='col-6 col-form-label fw-bold fs-6 flex-4'>
            To
            <div className='fv-row'>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat='dd/MM/yyyy'
                className='form-control form-control-lg form-control-solid'
                placeholderText='DD/MM/YYYY'
              />
            </div>
          </label>
        </div>
        {/* <div className='card-toolbar'>
          <a href='#' className='btn btn-sm btn-light-primary' title='Click to add a user'>
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div> */}
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
                <th className='w-25px'></th>
                <th className='min-w-10px'>ID</th>
                <th className='min-w-100px'>Date</th>
                <th className='min-w-100px'>Roll No</th>
                <th className='min-w-100px'>Recipt No</th>
                <th className='min-w-120px'>Particulars</th>
                <th className='min-w-120px'>Narration</th>
                <th className='min-w-100px'>Credit</th>
                <th className='min-w-100px'>Debit</th>
                <th className='min-w-120px'>Late Fees</th>
                <th className='min-w-100px text-center'>Balance</th>
                <th className='min-w-100px text-center'> Previous Balance</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {!showAddAccountBtn ? (
                <AddDayBookData
                  key={1}
                  companyId={params?.id}
                  totalBalance={grossTotalOfDayBookData}
                />
              ) : (
                <AddDayBookAccountFromDayBook key={1} setShowAddAccountBtn={setShowAddAccountBtn} />
              )}
              {/* <tr>
                <td colSpan='10' className='text-end fw-bold fs-6'>
                  Previous Balance:
                </td>
                <td className='text-dark fw-bold text-center fs-6'>
                  {previousTotalOfDayBookData?.toFixed(2) || '0.00'}
                </td>
              </tr> */}
              {/* Day Book Data */}
              {filteredData?.map((dayBookEntry, index) => {
                // if (dayBookEntry.credit !== 0) {
                //   balanceOfDayBookData =
                //     balanceOfDayBookData + dayBookEntry.credit + dayBookEntry.studentLateFees
                // } else {
                //   balanceOfDayBookData = balanceOfDayBookData - dayBookEntry.debit
                // }

                // console.log(dayBookEntry.studentInfo._id)

                balanceOfDayBookData =
                  balanceOfDayBookData +
                  dayBookEntry.credit -
                  dayBookEntry.debit +
                  dayBookEntry.studentLateFees

                previousTotalOfDayBookData =
                  previousTotalOfDayBookData +
                  dayBookEntry.credit -
                  dayBookEntry.debit +
                  dayBookEntry.studentLateFees

                // console.log(previousTotalOfDayBookAmount)
                // console.log(balanceOfDayBookData)
                return (
                  <Fragment key={index}>
                    {dayBookEntry?._id === editBayBookDataId ? (
                      <EditDayBookData
                        setEditBayBookDataId={setEditBayBookDataId}
                        dayBookEntry={dayBookEntry}
                        totalBalance={grossTotalOfDayBookData}
                      />
                    ) : (
                      <tr>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6 '>{index + 1}</td>
                        <td
                          className='text-dark fw-bold text-hover-primary fs-6 '
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                        >
                          {moment(dayBookEntry.dayBookDatadate).format('DD-MM-YYYY')}
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6'>
                          {dayBookEntry.rollNo}
                        </td>
                        <td
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                          className='text-dark fw-bold text-hover-primary fs-6'
                        >
                          {dayBookEntry?.reciptNumber}
                        </td>
                        <td
                          className=''
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                        >
                          <Link
                            className={
                              dayBookEntry.accountName
                                ? 'text-dark fw-bold text-hover-primary fs-6'
                                : 'text-dark fw-bold text-hover-primary fs-6'
                            }
                            target={'_blank'}
                            to={
                              dayBookEntry.accountName
                                ? `/daybook/singleAccount/${dayBookEntry?.dayBookAccountId}`
                                : dayBookEntry.studentInfo?._id
                                ? `/profile/student/${dayBookEntry?.studentInfo?._id}`
                                : `/daybook/viewDaybook/${params?.id}`
                            }
                          >
                            {dayBookEntry?.commissionPersonName
                              ? dayBookEntry?.commissionPersonName
                              : dayBookEntry?.accountName || dayBookEntry?.StudentName}
                          </Link>
                          <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {dayBookEntry?.linkDayBookAccountData?.accountName}
                          </span>
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6'>
                          {dayBookEntry.naretion || '--'}
                        </td>
                        <td
                          className='text-dark fw-bold text-hover-primary fs-6 '
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                        >
                          {dayBookEntry.credit}
                          <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {dayBookEntry.narration}
                          </span>
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6'>
                          {dayBookEntry.debit}
                        </td>

                        <td
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                          className='text-dark fw-bold text-hover-primary fs-6'
                        >
                          {dayBookEntry?.studentLateFees || 0}
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6'>
                          {balanceOfDayBookData.toFixed(2)}
                        </td>
                        <td className='text-dark fw-bold text-hover-primary fs-6'>
                          {previousTotalOfDayBookData.toFixed(2)}
                        </td>
                        {dayBookEntry.naretion && (
                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <button
                                onClick={() => editDayBookSingleDataHandler(dayBookEntry?._id)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </button>
                              <button
                                onClick={() => deleteDayBookSingleDataHandler(dayBookEntry?._id)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default ViewDayBook
