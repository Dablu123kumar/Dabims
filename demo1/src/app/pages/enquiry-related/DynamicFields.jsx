import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Dynamic.css'
import {useDynamicFieldContext} from './DynamicFieldsContext'
import {useParams} from 'react-router-dom'

const Dynamic = ({companyName, formId}) => {
  const {
    handleChange,
    handlePropertyChange,
    handleRemoveOption,
    handleAddOption,
    handleFieldTypeChange,
    handleRadioChange,
    handleCheckboxChange,
    fields,
    setFields,
    newOption,
    setNewOption,
    newOptionIndex,
    setNewOptionIndex,
    createCustomFormFieldData,
    getAllAddedFormsName,
    getAllCustomFormFieldDataQuery,
    setOpenModal,
  } = useDynamicFieldContext()

  const params = useParams()
  const singleCompanyId = params.id

  const isAddButtonDisabled =
    !fields[0].name ||
    (['select', 'checkbox', 'radio'].includes(fields[0].type) && fields[0].options.length === 0)

  const submitHandler = (e) => {
    e.preventDefault()
    createCustomFormFieldData.mutate({...fields[0], companyName: companyName, formId: formId})
    setFields([
      {
        type: 'text',
        name: '',
        value: '',
        mandatory: false,
        quickCreate: false,
        keyField: false,
        headerView: false,
        options: [],
      },
    ])
    setOpenModal(false)
  }

  //console.log(fields)
  return (
    <>
      <form className='dynamic-form'>
        <div className='field-container'>
          <select
            className='form-select form-select-solid form-select-lg'
            value={fields[0].type}
            onChange={(event) => {
              handleFieldTypeChange(fields[0], event.target.value)
              handleFieldTypeChange(0, event.target.value)
            }}
          >
            <option value='text'>Text Field</option>
            <option value='checkbox'>Checkbox</option>
            <option value='radio'>Radio</option>
            <option value='select'>Select</option>
            <option value='date'>Date</option>
            <option value='number'>Number</option>=
            <option value='datetime-local'>DateTime Local</option>
            <option value='textarea'>Textarea</option>
            <option value='url'>URL</option>
            <option value='currency'>Currency</option>
          </select>
          <input
            type='text'
            name='name'
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Name'
            value={fields[0].name}
            onChange={(event) => {
              const values = [...fields]
              values[0].name = event.target.value
              setFields(values)
            }}
          />
          {fields[0].type === 'text' && (
            <input
              type='text'
              name={fields[0]?.name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0]?.value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'checkbox' &&
            fields[0].options &&
            fields[0].options.map((option, optionIndex) => (
              <div key={optionIndex} className='position-relative checkbox-option'>
                <input
                  type='checkbox'
                  id={`checkbox-${0}-${optionIndex}`}
                  name={fields[0].name}
                  value={option.value}
                  className='form-check-input'
                  checked={Array.isArray(fields[0].value) && fields[0].value.includes(option.value)}
                  onChange={(event) => handleCheckboxChange(0, option.value, event, fields[0].type)}
                />
                <label htmlFor={`checkbox-${0}-${optionIndex}`}>{option.label}</label>
                <i
                  className='bi bi-x-circle position-absolute top-0 end-0 m-2 cursor-pointer'
                  onClick={() => handleRemoveOption(0, optionIndex)}
                ></i>
              </div>
            ))}

          {fields[0].type === 'radio' &&
            fields[0].options &&
            fields[0].options.map((option, optionIndex) => (
              <div key={optionIndex} className='position-relative radio-option'>
                <input
                  type='radio'
                  id={`radio-${0}-${optionIndex}`}
                  name={fields[0].name}
                  value={option.value}
                  className='form-check-input'
                  checked={fields[0].value === option.value}
                  onChange={() => handleRadioChange(0, option.value, fields[0].type)}
                />
                <label htmlFor={`radio-${0}-${optionIndex}`}>{option.label}</label>
                <i
                  className='bi bi-x-circle position-absolute end-0 m-2 cursor-pointer'
                  onClick={() => handleRemoveOption(0, optionIndex)}
                ></i>
              </div>
            ))}

          {fields[0].type === 'select' && (
            <div>
              <select
                name={fields[0].name}
                className='form-select form-select-solid form-select-lg'
                value={fields[0].value}
                onChange={(event) => handleChange(0, event, fields[0].type)}
              >
                <option value=''>Select an option</option>
                {fields[0].options &&
                  fields[0].options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <div className='mt-2'>
                {fields[0].options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <span>{option.label}</span>
                    <i
                      className='bi bi-x-circle cursor-pointer'
                      onClick={() => handleRemoveOption(0, optionIndex)}
                    ></i>
                  </div>
                ))}
              </div>
            </div>
          )}
          {fields[0].type === 'textarea' && (
            <textarea
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'url' && (
            <input
              type='url'
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'currency' && (
            <input
              type='number'
              step='0.01'
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              placeholder='Field Value'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'date' && (
            <input
              type='date'
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'number' && (
            <input
              type='number'
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}
          {fields[0].type === 'datetime-local' && (
            <input
              type='datetime-local'
              name={fields[0].name}
              className='form-control form-control-lg form-control-solid'
              value={fields[0].value}
              onChange={(event) => handleChange(0, event, fields[0].type)}
            />
          )}

          {['checkbox', 'radio', 'select'].includes(fields[0].type) && (
            <div>
              <input
                type='text'
                placeholder='New Option'
                value={newOptionIndex === 0 ? newOption : ''}
                onChange={(event) => {
                  setNewOption(event.target.value)
                  setNewOptionIndex(0)
                }}
                className='form-control form-control-lg form-control-solid mt-2'
              />
              <button
                type='button'
                onClick={() => handleAddOption(0)}
                className='btn btn-primary mt-2'
              >
                <i className='bi bi-plus-circle'></i> Add Option
              </button>
            </div>
          )}
          <div className='field-properties'>
            <h4 className='text-center mb-4'>Enable / Disable field properties</h4>
            <div className='d-flex flex-wrap gap-3'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  id={`mandatory-${0}`}
                  checked={fields[0].mandatory}
                  onChange={() => handlePropertyChange(0, 'mandatory')}
                  className='form-check-input'
                />
                <label htmlFor={`mandatory-${0}`} className='form-check-label'>
                  Mandatory Field
                </label>
              </div>
              <div className='form-check'>
                <input
                  type='checkbox'
                  id={`headerView-${0}`}
                  checked={fields[0].headerView}
                  onChange={() => handlePropertyChange(0, 'headerView')}
                  className='form-check-input'
                />
                <label htmlFor={`headerView-${0}`} className='form-check-label'>
                  Header View
                </label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={submitHandler}
            disabled={!fields[0].name || isAddButtonDisabled}
            type='button'
            className='btn btn-primary'
          >
            Add
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  )
}

export default Dynamic
