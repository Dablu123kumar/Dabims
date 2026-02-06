import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useCompanyContext} from '../../compay/CompanyContext'
import {KTIcon} from '../../../../_metronic/helpers'
import {useDynamicFieldContext} from '../DynamicFieldsContext'

export default function EditFormName() {
  const {useGetSingleFormNameById, updateFormNameMutation} = useDynamicFieldContext()
  const companyCTX = useCompanyContext()
  const navigate = useNavigate()
  const params = useParams()

  const {data} = useGetSingleFormNameById(params.id)
  // console.log(data)
  const [formName, setFormName] = useState(data?.singleForm?.formName || '')
  useEffect(() => {
    if (data) {
      setFormName(data?.formName || '')
    }
  }, [data])

  const companyId = data?.companyName

  const {data: companyInfo} = companyCTX?.useGetSingleCompanyData(companyId)

  // console.log(companyInfo)
  // console.log(companyId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateFormNameMutation.mutate({
        formName,
        companyName: companyId,
        id: data?._id,
      })
      navigate(`/view-form/${companyId}`)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header border-0 cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{`${companyInfo?.companyName} ->`}</h3>
          <div className='card-title mx-2'>
            <input
              type='text'
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
              placeholder='Name'
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            {/* <button className='btn btn-sm btn-light-primary mx-4 mb-1' >
              <KTIcon iconName='plus' className='fs-3' />
            </button> */}
          </div>
        </div>
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
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-6'>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>City</label>
                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='City'
                    />
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Email</label>
                  <div className='col-lg-8 fv-row'>
                    <input
                      type='email'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Email'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card-footer'>
            <div className='d-flex justify-content-end'>
              <button className='btn btn-primary' onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
