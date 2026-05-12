'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Rocket, LayoutDashboard, Target, Users, 
  BarChart3, Bookmark, CreditCard,  
  LogOut, Plus, ChevronDown, Check, Building, Sparkles, Menu, X, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/userStore'
import { useBusinessStore } from '@/store/businessStore'
import { useUIStore } from '@/store/uiStore'
import { useUsage } from '@/hooks/useUsage'
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
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DashboardNavbar() {
  const pathname = usePathname()
  const { user } = useUserStore()
  const { businesses, activeBusiness, setActiveBusiness } = useBusinessStore()
  const { openUpgradeModal } = useUIStore()
  const { data: usage } = useUsage()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { name: 'Strategy Document', href: '/dashboard', icon: LayoutDashboard },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const reportsUsed = usage?.reports_used || 0
  const reportsLimit = usage?.reports_limit || 1

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo + Business Switcher */}
            <div className="flex items-center gap-5">
              <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
                <div className="bg-brand-orange p-1.5 rounded-lg group-hover:shadow-md group-hover:shadow-brand-orange/20 transition-all">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tighter text-slate-900 hidden sm:block">SignalLoop</span>
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden md:block" />

              {/* Business Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors outline-none px-3 py-1.5 rounded-lg hover:bg-slate-50">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate max-w-[160px]">{activeBusiness?.business_name || 'Select Business'}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-white border-slate-200 shadow-xl rounded-xl p-1.5 mt-2 text-slate-900">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 px-3 py-2 font-bold tracking-widest">Your Businesses</DropdownMenuLabel>
                    {businesses.map((biz) => (
                      <DropdownMenuItem 
                        key={biz.id} 
                        onClick={() => setActiveBusiness(biz)}
                        className="flex items-center justify-between cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 px-3 py-2.5 transition-colors"
                      >
                        <span className="truncate text-sm font-semibold">{biz.business_name}</span>
                        {activeBusiness?.id === biz.id && <Check className="h-3.5 w-3.5 text-brand-orange" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-brand-orange focus:bg-brand-orange group px-3 py-2.5 transition-all">
                    <Link href="/onboarding" className="flex items-center gap-2.5 w-full text-brand-orange group-hover:text-white">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-sm font-semibold">Add Business</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all",
                      isActive 
                        ? "bg-brand-orange/10 text-brand-orange" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <link.icon className={cn("h-3.5 w-3.5", isActive ? 'text-brand-orange' : 'text-slate-400')} />
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Right: Usage + Upgrade + User Menu */}
            <div className="flex items-center gap-3">
              {/* Usage pill */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                <div className="w-16 bg-slate-200 rounded-full overflow-hidden h-1">
                  <div className="h-full bg-brand-orange rounded-full" style={{ width: `${(reportsUsed / reportsLimit) * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">{reportsUsed}/{reportsLimit}</span>
              </div>

              {user?.plan !== 'pro' && (
                <Button 
                  size="sm" 
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-1.5 font-semibold rounded-full px-4 h-8 text-xs shadow-sm hidden sm:flex"
                  onClick={() => openUpgradeModal()}
                >
                  <Sparkles className="h-3 w-3" />
                  Upgrade
                </Button>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                  <div className="h-8 w-8 rounded-full bg-brand-orange flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-slate-200 shadow-xl rounded-xl p-1.5 mt-2 text-slate-900" align="end">
                  <div className="px-3 py-3 border-b border-slate-100 mb-1.5">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <Badge className={cn(
                      "capitalize mt-2 text-[10px] font-bold tracking-widest border-none",
                      user?.plan === 'pro' ? "bg-amber-500/10 text-amber-600" :
                      user?.plan === 'starter' ? "bg-brand-orange/10 text-brand-orange" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {user?.plan} Plan
                    </Badge>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-slate-50 px-3 py-2.5">
                    <Link href="/billing/manage" className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-slate-50 px-3 py-2.5">
                    <Link href="/dashboard/settings" className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                      <Settings className="h-3.5 w-3.5 text-slate-400" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 px-3 py-2.5">
                    <LogOut className="h-3.5 w-3.5 mr-2.5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile hamburger */}
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-slate-500" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    isActive 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <link.icon className={cn("h-4 w-4", isActive ? 'text-brand-orange' : 'text-slate-400')} />
                  {link.name}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </>
  )
}
