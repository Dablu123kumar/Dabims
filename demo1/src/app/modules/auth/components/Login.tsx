/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login, verifyOTP, resendOTP} from '../core/_requests'
import {useAuth} from '../core/Auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const otpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
})

const initialValues = {email: '', password: ''}
const otpInitialValues = {otp: ''}

const inputWithIconStyle: React.CSSProperties = {
  paddingLeft: '3rem',
  height: 52,
  borderRadius: 12,
  border: '1.5px solid #e4e6ef',
  background: '#f9fafc',
  transition: 'all 0.2s ease',
  fontSize: '0.95rem',
}

const iconWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#8a92a6',
  pointerEvents: 'none',
  fontSize: 18,
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

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setOtpError('')
      try {
        const {data} = await login(values.email, values.password)
        if (data.requiresOTP) {
          setUserEmail(values.email)
          setShowOTPForm(true)
          setStatus('OTP sent to your email')
          setSubmitting(false)
        } else {
          saveAuth(data)
          if (data.api_token) {
            const {data: user} = await getUserByToken(data.api_token!)
            setCurrentUser(user)
          }
        }
      } catch (error: any) {
        console.error(error)
        saveAuth(undefined)
        const errorMessage = error.response?.data?.message || 'The login details are incorrect'
        setStatus(errorMessage)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  const otpFormik = useFormik({
    initialValues: otpInitialValues,
    validationSchema: otpSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setOtpError('')
      setLoading(true)
      try {
        const {data: auth} = await verifyOTP(userEmail, values.otp)
        saveAuth(auth)
        if (auth.api_token) {
          const {data: user} = await getUserByToken(auth.api_token!)
          setCurrentUser(user)
        }
        formik.resetForm()
        otpFormik.resetForm()
        setShowOTPForm(false)
      } catch (error: any) {
        console.error(error)
        const errorMessage = error.response?.data?.message || 'Invalid OTP'
        setOtpError(errorMessage)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  const handleResendOTP = async () => {
    setResendLoading(true)
    setResendSuccess('')
    try {
      await resendOTP(userEmail)
      setResendSuccess('OTP resent successfully!')
      setTimeout(() => setResendSuccess(''), 3000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP'
      setOtpError(errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  if (showOTPForm) {
    return (
      <form onSubmit={otpFormik.handleSubmit} noValidate id='kt_otp_form'>
        <div className='text-center mb-9'>
          <div
            className='d-inline-flex align-items-center justify-content-center mb-4'
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #eef0ff, #f5ecff)',
              color: '#6a4cff',
            }}
          >
            <i className='bi bi-shield-lock-fill' style={{fontSize: 28}}></i>
          </div>
          <h1 className='fw-bolder mb-2' style={{fontSize: '1.75rem'}}>
            Verify OTP
          </h1>
          <div className='text-gray-600 fs-6'>
            Enter the 6-digit code sent to <strong>{userEmail}</strong>
          </div>
        </div>

        {otpError && (
          <div className='mb-8 alert alert-danger py-3'>
            <div className='alert-text fw-semibold'>{otpError}</div>
          </div>
        )}
        {resendSuccess && (
          <div className='mb-8 alert alert-success py-3'>
            <div className='alert-text fw-semibold'>{resendSuccess}</div>
          </div>
        )}

        <div className='fv-row mb-8 position-relative'>
          <label className='form-label fs-6 fw-bold text-gray-800'>Enter OTP</label>
          <input
            placeholder='6-digit OTP'
            {...otpFormik.getFieldProps('otp')}
            className={clsx('form-control', {
              'is-invalid': otpFormik.touched.otp && otpFormik.errors.otp,
              'is-valid': otpFormik.touched.otp && !otpFormik.errors.otp,
            })}
            style={{
              height: 56,
              borderRadius: 12,
              border: '1.5px solid #e4e6ef',
              background: '#f9fafc',
              fontSize: '1.3rem',
              letterSpacing: '0.6rem',
              textAlign: 'center',
              fontWeight: 700,
            }}
            type='text'
            name='otp'
            autoComplete='off'
            maxLength={6}
          />
          {otpFormik.touched.otp && otpFormik.errors.otp && (
            <div className='fv-plugins-message-container mt-2'>
              <span role='alert' className='text-danger'>
                {otpFormik.errors.otp}
              </span>
            </div>
          )}
        </div>

        <div className='d-grid mb-6'>
          <button
            type='submit'
            id='kt_verify_otp_submit'
            style={primaryBtnStyle}
            disabled={otpFormik.isSubmitting || !otpFormik.isValid}
          >
            {!loading && <span className='indicator-label'>Verify OTP</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>

        <div className='text-center'>
          <button
            type='button'
            className='btn btn-link fw-semibold'
            onClick={handleResendOTP}
            disabled={resendLoading}
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <div className='text-center mt-2'>
          <button
            type='button'
            className='btn btn-link text-gray-600 fw-semibold'
            onClick={() => {
              setShowOTPForm(false)
              formik.resetForm()
              otpFormik.resetForm()
              setUserEmail('')
            }}
          >
            ← Back to Login
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate id='kt_login_signin_form'>
      <div className='text-center mb-9'>
        <h1 className='fw-bolder mb-2' style={{fontSize: '2rem', letterSpacing: '-0.5px'}}>
          Sign In
        </h1>
        <div className='text-gray-600 fs-6'>
          Welcome back! Please enter your credentials to continue.
        </div>
      </div>

      {formik.status && (
        <div
          className={clsx('mb-6 alert py-3', {
            'alert-danger': !formik.status.includes('sent'),
            'alert-info': formik.status.includes('sent'),
          })}
        >
          <div className='alert-text fw-semibold'>{formik.status}</div>
        </div>
      )}

      {/* Email */}
      <div className='fv-row mb-5'>
        <label className='form-label fs-6 fw-bold text-gray-800'>Email Address</label>
        <div className='position-relative'>
          <span style={iconWrapStyle}>
            <i className='bi bi-envelope-fill'></i>
          </span>
          <input
            placeholder='name@company.com'
            {...formik.getFieldProps('email')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.email && formik.errors.email,
              'is-valid': formik.touched.email && !formik.errors.email,
            })}
            style={inputWithIconStyle}
            type='email'
            name='email'
            autoComplete='off'
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container mt-2'>
            <span role='alert' className='text-danger'>
              {formik.errors.email}
            </span>
          </div>
        )}
      </div>

      {/* Password */}
      <div className='fv-row mb-4'>
        <label className='form-label fw-bold text-gray-800 fs-6 mb-2'>Password</label>
        <div className='position-relative'>
          <span style={iconWrapStyle}>
            <i className='bi bi-lock-fill'></i>
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.password && formik.errors.password,
              'is-valid': formik.touched.password && !formik.errors.password,
            })}
            style={{...inputWithIconStyle, paddingRight: '3rem'}}
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#8a92a6',
              cursor: 'pointer',
              fontSize: 18,
            }}
            aria-label='Toggle password visibility'
          >
            <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container mt-2'>
            <span role='alert' className='text-danger'>
              {formik.errors.password}
            </span>
          </div>
        )}
      </div>

      {/* Forgot password */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />
        <Link to='/auth/forgot-password' style={{color: '#6a4cff', textDecoration: 'none'}}>
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <div className='d-grid mb-8'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          style={primaryBtnStyle}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Sign In</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className='d-flex align-items-center mb-8'>
        <div style={{flex: 1, height: 1, background: '#e4e6ef'}} />
        <span className='mx-3 text-gray-500 fs-7 fw-semibold'>OR</span>
        <div style={{flex: 1, height: 1, background: '#e4e6ef'}} />
      </div>

      <div className='text-gray-600 text-center fw-semibold fs-6'>
        Want to register your company?{' '}
        <Link to='/auth/company-register' style={{color: '#6a4cff', fontWeight: 700}}>
          Register Company
        </Link>
      </div>
    </form>
  )
}
