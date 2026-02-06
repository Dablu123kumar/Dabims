import React, {useEffect, useMemo, useRef} from 'react'
import {useThemeMode} from '../../../_metronic/partials'
import {KTIcon} from '../../../_metronic/helpers'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

// Helper function to fetch CSS variables
const getCSSVariableValue = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

const CollectionDashBoardBox = ({className, chartSize = 70, chartLine = 11, chartRotate = 145}) => {
  const chartRef = useRef(null)
  const {mode} = useThemeMode()
  const dayBookDataCtx = usePaymentOptionContextContext()
  //console.log('daybookdatra',dayBookDataCtx.getDayBookDataQuery.data)

  const TotalIncome = dayBookDataCtx?.getDayBookDataQuery?.data?.reduce((acc, cur) => {
    return acc + cur.credit + cur.studentLateFees
  }, 0)

  const TotalExpense = dayBookDataCtx?.getDayBookDataQuery?.data?.reduce((acc, cur) => {
    return acc + cur.debit
  }, 0)

  const balanceAmount = useMemo(() => {
    return TotalIncome - TotalExpense
  }, [TotalIncome, TotalExpense])

  const totalFunds = TotalIncome + TotalExpense + balanceAmount
  const incomePercent = totalFunds > 0 ? TotalIncome / totalFunds : 0
  const expensePercent = totalFunds > 0 ? TotalExpense / totalFunds : 0
  const balancePercent = totalFunds > 0 ? balanceAmount / totalFunds : 0

  // Calculate percentage change
  const profitLossPercentage = useMemo(() => {
    if (TotalIncome === 0) return 0
    return ((balanceAmount - TotalExpense) / TotalIncome) * 100
  }, [TotalIncome, TotalExpense, balanceAmount])

  const isProfit = profitLossPercentage >= 0

  useEffect(() => {
    refreshChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, incomePercent, expensePercent, balancePercent])

  const refreshChart = () => {
    if (!chartRef.current) return

    setTimeout(() => {
      initChart(chartSize, chartLine, chartRotate)
    }, 10)
  }

  const initChart = (size, lineWidth, rotate) => {
    const el = chartRef.current
    if (!el) return

    el.innerHTML = ''

    const options = {
      size,
      lineWidth,
      rotate,
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.height = options.size

    el.appendChild(canvas)

    ctx.translate(options.size / 2, options.size / 2) // Center the canvas
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI) // Rotate -90 degrees

    const radius = (options.size - options.lineWidth) / 2

    const drawCircle = (color, width, percent) => {
      percent = Math.min(Math.max(0, percent || 1), 1)

      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false)
      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      ctx.lineWidth = width
      ctx.stroke()
    }

    // Draw circles based on percentages
    drawCircle('#E4E6EF', options.lineWidth, 1) // Background circle
    drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, incomePercent) // Income
    drawCircle(getCSSVariableValue('--bs-danger'), options.lineWidth, expensePercent) // Expense
    drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, balancePercent) // Balance
  }

  return (
  <div>

    {/* // main content  */}
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
          <span className='text-gray-400 pt-1 fw-semibold fs-6'>Over All Earnings Of All Companies </span>
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
  </div>

  )
}

export default CollectionDashBoardBox
