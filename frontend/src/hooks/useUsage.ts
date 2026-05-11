import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const resp = await api.get('/usage/')
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
