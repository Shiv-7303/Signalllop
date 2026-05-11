import { create } from 'zustand'
import { User, UsageInfo } from '@/types'

interface UserState {
  user: User | null
  usage: UsageInfo | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setUsage: (usage: UsageInfo | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  usage: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setUsage: (usage) => set({ usage }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, usage: null }),
}))
