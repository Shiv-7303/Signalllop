'use client'

import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { useUsage } from '@/hooks/useUsage'
import { UpgradeModal } from '@/components/UpgradeModal'
import { Sidebar } from '@/components/Sidebar'
import { TopHeader } from '@/components/TopHeader'
import { useUser } from '@/hooks/useUser'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HaloBackground } from '@/components/HaloBackground'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useUser()
  const { setUsage } = useUserStore()
  const { data: usageData } = useUsage()

  // Sync usage query to zustand store for non-react-query components
  useEffect(() => {
    if (usageData) {
      setUsage(usageData)
    }
  }, [usageData, setUsage])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <HaloBackground />
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin relative z-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden text-white">
      <HaloBackground />
      <Sidebar />
      <div className="md:pl-[300px] flex flex-col min-h-screen relative z-10">
        <div className="p-6 md:p-8 lg:p-10 space-y-10">
           <TopHeader />
           <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {children}
           </main>
        </div>
      </div>
      <UpgradeModal />
    </div>
  )
}
