import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDynamicFieldContext } from '../DynamicFieldsContext'
import { KTIcon } from '../../../../_metronic/helpers'
import { toast } from 'react-toastify'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal.jsx'
import DynamicFields from '../DynamicFields'
import { useCompanyContext } from '../../compay/CompanyContext'
import { useCustomFormFieldContext } from './CustomFormFieldDataContext'
import EditDynamicFields from './EditDynamicFields'
import EditSelectDynamicFields from "./EditSelectDynamicFields"

const ProfileForm = () => {
  const [inputData, setInputData] = useState('')
  const [open, setOpen] = useState(true)
  const [modalMode, setModalMode] = useState('add')
  const [selectedField, setSelectedField] = useState(null)
  const [isCreatingNewForm, setIsCreatingNewForm] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const [selectId, setSelectId] = useState(null)
  const customFormCTX = useDynamicFieldContext()
  const { deleteFieldMutation } = useDynamicFieldContext()
  const {
    getAllCustomFormFieldDataQuery,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
    createaddFormFieldData,
    getAllAddedFormsName,
  } = useDynamicFieldContext()

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
    setFieldValues,
    createCustomFromFieldValuesMutation,
    getAllDefaultSelectFields
  } = useCustomFormFieldContext()

  const selectField = getAllDefaultSelectFields?.data?.defaultSelects
  // console.log(selectField)

  const inputChangeHandler = (index, event, fieldName, type) => {
    handleInputChange(index, event, fieldName, type)
  }
  const checkboxChangeHandler = (index, optionValue, event, fieldName, type) => {
    handleCheckboxChange(index, optionValue, event, fieldName, type)
  }
  const radioChangeHandler = (index, event, fieldName, type, optionValue) => {
    handleOptionChange(index, event, fieldName, type, optionValue)
  }
  const selectChangeHandler = (index, event, fieldName, type) => {
    handleSelectChange(index, event, fieldName, type)
  }

  const { data } = customFormCTX.useGetSingleFormNameById(params.id)
  // console.log(data?._id)

  const { getCompanyLists } = useCompanyContext()
  // console.log(getCompanyLists?.data)

  const companyData = getCompanyLists?.data
    ?.filter((companyNameById) => companyNameById?._id === data?.companyName)
    .map((company) => company.companyName)
  //   console.log(companyData)

  const openAddFieldModal = () => {
    setModalMode('add')
    setSelectedField(null)
    setcontextOpenModal(true)
  }

  const openEditFieldModal = (field) => {
    // console.log(field)
    setModalMode('edit')
    setSelectedField(field)
    setcontextOpenModal(true)
  }

  const fieldDeleteHandler = (fieldId) => {
    deleteFieldMutation.mutate(fieldId, {
      onSuccess: () => {
        // toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setInput((prevInput) => ({ ...prevInput, [name]: value }))
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (inputData.trim() !== '') {
      createaddFormFieldData.mutate({ formName: inputData })

      setIsCreatingNewForm(false)
      setInputData('')
    }
  }


  const updateForm = getAllAddedFormsName?.data
    ?.filter((formName) => formName?._id === data?._id)
    .map((form) => ({
      formName: form?.formName,
      id: form?._id,
    }))
  // console.log(updateForm)

  const formNameAdded =
    getAllAddedFormsName.data &&
      getAllAddedFormsName.data.length > 0 &&
      getAllAddedFormsName.data[getAllAddedFormsName.data.length - 1]
      ? getAllAddedFormsName.data[getAllAddedFormsName.data.length - 1].formName
      : ''

  const openEditSelectFieldModal = (select) => {
    // console.log(field)
    setModalMode('select')
    setSelectId(select)
    setcontextOpenModal(true)
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 w-5'>{`${companyData} -> `}</h3>
            <div className='card-title mx-2'>
              {isCreatingNewForm || !formNameAdded ? (
                <>
                  <input
                    type='text'
                    placeholder='Enter form name'
                    className='form-control form-control-solid mb-3'
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    onClick={() => setOpen(true)}
                  />
                  <button className='btn btn-sm btn-light-primary mx-4 mb-1' onClick={handleSubmit}>
                    <KTIcon iconName='plus' className='fs-3' />
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ fontWeight: 'bolder', margin: 0 }}>{updateForm[0]?.formName}</h3>
                  <button
                    className='btn btn-sm btn-light-primary mx-4 mb-1'
                    onClick={() => navigate(`/update-form/${updateForm[0]?.id}`)}
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </button>
                </>
              )}
            </div>
          </div>
          {/* {formNameAdded && !isCreatingNewForm && (
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <button className='btn btn-sm btn-light-primary' onClick={handleNewForm}>
                <KTIcon iconName='plus' className='fs-3' />
                Create New Form
              </button>
            </div>
          )} */}
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <form>
            <div className='card-body border-top p-9'>
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        name='Name'
                        value={input.Name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
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
                        value={input['Mobile Number']}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span>City</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        name='City'
                        value={input.City}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Email</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='email'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        name='Email'
                        value={input.Email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                {selectField?.map((select) => (
                  <div className='col-6' key={select._id}>
                    <div className='row mb-6 align-items-center'>
                      <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                        <span>{select?.selectName}</span>
                      </label>
                      <div className='col-lg-8 d-flex align-items-center'> {/* Use flexbox to align items */}
                        <select
                          className='form-select form-select-solid form-select-lg flex-grow-1'
                          name={select?.selectName}
                        >
                          <option value="">--Select-an-Option--</option>
                          {select?.options.map((option) => (
                            <option key={option._id} value={option?.value}>
                              {option?.label}
                            </option>
                          ))}
                        </select>
                        {formNameAdded && <a
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2'
                          onClick={() => openEditSelectFieldModal(select)}
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* ------------------------------- FOOTER STARTS HERE ------------------------------- */}
            </div>
          </form>
        </div>
      </div>

      {/* ------------------------------- CUSTOM FIELDS STARTS HERE ------------------------------- */}

      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>{` ${companyData} -> ${formNameAdded ? `${updateForm[0]?.formName} ->` : ''
              } Customized Fields `}</h3>
          </div>
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <div className='card-body border-top p-9'>
            <form>
              <div className='row'>
                {getAllCustomFormFieldDataQuery.data
                  ?.filter((form) => form.formId[form.formId.length - 1] === params.id)
                  .map((field, index) => {
                    switch (field.type) {
                      case 'checkbox':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''
                                    }`}
                                  style={{ whiteSpace: 'nowrap' }}
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
                                          //value={field.value || false}
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
                                          className='form-check-input'
                                        />
                                        <label className='form-check-label'>{option.label}</label>
                                      </div>
                                      {/* Display the delete button only for the last option */}
                                      {optionIndex === field.options.length - 1 && (
                                        <>
                                          <a
                                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                            onClick={() => openEditFieldModal(field)}
                                          >
                                            <KTIcon iconName='pencil' className='fs-3' />
                                          </a>
                                          <a
                                            type='button'
                                            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                            onClick={() => fieldDeleteHandler(field._id)}
                                          >
                                            <KTIcon iconName='trash' className='fs-3' />
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'radio':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${field.mandatory === true ? 'required' : ''
                                    }`}
                                  style={{ whiteSpace: 'nowrap' }}
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
                                          className='form-check-input'
                                        />
                                        <label
                                          htmlFor={`${field.type}-${index}-${optionIndex}`}
                                          className='form-check-label'
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                      {/* Display the delete button only for the last option */}
                                      {optionIndex === field.options.length - 1 && (
                                        <>
                                          <a
                                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                            onClick={() => openEditFieldModal(field)}
                                          >
                                            <KTIcon iconName='pencil' className='fs-3' />
                                          </a>
                                          <a
                                            type='button'
                                            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                            onClick={() => fieldDeleteHandler(field._id)}
                                          >
                                            <KTIcon iconName='trash' className='fs-3' />
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'select':
                        // console.log(field)
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className={`col-lg-4 col-form-label fw-bold fs-6 `}>
                                <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                  {field.name}
                                </span>
                              </label>
                              <div className='col-lg-8 d-flex align-items-center'>
                                <select
                                  id={`${field.type}-${index}`}
                                  name={field.name}
                                  className='form-select form-select-solid form-select-lg flex-grow-1'
                                  value={field.selectValue}
                                  onChange={(event) => {
                                    selectChangeHandler(index, event, field.name, field.type)
                                  }}
                                >
                                  <option value=''>Select an option</option>
                                  {field.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                      {option.value}
                                    </option>
                                  ))}
                                </select>
                                <>
                                  <a
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    onClick={() => openEditFieldModal(field)}
                                  >
                                    <KTIcon iconName='pencil' className='fs-3' />
                                  </a>
                                  <a
                                    type='button'
                                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                    onClick={() => fieldDeleteHandler(field._id)}
                                  >
                                    <KTIcon iconName='trash' className='fs-3' />
                                  </a>
                                </>{' '}
                              </div>
                            </div>
                          </div>
                        )
                      default:
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className={`col-lg-4 col-form-label fw-bold fs-6`}>
                                <span className={`${field.mandatory === true ? 'required' : ''}`}>
                                  {field.name}
                                </span>
                              </label>
                              <div className='col-lg-8 d-flex align-items-center'>
                                <input
                                  id={`${field.type}-${index}`}
                                  type={field.type}
                                  className='form-control form-control-lg form-control-solid flex-grow-1'
                                  placeholder={field.name}
                                  value={fieldValues[index]}
                                  onChange={(event) =>
                                    inputChangeHandler(
                                      index,
                                      event.target.value,
                                      field.name,
                                      field.type
                                    )
                                  }
                                />
                                <>
                                  <a
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    onClick={() => openEditFieldModal(field)}
                                  >
                                    <KTIcon iconName='pencil' className='fs-3' />
                                  </a>
                                  <a
                                    type='button'
                                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                    onClick={() => fieldDeleteHandler(field._id)}
                                  >
                                    <KTIcon iconName='trash' className='fs-3' />
                                  </a>
                                </>
                              </div>
                            </div>
                          </div>
                        )
                    }
                  })}
              </div>
            </form>
          </div>
          {/* ------------------------------- FOOTER STARTS HERE ------------------------------- */}
          <div className='card card-footer'>
            <div className='d-flex justify-content-between'>
              {!isCreatingNewForm && formNameAdded ? (
                <button
                  type='button'
                  className='btn btn-info'
                  onClick={() => openAddFieldModal(true)}
                >
                  Add Field
                </button>
              ) : (
                ''
              )}
              {/* {formNameAdded ? (
                ''
              ) : (
                <button className='btn btn-primary' onClick={handleSave}>
                  Save
                </button>
              )} */}
              <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
                {modalMode === 'add' && (
                  <DynamicFields companyName={data?._id} />
                )}
                {modalMode === 'edit' && (
                  <EditDynamicFields setOpenModal={setcontextOpenModal} field={selectedField} />
                )}
                {modalMode === 'select' && (
                  <EditSelectDynamicFields setOpenModal={setcontextOpenModal} selectId={selectId} />
                )}
              </PopUpModal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileForm
