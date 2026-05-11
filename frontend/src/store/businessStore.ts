import { create } from 'zustand'
import { Business } from '@/types'

interface BusinessState {
  businesses: Business[]
  activeBusiness: Business | null
  setBusinesses: (businesses: Business[]) => void
  setActiveBusiness: (business: Business | null) => void
  addBusiness: (business: Business) => void
  removeBusiness: (id: string) => void
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businesses: [],
  activeBusiness: null,
  setBusinesses: (businesses) => set({ businesses }),
  setActiveBusiness: (activeBusiness) => set({ activeBusiness }),
  addBusiness: (business) => set((state) => ({ businesses: [...state.businesses, business] })),
  removeBusiness: (id) => set((state) => ({ 
    businesses: state.businesses.filter(b => b.id !== id),
    activeBusiness: state.activeBusiness?.id === id ? null : state.activeBusiness
  })),
}))
