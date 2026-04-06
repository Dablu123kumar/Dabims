import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {useCompanyContext} from './CompanyContext'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const PendingCompanies = () => {
  const {getPendingCompaniesQuery, approveCompanyMutation, rejectCompanyMutation} =
    useCompanyContext()

  const pendingList = getPendingCompaniesQuery?.data || []
  const isLoading = getPendingCompaniesQuery?.isLoading

  const handleApprove = (id) => {
    if (!window.confirm('Approve this company? They will be able to log in immediately.')) return
    approveCompanyMutation.mutate(id)
  }

  const handleReject = (id) => {
    if (!window.confirm('Reject this company? They will not be able to log in.')) return
    rejectCompanyMutation.mutate(id)
  }

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Pending Company Approvals</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Companies waiting for owner approval
          </span>
        </h3>
        <div className='card-toolbar'>
          <span className='badge badge-light-warning fs-7 fw-semibold'>
            {pendingList.length} Pending
          </span>
        </div>
      </div>

      <div className='card-body py-3'>
        {isLoading ? (
          <div className='text-center py-10'>
            <span className='spinner-border text-primary' />
          </div>
        ) : pendingList.length === 0 ? (
          <div className='text-center py-10 text-muted fw-semibold fs-6'>
            No pending company registrations.
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold fs-6 text-gray-800'>
                  <th className='min-w-200px'>Company</th>
                  <th className='min-w-150px'>Email</th>
                  <th className='min-w-140px'>Phone</th>
                  <th className='min-w-140px'>Address</th>
                  <th className='min-w-100px'>GST Based</th>
                  <th className='min-w-100px'>Status</th>
                  <th className='min-w-120px text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((company) => (
                  <tr key={company._id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-45px me-5'>
                          <img
                            src={
                              company.logo
                                ? `${BASE_URL_Image}/${company.logo}`
                                : toAbsoluteUrl('/media/avatars/300-14.jpg')
                            }
                            alt=''
                          />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold fs-6'>{company.companyName}</span>
                          <span className='text-muted fw-semibold fs-7'>
                            Registered: {new Date(company.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className='text-dark fw-bold fs-6'>{company.email}</span>
                    </td>
                    <td>
                      <span className='text-dark fw-bold fs-6'>{company.companyPhone}</span>
                    </td>
                    <td>
                      <span className='text-dark fw-bold fs-6'>{company.companyAddress}</span>
                    </td>
                    <td>
                      <span className='text-dark fw-bold fs-6'>{company.isGstBased}</span>
                    </td>
                    <td>
                      <span className='badge badge-light-warning'>Pending</span>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end gap-2'>
                        <button
                          onClick={() => handleApprove(company._id)}
                          disabled={approveCompanyMutation.isLoading}
                          className='btn btn-sm btn-light-success'
                          title='Approve'
                        >
                          <KTIcon iconName='check' className='fs-5' />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(company._id)}
                          disabled={rejectCompanyMutation.isLoading}
                          className='btn btn-sm btn-light-danger'
                          title='Reject'
                        >
                          <KTIcon iconName='cross' className='fs-5' />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingCompanies
