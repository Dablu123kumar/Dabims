import moment from 'moment'
import {KTIcon} from '../../../_metronic/helpers'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'

const ReadOnlyAlertStudentPending = ({index, studentAlertData, handleEditClick}) => {
  const studentCTX = useAdmissionContext()
  const alertStudentDeleteHandler = (id) => {
    if (!window.confirm('Are you sure you want to delete')) {
      return
    }
    studentCTX.deleteAlertStudentPendingFeesMutation.mutate(id)
  }

  return (
    <tr key={studentAlertData._id}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'>
          {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
        </div>
      </td>
      <td>{index + 1}</td>
      <td>{moment(studentAlertData?.Date).format('DD-MM-YYYY')}</td>
      <td className=''>{studentAlertData?.particulars}</td>
      <td className=''>
        {moment(studentAlertData?.RemainderDateAndTime).format('DD-MM-YYYY hh:mm a')}
      </td>
      <td className=''>{studentAlertData?.Status}</td>
      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            onClick={(e) => handleEditClick(e, studentAlertData)}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTIcon iconName='pencil' className='fs-3' />
          </button>
          <button
            onClick={() => alertStudentDeleteHandler(studentAlertData?._id)}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
          >
            <KTIcon iconName='trash' className='fs-3' />
          </button>
        </div>
      </td>
    </tr>
  )
}
export default ReadOnlyAlertStudentPending
