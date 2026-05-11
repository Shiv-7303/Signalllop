import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useBusinessStore } from '@/store/businessStore'
import { useEffect } from 'react'

export function useBusinesses() {
  const { setBusinesses, activeBusiness, setActiveBusiness } = useBusinessStore()

  const query = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const response = await api.get('/businesses/')
      return response.data
    },
  })

  useEffect(() => {
    if (query.data) {
      setBusinesses(query.data)
      if (!activeBusiness && query.data.length > 0) {
        setActiveBusiness(query.data[0])
      }
    }
  }, [query.data])

  return query
}
