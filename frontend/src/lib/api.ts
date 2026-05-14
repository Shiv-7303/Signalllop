import axios from 'axios'
import { createClient } from './supabase/client'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for Supabase JWT
api.interceptors.request.use(async (config) => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers.set('Authorization', `Bearer ${session.access_token}`)
  } else {
    console.warn('Axios Interceptor: No active session or access token found.')
  }

  return config
})

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Force a session refresh
        const supabase = createClient()
        const { data, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !data.session) {
          // If refresh fails, then we truly need to log out
          await supabase.auth.signOut()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }

        // Update the authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`
        
        // Retry the original request
        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    if (error.response?.status === 402) {
      console.warn('Upgrade Required: 402')
    }

    return Promise.reject(error)
  }
)

export default api
