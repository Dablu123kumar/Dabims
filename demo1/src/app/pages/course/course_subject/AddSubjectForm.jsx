const AddSubjectForm = ({newSubject, setNewSubject, setAddSubjectFormToggle}) => {
  return (
    <>
      <tr>
        <td>
          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
        </td>
        <td></td>
        <td>
          <input
            type='text'
            value={newSubject.subjectName}
            onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
            placeholder='Enter subject name...'
            className='form-control w-75'
            required={'required'}
          />
        </td>
        <td>
          <input
            type='text'
            value={newSubject.subjectCode}
            onChange={(e) => setNewSubject({...newSubject, subjectCode: e.target.value})}
            placeholder='Enter subject code...'
            className='form-control w-75'
            required={'required'}
          />
        </td>
        <td>
          <input
            type='number'
            min={1}
            max={5000}
            value={newSubject.fullMarks}
            onChange={(e) => setNewSubject({...newSubject, fullMarks: e.target.value})}
            placeholder='Enter full Marks...'
            className='form-control w-75'
          />
        </td>
        <td>
          <input
            className='form-control w-75'
            type='number'
            min={1}
            max={5000}
            value={newSubject.passMarks}
            onChange={(e) => setNewSubject({...newSubject, passMarks: e.target.value})}
            placeholder='Enter pass Marks...'
          />
        </td>
        <td></td>
        <td></td>

        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <button
              type='submit'
              className='btn btn-success btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            >
              Add
            </button>
            <button
              type='button'
              onClick={() => setAddSubjectFormToggle(false)}
              className='btn btn-danger btn btn-success btn-active-color-primary btn-sm me-1 px-5'
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    </>
  )
}
export default AddSubjectForm
