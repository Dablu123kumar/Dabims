import {useNavigate, useParams} from 'react-router-dom'
import {KTIcon} from '../../../_metronic/helpers'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import moment from 'moment'
import {useCompanyContext} from '../compay/CompanyContext'
import {useState} from 'react'

const PaymentApproval = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {
    getAllStudentsCourseFees,
    createStudentStatusMutation,
    useSingleStudentCourseFees,
    getAllRecieptStatusData,
  } = useStudentCourseFeesContext()

  const [checkboxStates, setCheckboxStates] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const approvalData = getAllRecieptStatusData?.data?.approvalData?.filter(
    (data) => data.companyId === params.id
  )

  const dataReciepts = getAllStudentsCourseFees?.data?.filter(
    (data) => data.studentInfo?.companyName === params.id
  )

  const companyCTX = useCompanyContext()
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(params?.id)
  const recieptCount = dataReciepts?.length

  // Handle checkbox change
  const handleCheckboxChange = (recieptId) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [recieptId]: !prev[recieptId], // Toggle the state
    }))
  }

  const handleStatusChange = (recieptId, studentId, status) => {
    // Update checkbox state when status changes to 'Pending'
    if (status === 'Pending') {
      setCheckboxStates((prev) => ({
        ...prev,
        [recieptId]: false, // Set the checkbox to false
      }))
    }

    // Call the mutation with updated values
    createStudentStatusMutation.mutate({
      studentId: studentId,
      companyId: params.id,
      reciept: recieptId,
      status,
      check: status === 'Approved' ? checkboxStates[recieptId] || false : false, // Ensure check is false for 'Pending'
    })
  }

  const getReceiptStatus = (recieptId) => {
    const approval = approvalData?.find(
      (data) => data.reciept?._id.toString() === recieptId.toString()
    )
    return approval ? approval.status : 'Pending'
  }

  const check = (recieptId) => {
    const approval = approvalData?.find(
      (data) => data.reciept?._id.toString() === recieptId.toString()
    )
    return approval ? approval?.check : false
  }

  const sortedDataReciepts = dataReciepts
    ?.filter((data) => data.studentInfo.companyName === params.id)
    ?.sort((a, b) => new Date(b.amountDate) - new Date(a.amountDate))

  const filteredDataReciepts = sortedDataReciepts?.filter((reciept) => {
    const studentName = reciept?.studentInfo?.name?.toLowerCase() || ''
    const courseName = reciept?.courseName?.courseName?.toLowerCase() || ''
    const recieptNumber = reciept?.reciptNumber?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    return (
      studentName.includes(query) || courseName.includes(query) || recieptNumber.includes(query)
    )
  })

  const isReceiptFromCurrentMonth = (receiptDate) => {
    const currentMonth = moment().month() + 1
    const receiptMonth = moment(receiptDate).month() + 1
    return currentMonth === receiptMonth && moment(receiptDate).year() === moment().year()
  }

  const getParticularsLabel = (studentId) => {
    const studentReceipts = dataReciepts.filter((reciept) => reciept.studentInfo._id === studentId)
    if (studentReceipts.length === 1 && isReceiptFromCurrentMonth(studentReceipts[0].amountDate)) {
      return 'New Admission'
    }
    return 'Installment'
  }

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{singleComapnyData?.companyName}</span>
          <span className='card-label fw-bold fs-3 mb-1'>Receipt {recieptCount}</span>
        </h3>
        <div className='search-bar'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by Name or Course'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th>No.</th>
                <th>Receipt No.</th>
                <th>Name</th>
                <th>Particulars</th>
                <th>Date</th>
                <th>Amount</th>
                <th className='text-end'>To Partner</th>
                <th className='text-end'>Status</th>
                {/* <th className='text-end'>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredDataReciepts?.length > 0 ? (
                filteredDataReciepts?.map((reciept, index) => {
                  const status = getReceiptStatus(reciept?._id)
                  const checkStatus = checkboxStates[reciept?._id] ?? check(reciept._id)
                  return (
                    <tr key={reciept._id}>
                      <td>{index + 1}</td>
                      <td
                        className='text-dark fw-bold text-hover-primary'
                        style={{cursor: 'pointer'}}
                        onClick={() => navigate(`/profile/student/${reciept?.studentInfo?._id}`)}
                      >
                        {reciept?.reciptNumber}
                      </td>
                      <td
                        className='text-dark fw-bold text-hover-primary'
                        style={{cursor: 'pointer'}}
                        onClick={() => navigate(`/profile/student/${reciept?.studentInfo?._id}`)}
                      >
                        {reciept?.studentInfo?.name}
                      </td>
                      <td>{getParticularsLabel(reciept?.studentInfo?._id)}</td>
                      <td>{moment(reciept?.amountDate).format('DD-MM-YYYY')}</td>
                      <td className='text-end'>{reciept?.amountPaid}</td>
                      <td className='text-end'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={checkStatus}
                          onChange={() => handleCheckboxChange(reciept._id)}
                        />
                      </td>
                      {/* <td className='text-end'>
                        <button
                          className='btn btn-icon btn-bg-light btn-active-color-success btn-sm'
                          onClick={() =>
                            handleStatusChange(reciept._id, reciept.studentInfo._id, 'Approved')
                          }
                        >
                          <KTIcon iconName='check' />
                        </button>
                      </td> */}
                      <td className='text-end'>
                        <div className='d-inline-block'>
                          <select
                            className={`form-select form-select-sm ${
                              status === 'Approved' ? 'badge-light-success' : 'badge-light-danger'
                            }`}
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(
                                reciept._id,
                                reciept.studentInfo._id,
                                e.target.value
                              )
                            }
                            style={{
                              width: 'auto',
                              textAlign: 'center',
                              color: status === 'Approved' ? '#50cd89' : '#f64e60', // Match badge text color
                              backgroundColor: status === 'Approved' ? '#e8fff3' : '#ffe2e5', // Match badge background
                            }}
                          >
                            <option value='Pending'>Pending</option>
                            <option value='Approved'>Approved</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan='9'>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentApproval
