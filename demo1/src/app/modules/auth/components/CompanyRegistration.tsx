import {useState, useRef} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {registerCompany} from '../core/_requests'

const companyRegistrationSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(100, 'Maximum 100 characters')
    .required('Company name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  companyPhone: Yup.string()
    .min(10, 'Minimum 10 digits')
    .required('Phone is required'),
  companyAddress: Yup.string()
    .min(5, 'Minimum 5 characters')
    .required('Address is required'),
  companyWebsite: Yup.string(),
  reciptNumber: Yup.string().required('Receipt number is required (e.g. ILS-100)'),
  gst: Yup.string(),
  isGstBased: Yup.string().required('Please select GST based option'),
})

const initialValues = {
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyPhone: '',
  companyAddress: '',
  companyWebsite: '',
  reciptNumber: '',
  gst: '',
  isGstBased: '',
}

export function CompanyRegistration() {
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoError, setLogoError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formik = useFormik({
    initialValues,
    validationSchema: companyRegistrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      if (!logoFile) {
        setLogoError('Company logo is required')
        setSubmitting(false)
        return
      }
      setLogoError('')
      setLoading(true)
      try {
        const formData = new FormData()
        formData.append('logo', logoFile)
        formData.append('companyName', values.companyName)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('companyPhone', values.companyPhone)
        formData.append('companyAddress', values.companyAddress)
        formData.append('companyWebsite', values.companyWebsite)
        formData.append('reciptNumber', values.reciptNumber)
        formData.append('gst', values.gst)
        formData.append('isGstBased', values.isGstBased)

        const {data} = await registerCompany(formData)

        if (data.pending) {
          setRegistrationSuccess(true)
        }
      } catch (error: any) {
        console.error(error)
        const errorMessage =
          error.response?.data?.error || 'Registration failed. Please try again.'
        setStatus(errorMessage)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  if (registrationSuccess) {
    return (
      <div className='form w-100 p-5 rounded text-center'>
        <div className='mb-8'>
          <div className='symbol symbol-100px mx-auto mb-5'>
            <span className='symbol-label bg-light-success'>
              <i className='ki-duotone ki-check-circle fs-3x text-success'>
                <span className='path1'></span>
                <span className='path2'></span>
              </i>
            </span>
          </div>
          <h1 className='fw-bolder mb-3 text-success'>Registration Submitted!</h1>
          <p className='fw-semibold fs-5 text-gray-600'>
            Your company registration is pending approval from the owner.
            <br />
            You will be able to log in once your account has been activated.
          </p>
        </div>
        <Link to='/auth/login' className='btn btn-primary'>
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <form
      className='form w-100 p-5 rounded'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_company_registration_form'
    >
      <div className='text-center mb-11'>
        <h1 className='fw-bolder mb-3'>Register Your Company</h1>
        <div className='fw-semibold fs-6'>Create your company account to get started</div>
      </div>

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* Logo */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Logo</label>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className={clsx('form-control bg-transparent', {
            'is-invalid': logoError,
          })}
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setLogoFile(file)
            if (file) setLogoError('')
          }}
        />
        {logoError && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{logoError}</span>
          </div>
        )}
      </div>

      {/* Company Name */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Company Name</label>
        <input
          placeholder='Enter Company Name..'
          {...formik.getFieldProps('companyName')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.companyName && formik.errors.companyName,
            'is-valid': formik.touched.companyName && !formik.errors.companyName,
          })}
          type='text'
          autoComplete='off'
        />
        {formik.touched.companyName && formik.errors.companyName && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.companyName}</span>
          </div>
        )}
      </div>

      {/* Email */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Company Email</label>
        <input
          placeholder='Enter Company Email Address..'
          {...formik.getFieldProps('email')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.email && formik.errors.email,
            'is-valid': formik.touched.email && !formik.errors.email,
          })}
          type='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>

      {/* Phone */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Company Phone</label>
        <input
          placeholder='Enter Company Phone Number..'
          {...formik.getFieldProps('companyPhone')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.companyPhone && formik.errors.companyPhone,
            'is-valid': formik.touched.companyPhone && !formik.errors.companyPhone,
          })}
          type='text'
          autoComplete='off'
        />
        {formik.touched.companyPhone && formik.errors.companyPhone && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.companyPhone}</span>
          </div>
        )}
      </div>

      {/* Website */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Company Website</label>
        <input
          placeholder='Enter Company website'
          {...formik.getFieldProps('companyWebsite')}
          className='form-control bg-transparent'
          type='text'
          autoComplete='off'
        />
      </div>

      {/* Address */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Company Address</label>
        <input
          placeholder='Enter Company Address'
          {...formik.getFieldProps('companyAddress')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.companyAddress && formik.errors.companyAddress,
            'is-valid': formik.touched.companyAddress && !formik.errors.companyAddress,
          })}
          type='text'
          autoComplete='off'
        />
        {formik.touched.companyAddress && formik.errors.companyAddress && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.companyAddress}</span>
          </div>
        )}
      </div>

      {/* Receipt Number */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Receipt Number (example: ILS-100)</label>
        <input
          placeholder='Enter Receipt Number'
          {...formik.getFieldProps('reciptNumber')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.reciptNumber && formik.errors.reciptNumber,
            'is-valid': formik.touched.reciptNumber && !formik.errors.reciptNumber,
          })}
          type='text'
          autoComplete='off'
        />
        {formik.touched.reciptNumber && formik.errors.reciptNumber && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.reciptNumber}</span>
          </div>
        )}
      </div>

      {/* GST */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>GST</label>
        <input
          placeholder='Enter GST'
          {...formik.getFieldProps('gst')}
          className='form-control bg-transparent'
          type='text'
          autoComplete='off'
        />
      </div>

      {/* Is GST Based */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Is GST Based</label>
        <select
          {...formik.getFieldProps('isGstBased')}
          className={clsx('form-select bg-transparent', {
            'is-invalid': formik.touched.isGstBased && formik.errors.isGstBased,
            'is-valid': formik.touched.isGstBased && !formik.errors.isGstBased,
          })}
        >
          <option value=''>--select--</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
        {formik.touched.isGstBased && formik.errors.isGstBased && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.isGstBased}</span>
          </div>
        )}
      </div>

      {/* Password */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bolder'>Password</label>
        <input
          placeholder='Enter password'
          {...formik.getFieldProps('password')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.password && formik.errors.password,
            'is-valid': formik.touched.password && !formik.errors.password,
          })}
          type='password'
          autoComplete='off'
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.password}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder'>Confirm Password</label>
        <input
          placeholder='Confirm password'
          {...formik.getFieldProps('confirmPassword')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword,
            'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
          })}
          type='password'
          autoComplete='off'
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.confirmPassword}</span>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_company_register_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Register Company</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Already have an account?{' '}
        <Link to='/auth/login' className='link-primary'>
          Sign In
        </Link>
      </div>
    </form>
  )
}
