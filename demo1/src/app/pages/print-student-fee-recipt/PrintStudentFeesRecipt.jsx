import { useState,useRef } from 'react'
import moment from 'moment'
import './studentFeesRecipt.css'
import { useCompanyContext } from '../compay/CompanyContext'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const PrintStudentFeesRecipt = () => {


  const studentGST_statusCTX = useCompanyContext()
  const [studentInfoData, setStudentInfoData] = useState(
    JSON.parse(localStorage.getItem('print-student-fees-recipt'))
  )
    const ref = useRef();
  //console.log(studentInfoData?.companyName?.isGstBased)
const handleDownload = async () => {
    window.print()
};

  const gstAmount =
    studentInfoData?.companyName?.isGstBased === 'Yes'
      ? (Number(studentInfoData.amountPaid) / Number(studentInfoData?.gst_percentage + 100)) * 100
      : Number(studentInfoData.amountPaid)
  const cutWithGstAmountPaid = studentInfoData.amountPaid - gstAmount
  // console.log(lateFeesGstAmount, cutWithGstLateFees)
  //console.log(cutWithGstAmountPaid.toFixed(2))
  //console.log(gstAmount)

  const formatDate = (date) => {
    //console.log('1717140043978'.length)
    // if (!date) return 'Invalid date'
    const parsedDate = moment(date, ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'], true)
    return parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : 'Invalid date'
  }

  return (
    <div  style={{ backgroundColor: 'white', height: '100%' }}>
      {/* Start body */}
      <table border='0' cellPadding='0' cellSpacing='0' width='100%'>
        {/* Start logo */}
        <tr>
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{ maxWidth: '600px' }}
            >
              <tr>
                <td align='center' valign='top' style={{ padding: '0 0' }}>
                  <a
                    href='http://www.visualmedia.co.in/'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ display: 'inline-block' }}
                  >
                    <img
                      src={BASE_URL_Image + '/' + studentInfoData?.companyName?.logo}
                      alt='Logo'
                      border='0'
                      width='200px'
                      style={{
                        borderRadius: '2px',
                        display: 'block',
                        width: '200px',
                        maxWidth: '200px',
                        minWidth: '200px',
                      }}
                    />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {/* End logo */}
 
        {/* Start hero */}
         <tr >
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{ maxWidth: '600px' }}
            >
              <tr>
                <td
                  bgcolor='#ffffff'
                  style={{
                    padding: '36px 24px 0',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    borderTop: '3px solid #d4dadf',
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '27px',
                      fontWeight: 700,
                      letterSpacing: '-1px',
                      lineHeight: '30px',
                      textAlign: 'left',
                    }}
                  >
                    Thank You, Your Fees Submitted Successfully!
                  </h6>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align='center' bgcolor='white' valign='top' width='100%'>
            <table
              align='center'
              bgcolor='#ffffff'
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{ maxWidth: '600px' }}
            >
              <tr>
                <td align='center' valign='top' style={{ fontSize: 0 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      maxWidth: '30%',
                      verticalAlign: 'top',
                      marginTop: '10px',
                    }}
                  >
                    <table
                      border='0'
                      cellPadding='0'
                      cellSpacing='0'
                      width='100%'
                      style={{ maxWidth: '300px' }}
                    >
                      <tr>
                        <td
                          valign='top'
                          style={{
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '15px',
                          }}
                        >
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Student Name</strong>
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Father Name</strong>
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Roll Number</strong>
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Course Name</strong>
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Payment Method</strong>
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            <strong>Payment Date</strong>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      maxWidth: '61%',
                      verticalAlign: 'top',
                      marginTop: '10px',
                    }}
                  >
                    <table
                      border='0'
                      cellPadding='0'
                      cellSpacing='0'
                      width='100%'
                      style={{ maxWidth: '300px' }}
                    >
                      <tr>
                        <td
                          valign='top'
                          style={{
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '15px',
                          }}
                        >
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {studentInfoData.studentInfo.name}
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {studentInfoData.studentInfo.father_name}
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {studentInfoData.studentInfo.rollNumber}
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {studentInfoData.courseName.courseName}
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {studentInfoData.paymentOption.name}
                          </span>
                          <span style={{ display: 'block', width: 'max-content' }}>
                            {moment(studentInfoData?.amountDate).format('DD-MM-YYYY')}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{ maxWidth: '600px' }}
            >
              {/* Start receipt table */}
              <tr>
                <td
                  align='left'
                  bgcolor='#ffffff'
                  style={{
                    padding: '5px 20px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '24px',
                  }}
                >
                  <table
                    style={{ marginTop: '10px' }}
                    border='0'
                    cellPadding='0'
                    cellSpacing='0'
                    width='100%'
                  >
                    <tr>
                      <td
                        bgcolor='#D2C7BA'
                        align='left'
                        width='75%'
                        style={{
                          padding: '12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        <strong>Receipt No</strong>
                      </td>
                      <td
                        align='left'
                        bgcolor='#D2C7BA'
                        width='25%'
                        style={{
                          padding: '12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '14px',
                          lineHeight: '24px',
                        }}
                      >
                        <strong>{studentInfoData.reciptNumber}</strong>
                      </td>
                    </tr>
                    <tr style={{ border: '2px dotted black' }}>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          border: '2px dotted black',
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        Fees Paid
                      </td>
                      {studentInfoData?.companyName?.isGstBased === 'Yes' ? (
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs {gstAmount.toFixed(2)}
                        </td>
                      ) : (
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs {studentInfoData.amountPaid.toFixed(2)}
                        </td>
                      )}
                    </tr>
                    <tr style={{ border: '2px dotted black' }}>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          padding: '6px 12px',
                          border: '2px dotted black',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        Late Fees
                      </td>
                      <td
                        align='left'
                        width='25%'
                        style={{
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        Rs {studentInfoData.lateFees.toFixed(2)}
                      </td>
                    </tr>

                    {studentInfoData?.companyName?.isGstBased === 'Yes' && (
                      <tr style={{ border: '2px dotted black' }}>
                        <td
                          align='left'
                          width='75%'
                          style={{
                            border: '2px dotted black',
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          GST ({studentInfoData?.gst_percentage} %)
                        </td>
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs {cutWithGstAmountPaid?.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr style={{ border: '2px dotted black' }}>
                      <td
                        align='left'
                        width='75%'
                        style={{
                          border: '2px dotted black',
                          padding: '6px 12px',
                          fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        Total
                      </td>
                      {studentInfoData?.companyName?.isGstBased === 'No' ? (
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs{' '}
                          {(
                            Number(studentInfoData.lateFees) + Number(studentInfoData.amountPaid)
                          ).toFixed(2)}{' '}
                        </td>
                      ) : (
                        <td
                          align='left'
                          width='25%'
                          style={{
                            padding: '6px 12px',
                            fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          Rs{' '}
                          {(
                            gstAmount +
                            cutWithGstAmountPaid +
                            Number(studentInfoData.lateFees)
                          ).toFixed(2)}{' '}
                        </td>
                      )}
                    </tr>
                  </table>
                </td>
              </tr>
              {/* End receipt table */}

              {/* Start copy */}
              <tr>
                <td
                  bgcolor='#ffffff'
                  style={{
                    padding: '24px',
                    fontSize: '14px',
                    lineHeight: '24px',
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    borderBottom: '3px solid #d4dadf',
                  }}
                >
                  <p style={{ textAlign: 'center' }}>
                    {studentInfoData.companyName.companyAddress} <br /> Contact Us : +91{' '}
                    {studentInfoData.companyName.companyPhone} <br />
                    <span>
                      Email :{' '}
                      <a href={`mailto:${studentInfoData.companyName.email}`} target='_blank'>
                        {studentInfoData.companyName.email} |
                      </a>{' '}
                    </span>
                    <span>
                      <a
                        href={'http://' + studentInfoData.companyName.companyWebsite}
                        target='_blank'
                      >
                        {studentInfoData.companyName.companyWebsite}
                      </a>
                    </span>
                  </p>
                </td>
              </tr>
              {/* End copy */}
            </table>
          </td>
        </tr>

       <tr >
<td align='center ' ><button
                className=" mt-3 btn  btn-color-white btn-active-dark-danger bg-danger "
                onClick={handleDownload}
              >
                Download as PDF
              </button></td>
        </tr>
   
        <tr>
          <td align='center' bgcolor='white'>
            <table
              border='0'
              cellPadding='0'
              cellSpacing='0'
              width='100%'
              style={{ maxWidth: '600px' }}
            >
              {/* Start permission */}
              <tr>
                <td
                  align='left'
                  bgcolor='white'
                  style={{
                    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    color: '#666',
                  }}
                >
                  <b> Important Note : </b>
                  <p>
                    CHEQUES SUBJECT TO REALISATION <br />
                    THE RECEIPT MUST BE PRODUCED WHEN DEMANDED
                    <br /> FEES ONCE PAID ARE NOT REFUNDABLE <br /> To stop receiving these emails,
                    you can{' '}
                    <a
                      href='http://www.visualmedia.co.in/'
                      target='_blank'
                      style={{ textDecoration: 'underline' }}
                    >
                      unsubscribe
                    </a>{' '}
                    at any time
                  </p>
                </td>
              </tr>
              {/* End permission */}
            </table>
          </td>
        </tr>

      </table>


    </div>
  )
}
export default PrintStudentFeesRecipt
