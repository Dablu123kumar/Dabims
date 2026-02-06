import moment from 'moment'
import {KTIcon} from '../../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import AddUserNotes from './AddUserNotes'
import EditStudentNotes from './EditStudentNotes'
import {useState} from 'react'

const StudentNotes = ({userId, enquiryName}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes
  // console.log(studentData)
  const [editStudentNoteId, setEditStudentNoteId] = useState(null)

  const handleEditStudentNoteIdhandler = (e, studentId) => {
    e.preventDefault()
    setEditStudentNoteId(studentId)
  }

  const deleteSingleStudentNoteHandler = (e, studentId) => {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return
    }
    studentNotesCTX.useDeleteStudentNoteMutation.mutate(studentId)
  }

  return (
    <div id='student-notes-section' className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Enquiry Notes</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Enquiry {enquiryName}</span>
        </h3>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted' key='tr'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='w-40px'>SR.No</th>
                <th className='min-w-200px'>Date</th>
                <th className='min-w-400px'>Particulars</th>
                <th className='min-w-300px'>Remainder</th>
                <th className='min-w-200px'>Added By</th>
                <th className='w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AddUserNotes userId={userId} />
              {studentData
                ?.filter((user) => user.userId === userId)
                ?.map((studentNote, index) => {
                  // console.log(studentNote._id, editStudentIssueId)
                  return (
                    <>
                      {studentNote?._id === editStudentNoteId ? (
                        <EditStudentNotes
                          studentNote={studentNote?._id}
                          key={studentNote?._id}
                          studentNoteData={studentNote}
                          setEditStudentNoteId={setEditStudentNoteId}
                        />
                      ) : (
                        <tr key={studentNote?._id}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              {/* <input className="form-check-input widget-9-check" type="checkbox" value="1" /> */}
                            </div>
                          </td>
                          <td>{index + 1}</td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {moment(studentNote?.date).format('DD-MM-YYYY')}
                            </a>
                          </td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {studentNote?.particulars}
                            </a>
                          </td>
                          <td>
                            <a className='text-dark fw-bold text-hover-primary d-block fs-6'>
                              {studentNote?.startTime && moment(studentNote?.startTime).isValid()
                                ? `${moment(studentNote?.startTime).format('DD-MM-YYYY : h:mm A')}`
                                : ''}
                            </a>
                          </td>
                          <td className=''>{studentNote?.addedBy}</td>

                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <button
                                onClick={(e) => handleEditStudentNoteIdhandler(e, studentNote?._id)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </button>
                              <button
                                onClick={(e) => deleteSingleStudentNoteHandler(e, studentNote?._id)}
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
          </table>
        </div>
      </div>
    </div>
  )
}
export default StudentNotes
