import {useState, useEffect} from 'react'
import axios from 'axios'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'

const BASE_URL = process.env.REACT_APP_BASE_URL

interface StaffUser {
  id: string
  fName: string
  lName: string
  email: string
  phone: string
  role: string
  companyId: string | null
}

const staffRoles = ['Admin', 'Accounts', 'Counsellor', 'Telecaller', 'Trainer']

const addStaffSchema = Yup.object().shape({
  fName: Yup.string().min(2).required('First name is required'),
  lName: Yup.string().min(2).required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  phone: Yup.string().min(10).required('Phone is required'),
  role: Yup.string().oneOf(staffRoles).required('Role is required'),
})

const StaffManagement = () => {
  const {auth, currentUser} = useAuth()
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const fetchStaff = async () => {
    try {
      setLoading(true)
      // Pass companyId explicitly so the backend always filters to this company's users
      const companyId = currentUser?.companyId
      const url = companyId
        ? `${BASE_URL}/api/users?items_per_page=100&companyId=${companyId}`
        : `${BASE_URL}/api/users?items_per_page=100`
      const {data} = await axios.get(url, config)
      setStaffList(data.data || [])
    } catch (error: any) {
      console.error('Error fetching staff:', error)
      toast.error(error?.response?.data?.message || 'Failed to load staff list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [currentUser?.companyId])

  const formik = useFormik({
    initialValues: {
      fName: '',
      lName: '',
      email: '',
      password: '',
      phone: '',
      role: 'Admin',
    },
    validationSchema: addStaffSchema,
    onSubmit: async (values, {setSubmitting, resetForm, setStatus}) => {
      try {
        await axios.post(`${BASE_URL}/api/users`, values, config)
        toast.success('Staff member added successfully!')
        resetForm()
        setShowForm(false)
        await fetchStaff()
      } catch (error: any) {
        const msg = error.response?.data?.error || 'Failed to add staff'
        setStatus(msg)
        toast.error(msg)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}`, config)
      toast.success('Staff member deleted')
      fetchStaff()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Staff Management</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Manage your company staff and their roles
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            className='btn btn-sm btn-primary'
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Staff'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className='card-body pt-0'>
          <form onSubmit={formik.handleSubmit} className='row g-3 mb-5 p-5 bg-light rounded'>
            {formik.status && (
              <div className='col-12'>
                <div className='alert alert-danger'>{formik.status}</div>
              </div>
            )}
            <div className='col-md-6'>
              <label className='form-label fw-bold'>First Name</label>
              <input
                {...formik.getFieldProps('fName')}
                className={clsx('form-control', {
                  'is-invalid': formik.touched.fName && formik.errors.fName,
                })}
                placeholder='First name'
              />
              {formik.touched.fName && formik.errors.fName && (
                <div className='invalid-feedback'>{formik.errors.fName}</div>
              )}
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold'>Last Name</label>
              <input
                {...formik.getFieldProps('lName')}
                className={clsx('form-control', {
                  'is-invalid': formik.touched.lName && formik.errors.lName,
                })}
                placeholder='Last name'
              />
              {formik.touched.lName && formik.errors.lName && (
                <div className='invalid-feedback'>{formik.errors.lName}</div>
              )}
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold'>Email</label>
              <input
                {...formik.getFieldProps('email')}
                className={clsx('form-control', {
                  'is-invalid': formik.touched.email && formik.errors.email,
                })}
                placeholder='Email'
                type='email'
              />
              {formik.touched.email && formik.errors.email && (
                <div className='invalid-feedback'>{formik.errors.email}</div>
              )}
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold'>Phone</label>
              <input
                {...formik.getFieldProps('phone')}
                className={clsx('form-control', {
                  'is-invalid': formik.touched.phone && formik.errors.phone,
                })}
                placeholder='Phone'
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className='invalid-feedback'>{formik.errors.phone}</div>
              )}
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold'>Password</label>
              <input
                {...formik.getFieldProps('password')}
                className={clsx('form-control', {
                  'is-invalid': formik.touched.password && formik.errors.password,
                })}
                placeholder='Password'
                type='password'
              />
              {formik.touched.password && formik.errors.password && (
                <div className='invalid-feedback'>{formik.errors.password}</div>
              )}
            </div>
            <div className='col-md-6'>
              <label className='form-label fw-bold'>Role</label>
              <select
                {...formik.getFieldProps('role')}
                className={clsx('form-select', {
                  'is-invalid': formik.touched.role && formik.errors.role,
                })}
              >
                {staffRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className='invalid-feedback'>{formik.errors.role}</div>
              )}
            </div>
            <div className='col-12'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? 'Adding...' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='card-body py-3'>
        <div className='table-responsive'>
          {loading ? (
            <div className='text-center py-5'>Loading...</div>
          ) : (
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-150px'>Name</th>
                  <th className='min-w-140px'>Email</th>
                  <th className='min-w-120px'>Phone</th>
                  <th className='min-w-100px'>Role</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='text-center text-muted py-5'>
                      No staff members found. Click "+ Add Staff" to add one.
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff.id}>
                      <td>
                        <span className='fw-bold d-block fs-6'>
                          {staff.fName} {staff.lName}
                        </span>
                      </td>
                      <td>
                        <span className='text-muted fw-semibold d-block fs-7'>
                          {staff.email}
                        </span>
                      </td>
                      <td>
                        <span className='text-muted fw-semibold d-block fs-7'>
                          {staff.phone || '-'}
                        </span>
                      </td>
                      <td>
                        <span className='badge badge-light-primary fs-7 fw-semibold'>
                          {staff.role}
                        </span>
                      </td>
                      <td className='text-end'>
                        {staff.role !== 'SuperAdmin' && staff.id !== currentUser?.id?.toString() && (
                          <button
                            className='btn btn-sm btn-light-danger'
                            onClick={() => handleDelete(staff.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffManagement
