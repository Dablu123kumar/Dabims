import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import {toast} from 'react-toastify'

const EnquiryForm = () => {
  const [isTouched, setIsTouched] = useState(false)
  // const [defaultFieldData, setDefaultFieldData] = useState({})
  // console.log(defaultFieldData)
  const [errors, setErrors] = useState({})
  const params = useParams()
  // console.log(params.id)
  const {getAllCustomFormFieldDataQuery, getAllAddedFormsName, fields} = useDynamicFieldContext()
  const {
    handleSelectChange,
    handleCheckboxChange,
    handleOptionChange,
    handleInputChange,
    fieldValues,
    input,
    setInput,
    setFormData,
    formData,
    getAllDefaultSelectFields,
    createCustomFromsFieldValuesMutation,
  } = useCustomFormFieldContext()

  const selectField = getAllDefaultSelectFields?.data?.defaultSelects
  // console.log(formData)
  // const fetchForm = get

  const [selectedFormId, setSelectedFormId] = useState('')

  const inputChangeHandler = (index, event, fieldName, type) => {
    // console.log('Input Value', event)
    handleInputChange(index, event, fieldName, type)
    // setDefaultFieldData(event)
  }

  const checkboxChangeHandler = (index, optionValue, event, fieldName, type) => {
    // console.log('Checkbox Value', optionValue)
    const checkedOption = optionValue
    if (checkedOption) {
      setIsTouched(false)
    }
    handleCheckboxChange(index, optionValue, event, fieldName, type)
  }
  const radioChangeHandler = (index, event, fieldName, type, optionValue) => {
    // console.log('Radio Value', event.target.value)
    const choosedSingle = optionValue
    if (choosedSingle) {
      setIsTouched(false)
    } else {
      setIsTouched(true)
    }
    handleOptionChange(index, event, fieldName, type, optionValue)
  }

  // console.log(selectedFormId)

  const selectChangeHandler = (index, event, fieldName, type) => {
    // console.log('select', event.target.value)
    const selectedOptionValue = event.target.value
    handleSelectChange(index, event, fieldName, type)
    if (selectedOptionValue) {
      setIsTouched(false)
    }
  }

  const {getCompanyLists} = useCompanyContext()

  const formName = getAllAddedFormsName?.data
    ?.filter((company) => company.companyName === params.id)
    .map((form) => form)
  // console.log(formName)

  const companyDataNameAndId =
    getCompanyLists?.data
      ?.filter((company) => company._id === params.id)
      ?.map((companyData) => ({
        name: companyData.companyName,
        id: companyData._id,
      })) || []

  useEffect(() => {
    // Set the default form ID when the formName data is available
    if (formName?.length > 0 && !selectedFormId) {
      const defaultFormId = formName[0]._id // Select the first form by default
      setSelectedFormId(defaultFormId)
    }
  }, [formName])

  const companyId =
    companyDataNameAndId.length > 0
      ? getCompanyLists?.data
          ?.filter((companyNameById) => companyNameById?._id === companyDataNameAndId[0]?.id)
          .map((company) => company._id)
      : []

  // console.log(params.id)

  const formNameById = getAllAddedFormsName?.data
    ?.filter((formId) => formId._id === selectedFormId)
    .map((form) => form.formName)
  // console.log(formNameById)

  const handleDefaultSelectChange = (e, selectName, type) => {
    const {value} = e.target

    // Update the formData state with the selected value, using selectName as the key
    setFormData((prevData) => ({
      ...prevData,
      [selectName]: {newValue: value, type},
    }))
  }

  const handleChange = (event) => {
    const {name, value} = event.target
    setInput((prevInput) => ({...prevInput, [name]: value}))
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleBlur = (fieldName, value) => {
    // console.log(value)
    if (!value) {
      setIsTouched((prevTouched) => ({
        ...prevTouched,
        [fieldName]: true,
        [value]: true, // You can also use this if you want to keep track of different types
      }))
    }
  }

  const handleFormSelectionChange = (event) => {
    const newFormId = event.target.value
    setSelectedFormId(newFormId)
    // console.log(newFormId)
  }

  useEffect(() => {
    if (selectedFormId) {
      // Fetch or update form fields based on selectedFormId
    }
  }, [selectedFormId])

  const validateForm = () => {
    let isValid = true
    const errors = {}

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Check static required fields
    if (!input.Name) {
      isValid = false
      errors.Name = 'Name is required!'
    }
    if (!input['Mobile Number']) {
      isValid = false
      errors['Mobile Number'] = 'Mobile Number is required!'
    }
    if (!input.Email) {
      isValid = false
      errors.Email = 'Email is required!'
      toast.error('Email is required!') // Email required toast
    } else if (!emailRegex.test(input.Email)) {
      isValid = false
      errors.Email = 'Please enter a valid email address!'
      toast.error('Please enter a valid email address!') // Invalid email toast
    }

    // Define the types you want to validate
    const validTypes = [
      'text',
      'number',
      'datetime-local',
      'date',
      'url',
      'currency',
      'textarea',
      'checkbox',
      'radio',
    ]

    // Validate dynamic fields
    const fieldsToValidate =
      getAllCustomFormFieldDataQuery?.data?.filter(
        (form) => form.formId[form.formId.length - 1] === selectedFormId
      ) || []

    fieldsToValidate.forEach((field) => {
      // Validate fields based on their type and if they are mandatory
      if (field.mandatory && validTypes.includes(field.type)) {
        if (!formData[field.name]) {
          isValid = false
          errors[field.name] = `${field.name} is required!`
        }
      }
    })

    // Update the state with errors (assuming you're using a state to store errors)
    setIsTouched(errors)

    return isValid
  }

  const handleSave = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill all the required fields !!')
    } else {
      // Proceed with form submission
      createCustomFromsFieldValuesMutation.mutate({
        ...formData,
        formId: selectedFormId,
        companyId: params.id,
      })
      window.location.reload()
    }
  }

  // const select = fields?.map((value) => value)
  // console.log(companyDataNameAndId)

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer d-flex flex-column flex-md-row align-items-center justify-content-between'>
          <div className='card-title mb-3 mb-md-0 text-center text-md-start'>
            <h3 className='fw-bolder m-0'>
              {companyDataNameAndId[0]?.name
                ? `${companyDataNameAndId[0]?.name} -> ${formNameById}`
                : `${formNameById}`}
            </h3>
          </div>
          <div className='text-center text-md-end'>
            <select
              className='form-select form-select-solid form-select-lg w-100 w-md-auto'
              onChange={handleFormSelectionChange}
              value={selectedFormId}
            >
              {formName?.map((form) => (
                <option key={form._id} value={form._id}>
                  {form.formName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFormId && (
          <div id='kt_account_profile_details' className='collapse show'>
            <form>
              <div className='card-body border-top p-9'>
                <>
                  <div className='row'>
                    <div className='col-'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                          Name
                        </label>
                        <div className='col-lg-6 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                            placeholder='Name'
                            name='Name'
                            value={input.Name || ''}
                            onClick={() => setIsTouched((prev) => ({...prev, Name: true}))}
                            onChange={handleChange}
                            onBlur={() => handleBlur('Name')}
                          />
                          {isTouched.Name && !input.Name && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Name is required!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='col-'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                          Mobile Number
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Mobile Number'
                            name='Mobile Number'
                            value={input['Mobile Number'] || ''}
                            onClick={() => setIsTouched((prev) => ({...prev, Name: true}))}
                            onChange={handleChange}
                            onBlur={() => handleBlur('Mobile Number')}
                          />
                          {isTouched['Mobile Number'] && !input['Mobile Number'] && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Mobile Number is required!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>City</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='City'
                            name='City'
                            value={input.City || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-'>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6 required'>
                          Email
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='email'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Email'
                            name='Email'
                            value={input.Email || ''}
                            onClick={() => setIsTouched((prev) => ({...prev, Name: true}))}
                            onChange={handleChange}
                            onBlur={() => handleBlur('Email')}
                          />
                          {isTouched.Email && !input.Email && (
                            <div className='fv-plugins-message-container mx-5'>
                              <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                Email is required!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    {selectField?.map((select) => (
                      <div className='col-' key={select?._id}>
                        <div className='row mb-6 align-items-center'>
                          <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                            <span>{select?.selectName}</span>
                          </label>
                          <div className='col-lg-8 d-flex flex-column'>
                            {' '}
                            {/* Flex column to stack elements vertically */}
                            <select
                              className='form-select form-select-solid form-select-lg flex-grow-1'
                              name={select?.selectName}
                              // onClick={() => handleBlur(select?.selectName, select?.selectValue)}
                              // onBlur={() => handleBlur(select?.selectName, select?.selectValue)}
                              onChange={(e) =>
                                handleDefaultSelectChange(e, select?.selectName, select?.type)
                              }
                            >
                              <option value=''>--Select-an-Option--</option>
                              {select?.options.map((option) => (
                                <option key={option._id} value={option?.value}>
                                  {option?.label}
                                </option>
                              ))}
                            </select>
                            {/* Error message below the select input */}
                            {isTouched[select?.selectName] &&
                              !select?.selectValue &&
                              select?.mandatory === true && (
                                <div className='fv-plugins-message-container mt-2'>
                                  <div className='fv-help-block' style={{whiteSpace: 'nowrap'}}>
                                    {`${select?.selectName} is required!`}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>

                {/* Dynamically render form fields based on selected form ID */}
                <div className='row'>
                  {getAllCustomFormFieldDataQuery.data
                    ?.filter((form) => form.formId[form.formId.length - 1] === selectedFormId)
                    .map((field, index) => {
                      // console.log(field)
                      switch (field.type) {
                        case 'checkbox':
                          return (
                            <div className='col-' key={index}>
                              <div className='row mb-6'>
                                <div className='col-lg-4 d-flex align-items-center'>
                                  <label
                                    htmlFor={`${field.type}-${index}`}
                                    className={`col-form-label fw-bold fs-6 ${
                                      field.mandatory === true ? 'required' : ''
                                    }`}
                                    style={{whiteSpace: 'nowrap'}}
                                  >
                                    {field.name}
                                  </label>
                                </div>
                                <div className='col-lg-8'>
                                  <div className='row'>
                                    {field.options.map((option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className='col-md-6 mb-2 d-flex align-items-center'
                                      >
                                        <div className='form-check flex-grow-1'>
                                          <input
                                            type='checkbox'
                                            name={field.name}
                                            checked={field?.value && field?.value[optionIndex]}
                                            onChange={(event) =>
                                              checkboxChangeHandler(
                                                index,
                                                option.value,
                                                event,
                                                field.name,
                                                field.type
                                              )
                                            }
                                            onClick={() => handleBlur(field.name, option.value)}
                                            onBlur={() => handleBlur(field.name, option.value)}
                                            className='form-check-input'
                                          />
                                          <label className='form-check-label  text-dark'>
                                            {option.label}
                                          </label>
                                        </div>
                                      </div>
                                    ))}
                                    {isTouched[field.name] &&
                                      !field.checked &&
                                      field.mandatory === true && (
                                        <div className='fv-plugins-message-container mx-5'>
                                          <div
                                            className='fv-help-block'
                                            style={{whiteSpace: 'nowrap'}}
                                          >
                                            {`${field.name} is Required!`}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )

                        case 'radio':
                          return (
                            <div className='col-' key={index}>
                              <div className='row mb-6'>
                                <div className='col-lg-4 d-flex align-items-center'>
                                  <label
                                    htmlFor={`${field.type}-${index}`}
                                    className={`col-form-label fw-bold fs-6 ${
                                      field.mandatory === true ? 'required' : ''
                                    }`}
                                    style={{whiteSpace: 'nowrap'}}
                                  >
                                    {field.name}
                                  </label>
                                </div>
                                <div className='col-lg-8'>
                                  <div className='row'>
                                    {field.options.map((option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className='col-md-6 mb-2 d-flex align-items-center'
                                      >
                                        <div className='form-check flex-grow-1'>
                                          <input
                                            id={`${field.type}-${index}-${optionIndex}`}
                                            type='radio'
                                            name={field.name}
                                            value={field?.value}
                                            //checked={field.value}
                                            onChange={(e) =>
                                              radioChangeHandler(
                                                index,
                                                e,
                                                field.name,
                                                field.type,
                                                option.value
                                              )
                                            }
                                            onClick={() => handleBlur(field.name, option.value)}
                                            onBlur={() => handleBlur(field.name, option.value)}
                                            className='form-check-input'
                                          />
                                          <label
                                            htmlFor={`${field.type}-${index}-${optionIndex}`}
                                            className='form-check-label text-dark'
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                        {/* Display the delete button only for the last option */}
                                      </div>
                                    ))}
                                    {isTouched[field.name] &&
                                      !field.value &&
                                      field.mandatory === true && (
                                        <div className='fv-plugins-message-container mx-5'>
                                          <div
                                            className='fv-help-block'
                                            style={{whiteSpace: 'nowrap'}}
                                          >
                                            {`${field.name} is Required!`}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        case 'textarea':
                          return (
                            <div className='col-' key={index}>
                              <div className='row mb-6'>
                                <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                                  <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                    {field.name}
                                  </span>
                                </label>
                                <div className='col-lg-8'>
                                  <textarea
                                    id={`${field.type}-${index}`}
                                    // type={field.type}
                                    className='form-control form-control-lg form-control-solid'
                                    placeholder={field.name}
                                    value={fieldValues[index] || ''}
                                    onChange={(event) =>
                                      inputChangeHandler(
                                        index,
                                        event.target.value,
                                        field.name,
                                        field.type
                                      )
                                    }
                                    onBlur={() => handleBlur(field.name, fieldValues[index])}
                                    onClick={() => handleBlur(field.name, fieldValues[index])}
                                  />
                                  {isTouched[field.name] &&
                                    !fieldValues[index] &&
                                    field.mandatory === true && (
                                      <div className='fv-plugins-message-container mt-2'>
                                        <div className='fv-help-block'>
                                          {`${field.name} is Required!`}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        case 'select':
                          return (
                            <div className='col-' key={index}>
                              <div className='row mb-6'>
                                <div className='col-lg-4 d-flex align-items-center'>
                                  <label
                                    className={`col-form-label fw-bold fs-6 ${
                                      field.mandatory ? 'required' : ''
                                    }`}
                                  >
                                    {field.name}
                                  </label>
                                </div>
                                <div className='col-lg-8 d-flex flex-column'>
                                  <select
                                    id={`${field.type}-${index}`}
                                    name={field.name}
                                    className='form-select form-select-solid form-select-lg flex-grow-1'
                                    value={field.selectValue}
                                    onClick={() => handleBlur(field.name, field.seletValue)}
                                    onBlur={() => handleBlur(field.name, field.seletValue)}
                                    onChange={(event) => {
                                      // console.log(event.target.value)
                                      selectChangeHandler(index, event, field.name, field.type)
                                    }}
                                  >
                                    <option value=''>Select an option</option>
                                    {field.options.map((option, optionIndex) => (
                                      <option key={optionIndex} value={option.value}>
                                        {option.value} {/* Display the option label or value */}
                                      </option>
                                    ))}
                                  </select>
                                  {/* Error message displayed below the select field */}
                                  {isTouched[field.name] &&
                                    !field?.selectValue &&
                                    field.mandatory === true && (
                                      <div className='fv-plugins-message-container mt-2'>
                                        <div
                                          className='fv-help-block'
                                          style={{whiteSpace: 'nowrap'}}
                                        >
                                          {`${field.name} is required!`}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )

                        default:
                          return (
                            <div className='col-' key={index}>
                              <div className='row mb-6'>
                                <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                                  <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                    {field.name}
                                  </span>
                                </label>
                                <div className='col-lg-8'>
                                  <input
                                    id={`${field.type}-${index}`}
                                    type={field.type}
                                    className='form-control form-control-lg form-control-solid'
                                    placeholder={field.name}
                                    value={fieldValues[index] || ''}
                                    onChange={(event) =>
                                      inputChangeHandler(
                                        index,
                                        event.target.value,
                                        field.name,
                                        field.type
                                      )
                                    }
                                    onBlur={() => handleBlur(field.name, fieldValues[index])}
                                    onClick={() => handleBlur(field.name, fieldValues[index])}
                                  />
                                  {isTouched[field.name] &&
                                    !fieldValues[index] &&
                                    field.mandatory === true && (
                                      <div className='fv-plugins-message-container mt-2'>
                                        <div className='fv-help-block'>
                                          {`${field.name} is Required!`}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                      }
                    })}
                </div>
              </div>
              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='button' onClick={handleSave} className='btn btn-primary'>
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default EnquiryForm
