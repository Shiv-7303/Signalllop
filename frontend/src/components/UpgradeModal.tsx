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
      color: 'amber'
    }
  ]

  return (
    <Dialog open={upgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-800 text-white p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {plans.map((p) => (
            <div key={p.name} className={`p-8 space-y-6 ${p.name === 'Pro' ? 'bg-indigo-600/5' : 'border-r border-slate-800'}`}>
              <div className="space-y-2">
                <h3 className={`text-2xl font-bold ${p.name === 'Pro' ? 'text-amber-500' : 'text-indigo-500'}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className={`h-4 w-4 mt-0.5 ${p.name === 'Pro' ? 'text-amber-500' : 'text-indigo-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className={`w-full ${p.name === 'Pro' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold h-12`}>
                <Link href={`/checkout?plan=${p.name.toLowerCase()}`}>
                  Get {p.name}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center">
          <button onClick={closeUpgradeModal} className="text-xs text-slate-500 hover:text-white transition-colors">
            Maybe later, I&apos;ll stick with {user?.plan || 'Free'} for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
