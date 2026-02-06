import moment from 'moment'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'

const OnlyViewStudentNotes = ({userId, enquiryName}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

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
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='w-40px'>SR.No</th>
                <th className='min-w-200px'>Date</th>
                <th className='min-w-400px'>Particulars</th>
                <th className='min-w-300px'>Remainder</th>
                <th className='min-w-200px'>Added By</th>
              </tr>
            </thead>
            <tbody>
              {studentData?.filter((user) => user.userId === userId)?.length > 0 ? (
                studentData
                  ?.filter((user) => user.userId === userId)
                  ?.map((studentNote, index) => (
                    <tr key={studentNote?._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          {/* Checkbox can be placed here if needed */}
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
                          {studentNote?.startTime && moment(studentNote?.endTime).isValid()
                            ? `${moment(studentNote?.startTime).format('DD-MM-YYYY : h:mm A')}`
                            : ''}
                        </a>
                      </td>
                      <td>{studentNote?.addedBy}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan='5' className='text-center fw-bold text-muted'>
                    No notes found !!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OnlyViewStudentNotes
