'use client'

import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { useUsage } from '@/hooks/useUsage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'

export function TopHeader() {
  const { user } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const { data: usage } = useUsage()

  const reportsUsed = usage?.reports_used || 0
  const reportsLimit = usage?.reports_limit || 1
  const reportsPercent = (reportsUsed / reportsLimit) * 100

  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-30 px-6 flex items-center justify-between rounded-full mt-4 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-white md:hidden drop-shadow-sm tracking-tightest">SignalLoop</h2>
        <div className="hidden md:flex items-center gap-6">
          <Badge className={cn(
            "capitalize py-1 px-4 border-none text-[10px] font-bold tracking-widest uppercase",
            user?.plan === 'pro' ? "bg-amber-500/10 text-amber-400" :
            user?.plan === 'starter' ? "bg-brand-orange/10 text-brand-orange" :
            "bg-white/5 text-slate-300"
          )}>
            {user?.plan} Plan
          </Badge>
          
          <div className="flex items-center gap-3">
            <div className="w-32 bg-white/5 rounded-full overflow-hidden h-1.5 border border-white/5">
              <div 
                 className="h-full bg-brand-orange rounded-full shadow-[0_0_10px_rgba(64,150,255,0.8)]" 
                 style={{ width: `${reportsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="text-white drop-shadow-sm">{reportsUsed}</span>/{reportsLimit} Reports
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.plan !== 'pro' && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
            <Button 
              size="sm" 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2 font-bold rounded-full px-5 shadow-lg shadow-brand-orange/20 border border-white/10 transition-colors"
              onClick={() => openUpgradeModal()}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade
            </Button>
          </motion.div>
        )}
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

