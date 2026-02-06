import React, {useState} from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import './ResetPassword.css'
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL
const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
  const navigate = useNavigate()
  let {id, token} = useParams()
  const initialValues = {
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  })

  const handleSubmit = async (values, {setSubmitting}) => {
    // console.log('Reset Password Data:', values)
    const {password} = values
    const res = await axios.post(`${BASE_URL}/api/reset-password/${id}/${token}`, {password})
    if (res.data.success) {
      navigate('/login')
      setSubmitting(false)
    }
    // Add API call or form submission logic here
  }

  return (
    <div className='center-wrapper'>
      <div className='reset-password-container'>
        <h2>Reset Password</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting}) => (
            <Form className='reset-password-form'>
              <div className='form-group'>
                <label htmlFor='password'>New Password</label>
                <Field
                  type={showPassword ? 'text' : 'password'} // Toggle field type based on state
                  name='password'
                  placeholder='Enter new password'
                  className='form-field'
                />
                <ErrorMessage name='password' component='div' className='error-message' />
              </div>

              <div className='form-group'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <Field
                  type={showPassword ? 'text' : 'password'} // Toggle field type based on state
                  name='confirmPassword'
                  placeholder='Confirm your password'
                  className='form-field'
                />
                <ErrorMessage name='confirmPassword' component='div' className='error-message' />
              </div>

              <div className='form-group'>
                <label>
                  <input
                    type='checkbox'
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)} // Toggle password visibility
                  />{' '}
                  Show Password
                </label>
              </div>

              <button type='submit' disabled={isSubmitting} className='submit-btn'>
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ResetPassword
