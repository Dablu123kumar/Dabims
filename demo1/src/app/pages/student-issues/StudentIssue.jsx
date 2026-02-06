import moment from 'moment'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import AddStudentIssue from './AddStudentIssue'
import {useCompanyContext} from '../compay/CompanyContext'
import {useState} from 'react'
import EditStudentIssue from './EditStudentIssue'

const StudentIssue = ({studentInfoData}) => {
  //console.log(studentInfoData.name)
  const studentIssueCTX = useCompanyContext()
  const {data: toggleShowStudentNotes} = studentIssueCTX.useGetSingleStudentIssueStatusQuery(
    studentInfoData?._id
  )
  // console.log(studentIssueCTX)
  const [editStudentIssueId, setEditStudentIssueId] = useState(null)
  //console.log(editStudentIssueId)
  const handleEditStudentIssueIdhandler = (e, studentId) => {
    e.preventDefault()
    setEditStudentIssueId(studentId)
  }

  const deleteSingleStudentIssueHandler = (e, studentId) => {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return
    }
    studentIssueCTX.useDeleteStudentIssueMutation.mutate(studentId)
  }

  const showStudentNotesHandler = async (e) => {
    studentIssueCTX.useUpdateStudentStatusShowNotesDashboardMutation.mutate({
      showStudent: e.target.checked,
      studentId: studentInfoData?._id,
      studentName: studentInfoData?.name,
    })
  }

  return (
    <div id='student-notes-section' className='card'>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Student Notes</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Student {studentInfoData?.name}</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
        >
          <div className='p-3 btn btn-outline btn-danger form-check form-switch form-switch-sm form-check-custom form-check-solid'>
            <label className='form-check-label text-secondary' style={{cursor: 'pointer'}}>
              <input
                className='form-check-input me-3'
                type='checkbox'
                value=''
                id='sendEmailCheckbox'
                onChange={showStudentNotesHandler}
                checked={toggleShowStudentNotes?.singleStudentIssueStatus?.showStudent}
              />
              Student Flag
            </label>
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
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='w-40px'>SR.No</th>
                <th className='min-w-200px'>Date</th>
                <th className='min-w-500px'>Particulars</th>
                <th className='min-w-200px'>Added By</th>
                <th className='w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <AddStudentIssue studentInfoData={studentInfoData?._id} />
              {studentIssueCTX?.getStudentIssuesListsQuery?.data
                ?.filter((stud) => stud?.studentId === studentInfoData?._id)
                ?.map((studentIssueData, index) => {
                  // console.log(studentIssueData._id, editStudentIssueId)
                  return (
                    <>
                      {studentIssueData?._id === editStudentIssueId ? (
                        <EditStudentIssue
                          studentInfoData={studentInfoData?._id}
                          key={studentIssueData?._id}
                          studentIssueData={studentIssueData}
                          setEditStudentIssueId={setEditStudentIssueId}
                        />
                      ) : (
                        <tr key={studentIssueData?._id}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              {/* <input className="form-check-input widget-9-check" type="checkbox" value="1" /> */}
                            </div>
                          </td>
                          <td>{index + 1}</td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {moment(studentIssueData?.date).format('DD-MM-YYYY')}
                            </a>
                          </td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {studentIssueData?.particulars}
                            </a>
                          </td>
                          <td className=''>{studentIssueData?.addedBy}</td>

                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <button
                                onClick={(e) =>
                                  handleEditStudentIssueIdhandler(e, studentIssueData?._id)
                                }
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </button>
                              <button
                                onClick={(e) =>
                                  deleteSingleStudentIssueHandler(e, studentIssueData?._id)
                                }
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
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

export default StudentIssue
