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
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle unauthorized (session expired)
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/login'
    }

    if (error.response?.status === 402) {
      // Handle payment required (Plan limit exceeded)
      // This will be handled by components via Zustand store or React Query hooks
      // But we can trigger a global event or store update here
      console.warn('Upgrade Required: 402')
    }

    return Promise.reject(error)
  }
)

export default api
