'use client'

import { useUIStore } from '@/store/uiStore'
import { useUserStore } from '@/store/userStore'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Rocket, Star, MoveDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function UpgradeModal() {
  const { upgradeModalOpen, closeUpgradeModal } = useUIStore()
  const { user } = useUserStore()

  const plans = [
    {
      name: 'Starter',
      price: '₹499',
      features: ['20 Reports / month', '5 Competitors', 'Weekly opportunity feed', 'Saved opportunities'],
    },
    {
      name: 'Pro',
      price: '₹999',
      features: ['50 Reports / month', 'Unlimited Competitors', 'Priority AI queue', 'Daily refresh'],
      popular: true
    }
  ]

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="w-[95vw] sm:w-full max-w-4xl max-h-[90dvh] overflow-y-auto overflow-x-hidden bg-[var(--paper-white)] border-4 border-slate-900 text-slate-900 p-0 shadow-[4px_4px_0px_#1a1a2e] sm:shadow-[8px_8px_0px_#1a1a2e] rounded-xl sketch-border">
        {/* BACKGROUND NOISE */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <DialogTitle className="sr-only">Upgrade Plan</DialogTitle>
        <DialogDescription className="sr-only">Choose a plan to upgrade your SignalLoop access.</DialogDescription>
        
        <div className="p-6 sm:p-8 pb-4 text-center relative z-10 border-b-2 border-slate-200 border-dashed">
          <h2 className="text-3xl sm:text-4xl font-handdrawn text-slate-900">Unlock your true potential</h2>
          <p className="text-sm font-bold text-slate-500 mt-2">You&apos;ve hit the limits of the Free plan. Upgrade to keep growing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 p-4 sm:p-6 gap-6 sm:gap-8 relative z-10 mb-2">
          {plans.map((p) => (
            <div key={p.name} className={cn(
              "sketch-border bg-white flex flex-col relative",
              p.popular 
                ? "border-4 border-slate-900 shadow-[6px_6px_0px_#1a1a2e] transform -rotate-1" 
                : "border-2 border-slate-300 shadow-[2px_2px_0px_#cbd5e1] transform rotate-1"
            )}>
              {p.popular && (
                <div className="absolute -top-3 -right-3 z-20">
                  <span className="bg-highlight-yellow text-slate-900 border-2 border-slate-900 sketch-border-sm font-bold text-[10px] uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0px_#1a1a2e] transform rotate-6 inline-block">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-handdrawn text-3xl text-slate-900 mb-4">{p.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900">{p.price}</span>
                  <span className="text-slate-500 font-bold text-xs">/mo</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="font-bold text-slate-700 text-xs">{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  asChild
                  onClick={closeUpgradeModal}
                  className={cn(
                    "w-full h-12 text-sm sketch-border-sm border-2 shadow-[2px_2px_0px_#1a1a2e] active:shadow-none active:translate-y-[2px] transition-all",
                    p.popular 
                      ? "bg-brand-orange hover:bg-orange-600 text-white border-slate-900" 
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-900"
                  )}
                >
                  <Link href={`/checkout?plan=${p.name.toLowerCase()}`}>
                    Get {p.name} →
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-50 border-t-2 border-slate-900 text-center relative z-10 flex justify-center">
          <DialogClose asChild>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-4 py-2 sketch-border-sm hover:bg-slate-200">
              Maybe later
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
