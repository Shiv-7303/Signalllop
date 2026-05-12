'use client'

import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { Lock, Sparkles } from 'lucide-react'

interface FeatureGateOverlayProps {
  plan: 'starter' | 'pro'
  children: React.ReactNode
  className?: string
}

export function FeatureGateOverlay({ plan, children, className }: FeatureGateOverlayProps) {
  const { user } = useUserStore()
  const { openUpgradeModal } = useUIStore()

  const currentPlan = user?.plan || 'free'
  
  const planWeights = { 'free': 0, 'starter': 1, 'pro': 2 }
  const hasAccess = planWeights[currentPlan] >= planWeights[plan]

  if (hasAccess) return <>{children}</>

  return (
    <div className={`relative group ${className}`}>
      <div className="blur-[3px] pointer-events-none opacity-40 select-none">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="bg-indigo-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-white capitalize">{plan} Feature</h3>
          <p className="text-sm text-slate-400 max-w-[240px] mt-2 mb-6">
            Upgrade your plan to unlock full access to these insights and more.
          </p>
          <Button 
            onClick={() => openUpgradeModal(plan)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to {plan}
          </Button>
        </div>
      </div>
    </div>
  )
}
