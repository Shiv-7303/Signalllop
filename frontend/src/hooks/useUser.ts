import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import api from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const { user, usage, isLoading, setUser, setUsage, setLoading } = useUserStore()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setLoading(false)
          return
        }

        // Call backend /auth/me
        const response = await api.get('/auth/me')
        setUser(response.data)
        
        // Fetch usage too
        const usageResp = await api.get('/usage/')
        setUsage(usageResp.data)
        
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!user && isLoading) {
      fetchUser()
    }
  }, [])

  return { user, usage, isLoading }
}
