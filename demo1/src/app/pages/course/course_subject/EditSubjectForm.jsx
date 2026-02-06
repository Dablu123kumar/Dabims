const EditSubjectForm = ({editSubject, setEditSubject, setEditSubjectId}) => {
  //console.log(editSubject)
  return (
    <tr>
      <td>
        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
      </td>
      <td></td>
      <td>
        <input
          type='text'
          value={editSubject?.subjectName}
          onChange={(e) => setEditSubject({...editSubject, subjectName: e.target.value})}
          placeholder='Enter subject name...'
          className='form-control w-75 '
        />
      </td>
      <td>
        <input
          type='text'
          value={editSubject.subjectCode}
          onChange={(e) => setEditSubject({...editSubject, subjectCode: e.target.value})}
          placeholder='Enter subject code...'
          className='form-control w-75 '
        />
      </td>

      <td>
        <input
          type='number'
          min={1}
          max={1000}
          value={editSubject.fullMarks}
          onChange={(e) => setEditSubject({...editSubject, fullMarks: e.target.value})}
          placeholder='Enter full Marks...'
          className='form-control w-75 '
        />
      </td>
      <td>
        <input
          className='form-control w-75 '
          type='number'
          min={1}
          max={1000}
          value={editSubject.passMarks}
          onChange={(e) => setEditSubject({...editSubject, passMarks: e.target.value})}
          placeholder='Enter pass Marks...'
        />
      </td>
      <td></td>
      <td></td>

      <td>
        <div className='d-flex justify-content-end flex-shrink-0'>
          <button
            type='submit'
            className='btn btn-success btn-active-color-primary btn-sm me-1 px-5'
          >
            Save
          </button>
          <button
            type='button'
            onClick={() => setEditSubjectId(null)}
            className='btn btn-danger  btn-active-color-primary btn-sm me-1 px-5'
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )
}
export default EditSubjectForm
