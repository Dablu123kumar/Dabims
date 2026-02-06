import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTIcon} from '../../../../_metronic/helpers'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useCompanyContext} from '../../compay/CompanyContext'

export default function ViewForms() {
  const {getAllAddedFormsName, deleteFormMutation} = useDynamicFieldContext()
  const navigate = useNavigate()
  const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id

  const {data: companyInfo} = companyCTX?.useGetSingleCompanyData(companyId)

  // Extract data from context
  const data = getAllAddedFormsName?.data || []

  // Filter forms for the current company
  const filteredForms = data?.filter(
    (addF) => addF?.companyName?.toString() === companyId?.toString()
  )

  const formDeleteHandler = (formId) => {
    if (!window.confirm('Are you sure you want to delete this Form?')) {
      return
    }

    deleteFormMutation.mutate(formId, {
      onSuccess: () => {
        toast.success('Form deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })
  }

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Forms</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          title='Click to add a user'
        >
          <a
            onClick={() => navigate(`/add-form/${companyId}`)}
            className='btn btn-sm btn-light-primary'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Create New Form
          </a>
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'></th>
                <th className='min-w-150px'>Form Name</th>
                <th className='min-w-140px'>Company</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredForms) && filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <tr key={form._id}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        <input
                          className='form-check-input widget-9-check'
                          type='checkbox'
                          value='1'
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => navigate(`/profile-form/${form._id}`)}
                      className='cursor-pointer'
                    >
                      {form.formName}
                    </td>
                    <td>{companyInfo?.companyName}</td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <a
                          onClick={() => navigate(`/update-form/${form._id}`)}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </a>
                        <a
                          onClick={() => formDeleteHandler(form._id)}
                          className='btn btn-icon btn-bg-light btn-active-color-danger  btn-sm'
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center'>
                    No forms available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
