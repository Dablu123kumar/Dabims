import React, {useEffect, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import moment from 'moment'
import PayStudentFee from './PayStudentFee'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useQuery, useQueryClient} from 'react-query'
import axios from 'axios'
import {useAuth} from '../../modules/auth'
import {useNavigate, useParams} from 'react-router-dom'
import ReadOnlyCourseFee from './ReadOnlyCourseFee'
import EditOnlyCourseFee from './EditOnlyCourseFee'
import {toast} from 'react-toastify'
import {useCompanyContext} from '../compay/CompanyContext'
import useUserRoleAccessContext from '../userRoleAccessManagement/UserRoleAccessContext'
import PayStudentFeeOnline from './PayStudentFeeOnline'

const BASE_URL = process.env.REACT_APP_BASE_URL

const StudentCourseFee = ({className, studentInfoData}) => {
  //console.log(studentInfoData, 'studentInfoData')
  const params = useParams()
  const navigate = useNavigate()
  const {currentUser} = useAuth()
  const companyCtx = useCompanyContext()

  const {data: sendWhatsAppMessageSuggestion} = companyCtx.getWhatsAppMessageuggestionStatus
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()

  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData
  // console.log(companyCtx.getWhatsAppMessageuggestionStatus?.data[0]?.whatsappSuggestionStatus)

  const [addStudentFeeFormToggle, setAddStudentFeeFormToggle] = useState(false)
  const [addOnlineStudentFeeFormToggle, setAddOnlineStudentFeeFormToggle] = useState(false)
  const [studentCourseFeeEditId, setStudentCourseFeesEditId] = useState(null)
  //console.log(studentCourseFeeEditId)
  const {getAllRecieptStatusData, createStudentStatusMutation} = useStudentCourseFeesContext()
  const approvalData = getAllRecieptStatusData?.data?.approvalData?.filter(
    (data) => data.studentId?._id === params.id
  )
  // console.log(approvalData)
  const getReceiptStatus = (recieptId) => {
    const approval = approvalData?.find(
      (data) => data.reciept?._id?.toString() === recieptId?.toString()
    )
    // console.log(approvalData)
    return approval ? approval.status : 'Pending'
  }

  // console.log(getReceiptStatus)
  const [editStudentCourseFees, setEditStudentCourseFees] = useState({
    netCourseFees: 0,
    remainingFees: 0,
    amountPaid: '',
    narration: '',
    amountDate: '',
    paymentOption: '',
    lateFees: '',
    reciptNumber: '',
  })

  const studentPayFeeCtx = useStudentCourseFeesContext()

  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  //console.log('result',result)

  // 1️⃣ Sort payments by date (oldest first)
  const sortedFees = Array.isArray(result?.data)
    ? [...result.data].sort((a, b) => new Date(a.amountDate) - new Date(b.amountDate))
    : []

  // 2️⃣ Calculate running balance
  let runningNetFees = Number(studentInfoData?.netCourseFees || 0)

  const calculatedFees = sortedFees.map((fee) => {
    const amountPaid = Number(fee.amountPaid || 0)
    const remaining = runningNetFees - amountPaid

    const calculatedRow = {
      ...fee,
      displayNetCourseFees: runningNetFees,
      displayRemainingFees: remaining,
    }

    runningNetFees = remaining
    return calculatedRow
  })
  
  //console.log('totalpaid',totalPaid)
  const newRecipt = result?.data?.length ? result?.data[result?.data.length - 1] : null
  // console.log(newRecipt)
  //console.log(studentPayFeeCtx.createStudentCourseFeesMutation.data)
  // console.log(result)
  const addStudentFeeFormToggleHandler = () => {
    setAddStudentFeeFormToggle((prev) => !prev)
    // console.log(addStudentFeeFormToggle)
  }

  const addEasebuzzStudentFeeFormToggleHandler = () => {
    setAddOnlineStudentFeeFormToggle((prev) => !prev)
    // console.log(addStudentFeeFormToggle)
  }

  const [payStudentFeesAdd, setPayStudentFeesAdd] = useState()
  // const [payStudentFeesOnlineAdd, setPayStudentFeesOnlineAdd] = useState()

  useEffect(() => {
    const initialAmountPaid =
      result.data?.length > 0
        ? studentInfoData?.remainingCourseFees
        : studentInfoData?.netCourseFees

    setPayStudentFeesAdd({
      netCourseFees: initialAmountPaid,
      remainingFees: Number(studentInfoData?.remainingCourseFees).toFixed(2),
      amountPaid: '',
      narration: '',
      amountDate: '',
      paymentOption: '',
      lateFees: 0,
    })
  }, [result.data, studentInfoData])

  // console.log(result?.data[result?.data?.length - 1])

  // console.log(payStudentFeesAdd)
  //console.log(studentPayFeeCtx.createStudentCourseFeesMutation)

  const payStudentFeesAddHandler = (e) => {
    e.preventDefault()
    // amountDate
    // amountPaid
    // lateFees
    // paymentOption

    if (payStudentFeesAdd.amountPaid === '') {
      toast.error('Please enter the amount paid', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.amountDate === '') {
      toast.error('Please enter the Date', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.paymentOption === '') {
      toast.error('Please select the payment option', {bodyStyle: {fontSize: '18px'}})
      return
    }

    let url = `https://web.whatsapp.com/send?phone=+91${studentInfoData.phone_number}`

    // // Appending the message to the URL by encoding it
    // url += `&text=Hello, ${studentInfoData.name} your fess has been submitted successfully ${payStudentFeesAdd.amountPaid} Rs? &app_absent=0`

    url += `&text=Dear ${encodeURIComponent(
      studentInfoData.name
    )}, We have successfully received Rs.${encodeURIComponent(
      payStudentFeesAdd.amountPaid
    )}/- as your monthly installment.\nThanks,\n${studentInfoData?.companyName?.companyName}`

    //console.log(Number(payStudentFeesAdd.amountPaid), Number(payStudentFeesAdd.netCourseFees))

    if (Number(payStudentFeesAdd?.amountPaid) <= Number(payStudentFeesAdd?.netCourseFees)) {
      try {
        if (studentInfoData.no_of_installments === 1) {
          //console.log(payStudentFeesAdd)
          if (Number(payStudentFeesAdd.remainingFees) === 0) {
            studentPayFeeCtx.createStudentCourseFeesMutation.mutate({
              ...payStudentFeesAdd,
              studentInfo: studentInfoData?._id,
              no_of_installments_amount: studentInfoData.no_of_installments_amount,
              no_of_installments: studentInfoData.no_of_installments,
              courseName: studentInfoData?.courseName,
            })
            setAddStudentFeeFormToggle(false)
            setPayStudentFeesAdd({
              netCourseFees: 0,
              remainingFees: 0,
              amountPaid: 0,
              narration: '',
              amountDate: Date.now(),
              paymentOption: '',
              lateFees: 0,
            })
            if (sendWhatsAppMessageSuggestion[0]?.whatsappSuggestionStatus) {
              window.open(url)
            }
            // if (studentPayFeeCtx.createStudentCourseFeesMutation.isError === false) {
            //   navigate(`/profile/student/${studentInfoData?._id}`)
            //window.location.reload()
            // }
          }

          toast.error(
            'If student have 1 installment then you have to pay complete remaining fees. else you have to increase student installment'
          )

          // if (studentPayFeeCtx.createStudentCourseFeesMutation.isError === false) {
          //   navigate(`/profile/student/${studentInfoData?._id}`)
          //   // window.location.reload()
          // }
          return
        }

        studentPayFeeCtx.createStudentCourseFeesMutation.mutate({
          ...payStudentFeesAdd,
          studentInfo: studentInfoData?._id,
          no_of_installments_amount: studentInfoData.no_of_installments_amount,
          no_of_installments: studentInfoData.no_of_installments,
          courseName: studentInfoData?.courseName,
        })
        setAddStudentFeeFormToggle(false)

        setPayStudentFeesAdd({
          netCourseFees: 0,
          remainingFees: 0,
          amountPaid: 0,
          narration: '',
          amountDate: Date.now(),
          paymentOption: '',
          lateFees: 0,
        })
        if (sendWhatsAppMessageSuggestion[0]?.whatsappSuggestionStatus) {
          window.open(url)
        }

        // if (studentPayFeeCtx.createStudentCourseFeesMutation.isError === false) {
        //   navigate(`/profile/student/${studentInfoData?._id}`)
        //window.location.reload()
        // }
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error('Amount paid should not be more than Net Course  fees')
      // navigate(`/profile/student/${studentInfoData?._id}`)
      // window.location.reload()
      return
    }
  }

  const payOnlineStudentFeesAddHandler = async (e) => {
    e.preventDefault()
    setPayStudentFeesAdd({
      ...payStudentFeesAdd,
      studentInfo: studentInfoData?._id,
      no_of_installments_amount: studentInfoData.no_of_installments_amount,
      no_of_installments: studentInfoData.no_of_installments,
      courseName: studentInfoData?.courseName,
    })

    if (payStudentFeesAdd.amountPaid === '') {
      toast.error('Please enter the amount paid', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.amountDate === '') {
      toast.error('Please enter the Date', {bodyStyle: {fontSize: '18px'}})
      return
    } else if (payStudentFeesAdd.paymentOption === '') {
      toast.error('Please select the payment option', {bodyStyle: {fontSize: '18px'}})
      return
    }

    // Check if the amount paid is less than the no_of_installment_amount
    if (currentUser?.role === 'Student') {
      if (
        Number(payStudentFeesAdd.amountPaid) < Number(studentInfoData.no_of_installments_amount)
      ) {
        toast.error(
          `Amount paid cannot be less than ${studentInfoData.no_of_installments_amount}`,
          {
            bodyStyle: {fontSize: '18px'},
          }
        )
        return
      }
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/courseFees/online-payment`, {
        ...payStudentFeesAdd,
        studentInfo: studentInfoData?._id,
        no_of_installments_amount: studentInfoData.no_of_installments_amount,
        no_of_installments: studentInfoData.no_of_installments,
        courseName: studentInfoData?.courseName,
      })

      // console.log('Response from backend:', response.data);

      if (response.data.success && response.data.paymentLink) {
        // Open the payment link in a new tab
        // window.open(response.data.paymentLink)
        window.location.href = response.data.paymentLink
      } else if (response.data.failureMessage) {
        // Redirect to the profile page and show a popup with the failure message
        // console.log(response);
        toast.error(response.data.failureMessage, {bodyStyle: {fontSize: '18px'}})
        navigate(`/payment/failure`)
      } else {
        toast.error('Payment initiation failed')
      }
    } catch (error) {
      console.error('Error initiating payment:', error)
      toast.error('Error initiating payment')
    }
  }

  const editStudentCourseFessHandler = (e) => {
    // console.log(editStudentCourseFees)
    e.preventDefault()
    studentPayFeeCtx.updateStudentSingleCourseFeesMutation.mutate(editStudentCourseFees)
    setStudentCourseFeesEditId(null)
    // navigate(`/profile/student/${studentInfoData?._id}`)
    // window.location.reload()
    return
  }

  const delelteStudentCourseFeesHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this student course fee?')) {
      studentPayFeeCtx.useDeleteSingleStudentCourseFees.mutate(id)
      window.location.reload()
    }
    // navigate(`/profile/student/${studentInfoData?._id}`)
    return
  }

  // let id
  // const statusForSingleData = getReceiptStatus(id)
  // console.log(statusForSingleData)
  // console.log(payStudentFeesAdd)

  // console.log(listOfFeesData)
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to pay fees'
        >
          {userRoleAccess?.some(
            (userAccess) =>
              userAccess.studentFeesAccess['Add Student Fees'] === true &&
              userAccess.role === currentUser?.role &&
              currentUser.role !== 'Student'
          ) ? (
            <button
              disabled={studentInfoData?.remainingCourseFees === 0}
              onClick={addStudentFeeFormToggleHandler}
              className='btn btn-sm btn-light-primary'
            >
              {studentInfoData?.remainingCourseFees === 0 ? (
                ''
              ) : (
                <KTIcon iconName='plus' className='fs-3' />
              )}
              {studentInfoData?.remainingCourseFees === 0
                ? `${studentInfoData?.name} paid all fees`
                : 'Pay Fees'}
            </button>
          ) : (
            ''
            // <p className='btn btn-sm btn-light-primary'>Student Course Fees Record</p>
          )}
          <button
            disabled={studentInfoData?.remainingCourseFees === 0}
            onClick={addEasebuzzStudentFeeFormToggleHandler}
            className='btn btn-sm btn-light-primary mx-5'
          >
            {studentInfoData?.remainingCourseFees === 0 ? (
              ''
            ) : (
              <KTIcon iconName='plus' className='fs-3' />
            )}
            {studentInfoData?.remainingCourseFees === 0
              ? `${studentInfoData?.name} paid all fees`
              : 'Pay Online'}
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <form
            onSubmit={
              studentCourseFeeEditId
                ? editStudentCourseFessHandler
                : addStudentFeeFormToggle
                ? payStudentFeesAddHandler
                : payOnlineStudentFeesAddHandler
            }
          >
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className=''>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                  </th>
                  <th className='min-w-80px'>Sr No</th>
                  <th className='min-w-150px'>Net Course Fees</th>
                  <th className='min-w-150px'>Amount Paid</th>
                  <th className='min-w-100px'>Remaining</th>
                  <th className='min-w-100px'>Date</th>
                  <th className='min-w-100px'>Recipt No</th>
                  <th className='min-w-150px'>Payment Options</th>
                  <th className='min-w-80px'>Late Fee</th>
                  <th className='min-w-40px'>Status</th>
                  <th className='min-w-150px'>Added By</th>
                  {userRoleAccess?.some(
                    (userAccess) =>
                      (userAccess.studentFeesAccess['Edit Student Fees'] === true ||
                        userAccess.studentFeesAccess['Print Recipt'] === true ||
                        userAccess.studentFeesAccess['Whatsapp Button'] === true ||
                        userAccess.studentFeesAccess['Mail Button'] === true ||
                        userAccess.studentFeesAccess['Delete Student Fees'] === true) &&
                      userAccess.role === currentUser?.role
                  ) && <th className='min-w-200px text-end'>Actions</th>}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}

              <tbody>
                {addStudentFeeFormToggle && (
                  <PayStudentFee
                    payStudentFeesAdd={payStudentFeesAdd}
                    setPayStudentFeesAdd={setPayStudentFeesAdd}
                    studentInfoData={studentInfoData}
                    setAddStudentFeeFormToggle={setAddStudentFeeFormToggle}
                  />
                )}
                {addOnlineStudentFeeFormToggle && (
                  <PayStudentFeeOnline
                    payStudentFeesAdd={payStudentFeesAdd}
                    setPayStudentFeesAdd={setPayStudentFeesAdd}
                    studentInfoData={studentInfoData}
                    setAddOnlineStudentFeeFormToggle={setAddOnlineStudentFeeFormToggle}
                  />
                )}
                {calculatedFees.length > 0 &&
                  calculatedFees.map((StudentFee, index) => {
                    const status = getReceiptStatus(StudentFee?._id)

                    return (
                      <React.Fragment key={StudentFee._id}>
                        {StudentFee._id === studentCourseFeeEditId ? (
                          <EditOnlyCourseFee
                            StudentFee={StudentFee}
                            setEditStudentCourseFees={setEditStudentCourseFees}
                            setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                            editStudentCourseFees={editStudentCourseFees}
                          />
                        ) : (
                          <ReadOnlyCourseFee
                            studentInfoData={studentInfoData}
                            StudentFee={StudentFee}
                            index={index}
                            status={status}
                            delelteStudentCourseFeesHandler={delelteStudentCourseFeesHandler}
                            setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                          />
                        )}
                      </React.Fragment>
                    )
                  })}
                {/* {result.data?.length > 0 ? (
                  result.data?.map((StudentFee, index) => {
                    const status = getReceiptStatus(StudentFee?._id)
                    // id = StudentFee?._id
                    return (
                      <React.Fragment key={index}>
                        {StudentFee._id === studentCourseFeeEditId ? (
                          <EditOnlyCourseFee
                            StudentFee={StudentFee}
                            setEditStudentCourseFees={setEditStudentCourseFees}
                            setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                            editStudentCourseFees={editStudentCourseFees}
                          />
                        ) : (
                          <ReadOnlyCourseFee
                            studentInfoData={studentInfoData}
                            StudentFee={StudentFee}
                            index={index}
                            status={status}
                            delelteStudentCourseFeesHandler={delelteStudentCourseFeesHandler}
                            setStudentCourseFeesEditId={setStudentCourseFeesEditId}
                          />
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <></>
                )} */}
              </tbody>
              {/* end::Table body */}
            </table>
          </form>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default StudentCourseFee
