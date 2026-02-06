import {useState, useEffect} from 'react'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'
import {useNavigate, useParams} from 'react-router-dom'
import {useCustomFormFieldContext} from './CustomFormFieldDataContext'
import OnlyViewStudentNotes from '../StudentNotes/OnlyViewStudentNotes'

const OnlyViewFormData = ({rowId, setOpenModal, openEditFormData}) => {
  const navigate = useNavigate()
  const [formFieldValues, setFormFieldValues] = useState({})
  const {getAllCustomFormFieldDataQuery, getAllAddedFormsName} = useDynamicFieldContext()
  const {useGetSingleFormValueById, getAllDefaultSelectFields} = useCustomFormFieldContext()
  const {getCompanyLists} = useCompanyContext()
  const params = useParams()

  const allDefaultSelects = getAllDefaultSelectFields?.data?.defaultSelects

  // console.log(formFieldValues)
  const {data: singleFormValueData} = useGetSingleFormValueById(rowId)
  const companyId = singleFormValueData?.companyId
  const formId = singleFormValueData?.formId

  // console.log(singleFormValueData)

  const enquiryName = singleFormValueData?.formFiledValue
    ?.filter((name) => name.name === 'Name')
    .map((name) => name.value)

  const id = getAllAddedFormsName?.data
    ?.filter((company) => company.companyName === companyId && company._id === formId)
    .map((company) => ({
      companyId: company.companyName,
      formName: company.formName,
    }))

  const companyName =
    id &&
    id.length > 0 &&
    getCompanyLists?.data
      ?.filter((companyById) => companyById._id === id[0]?.companyId)
      .map((company) => company.companyName)

  useEffect(() => {
    // Initialize form field values from the existing data
    if (singleFormValueData?.formFiledValue) {
      const initialValues = singleFormValueData.formFiledValue.reduce((acc, field) => {
        acc[field.name] = field.value
        return acc
      }, {})
      setFormFieldValues(initialValues)
    }
  }, [singleFormValueData])

  // console.log(singleFormValueData)

  return (
    <>
      <form className='dynamic-form'>
        <div className='field-container'>
          <div className='card-title m-0'>
            {id && id.length > 0 ? (
              <h3 className='fw-bolder m-0 w-5'>{`${companyName} -> ${id[0]?.formName} `}</h3>
            ) : (
              <h3 className='fw-bolder m-0 w-5'>Loading...</h3>
            )}
          </div>
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <form>
            <div className='card-body border-top p-9'>
              <div className='row'>
                {singleFormValueData?.formFiledValue
                  ?.filter((formFieldData) => formFieldData.name !== 'companyId')
                  .map((formFieldData, index) => {
                    // console.log(formFieldData)
                    if (
                      formFieldData.type === 'text' ||
                      formFieldData.type === 'url' ||
                      formFieldData.type === 'currency'
                    ) {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <input
                                type='text'
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData?.name}
                                name='Name'
                                disabled
                                value={formFieldValues[formFieldData.name] || ''}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    } else if (
                      formFieldData.type === 'date' ||
                      formFieldData.type === 'datetime-local'
                    ) {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <input
                                disabled
                                type={formFieldData.type === 'date' ? 'date' : 'datetime-local'}
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData.name}
                                name='Name'
                                value={formFieldValues[formFieldData.name] || ''}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    } else if (formFieldData.type === 'number') {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <input
                                disabled
                                type='number'
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData.name}
                                name='Name'
                                value={formFieldValues[formFieldData.name] || ''}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    } else if (formFieldData.type === 'textarea') {
                      return (
                        <div className='col-6' key={index}>
                          <div className='row mb-6'>
                            <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                              {formFieldData.name}
                            </label>
                            <div className='col-lg-6 fv-row'>
                              <textarea
                                type='textarea'
                                disabled
                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                placeholder={formFieldData.name}
                                name='Name'
                                value={formFieldValues[formFieldData.name] || ''}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
                {allDefaultSelects?.map((select) => {
                  return (
                    <div className='col-6' key={select.id}>
                      <div className='row mb-6'>
                        <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                          {select.selectName}
                        </label>
                        <div className='col-lg-6 fv-row'>
                          <select
                            className='form-select form-select-solid'
                            disabled
                            value={formFieldValues[select.selectName] || ''}
                          >
                            {select.options &&
                              select.options.map((option, optionIndex) => (
                                <option key={optionIndex} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {getAllCustomFormFieldDataQuery.data
                  ?.filter((form) => form.formId[form.formId.length - 1] === formId)
                  .map((field, index) => {
                    switch (field.type) {
                      case 'checkbox':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <div className='col-lg-4 d-flex align-items-center'>
                                <label
                                  htmlFor={`${field.type}-${index}`}
                                  className={`col-form-label fw-bold fs-6 ${
                                    field.mandatory === true ? '' : ''
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
                                          disabled
                                          name={field.name}
                                          checked={
                                            Array.isArray(
                                              formFieldValues[
                                                field.type === 'checkbox' ? field.name : 'checkbox'
                                              ]
                                            ) &&
                                            formFieldValues[
                                              field.type === 'checkbox' ? field.name : 'checkbox'
                                            ].includes(option.value)
                                          }
                                          className='form-check-input'
                                        />
                                        <label className='form-check-label'>{option.label}</label>
                                      </div>
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
                                  className={`col-form-label fw-bold fs-6 ${
                                    field.mandatory === true ? '' : ''
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
                                          disabled
                                          name={field.name}
                                          value={option.value}
                                          checked={
                                            formFieldValues[field.name] === option.value || false
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
                                      {/* {optionIndex === field.options.length - 1 && (
                                        <button
                                          type='button'
                                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-2'
                                          onClick={() => fieldDeleteHandler(field._id)}
                                        >
                                          <KTIcon iconName='trash' className='fs-3' />
                                        </button>
                                      )} */}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      case 'select':
                        return (
                          <div className='col-6' key={index}>
                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                                {field.name}
                              </label>
                              <div className='col-lg-6 fv-row'>
                                <select
                                  className='form-select form-select-solid'
                                  value={formFieldValues[field.name] || ''}
                                  disabled
                                >
                                  <option value=''>Select an option</option>
                                  {field.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )
                      default:
                        return null
                    }
                  })}
              </div>
            </div>
          </form>
        </div>
      </form>
      <OnlyViewStudentNotes userId={rowId} enquiryName={enquiryName} />
      <div className='card-footer d-flex justify-content-end py-6 px-9'>
        <button type='button' className='btn btn-primary' onClick={() => openEditFormData(rowId)}>
          Edit
        </button>
      </div>
    </>
  )
}

export default OnlyViewFormData
