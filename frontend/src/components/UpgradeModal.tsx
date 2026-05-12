'use client'

import { useUIStore } from '@/store/uiStore'
import { useUserStore } from '@/store/userStore'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export function UpgradeModal() {
  const { upgradeModalOpen, closeUpgradeModal } = useUIStore()
  const { user } = useUserStore()

  const plans = [
    {
      name: 'Starter',
      price: 'Rs.499',
      features: ['20 Reports / month', '5 Competitors', '20+ Opportunity cards', 'Weekly refresh'],
      color: 'indigo'
    },
    {
      name: 'Pro',
      price: 'Rs.999',
      features: ['50 Reports / month', 'Unlimited Competitors', 'All Opportunity cards', 'Daily refresh', 'Priority AI queue'],
      color: 'orange'
    }
  ]

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="max-w-4xl bg-white border-slate-200 text-slate-900 p-0 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {plans.map((p) => (
            <div key={p.name} className={`p-8 space-y-6 ${p.name === 'Pro' ? 'bg-[#FF4500]/5' : 'border-r border-slate-200'}`}>
              <div className="space-y-2">
                <h3 className={`text-2xl font-bold ${p.name === 'Pro' ? 'text-[#FF4500]' : 'text-slate-800'}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{p.price}</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <Check className={`h-4 w-4 mt-0.5 ${p.name === 'Pro' ? 'text-[#FF4500]' : 'text-slate-400'}`} strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className={`w-full ${p.name === 'Pro' ? 'bg-[#FF4500] hover:bg-[#FF4500]/90 text-white shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm hover:shadow transition-all duration-200'} font-bold h-12`}>
                <Link href={`/checkout?plan=${p.name.toLowerCase()}`}>
                  Get {p.name}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button onClick={closeUpgradeModal} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
            Maybe later, I&apos;ll stick with {user?.plan || 'Free'} for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
