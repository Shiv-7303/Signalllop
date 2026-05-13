'use client'

import { useUserStore } from '@/store/userStore'
import { useUsage } from '@/hooks/useUsage'
import { UpgradeModal } from '@/components/UpgradeModal'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import { Sidebar } from '@/components/Sidebar'
import { MobileTabBar } from '@/components/MobileTabBar'
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
    console.log("DashboardLayout usageData changed:", usageData);
    setUsage(usageData || null);
  }, [usageData, setUsage])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <HaloBackground />
        <Loader2 className="h-10 w-10 text-brand-orange animate-spin relative z-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden text-slate-900 flex">
      <HaloBackground />
      
      {/* Sidebar - fixed width */}
      <div className="hidden md:block shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-y-auto">
        <DashboardNavbar />
        {/* Add bottom padding on mobile to account for MobileTabBar */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-10">
           <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {children}
           </main>
        </div>
      </div>
      
      <MobileTabBar />
      <UpgradeModal />
    </div>
  )
}
