import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { toast } from 'react-hot-toast'

export function useQuotaGate() {
  const { usage } = useUserStore()
  const { openUpgradeModal } = useUIStore()

  const checkReportQuota = () => {
    if (usage && usage.reports_remaining <= 0) {
      toast.error("Report quota exhausted. Upgrade to continue.")
      openUpgradeModal()
      return false
    }
    return true
  }

  const checkCompetitorQuota = () => {
    if (usage && usage.competitors_remaining <= 0) {
      toast.error("Competitor quota exhausted. Upgrade to add more.")
      openUpgradeModal()
      return false
    }
    return true
  }

  return { checkReportQuota, checkCompetitorQuota }
}
