import React, {useEffect, useMemo, useRef} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useThemeMode} from '../../../_metronic/partials'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {useCompanyContext} from '../compay/CompanyContext'

const getCSSVariableValue = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

const CompanyCollectionDashboardBox = ({
  className,
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
}) => {
  // ✅ HOOKS FIRST — ALWAYS
  const chartRef = useRef(null)
  const {mode} = useThemeMode()
  const {selectedCompany} = useCompanyContext()
  const paymentCtx = usePaymentOptionContextContext()

  const companyId = selectedCompany?._id
  const daybookData = paymentCtx?.getDayBookDataQuery?.data || []

  // ✅ SAFE useMemo (always runs)
  const companyDaybook = useMemo(() => {
    if (!companyId) return []
    return daybookData.filter((item) => item?.companyId === companyId)
  }, [companyId, daybookData])

  const TotalIncome = useMemo(
    () =>
      companyDaybook.reduce(
        (acc, cur) => acc + (cur.credit || 0) + (cur.studentLateFees || 0),
        0
      ),
    [companyDaybook]
  )

  const TotalExpense = useMemo(
    () =>
      companyDaybook.reduce((acc, cur) => acc + (cur.debit || 0), 0),
    [companyDaybook]
  )

  const balanceAmount = TotalIncome - TotalExpense

  const totalFunds = TotalIncome + TotalExpense + balanceAmount || 1
  const incomePercent = TotalIncome / totalFunds
  const expensePercent = TotalExpense / totalFunds
  const balancePercent = balanceAmount / totalFunds

  const profitLossPercentage = useMemo(() => {
    if (TotalIncome === 0) return 0
    return ((balanceAmount - TotalExpense) / TotalIncome) * 100
  }, [TotalIncome, TotalExpense, balanceAmount])

  const isProfit = profitLossPercentage >= 0

  // ✅ SAFE useEffect (always runs)
  useEffect(() => {
    if (!companyId) return
    refreshChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, incomePercent, expensePercent, balancePercent, companyId])

  const refreshChart = () => {
    if (!chartRef.current) return
    setTimeout(() => initChart(chartSize, chartLine, chartRotate), 10)
  }

  const initChart = (size, lineWidth, rotate) => {
    const el = chartRef.current
    if (!el) return
    el.innerHTML = ''

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.height = size
    el.appendChild(canvas)

    ctx.translate(size / 2, size / 2)
    ctx.rotate((-1 / 2 + rotate / 180) * Math.PI)
    const radius = (size - lineWidth) / 2

    const drawCircle = (color, percent) => {
      percent = Math.min(Math.max(percent, 0), 1)
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent)
      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }

    drawCircle('#E4E6EF', 1)
    drawCircle(getCSSVariableValue('--bs-primary'), incomePercent)
    drawCircle(getCSSVariableValue('--bs-danger'), expensePercent)
    drawCircle(getCSSVariableValue('--bs-success'), balancePercent)
  }

  // ✅ CONDITIONAL JSX (NOT hook)
  if (!companyId) return null

  return (
    <>
    {/* <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title'>
          <span className='fw-bold fs-4'>Company Earnings</span>
          <div className='text-muted fs-7'>{selectedCompany?.companyName}</div>
        </div>
      </div>

      <div className='card-body d-flex align-items-center'>
        <div ref={chartRef} style={{minWidth: chartSize}} />
        <div className='flex-grow-1 ms-6'>
          <div>Total Income: ₹{TotalIncome}</div>
          <div>Total Expense: ₹{TotalExpense}</div>
          <div>Balance: ₹{balanceAmount}</div>
        </div>
      </div>
    </div> */}

<div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex align-items-center'>
            <span className='fs-4 fw-semibold text-gray-400 me-1 align-self-start'>₹</span>
            <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>
              {new Intl.NumberFormat('en-IN').format(balanceAmount)}
            </span>
            <span
              className={`badge fs-base mx-4 ${
                isProfit ? 'badge-light-success' : 'badge-light-danger'
              }`}
            >
              <KTIcon
                iconName={isProfit ? 'arrow-up' : 'arrow-down'}
                className={`fs-5 ms-n1 ${isProfit ? 'text-success' : 'text-danger'}`}
              />{' '}
              {Math.abs(profitLossPercentage).toFixed(2)}%
            </span>
          </div>
          <span className='text-gray-400 pt-1 fw-semibold fs-6'>Over All Earnings Of {selectedCompany?.companyName} </span>
        </div>
      </div>

      <div className='card-body pt-2 pb-4 d-flex align-items-center'>
        <div className='d-flex flex-center me-2'>
          <div
            id='kt_card_widget_17_chart'
            ref={chartRef}
            style={{minWidth: chartSize + 'px', minHeight: chartSize + 'px'}}
            data-kt-size={chartSize}
            data-kt-line={chartLine}
          ></div>
        </div>

        <div className='d-flex flex-column flex-grow-1'>
          <div className='d-flex fw-semibold align-items-center mb-3'>
            <div className='bullet w-8px h-3px rounded-2 bg-success me-2'></div>
            <div className='text-gray-500 flex-grow-1 text-truncate'>Total Income</div>
            <div className='fw-bolder text-gray-700 text-nowrap ms-4'>
              ₹{new Intl.NumberFormat('en-IN').format(TotalIncome)}
            </div>
          </div>
          <div className='d-flex fw-semibold align-items-center mb-3'>
            <div className='bullet w-8px h-3px rounded-2 bg-danger me-2'></div>
            <div className='text-gray-500 flex-grow-1 text-truncate'>Total Expense</div>
            <div className='fw-bolder text-gray-700 text-nowrap ms-4'>
              ₹{new Intl.NumberFormat('en-IN').format(TotalExpense)}
            </div>
          </div>
          <div className='d-flex fw-semibold align-items-center'>
            <div
              className='bullet w-8px h-3px rounded-2 me-2'
              style={{backgroundColor: '#E4E6EF'}}
            ></div>
            <div className='text-gray-500 flex-grow-1 text-truncate'>Balance</div>
            <div className='fw-bolder text-gray-700 text-nowrap ms-4'>
              ₹ {new Intl.NumberFormat('en-IN').format(balanceAmount)}
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}

export default CompanyCollectionDashboardBox
