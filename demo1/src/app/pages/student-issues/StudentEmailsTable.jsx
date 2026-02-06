import React, { useEffect, useState } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
import { useDynamicFieldContext } from '../enquiry-related/DynamicFieldsContext'
import moment from 'moment'
import { useCompanyContext } from '../compay/CompanyContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useStudentCourseFeesContext } from '../courseFees/StudentCourseFeesContext'
const BASE_URL = process.env.REACT_APP_BASE_URL

const StudentEmailsTable = ({ studentInfoData }) => {
  const [emailLogs, setEmailLogs] = useState([])
  const [isSendingEmail, setIsSendingEmail] = useState(false) // Track sending status
  const [emailTemplates, setEmailTemplates] = useState([])
  const [selectValue, setSelectValue] = useState('')

  // Modal states
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false) // For sending email modal
  const [isEmailContentModalOpen, setIsEmailContentModalOpen] = useState(false) // For viewing email content modal
  const [selectedEmail, setSelectedEmail] = useState({ subject: '', content: '' }) // Email content for modal
  // console.log(selectedEmail.content)
  const companyCTX = useCompanyContext()
  const studentPayFeeCtx = useStudentCourseFeesContext()
  const result = studentPayFeeCtx.useSingleStudentCourseFees(studentInfoData?._id)
  const { emailTemplate } = useCompanyContext()
  //console.log('getemailt', emailTemplate)
  const { data: singleCompanyData } = companyCTX?.useGetSingleCompanyData(
    studentInfoData?.companyName
  )

  const student = result?.data || []
  // console.log(studentInfoData)

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allMails`)
        setEmailLogs(res.data)
      } catch (error) {
        console.log('Failed to fetch email logs')
      }
    }

    const fetchEmailTemplates = async () => {
      try {
        const res = await companyCTX.getEmailTemplate()
        console.log('email templates:', res)
        setEmailTemplates(res.data || [])
        if (res.data.length > 0) {
          setSelectValue(res.data[0]?.customTemplate) // Set the first template as selected
        }
        if (selectValue === res.data?.[0]?.cancellationTemplate) {
          setSelectValue(res.data?.[0]?.cancellationTemplate)
        }
      } catch (error) {
        console.log('Failed to fetch email templates')
      }
    }

    fetchEmails()
    fetchEmailTemplates()
  }, [])

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value
    setSelectValue(selectedValue)
  }

  const sendWarningEmail = async (studentData) => {
    setIsSendingEmail(true) // Start sending email
    try {
      const res = await axios.post(`${BASE_URL}/api/students/sendWarningMail`, studentData)
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            fontSize: '18px',
            color: 'white',
            background: 'black',
          },
        })
        setIsSendEmailModalOpen(false) // Close the modal after sending email
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSendingEmail(false) // Stop sending email
    }
  }

  const sendAddmissionCancellationMail = async (studentData) => {
    setIsSendingEmail(true) // Start sending email
    try {
      const res = await axios.post(
        `${BASE_URL}/api/students/sendAddmissionCancellationMail`,
        studentData
      )
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            fontSize: '18px',
            color: 'white',
            background: 'black',
          },
        })
        setIsSendEmailModalOpen(false) // Close the modal after sending email
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSendingEmail(false) // Stop sending email
    }
  }

  // console.log(studentInfoData)

  const formatLetter = (template, studentInfoData, courseName, remainingFees) => {
    if (!studentInfoData || !singleCompanyData) return '' // Guard clause
    return template
      .replace(/\${studentInfo.name}/g, studentInfoData.name || '')
      .replace(/\${studentInfo.mobile_number}/g, studentInfoData.mobile_number || '')
      .replace(/\${studentInfo.present_address}/g, studentInfoData.present_address || '')
      .replace(/\${studentInfo.city}/g, studentInfoData.city || '')
      .replace(/\${studentInfo.father_name}/g, studentInfoData.father_name || '')
      .replace(/\${courseName.courseName}/g, studentInfoData.select_course || '')
      .replace(/\${companyName.companyName}/g, singleCompanyData.companyName || '')
      .replace(/\${studentInfo.remainingCourseFees}/g, studentInfoData.remainingCourseFees || '')
      .replace(/\${studentInfo.rollNumber}/g, studentInfoData.rollNumber || '')
      .replace(/\${studentInfo.email}/g, studentInfoData.email || '')
      .replace(/\${courseName.courseFees}/g, studentInfoData.course_fees || '')
      .replace(/\${companyName.companyPhone}/g, singleCompanyData.companyPhone || '')
      .replace(/\${companyName.email}/g, singleCompanyData.email || '')
      .replace(/\${companyName.companyAddress}/g, singleCompanyData.companyAddress || '')
      .replace(/\${companyName.companyWebsite}/g, singleCompanyData.companyWebsite || '')
  }

  // Handle opening the content modal
  const handleEmailClick = (email) => {
    // console.log(email)
    setSelectedEmail({
      subject: email.subject,
      content: email.content || 'No content available',
    })
    setIsEmailContentModalOpen(true) // Open the email content modal
  }

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <>
      <div className={`card my-10`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Student Emails</span>
            <span className='mt-1 fw-semibold fs-7'>{studentInfoData?.name}</span>
          </h3>
          <div className='card-toolbar'>
            {/* Open Send Email Modal */}
            <button
              className='btn btn-sm btn-light-primary'
              onClick={() => setIsSendEmailModalOpen(true)}
            >
              <KTIcon iconName='send' className='fs-3' />
              Send Email
            </button>
          </div>
        </div>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold '>
                  <th className='w-25px'></th>
                  <th className='min-w-100px'>Email Date and Time</th>
                  <th className='min-w-120px'>Subject</th>
                  <th className='min-w-150px'>Sended By</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='text-center'>
                      <h4>No student Mail data available</h4>
                    </td>
                  </tr>
                ) : (
                  emailLogs
                    ?.filter((check) =>
                      check.recipientEmails?.[0]?.includes(studentInfoData?.email)
                    )
                    .map((email, index) => (
                      <tr key={index}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                        </td>
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {moment(email.sentAt).format('DD/MM/YYYY hh:mm A')}
                          </a>
                        </td>
                        <td>
                          {/* Open Email Content Modal */}
                          <a
                            className='text-dark fw-bold text-hover-primary d-block fs-6'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEmailClick(email)}
                          >
                            {email.subject}
                          </a>
                        </td>
                        <td>
                          <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                            {email.sendedBy}
                          </a>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Send Email Modal */}
      {isSendEmailModalOpen && (
        <PopUpModal show={isSendEmailModalOpen} handleClose={() => setIsSendEmailModalOpen(false)}>
          <div className='d-flex justify-content-end'>
            <select
              className='form-select form-select-solid form-select-lg mt-8'
              onChange={handleSelectionChange}
              value={selectValue}
            >
              {emailTemplate?.length > 0 ? (
                emailTemplate.map((email) => (
                  <>
                    <option key={email._id} value={email.customTemplate}>
                      Warning Letter
                    </option>
                    <option value={email.cancellationTemplate}>
                      Addmission Cancellation Letter
                    </option>
                  </>
                ))
              ) : (
                <option disabled>No templates available</option>
              )}
            </select>
          </div>
          <div className='mt-5'>
            <pre
              style={{
                fontFamily: 'Gill Sans, sans-serif',
                fontSize: '12px',
                color: themeMode === 'dark' ? '#fff' : 'black',
                padding: '4px',
              }}
            >
              {formatLetter(selectValue, studentInfoData)}
            </pre>
          </div>
          <div className='footer d-flex justify-content-end'>
            <button
              className='btn btn-primary'
              onClick={() => {
                selectValue === emailTemplate?.[0]?.customTemplate
                  ? sendWarningEmail(student.length > 0 ? student[0] : null)
                  : sendAddmissionCancellationMail(student.length > 0 ? student[0] : null)
              }}
              disabled={studentInfoData?.remainingCourseFees === 0 || isSendingEmail}
            >
              <KTIcon iconName='send' className='fs-3' />
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </PopUpModal>
      )}

      {/* Email Content Modal */}
      {isEmailContentModalOpen && (
        <PopUpModal
          show={isEmailContentModalOpen}
          handleClose={() => setIsEmailContentModalOpen(false)}
        >
          <div className='mt-10' style={{ background: themeMode === 'dark' ? '#323333' : '#fff' }}>
            <h5>{selectedEmail.subject}</h5>
            <div
              style={{ color: themeMode === 'dark' ? '#fff' : '' }}
              dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
            />
          </div>
        </PopUpModal>
      )}
    </>
  )
}

export default StudentEmailsTable
