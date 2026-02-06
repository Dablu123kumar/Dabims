import React, {useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useCourseContext} from '../course/CourseContext'
import ExcelSheetDownload from '../../pages/course/category/ExcelSheetDownload'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useGetCourseCategoryContextContext} from '../course/category/CourseCategoryContext'
import {KTIcon} from '../../../_metronic/helpers'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useCompanyContext} from '../compay/CompanyContext'

const StudentCourseDataDownload = () => {
  const navigate = useNavigate()
  const courseCTX = useCourseContext()
  const studentCTX = useAdmissionContext()
  const ctx = useGetCourseCategoryContextContext()
  const [toDate, setToDate] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const params = useParams()
  const COURSEctx = useStudentCourseFeesContext()
  const {data, isLoading} = COURSEctx.useGetStudentMonthlyCourseFeesCollection(params?.id)
  const studentPayFeeCtx = useStudentCourseFeesContext()
  const companyCTX = useCompanyContext()
  const {data: CompanyInfo} = companyCTX?.useGetSingleCompanyData(params?.id)
  const studentFees = studentPayFeeCtx.getAllStudentsCourseFees?.data || []
  const students = studentCTX?.studentsLists?.data?.users || []
  const allCategories = ctx.getCourseCategoryLists?.data || []

  const {data: coursesData} = courseCTX.getCourseLists
  // Get all courses
  const allCourses = courseCTX?.getCourseLists?.data || []

  const handleGeneratePDF = () => {
    const doc = new jsPDF()

    // Title
    doc?.setFontSize(12)
    doc?.text('All Students Data', 10, 10)

    // Date range
    if (fromDate && toDate) {
      doc?.setFontSize(12)
      doc?.text(
        `Date Range: ${moment(fromDate)?.format('DD/MM/YYYY')} - ${moment(toDate)?.format(
          'DD/MM/YYYY'
        )}`,
        10,
        20
      )
    }

    // Filter students by date range and year if dates are selected, otherwise show all data
    const filteredStudentFees = studentFees?.filter((student) => {
      if (!fromDate && !toDate) {
        // If no date range is selected, show all data
        return true
      }

      const admissionDate = moment(student.admissionDate)
      const fromDateMatch = fromDate ? admissionDate?.isSameOrAfter(moment(fromDate), 'day') : true
      const toDateMatch = toDate ? admissionDate?.isSameOrBefore(moment(toDate), 'day') : true

      // Ensure the date range includes the exact 'fromDate' and 'toDate'
      const isDateInRange = admissionDate?.isBetween(
        moment(fromDate)?.startOf('day'),
        moment(toDate)?.endOf('day'),
        null,
        '[]'
      )

      return fromDateMatch && toDateMatch && isDateInRange
    })

    // Table headers and data
    const tableColumn = [
      'Roll Number',
      'Name',
      'Father Name',
      'Mobile Number',
      'Course',
      'Course Fees',
      'Total Paid',
      'Remaining Fees',
      'Date',
      'Added By',
    ]

    // Prepare table rows
    const tableRows = filteredStudentFees?.map((student) => [
      student?.studentInfo?.rollNumber || 'N/A',
      student?.studentInfo?.name || 'N/A',
      student?.studentInfo?.father_name || 'N/A',
      student?.studentInfo?.mobile_number || 'N/A',
      student?.courseName?.courseName || 'N/A',
      student?.studentInfo?.netCourseFees || 0,
      student?.studentInfo?.totalPaid || 0,
      student?.remainingFees || 0,
      moment(student?.admissionDate)?.format('DD/MM/YYYY') || 'N/A',
      student?.addedBy || 'N/A',
    ])

    // Calculate the totals across all filtered students
    const totalCourseFees = filteredStudentFees?.reduce(
      (sum, student) => sum + (student?.studentInfo?.netCourseFees || 0),
      0
    )
    const totalPaid = filteredStudentFees?.reduce(
      (sum, student) => sum + (student?.studentInfo?.totalPaid || 0),
      0
    )
    const totalRemainingFees = filteredStudentFees?.reduce(
      (sum, student) => sum + (student?.remainingFees || 0),
      0
    )

    // Add totals row at the end of the table rows
    tableRows.push([
      '', // Empty space for "Roll Number"
      '', // Empty space for "Name"
      '', // Empty space for "Father Name"
      '', // Empty space for "Mobile Number"
      'Total', // Label for totals
      totalCourseFees?.toFixed(2), // Total Course Fees
      totalPaid?.toFixed(2), // Total Paid
      totalRemainingFees?.toFixed(2), // Total Remaining Fees
      '', // Empty space for "Date"
      '', // Empty space for "Added By"
    ])

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      margin: {left: 5, right: 5},
      styles: {halign: 'center'}, // Center-align text by default
      headStyles: {fillColor: [22, 160, 233]}, // Header color
      bodyStyles: {textColor: 20},
      footStyles: {fontStyle: 'bold', halign: 'center'}, // Bold and aligned footer
    })

    // Open PDF in a new tab
    const pdfBlob = doc?.output('blob')
    const pdfURL = URL?.createObjectURL(pdfBlob)
    window?.open(pdfURL, '_blank')
  }

  const courseCountsByCategory = allCategories?.reduce((acc, category) => {
    acc[category.category] = allCourses?.filter(
      (course) => course?.category?.category === category?.category
    ).length
    return acc
  }, {})

  // Group students by category
  const studentCountsByCategory = allCategories?.reduce((acc, category) => {
    // Assuming category has a unique _id property
    const studentsInCategory = students?.filter(
      (student) => student?.courseName?.category === category?._id // Compare category IDs
    )

    acc[category?.category] = studentsInCategory?.length // Use category._id as the key
    return acc
  }, {})

  const courseIdToName = coursesData?.reduce((acc, course) => {
    acc[course._id] = course.courseName
    return acc
  }, {})

  const calculateMonthDiff = (expireDate) => {
    const currentDate = moment() // Current date
    const expireDateObj = moment(expireDate) // Expiry date
    let monthsDiff = currentDate.diff(expireDateObj, 'months', true) // Floating point difference
    monthsDiff = Math.floor(monthsDiff) // Round down
    return monthsDiff < 0 ? 0 : monthsDiff + 1
  }

  const filteredData = data?.filter((item) => {
    const missedMonths = calculateMonthDiff(
      item?.studentInfo?.no_of_installments_expireTimeandAmount
    )
    const hasPaidForCurrentMonth =
      Number(item?.expiration_date?.split('-')[1]) === toDate?.getMonth() + 1

    return (
      missedMonths !== 0 &&
      item?.studentInfo?.no_of_installments === item?.installment_number &&
      item.dropOutStudent === false &&
      !hasPaidForCurrentMonth
    )
  })

  const collectionFeesBalance = filteredData?.reduce((acc, cur) => acc + cur?.installment_amount, 0)

  const downloadPDF = (fromDate, toDate) => {
    const doc = new jsPDF()
    const tableColumn = [
      'Roll Number',
      'Name',
      'Course',
      'Missing Months',
      'Contact',
      'Installment Amount',
    ]
    const tableRows = []

    filteredData?.forEach((student) => {
      const rowData = [
        student?.studentInfo?.rollNumber,
        student?.studentInfo?.name,
        courseIdToName[student?.studentInfo?.courseName],
        calculateMonthDiff(student?.studentInfo?.no_of_installments_expireTimeandAmount),
        student?.studentInfo?.mobile_number,
        student?.installment_amount.toFixed(2),
      ]
      tableRows.push(rowData)
    })

    // Add title and filter details
    doc.text(`Monthly Collection Fee Report - ${CompanyInfo?.companyName}`, 14, 10)
    if (fromDate && toDate) {
      doc.text(`From: ${fromDate} To: ${toDate}`, 14, 16) // Add From and To dates
    }
    doc.text(`Total Collection Fees: Rs. ${collectionFeesBalance?.toFixed(2)}`, 14, 22)

    // Add the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      columnStyles: {
        0: {halign: 'center'}, // Center-align the 1st column
        1: {halign: 'center'}, // Center-align the 2nd column
        2: {halign: 'center'}, // Center-align the 3rd column
        3: {halign: 'center'}, // Center-align the 4th column
        4: {halign: 'center'}, // Center-align the 5th column
        5: {halign: 'center'}, // Center-align the 6th column
      },
    })

    // Open the PDF in a new tab
    const pdfBlob = doc.output('blob')
    const pdfURL = URL.createObjectURL(pdfBlob)
    window.open(pdfURL, '_blank')
  }

  // console.log(studentCountsByCategory)
  // Log the result to verify
  // console.log(courseCountsByCategory)

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Student Reports</span>
        </h3>
        <div className='d-flex gap-3'>
          <label className='d-flex align-items-center'>
            From
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat='dd/MM/yyyy'
              className='form-control form-control-sm ms-2'
              placeholderText='DD/MM/YYYY'
            />
          </label>
          <label className='d-flex align-items-center'>
            To
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat='dd/MM/yyyy'
              className='form-control form-control-sm ms-2'
              placeholderText='DD/MM/YYYY'
            />
          </label>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <div className='card-toolbar'>
            <button className='btn btn-primary btn-sm' onClick={downloadPDF}>
              Download Monthly Report PDF
            </button>
          </div>
          <div className='card-toolbar'>
            <button className='btn btn-primary btn-sm' onClick={handleGeneratePDF}>
              All Students PDF
            </button>
          </div>
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
                <th className='min-w-150px'>Category Name</th>
                <th className='min-w-150px'>Students</th>
                <th className='min-w-150px'>Courses</th>
                <th className='min-w-140px'>Created By</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {ctx.getCourseCategoryLists?.data?.length > 0 ? (
                ctx.getCourseCategoryLists?.data?.map((category) => (
                  <tr key={category?._id}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {category?.category}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {studentCountsByCategory[category.category]
                              ? studentCountsByCategory[category.category]
                              : 0}
                          </a>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          {/* <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' /> */}
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                            {courseCountsByCategory[category.category] || 0}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {category?.createdBy}
                      </a>
                    </td>
                    <td className='text-end'>
                      <div className='d-flex flex-column w-100 me-2'>
                        <div className='d-flex flex-stack mb-2'>
                          <span className=' me-2 fs-7 fw-semibold'>
                            {moment(category?.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <ExcelSheetDownload
                          fromDate={fromDate}
                          toDate={toDate}
                          companyId={category?.companyName}
                          categoryId={category?._id}
                        />
                        {/* <button
                          onClick={() => navigate('/course/category/add', {state: category})}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button> */}
                        {/* <button
                          onClick={() => deleteCourseCategoryHandler(category._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='col-12'>
                  <td className='text-center' colSpan={5}>
                    <h2 className='p-5'>Course Category Not Available!</h2>
                    <p>Please Create New Course Category</p>
                  </td>
                </tr>
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
  )
}

export default StudentCourseDataDownload
