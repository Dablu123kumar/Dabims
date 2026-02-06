import { useEffect, useState } from 'react'
import { useDynamicFieldContext } from '../DynamicFieldsContext'
import { toast } from 'react-toastify'

const EditDynamicFields = ({ field, setOpenModal }) => {
  const { useGetSingleCustomFieldById, updateFieldMutation } = useDynamicFieldContext()
  const fieldId = useGetSingleCustomFieldById(field?._id)
  const currentField = fieldId?.data?.customField
  const [fields, setFields] = useState(currentField)
  // console.log(fields)
  const [newOption, setNewOption] = useState('')

  useEffect(() => {
    setFields(currentField)
  }, [currentField])

  const handleFieldTypeChange = (event) => {
    const updatedType = event.target.value
    setFields((prevFields) => ({
      ...prevFields,
      type: updatedType,
      value: '', // Clear value when type changes
      options:
        updatedType === 'checkbox' || updatedType === 'radio' || updatedType === 'select'
          ? []
          : undefined, // Reset options for specific types
    }))
  }

  const handleFieldNameChange = (event) => {
    const updatedName = event.target.value
    setFields((prevFields) => ({
      ...prevFields,
      name: updatedName,
    }))
  }

  const handleFieldValueChange = (event) => {
    const updatedValue = event.target.value
    setFields((prevFields) => ({
      ...prevFields,
      value: updatedValue,
    }))
  }

  const handleAddOption = () => {
    if (newOption.trim() === '') return

    setFields((prevFields) => ({
      ...prevFields,
      options: [...(prevFields.options || []), { label: newOption, value: newOption }],
    }))
    setNewOption('')
  }

  const handleRemoveOption = (optionIndex) => {
    setFields((prevFields) => ({
      ...prevFields,
      options: prevFields.options.filter((_, index) => index !== optionIndex),
    }))
  }

  const handleMandatoryChange = (event) => {
    const isMandatory = event.target.checked
    // console.log(isMandatory)
    setFields((prevFields) => ({
      ...prevFields,
      mandatory: isMandatory,
    }))
  }

  const handleHeaderViewChange = (event) => {
    const isHeaderView = event.target.checked
    setFields((prevFields) => ({
      ...prevFields,
      headerView: isHeaderView,
    }))
    // console.log('Header view set to:', isHeaderView)
  }

  const isAddButtonDisabled =
    !fields?.name ||
    (['select', 'checkbox', 'radio'].includes(fields?.type) && fields?.options.length === 0)

  const submitHandler = () => {
    // Assuming 'trainer._id' is the ID you want to send
    const updatedData = {
      id: field._id,
      fields: fields,
    }

    updateFieldMutation.mutate(updatedData, {
      onSuccess: () => {
        // toast.success('Field updated successfully')
        setOpenModal(false)
      },
      onError: (error) => {
        console.error('Error updating field:', error)
        // toast.error('Failed to update field')
      },
    })
  }

  return (
    <form className='dynamic-form'>
      <div className='field-container'>
        <select
          className='form-select form-select-solid form-select-lg'
          value={fields?.type || ''}
          onChange={handleFieldTypeChange}
        >
          <option value='text'>Text Field</option>
          <option value='checkbox'>Checkbox</option>
          <option value='radio'>Radio</option>
          <option value='select'>Select</option>
          <option value='date'>Date</option>
          <option value='number'>Number</option>
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
          value={fields?.name || ''}
          onChange={handleFieldNameChange}
        />

        {fields?.type === 'text' && (
          <input
            type='text'
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Value'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'textarea' && (
          <textarea
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Value'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'url' && (
          <input
            type='url'
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Value'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'currency' && (
          <input
            type='number'
            step='0.01'
            className='form-control form-control-lg form-control-solid'
            placeholder='Field Value'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'date' && (
          <input
            type='date'
            className='form-control form-control-lg form-control-solid'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'number' && (
          <input
            type='number'
            className='form-control form-control-lg form-control-solid'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'datetime-local' && (
          <input
            type='datetime-local'
            className='form-control form-control-lg form-control-solid'
            value={fields?.value || ''}
            onChange={handleFieldValueChange}
          />
        )}

        {fields?.type === 'checkbox' &&
          fields?.options &&
          fields.options.map((option, optionIndex) => (
            <div key={optionIndex} className='position-relative checkbox-option'>
              <input
                type='checkbox'
                id={`checkbox-${optionIndex}`}
                className='form-check-input'
              // Handle checkbox change here
              />
              <label htmlFor={`checkbox-${optionIndex}`}>{option.label}</label>
              <i
                className='bi bi-x-circle position-absolute top-0 end-0 m-2 cursor-pointer'
                onClick={() => handleRemoveOption(optionIndex)}
              ></i>
            </div>
          ))}

        {fields?.type === 'radio' &&
          fields?.options &&
          fields.options.map((option, optionIndex) => (
            <div key={optionIndex} className='position-relative radio-option'>
              <input
                type='radio'
                id={`radio-${optionIndex}`}
                name={fields?.name || ''}
                className='form-check-input'
                value={option.value}
                checked={fields?.value === option.value}
              // Handle radio change here
              />
              <label htmlFor={`radio-${optionIndex}`}>{option.label}</label>
              <i
                className='bi bi-x-circle position-absolute end-0 m-2 cursor-pointer'
                onClick={() => handleRemoveOption(optionIndex)}
              ></i>
            </div>
          ))}

        {fields?.type === 'select' && (
          <div>
            <select
              name={fields?.name || ''}
              className='form-select form-select-solid form-select-lg'
              value={fields?.value || ''}
              onChange={handleFieldValueChange}
            >
              <option value=''>Select an option</option>
              {fields?.options &&
                fields.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            <div className='mt-2'>
              {fields?.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className='d-flex justify-content-between align-items-center'
                >
                  <span>{option.label}</span>
                  <i
                    className='bi bi-x-circle cursor-pointer'
                    onClick={() => handleRemoveOption(optionIndex)}
                  ></i>
                </div>
              ))}
            </div>
          </div>
        )}
        {['checkbox', 'radio', 'select'].includes(fields?.type) && (
          <div>
            <input
              type='text'
              placeholder='New Option'
              value={newOption}
              onChange={(event) => setNewOption(event.target.value)}
              className='form-control form-control-lg form-control-solid mt-2'
            />
            <button type='button' onClick={handleAddOption} className='btn btn-primary mt-2'>
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
                checked={fields?.mandatory}
                onChange={handleMandatoryChange}
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
                checked={fields?.headerView}
                onClick={handleHeaderViewChange}
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
          disabled={!fields?.name || isAddButtonDisabled}
          type='button'
          className='btn btn-primary'
        >
          Add
        </button>
      </div>
    </form>
  )
}

export default EditDynamicFields
