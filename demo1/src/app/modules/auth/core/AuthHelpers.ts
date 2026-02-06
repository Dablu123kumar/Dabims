import { AuthModel } from './_models'

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'

const isTokenExpired = (auth: AuthModel): boolean => {
  if (!auth.expiresAt) {
    return false // No expiration time set
  }
  const currentTime = Date.now()
  return currentTime > auth.expiresAt
}

const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // Check if token has expired
      if (isTokenExpired(auth)) {
        console.warn('Token has expired, removing from storage')
        removeAuth()
        return undefined
      }
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

let logoutCallback: ((() => void) | null) = null

const setLogoutCallback = (callback: ((() => void) | null)) => {
  logoutCallback = callback
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  
  // Request Interceptor - Add token to headers
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth()
      if (auth && auth.api_token) {
        config.headers.Authorization = `Bearer ${auth.api_token}`
      }
      return config
    },
    (err: any) => Promise.reject(err)
  )

  // Response Interceptor - Handle expired token (401 Unauthorized)
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        // Token expired or unauthorized - clear auth
        console.warn('Token expired or unauthorized (401), logging out...')
        removeAuth()
        
        // Call the logout callback if set, otherwise fallback to redirect
        if (logoutCallback) {
          logoutCallback()
        } else if (!window.location.pathname.includes('/auth')) {
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 100)
        }
      }
      return Promise.reject(error)
    }
  )
}

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY, isTokenExpired, setLogoutCallback }
