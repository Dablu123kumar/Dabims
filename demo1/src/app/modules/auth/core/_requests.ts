import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const BASE_URL = process.env.REACT_APP_BASE_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${BASE_URL}/api/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(`${BASE_URL}/api/users/auth`, {
    email,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Verify OTP and complete login
export function verifyOTP(email: string, otp: string) {
  return axios.post<AuthModel>(`${BASE_URL}/api/users/verify-otp`, {
    email,
    otp,
  })
}

// Resend OTP
export function resendOTP(email: string) {
  return axios.post<{success: boolean; message: string}>(`${BASE_URL}/api/users/resend-otp`, {
    email,
  })
}
// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(`${BASE_URL}/api/users/requestPassword`, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(`${BASE_URL}/api/users/verifyToken`, {
    api_token: token,
  })
}





