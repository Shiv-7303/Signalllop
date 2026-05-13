'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, LayoutDashboard, Rocket } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import api from '@/lib/api'

export default function BillingSuccessPage() {
  const router = useRouter()
  const { user, setUser, setUsage } = useUserStore()

  useEffect(() => {
    // Refresh user data to show updated plan
    const refreshData = async () => {
      try {
        const userResp = await api.get('/auth/me')
        setUser(userResp.data)
        const usageResp = await api.get('/usage/')
        setUsage(usageResp.data)
      } catch (err) {
        console.error('Failed to refresh user data after payment')
      }
    }
    refreshData()
  }, [setUser, setUsage])

  return (
    <div className="min-h-screen bg-[var(--paper-white)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND NOISE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="sketch-border bg-white shadow-[8px_8px_0px_#1a1a2e] max-w-md w-full relative z-10 transform -rotate-1 p-8 text-center flex flex-col items-center">
        
        <div className="absolute top-0 right-0 -z-10 opacity-5 transform rotate-12 translate-x-4 -translate-y-4">
          <Rocket className="w-40 h-40 text-brand-orange" />
        </div>

        <div className="h-20 w-20 bg-emerald-100 sketch-border border-2 border-slate-900 shadow-[4px_4px_0px_#1a1a2e] flex items-center justify-center transform rotate-3 mb-8">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="text-4xl font-handdrawn text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-600 font-bold mb-8">
          You&apos;re now on the <span className="bg-highlight-yellow px-2 py-0.5 border border-slate-900 sketch-border-sm text-slate-900 font-bold capitalize transform inline-block -rotate-2">{user?.plan || 'Paid'}</span> plan.
        </p>

        <div className="w-full space-y-4 text-left mb-10 border-t-2 border-dashed border-slate-200 pt-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Your new features are unlocked:</p>
          <div className="grid grid-cols-1 gap-3">
             {[
               'Increased report limits',
               'More competitor slots',
               'Advanced AI opportunity scoring',
               'Automated background scanning'
             ].map(f => (
               <div key={f} className="flex items-center gap-3 text-sm text-slate-800 sketch-border-sm bg-slate-50 p-3 border-2 border-slate-200 font-bold">
                  <Sparkles className="h-4 w-4 text-brand-orange" />
                  {f}
               </div>
             ))}
          </div>
        </div>

        <Button onClick={() => router.push('/dashboard')} className="w-full btn-primary h-14 text-lg gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
