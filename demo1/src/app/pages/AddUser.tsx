import React, {useState} from 'react'
import {
  addUser,
  addUserInitialValues,
} from '../../app/modules/accounts/components/settings/SettingsModel'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useMutation} from 'react-query'
import {toast} from 'react-toastify'

const addUserSchema = Yup.object().shape({
  fName: Yup.string().required('First name is required'),
  lName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required'),
  phone: Yup.string().required('Phone Number is required'),
  role: Yup.string().required('User Type is required'),
  password: Yup.string().required('Password is required..'),
})

const BASE_URL = process.env.REACT_APP_BASE_URL

const AddUser: React.FC = () => {
  const [data, setData] = useState<addUser>(addUserInitialValues)
  //console.log(data)

  const postAddUserDataHandler = async (values: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Error posting data. Status:', response.status)
        const errorMessage = await response.text()
        toast.error(`Error message: ${errorMessage}`)
        throw new Error('Error posting data')
        return
      }

      // console.log('Data posted successfully', response);
      toast.success('user created successfully!')
      return response.json()
    } catch (error) {
      console.error('Error in postAddUserDataHandler:', error)
      alert('user already exists!')
      // setError(error);
      throw error // Re-throw the error to be caught by the `onError` handler in `useMutation`
    }
  }

  // Use the useMutation hook
  const mutation = useMutation(postAddUserDataHandler, {
    onSuccess: () => {
      // Optional: Handle success, e.g., redirect or show a success message
      // console.log('Data posted successfully');
    },
    onError: (error) => {
      // Optional: Handle error, e.g., show an error message
      console.error('Error posting data:', error)
      // setError(error)
    },
  })

  const [loading, setLoading] = useState(false)
  const formik = useFormik<addUser>({
    initialValues: addUserInitialValues,
    validationSchema: addUserSchema,
    onSubmit: async (values) => {
      // console.log(values);
      setLoading(true)
      setTimeout(() => {
        const updatedData = Object.assign(data, values)
        setData(updatedData)
        setLoading(false)
      }, 1000)
      mutation.mutate(values)
    },
  })
  //console.log(formik);

  return (
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
          <h3 className='fw-bolder m-0'>Add User</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='First name'
                      {...formik.getFieldProps('fName')}
                    />
                    {formik.touched.fName && formik.errors.fName && (
                      <div className='fv-help-block'>{formik.errors.fName}</div>
                    )}
                  </div>

                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Last name'
                      {...formik.getFieldProps('lName')}
                    />
                    {formik.touched.lName && formik.errors.lName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.lName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Emaill'
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.email}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Password</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Password'
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.password}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Contact Phone</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('phone')}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.phone}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>User Type</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg fw-bold'
                  {...formik.getFieldProps('role')}
                >
                  <option value=''>Select a User Type</option>
                  <option value='Admin'>Admin</option>
                  <option value='Counsellor'>Counsellor</option>
                  <option value='Telecaller'>Telecaller</option>
                  <option value='Accounts'>Accounts</option>
                  <option value='Student'>Student</option>
                  <option value='SuperAdmin'>SuperAdmin</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.role}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Add User'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser
