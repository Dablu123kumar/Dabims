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
  companyPhone: Yup.string().min(10, 'Minimum 10 digits').required('Phone is required'),
  companyAddress: Yup.string().min(5, 'Minimum 5 characters').required('Address is required'),
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

const inputStyle: React.CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: '1.5px solid #e4e6ef',
  background: '#f9fafc',
  fontSize: '0.95rem',
}

const inputWithIconStyle: React.CSSProperties = {
  ...inputStyle,
  paddingLeft: '2.75rem',
}

const iconWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#8a92a6',
  pointerEvents: 'none',
  fontSize: 16,
}

const primaryBtnStyle: React.CSSProperties = {
  height: 52,
  borderRadius: 12,
  background: 'linear-gradient(135deg, #6a4cff 0%, #9b6dff 100%)',
  border: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '0.3px',
  boxShadow: '0 10px 24px rgba(106, 76, 255, 0.35)',
  color: '#fff',
}

export function CompanyRegistration() {
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [logoError, setLogoError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLogoFile(file)
    if (file) {
      setLogoError('')
      const reader = new FileReader()
      reader.onload = (ev) => setLogoPreview(String(ev.target?.result || ''))
      reader.readAsDataURL(file)
    } else {
      setLogoPreview('')
    }
  }

  if (registrationSuccess) {
    return (
      <div className='text-center py-5'>
        <div
          className='d-inline-flex align-items-center justify-content-center mb-5'
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            color: '#059669',
          }}
        >
          <i className='bi bi-check-circle-fill' style={{fontSize: 48}}></i>
        </div>
        <h1 className='fw-bolder mb-3' style={{fontSize: '1.75rem', color: '#059669'}}>
          Registration Submitted!
        </h1>
        <p className='fw-semibold fs-6 text-gray-600 mb-6' style={{lineHeight: 1.6}}>
          Your company registration is pending approval from the owner.
          <br />
          You'll be able to log in once your account has been activated.
        </p>
        <Link to='/auth/login' style={{...primaryBtnStyle, display: 'inline-block', padding: '14px 32px', textDecoration: 'none'}}>
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate id='kt_company_registration_form'>
      <div className='text-center mb-8'>
        <h1 className='fw-bolder mb-2' style={{fontSize: '1.9rem', letterSpacing: '-0.5px'}}>
          Register Your Company
        </h1>
        <div className='text-gray-600 fs-6'>
          Join our Institute Management System — create your company account in minutes.
        </div>
      </div>

      {formik.status && (
        <div className='mb-6 alert alert-danger py-3'>
          <div className='alert-text fw-semibold'>{formik.status}</div>
        </div>
      )}

      {/* Logo Upload with preview */}
      <div className='fv-row mb-6'>
        <label className='form-label fs-6 fw-bold text-gray-800'>Company Logo</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${logoError ? '#f1416c' : '#d1d5e0'}`,
            borderRadius: 14,
            padding: '1.25rem',
            background: '#f9fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transition: 'all 0.2s ease',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center flex-shrink-0'
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: logoPreview ? '#fff' : 'linear-gradient(135deg, #eef0ff, #f5ecff)',
              overflow: 'hidden',
              border: '1px solid #e4e6ef',
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt='preview'
                style={{width: '100%', height: '100%', objectFit: 'contain'}}
              />
            ) : (
              <i className='bi bi-cloud-arrow-up-fill' style={{fontSize: 28, color: '#6a4cff'}}></i>
            )}
          </div>
          <div className='flex-grow-1'>
            <div className='fw-bold text-gray-800 mb-1'>
              {logoFile ? logoFile.name : 'Click to upload company logo'}
            </div>
            <div className='text-gray-500 fs-7'>
              PNG, JPG or SVG &mdash; recommended square format
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            style={{display: 'none'}}
            onChange={handleLogoChange}
          />
        </div>
        {logoError && (
          <div className='fv-plugins-message-container mt-2'>
            <span role='alert' className='text-danger'>
              {logoError}
            </span>
          </div>
        )}
      </div>

      {/* Two-column grid */}
      <div className='row g-4'>
        {/* Company Name */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Company Name</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-building'></i>
            </span>
            <input
              placeholder='Acme Corp'
              {...formik.getFieldProps('companyName')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.companyName && formik.errors.companyName,
                'is-valid': formik.touched.companyName && !formik.errors.companyName,
              })}
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
          {formik.touched.companyName && formik.errors.companyName && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.companyName}
              </span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Company Email</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-envelope-fill'></i>
            </span>
            <input
              placeholder='hello@company.com'
              {...formik.getFieldProps('email')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email,
                'is-valid': formik.touched.email && !formik.errors.email,
              })}
              style={inputWithIconStyle}
              type='email'
              autoComplete='off'
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.email}
              </span>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Company Phone</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-telephone-fill'></i>
            </span>
            <input
              placeholder='+91 98765 43210'
              {...formik.getFieldProps('companyPhone')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.companyPhone && formik.errors.companyPhone,
                'is-valid': formik.touched.companyPhone && !formik.errors.companyPhone,
              })}
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
          {formik.touched.companyPhone && formik.errors.companyPhone && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.companyPhone}
              </span>
            </div>
          )}
        </div>

        {/* Website */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Company Website</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-globe'></i>
            </span>
            <input
              placeholder='https://company.com'
              {...formik.getFieldProps('companyWebsite')}
              className='form-control'
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
        </div>

        {/* Address */}
        <div className='col-12'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Company Address</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-geo-alt-fill'></i>
            </span>
            <input
              placeholder='Street, City, State, ZIP'
              {...formik.getFieldProps('companyAddress')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.companyAddress && formik.errors.companyAddress,
                'is-valid': formik.touched.companyAddress && !formik.errors.companyAddress,
              })}
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
          {formik.touched.companyAddress && formik.errors.companyAddress && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.companyAddress}
              </span>
            </div>
          )}
        </div>

        {/* Receipt Number */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Receipt Number</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-receipt'></i>
            </span>
            <input
              placeholder='ILS-100'
              {...formik.getFieldProps('reciptNumber')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.reciptNumber && formik.errors.reciptNumber,
                'is-valid': formik.touched.reciptNumber && !formik.errors.reciptNumber,
              })}
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
          {formik.touched.reciptNumber && formik.errors.reciptNumber && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.reciptNumber}
              </span>
            </div>
          )}
        </div>

        {/* Is GST Based */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Is GST Based?</label>
          <select
            {...formik.getFieldProps('isGstBased')}
            className={clsx('form-select', {
              'is-invalid': formik.touched.isGstBased && formik.errors.isGstBased,
              'is-valid': formik.touched.isGstBased && !formik.errors.isGstBased,
            })}
            style={inputStyle}
          >
            <option value=''>-- select --</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </select>
          {formik.touched.isGstBased && formik.errors.isGstBased && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.isGstBased}
              </span>
            </div>
          )}
        </div>

        {/* GST */}
        <div className='col-12'>
          <label className='form-label fs-6 fw-bold text-gray-800'>GST Number (optional)</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-file-earmark-text'></i>
            </span>
            <input
              placeholder='Enter GST number'
              {...formik.getFieldProps('gst')}
              className='form-control'
              style={inputWithIconStyle}
              type='text'
              autoComplete='off'
            />
          </div>
        </div>

        {/* Password */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Password</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-lock-fill'></i>
            </span>
            <input
              placeholder='Minimum 6 characters'
              {...formik.getFieldProps('password')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.password && formik.errors.password,
                'is-valid': formik.touched.password && !formik.errors.password,
              })}
              style={{...inputWithIconStyle, paddingRight: '2.75rem'}}
              type={showPwd ? 'text' : 'password'}
              autoComplete='off'
            />
            <button
              type='button'
              onClick={() => setShowPwd((v) => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#8a92a6',
                cursor: 'pointer',
              }}
            >
              <i className={showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.password}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className='col-md-6'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Confirm Password</label>
          <div className='position-relative'>
            <span style={iconWrapStyle}>
              <i className='bi bi-shield-lock-fill'></i>
            </span>
            <input
              placeholder='Re-enter password'
              {...formik.getFieldProps('confirmPassword')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword,
                'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
              })}
              style={{...inputWithIconStyle, paddingRight: '2.75rem'}}
              type={showConfirmPwd ? 'text' : 'password'}
              autoComplete='off'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPwd((v) => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#8a92a6',
                cursor: 'pointer',
              }}
            >
              <i className={showConfirmPwd ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className='fv-plugins-message-container mt-1'>
              <span role='alert' className='text-danger fs-7'>
                {formik.errors.confirmPassword}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className='d-grid mt-8 mb-6'>
        <button
          type='submit'
          id='kt_company_register_submit'
          style={primaryBtnStyle}
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

      <div className='text-gray-600 text-center fw-semibold fs-6'>
        Already have an account?{' '}
        <Link to='/auth/login' style={{color: '#6a4cff', fontWeight: 700}}>
          Sign In
        </Link>
      </div>
    </form>
  )
}
