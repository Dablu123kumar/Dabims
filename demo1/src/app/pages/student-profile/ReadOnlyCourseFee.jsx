import moment from 'moment'
import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useAuth} from '../../modules/auth/core/Auth'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'
import {Link, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'
import useUserRoleAccessContext from '../userRoleAccessManagement/UserRoleAccessContext'
import PaymentApproval from '../Payment_Approval/PaymentApproval'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'

const BASE_URL = process.env.REACT_APP_BASE_URL

const ReadOnlyCourseFee = ({
  studentInfoData,
  StudentFee,
  index,
  status,
  setStudentCourseFeesEditId,
  delelteStudentCourseFeesHandler,
}) => {
  //console.log( 'studentInfoData',studentInfoData )
  const params = useParams()
  // console.log(params.id)
 // console.log(StudentFee)
  const {auth, currentUser} = useAuth()
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()
  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData

  //console.log(paymentOptionCtx.getPaymentOptionsData.data)
  const paymentOptionCtx = usePaymentOptionContextContext()
  // console.log(approvalData)

  const studentEditCourseFeesHandler = (id) => {
    setStudentCourseFeesEditId(id)
    toast.error(
      'Are you sure you want to Edit this student course fee? just edit recipt number and or date.Please do not update amount ?',
      {
        style: {
          fontSize: '18px',
          color: 'white',
          background: 'black',
        },
      }
    )
  }

  const sendDataWhatsappAsMessage = () => {
    let url = `https://web.whatsapp.com/send?phone=+91${studentInfoData.phone_number}`
    // // Appending the message to the URL by encoding it
    // url += `&text=Hello, ${studentInfoData.name} your fess has been submitted successfully ${StudentFee.amountPaid} Rs? &app_absent=0`
    url += `&text=Dear ${studentInfoData.name}, We have successfully received Rs.${StudentFee.amountPaid}/- as your monthly installment.
Thanks,
${studentInfoData?.companyName?.companyName}`
    window.open(url)
  }

  const sendMailToStudentAgainIfNotAccept = async (studentData) => {
    try {
      // console.log(studentData)
      const res = await axios.post(`${BASE_URL}/api/students/sendMailStudent`, studentData)
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            fontSize: '18px',
            color: 'white',
            background: 'black',
          },
        })
      }
    } catch (error) {}
  }

  const formatDate = (date) => {
    // console.log('1717140043978'.length)
    // if (!date) return 'Invalid date'
    const parsedDate = moment(date, ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'], true)
    return parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : 'Invalid date'
  }

  return (
    <>
      <tr key={StudentFee._id}>
        <td>
          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
        </td>
        <td>{index + 1}</td>
        <td>{StudentFee?.displayNetCourseFees}</td>
        {/* <td>{StudentFee?.netCourseFees}</td> */}
        <td>
          {StudentFee?.amountPaid} <br />
          <span className='text-muted fw-semibold text-muted d-block fs-7'>
            {StudentFee.narration}
          </span>
        </td>
        <td>{StudentFee?.displayRemainingFees}</td>
        {/* <td>{StudentFee?.remainingFees}</td> */}
        <td>{moment(StudentFee?.amountDate).format('DD-MM-YYYY')}</td>
        <td>{StudentFee?.reciptNumber}</td>

        <td>
          {paymentOptionCtx.getPaymentOptionsData.data?.map((paymentOpt) => (
            <React.Fragment key={paymentOpt._id}>
              {StudentFee.paymentOption._id === paymentOpt._id && paymentOpt.name}
            </React.Fragment>
          ))}
        </td>

        <td>{StudentFee?.lateFees}</td>
        <td className='text-end'>
          <span
            className={`badge ${
              status === 'Approved' ? 'badge-light-success' : 'badge-light-danger'
            }`}
          >
            {status || 'Pending'}
          </span>
        </td>
        <td>{StudentFee?.addedBy}</td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0 gap-4 '>
            {currentUser.role !== 'Student' && status === 'Approved' && (
              <>
                {userRoleAccess?.some(
                  (userAccess) =>
                    userAccess.studentFeesAccess['Print Recipt'] === true &&
                    userAccess.role === currentUser?.role
                ) && (
                  <Link
                    to={'/print-student-fees-recipt'}
                    target='_blank'
                    type='button'
                    onClick={() =>
                      localStorage.setItem('print-student-fees-recipt', JSON.stringify(StudentFee))
                    }
                    className='btn btn-bg-light btn-active-color-primary btn-sm me-1'
                    style={{whiteSpace: 'nowrap'}} // Ensures the text stays in one line
                  >
                    Print Recipt
                  </Link>
                )}
                {userRoleAccess?.some(
                  (userAccess) =>
                    userAccess.studentFeesAccess['Mail Button'] === true &&
                    userAccess.role === currentUser?.role
                ) && (
                  <button
                    onClick={() => sendMailToStudentAgainIfNotAccept(StudentFee)}
                    type='button'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <img src='/gmail.png' className='img-thumbnail' alt='gmail' />
                  </button>
                )}
                {userRoleAccess?.some(
                  (userAccess) =>
                    userAccess.studentFeesAccess['Whatsapp Button'] === true &&
                    userAccess.role === currentUser?.role
                ) && (
                  <button
                    onClick={() => sendDataWhatsappAsMessage()}
                    type='button'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <img src='/whatsapp.png' className='img-thumbnail' alt='whatsapp' />
                  </button>
                )}
              </>
            )}
            {userRoleAccess?.some(
              (userAccess) =>
                userAccess.studentFeesAccess['Edit Student Fees'] === true &&
                userAccess.role === currentUser?.role
            ) && (
              <>
                <button
                  onClick={() => studentEditCourseFeesHandler(StudentFee?._id)}
                  type='button'
                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                >
                  <KTIcon iconName='pencil' className='fs-3' />
                </button>
                {userRoleAccess?.some(
                  (userAccess) =>
                    userAccess.studentFeesAccess['Delete Student Fees'] === true &&
                    userAccess.role === currentUser?.role
                ) && (
                  <button
                    onClick={() => delelteStudentCourseFeesHandler(StudentFee?._id)}
                    type='button'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                  >
                    <KTIcon iconName='trash' className='fs-3' />
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  )
}
export default ReadOnlyCourseFee
