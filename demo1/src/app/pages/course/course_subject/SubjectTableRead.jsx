import {KTIcon} from '../../../../_metronic/helpers'
import moment from 'moment'

const SubjectTableRead = ({
  subject,
  key,
  setEditSubjectId,
  setEditSubject,
  handleDeleteSubject,
  index,
}) => {
  const editSubjectAndIdHanlder = (id, subject) => {
    setEditSubjectId(id)
    setEditSubject(subject)
  }
  return (
    <tr key={key}>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td>{index + 1}</td>
      <td>{subject.subjectName}</td>
      <td>{subject.subjectCode}</td>
      <td>{subject.fullMarks}</td>
      <td>{subject.passMarks}</td>
      <td>{subject.addedBy}</td>
      <td>{moment(subject.createdAt).format('DD/MM/YYYY')}</td>

      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='button'
            onClick={() => editSubjectAndIdHanlder(subject?._id, subject)}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTIcon iconName='pencil' className='fs-3' />
          </button>
          <button
            type='button'
            onClick={() => handleDeleteSubject(subject._id)}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
          >
            <KTIcon iconName='trash' className='fs-3' />
          </button>
        </div>
      </td>
    </tr>
  )
}
export default SubjectTableRead
