import React, {useEffect, useState} from 'react'
import CreateForm from '../enquiry-related/dynamicForms/AddForm'
import {useDynamicFieldContext} from '../enquiry-related/DynamicFieldsContext'
import {useParams} from 'react-router-dom'

export default function () {
  const [selectedOption, setSelectedOption] = useState('')
  const {getAllAddedFormsName} = useDynamicFieldContext()
  const params = useParams()
  // console.log(params.id)

  const companyId = params?.id

  useEffect(() => {
    if (getAllAddedFormsName?.data?.length > 0) {
      setSelectedOption(getAllAddedFormsName.data[0].formName)
    }
  }, [getAllAddedFormsName])

  const handleValue = (e) => {
    setSelectedOption(e.target.value)
  }

  //console.log(getAllAddedFormsName.data)

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 col-lg-12'>{'Create Form -> Form Selction'}</h3>
            <label htmlFor='select' className='col-lg-4 col-form-label fw-bold fs-6'>
              Choose a Form:
            </label>
            <div className='col-lg-12'>
              <select
                id='select'
                className='form-select form-select-solid form-select-lg'
                value={selectedOption}
                onChange={handleValue}
              >
                {getAllAddedFormsName?.data
                  ?.filter((name) => name.companyName === companyId.toString())
                  .map((form) => (
                    <>
                      <option value=''>--Select-Form--</option>
                      <option key={form?._id} value={form?.formName}>
                        {form.formName}
                      </option>
                    </>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* {selectedOption && (
        <div style={{marginTop: '2rem'}}>
          <CreateForm selectedOption={selectedOption} />
        </div>
      )} */}
    </>
  )
}
