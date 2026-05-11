import { create } from 'zustand'

interface UIState {
  upgradeModalOpen: boolean
  upgradeModalPlan: string | null
  openUpgradeModal: (plan?: string | null) => void
  closeUpgradeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  upgradeModalOpen: false,
  upgradeModalPlan: null,
  openUpgradeModal: (plan = null) => set({ upgradeModalOpen: true, upgradeModalPlan: plan }),
  closeUpgradeModal: () => set({ upgradeModalOpen: false, upgradeModalPlan: null }),
}))
