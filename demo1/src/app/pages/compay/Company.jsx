import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useNavigate} from 'react-router-dom'
import {useCompanyContext} from './CompanyContext'
const BASE_URL = process.env.REACT_APP_BASE_URL

const BASE_URL_Image = `${BASE_URL}/api/images`

const Company = () => {
  const navigate = useNavigate()
  const companyCTX = useCompanyContext()
  //console.log(companyCTX.getCompanyLists.data)

  const companyDeleteHandler = (companyId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }
    companyCTX.deleteCompanyMutation.mutate(companyId)
  }
  console.log(companyCTX.getCompanyLists.data)

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Company</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Add your Company</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <button onClick={() => navigate('/add-company')} className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-3' />
            Add New Company
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold fs-4'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                </th>
                <th className='min-w-150px'>Company</th>
                <th className='min-w-150px'>Email</th>
                <th className='min-w-140px'>Address</th>
                <th className='min-w-120px'>Recipt No</th>
                <th className='min-w-120px'>GST</th>
                <th className='min-w-120px'>Is GST Based</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {companyCTX.getCompanyLists?.data?.map((companyData) => (
                <tr key={companyData._id}>
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      {/* <input className='form-check-input widget-9-check' type='checkbox' value='1' /> */}
                    </div>
                  </td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px me-5'>
                        <img
                          src={
                            companyData.logo
                              ? `${BASE_URL_Image}/${companyData.logo}`
                              : toAbsoluteUrl('/media/avatars/300-14.jpg')
                          }
                          alt=''
                        />
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <p className='text-dark fw-bold text-hover-primary fs-6'>
                          {companyData.companyName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6'>{companyData.email}</p>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6'>
                      {companyData.companyAddress}
                    </p>
                  </td>
                  <td className=''>
                    <p className='text-dark fw-bold text-hover-primary fs-6'>
                      {companyData.reciptNumber}
                    </p>
                  </td>
                  <td className=''>
                    <p className='text-dark fw-bold text-hover-primary fs-6'>{companyData.gst}</p>
                  </td>
                  <td className=''>
                    <p className='text-dark fw-bold text-hover-primary fs-6'>
                      {companyData?.isGstBased}
                    </p>
                  </td>

                  <td>
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <button
                        onClick={() => navigate('/update-company', {state: companyData})}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button
                        onClick={() => companyDeleteHandler(companyData._id)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
export default Company
