import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useNavigate} from 'react-router-dom'
import {useCompanyContext} from './CompanyContext'
import {useAuth} from '../../modules/auth'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const statusBadge = (status) => {
  if (status === 'approved') return <span className='badge badge-light-success'>Approved</span>
  if (status === 'rejected') return <span className='badge badge-light-danger'>Rejected</span>
  return <span className='badge badge-light-warning'>Pending</span>
}

const Company = () => {
  const navigate = useNavigate()
  const companyCTX = useCompanyContext()
  const {currentUser} = useAuth()

  const isSuperAdmin = currentUser?.role === 'SuperAdmin'

  const companyDeleteHandler = (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return
    companyCTX.deleteCompanyMutation.mutate(companyId)
  }

  const handleApprove = (id) => {
    if (!window.confirm('Approve this company? They will be able to log in immediately.')) return
    companyCTX.approveCompanyMutation.mutate(id)
  }

  const handleReject = (id) => {
    if (!window.confirm('Reject this company? They will not be able to log in.')) return
    companyCTX.rejectCompanyMutation.mutate(id)
  }

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Company</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Manage your companies</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a company'
        >
          <button onClick={() => navigate('/add-company')} className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-3' />
            Add New Company
          </button>
        </div>
      </div>

      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold fs-6 text-gray-800'>
                <th className='w-25px'></th>
                <th className='min-w-150px'>Company</th>
                <th className='min-w-150px'>Email</th>
                <th className='min-w-140px'>Address</th>
                <th className='min-w-100px'>Recipt No</th>
                <th className='min-w-80px'>GST</th>
                <th className='min-w-100px'>Is GST Based</th>
                {isSuperAdmin && <th className='min-w-110px'>Status</th>}
                <th className='min-w-120px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companyCTX.getCompanyLists?.data?.map((companyData) => (
                <tr key={companyData._id}>
                  <td></td>
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
                        <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                          {companyData.companyName}
                        </p>
                        <span className='text-muted fw-semibold fs-7'>
                          {new Date(companyData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                      {companyData.email}
                    </p>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                      {companyData.companyAddress}
                    </p>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                      {companyData.reciptNumber}
                    </p>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                      {companyData.gst}
                    </p>
                  </td>
                  <td>
                    <p className='text-dark fw-bold text-hover-primary fs-6 mb-0'>
                      {companyData?.isGstBased}
                    </p>
                  </td>

                  {isSuperAdmin && (
                    <td>{statusBadge(companyData.status)}</td>
                  )}

                  <td>
                    <div className='d-flex justify-content-end flex-shrink-0 gap-1'>
                      {/* Approve/Reject — SuperAdmin only, shown for non-approved companies */}
                      {isSuperAdmin && companyData.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(companyData._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1'
                          title='Approve'
                        >
                          <KTIcon iconName='check' className='fs-3' />
                        </button>
                      )}
                      {isSuperAdmin && companyData.status === 'approved' && (
                        <button
                          onClick={() => handleReject(companyData._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                          title='Revoke Access'
                        >
                          <KTIcon iconName='cross' className='fs-3' />
                        </button>
                      )}

                      <button
                        onClick={() => navigate('/update-company', {state: companyData})}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        title='Edit'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button
                        onClick={() => companyDeleteHandler(companyData._id)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        title='Delete'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Company
