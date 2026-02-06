/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login, verifyOTP, resendOTP} from '../core/_requests'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
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
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
})

const initialValues = {
  email: 'rahul@gmail.com',
  password: '233124312423',
}

const otpInitialValues = {
  otp: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
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
          // OTP required, show OTP form
          setUserEmail(values.email)
          setShowOTPForm(true)
          setStatus('OTP sent to your email')
          setSubmitting(false)
        } else {
          // No OTP needed, login directly
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
        
        // OTP verified, save auth and get user
        saveAuth(auth)
        if (auth.api_token) {
          const {data: user} = await getUserByToken(auth.api_token!)
          setCurrentUser(user)
        }
        
        // Reset forms
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

  // Show OTP form if required
  if (showOTPForm) {
    return (
      <form
        className='form w-100'
        onSubmit={otpFormik.handleSubmit}
        noValidate
        id='kt_otp_form'
      >
        {/* begin::Heading */}
        <div className='text-center mb-11'>
          <h1 className='text-dark fw-bolder mb-3'>Verify OTP</h1>
          <div className='text-gray-500 fw-semibold fs-6'>
            Enter the OTP sent to {userEmail}
          </div>
        </div>
        {/* end::Heading */}

        {otpError && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>{otpError}</div>
          </div>
        )}

        {resendSuccess && (
          <div className='mb-lg-15 alert alert-success'>
            <div className='alert-text font-weight-bold'>{resendSuccess}</div>
          </div>
        )}

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <label className='form-label fs-6 fw-bolder text-dark'>Enter OTP</label>
          <input
            placeholder='6-digit OTP'
            {...otpFormik.getFieldProps('otp')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': otpFormik.touched.otp && otpFormik.errors.otp},
              {
                'is-valid': otpFormik.touched.otp && !otpFormik.errors.otp,
              }
            )}
            type='text'
            name='otp'
            autoComplete='off'
            maxLength={6}
          />
          {otpFormik.touched.otp && otpFormik.errors.otp && (
            <div className='fv-plugins-message-container'>
              <span role='alert'>{otpFormik.errors.otp}</span>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Action */}
        <div className='d-grid mb-10'>
          <button
            type='submit'
            id='kt_verify_otp_submit'
            className='btn btn-primary'
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
        {/* end::Action */}

        {/* begin::Resend OTP */}
        <div className='text-center'>
          <button
            type='button'
            className='btn btn-link'
            onClick={handleResendOTP}
            disabled={resendLoading}
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
        {/* end::Resend OTP */}

        {/* begin::Back to login */}
        <div className='text-center mt-5'>
          <button
            type='button'
            className='btn btn-link'
            onClick={() => {
              setShowOTPForm(false)
              formik.resetForm()
              otpFormik.resetForm()
              setUserEmail('')
            }}
          >
            Back to Login
          </button>
        </div>
        {/* end::Back to login */}
      </form>
    )
  }

  // Show login form
  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Welcome to Reliance Education</div>
      </div>
      {/* begin::Heading */}

      {formik.status && (
        <div className={clsx('mb-lg-15 alert', {
          'alert-danger': !formik.status.includes('sent'),
          'alert-info': formik.status.includes('sent'),
        })}>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
