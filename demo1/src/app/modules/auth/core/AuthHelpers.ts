import { AuthModel } from './_models'

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'

const isTokenExpired = (auth: AuthModel): boolean => {
  if (!auth.expiresAt) {
    return false // No expiration time set
  }
  const currentTime = Date.now()
  return currentTime > auth.expiresAt
}

// Returns stored auth regardless of token expiry — the axios interceptor handles refresh/logout
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
      // If expired AND no refresh token, remove immediately
      if (isTokenExpired(auth) && !auth.refresh_token && !auth.refreshToken) {
        console.warn('Token expired and no refresh token, removing from storage')
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
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const doLogout = () => {
  removeAuth()
  if (logoutCallback) {
    logoutCallback()
  } else if (!window.location.pathname.includes('/auth')) {
    setTimeout(() => {
      window.location.href = '/auth/login'
    }, 100)
  }
}

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

  // Response Interceptor - Try refresh on 401, only logout if refresh also fails
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      // Don't retry the refresh endpoint itself
      if (originalRequest.url?.includes('/users/refresh-token')) {
        doLogout()
        return Promise.reject(error)
      }

      const auth = getAuth()
      const refreshToken = auth?.refresh_token || auth?.refreshToken
      if (!refreshToken) {
        doLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post('/api/users/refresh-token', { refresh_token: refreshToken })
        const { api_token, expiresAt } = response.data

        // Update stored auth with new access token
        const currentAuth = getAuth()
        if (currentAuth) {
          setAuth({ ...currentAuth, api_token, expiresAt })
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${api_token}`
        originalRequest.headers.Authorization = `Bearer ${api_token}`
        processQueue(null, api_token)
        return axios(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        doLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY, isTokenExpired, setLogoutCallback }
