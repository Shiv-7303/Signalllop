'use client'

import Link from 'next/link'
import { 
  Rocket, Bell, Plus, ChevronDown, Check, Building, Settings, LogOut, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/userStore'
import { useBusinessStore } from '@/store/businessStore'
import { useUIStore } from '@/store/uiStore'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function DashboardNavbar() {
  const { user } = useUserStore()
  const { businesses, activeBusiness, setActiveBusiness } = useBusinessStore()
  const { openUpgradeModal } = useUIStore()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#fffdfa] border-b-2 border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* Left: Mobile Logo & Business Switcher */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="md:hidden flex items-center gap-2 group shrink-0">
            <Rocket className="h-5 w-5 text-slate-900" />
          </Link>

          {/* Business Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-bold text-slate-900 outline-none hover:bg-highlight-yellow/50 px-3 py-1.5 rounded sketch-border border-transparent hover:border-slate-900 transition-all">
              <span className="truncate max-w-[160px]">{activeBusiness?.business_name || 'SignalLoop'}</span>
              <ChevronDown className="h-4 w-4 text-slate-900" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-white sketch-border border-slate-900 shadow-[4px_4px_0px_#1a1a2e] rounded-none p-2 mt-2 text-slate-900">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] uppercase text-slate-500 px-2 py-1 font-bold tracking-widest">Your Businesses</DropdownMenuLabel>
                {businesses.map((biz) => (
                  <DropdownMenuItem 
                    key={biz.id} 
                    onClick={() => setActiveBusiness(biz)}
                    className="flex items-center justify-between cursor-pointer rounded hover:bg-highlight-yellow focus:bg-highlight-yellow px-2 py-2 transition-colors font-bold"
                  >
                    <span className="truncate text-sm">{biz.business_name}</span>
                    {activeBusiness?.id === biz.id && <Check className="h-4 w-4 text-slate-900" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-200 my-2" />
              <DropdownMenuItem asChild className="cursor-pointer rounded hover:bg-brand-orange hover:text-white focus:bg-brand-orange focus:text-white group px-2 py-2 transition-colors">
                <Link href="/onboarding" className="flex items-center gap-2 w-full font-bold">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Add Business</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Bell + Upgrade + Avatar */}
        <div className="flex items-center gap-4">
          
          <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full border border-white" />
          </button>

          {user?.plan !== 'pro' && (
            <Button 
              size="sm" 
              className="bg-white hover:bg-highlight-yellow text-slate-900 font-bold rounded-none sketch-border border-slate-900 shadow-[2px_2px_0px_#1a1a2e] px-4 h-8 text-xs hidden sm:flex active:translate-y-[2px] active:shadow-none transition-all"
              onClick={() => openUpgradeModal()}
            >
              Upgrade to Pro
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase sketch-border shadow-[2px_2px_0px_#f97316]">
                {user?.name?.[0] || user?.email?.[0] || 'U'}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white sketch-border border-slate-900 shadow-[4px_4px_0px_#1a1a2e] rounded-none p-2 mt-2 text-slate-900" align="end">
              <div className="px-2 py-2 border-b-2 border-dashed border-slate-200 mb-2">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                <Badge className={cn(
                  "capitalize mt-2 text-[10px] font-bold tracking-widest border-2 sketch-border-sm",
                  user?.plan === 'pro' ? "bg-amber-100 text-amber-800 border-amber-800" :
                  user?.plan === 'starter' ? "bg-orange-100 text-brand-orange border-brand-orange" :
                  "bg-slate-100 text-slate-600 border-slate-400"
                )}>
                  {user?.plan || 'Free'}
                </Badge>
              </div>
              <DropdownMenuItem asChild className="cursor-pointer rounded hover:bg-highlight-yellow focus:bg-highlight-yellow px-2 py-2 font-bold">
                <Link href="/billing/manage" className="flex items-center gap-2 text-sm text-slate-900">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded hover:bg-highlight-yellow focus:bg-highlight-yellow px-2 py-2 font-bold">
                <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-slate-900">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 my-2" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded hover:bg-rose-100 focus:bg-rose-100 text-rose-600 px-2 py-2 font-bold">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </nav>
  )
}
