import React, {useState, useEffect} from 'react'
import DynamicEnquiryForm from '../enquiry-related/DynamicEnquiryForm'
import {useCompanyContext} from '../compay/CompanyContext'

export default function GeneralSettingForm() {
  const [selectedOption, setSelectedOption] = useState('')
  const {getCompanyLists} = useCompanyContext()

  useEffect(() => {
    if (getCompanyLists?.data?.length > 0) {
      setSelectedOption(getCompanyLists.data[0]._id)
    }
  }, [getCompanyLists])

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-header border-0 cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0 col-lg-12'>{'Settings -> Form Settings'}</h3>
            <label htmlFor='select' className='col-lg-4 col-form-label fw-bold fs-6'>
              Choose an option:
            </label>
            <div className='col-lg-8'>
              <select
                id='select'
                value={selectedOption}
                className='form-select form-select-solid form-select-lg'
                onChange={handleSelectChange}
              >
                {getCompanyLists?.data?.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop: '-4rem'}}>
        <DynamicEnquiryForm companyName={selectedOption} />
      </div>
    </>
  )
}
