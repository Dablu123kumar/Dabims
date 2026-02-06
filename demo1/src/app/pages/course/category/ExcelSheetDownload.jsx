import React, {useState} from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {useAdmissionContext} from '../../../modules/auth/core/Addmission'
import {useStudentCourseFeesContext} from '../../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import {useParams} from 'react-router-dom'
import {useCourseContext} from '../CourseContext'
import {useGetCourseCategoryContextContext} from './CourseCategoryContext'

const DocumentViewer = ({companyId, toDate, fromDate, categoryId}) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [pdfURL, setPdfURL] = useState('')
  const ctx = useCourseContext()
  const categoryCTX = useGetCourseCategoryContextContext()
  const params = useParams()
  const studentPayFeeCtx = useStudentCourseFeesContext()
  // console.log(categoryId)
  // Fetch student fee data
  const studentFees = studentPayFeeCtx?.getAllStudentsCourseFees?.data || []

  const formattedFromDate = fromDate ? moment(fromDate).startOf('day') : null
  const formattedToDate = toDate ? moment(toDate).endOf('day') : null

  const filteredStudentFees = studentFees?.filter((fee) => {
    const feeDate = moment(fee?.amountDate).startOf('day') // Parse fee date and set time to midnight
    const companyMatch = fee?.companyName === params?.id // Match on company ID
    const fromDateMatch = !formattedFromDate || feeDate?.isSameOrAfter(formattedFromDate, 'day')
    const toDateMatch = !formattedToDate || feeDate?.isSameOrBefore(formattedToDate, 'day')
    const courseMatch = fee?.courseName?.category === categoryId // Match on course category

    // Debugging logs to see the dates being compared

    // Filter students who match all criteria
    return companyMatch && fromDateMatch && toDateMatch && courseMatch
  })

  // console.log(filteredStudentFees)
  // console.log(c)

  // Group the filtered fees by course
  const groupedByCourse = filteredStudentFees?.reduce((acc, fee) => {
    const courseId = fee?.courseName?._id
    if (!acc[courseId]) {
      acc[courseId] = []
    }
    acc[courseId]?.push(fee)
    return acc
  }, {})

  // Map filtered fees to include student details
  const dataForPDF = (fees) =>
    fees.map((fee) => ({
      rollNumber: fee?.studentInfo?.rollNumber || 'N/A',
      studentName: fee?.studentInfo?.name || 'N/A',
      fatherName: fee?.studentInfo?.father_name || 'N/A',
      mobileNumber: fee?.studentInfo?.mobile_number || 'N/A',
      courseName: fee?.courseName?.courseName || 'N/A',
      reciptNumber: fee?.reciptNumber || 'N/A',
      courseFees: fee?.studentInfo?.netCourseFees || 0,
      remainingFees: fee?.remainingFees || 0,
      totalPaid: fee?.studentInfo?.totalPaid || 0,
      amountDate: moment(fee?.studentInfo?.createdAt)?.format('DD/MM/YYYY'),
      addedBy: fee?.addedBy || 'N/A',
    }))

  // console.log(categoryCTX.getCourseCategoryLists)

  // Function to generate PDF for each course
  const generatePDF = () => {
    const doc = new jsPDF()
    doc?.setFontSize(12)

    const courseIds = Object?.keys(groupedByCourse)

    courseIds.forEach((courseId, index) => {
      const courseFees = groupedByCourse[courseId]
      const courseName = courseFees[0]?.courseName?.courseName || 'Unknown Course'

      // Title for each course PDF
      doc.text(`${courseName} - Student Fee Report`, 10, 20)

      // Date Range Section
      if (fromDate && toDate) {
        doc.setFontSize(12)
        doc.text(
          `Date Range: ${moment(fromDate).format('DD/MM/YYYY')} - ${moment(toDate).format(
            'DD/MM/YYYY'
          )}`,
          10,
          30 // Positioning after the course name title
        )
      }

      // Add table header
      const headers = [
        [
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
        ],
      ]

      // Initialize totals for the course
      let totalCourseFees = 0
      let totalPaid = 0
      let totalRemainingFees = 0

      // Add table data
      const data = dataForPDF(courseFees).map((item) => {
        // Sum the values for totals
        totalCourseFees += item?.courseFees || 0
        totalPaid += item?.totalPaid || 0
        totalRemainingFees += item?.remainingFees || 0

        return [
          item?.rollNumber,
          item?.studentName,
          item?.fatherName,
          item?.mobileNumber,
          item?.courseName,
          item?.courseFees,
          item?.totalPaid,
          item?.remainingFees,
          item?.amountDate,
          item?.addedBy,
        ]
      })

      // Add a totals row at the end of the data
      data?.push([
        '', // Empty space for "Roll Number"
        '', // Empty space for "Name"
        '', // Empty space for "Father Name"
        '', // Empty space for "Mobile Number"
        'Total', // Label for totals
        totalCourseFees?.toFixed(2), // Course Fees Total
        totalPaid?.toFixed(2), // Total Paid
        totalRemainingFees?.toFixed(2), // Remaining Fees
        '', // Empty space for "Date"
        '', // Empty space for "Added By"
      ])

      // Add table using autoTable
      doc?.autoTable({
        head: headers,
        body: data,
        startY: 40, // Start after the date range text
        margin: {left: 5, right: 5},
        styles: {halign: 'center'}, // Center-align text by default
        headStyles: {fillColor: [22, 160, 233]}, // Header color
        bodyStyles: {textColor: 20},
        footStyles: {fontStyle: 'bold', halign: 'center'}, // Bold and aligned footer
      })

      // Add a new page for the next course if more than one course exists
      if (index < courseIds.length - 1) {
        doc?.addPage()
      }
    })

    // Generate the file name using the selected category name
    const selectedCategoryName =
      categoryCTX?.getCourseCategoryLists?.data?.find((cat) => cat?._id === categoryId)?.category ||
      'Unknown_Category'
    const fileName = `Student_Fee_Report_${selectedCategoryName?.replace(/\s+/g, '_')}.pdf`

    // Convert PDF to Blob URL for preview
    const pdfBlob = doc?.output('blob')
    const pdfURL = URL?.createObjectURL(pdfBlob)

    // Open PDF in a new tab for preview
    const newTab = window.open(pdfURL, '_blank')
    if (newTab) {
      newTab.focus() // Focus on the new tab
    }

    // Trigger download with the correct file name
    const downloadLink = document.createElement('a')
    downloadLink.href = pdfURL
    downloadLink.download = fileName
    downloadLink.click()
  }

  return (
    <div>
      {/* Generate PDF Button */}
      <button onClick={generatePDF} className='btn btn-primary btn-sm'>
        Generate PDF
      </button>

      {/* Preview Modal */}
      {isPreviewVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: '999',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              position: 'relative',
              width: '80%',
              height: '80%',
              zIndex: '999',
            }}
          >
            <iframe
              src={pdfURL}
              title='PDF Preview'
              style={{width: '100%', height: '100%', border: 'none'}}
            ></iframe>
            <button
              onClick={() => setIsPreviewVisible(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentViewer
