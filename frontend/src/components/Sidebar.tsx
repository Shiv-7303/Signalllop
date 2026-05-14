'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Rocket, LayoutDashboard, Target, Users, 
  BarChart3, Bookmark, CreditCard, Settings, 
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { user, usage } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const supabase = createClient()
  const router = useRouter()

  const mainLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/dashboard/opportunities', icon: Target },
    { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Saved', href: '/dashboard/saved', icon: Bookmark },
  ]

  const bottomLinks = [
    { name: 'Billing', href: '/billing/manage', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const reportsUsed = usage?.reports_used || 0
  const reportsLimit = usage?.reports_limit || 20
  const usagePercent = Math.min(100, Math.round((reportsUsed / Math.max(1, reportsLimit)) * 100))

  return (
    <div className="w-[220px] bg-[#fffdfa] border-r-2 border-slate-200 flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="p-6 pb-6 border-b-2 border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Rocket className="h-5 w-5 text-slate-900" />
          <span className="font-handdrawn text-2xl text-slate-900 tracking-tight">SignalLoop</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold transition-all",
                isActive 
                  ? "bg-highlight-yellow text-slate-900 border-l-4 border-slate-900 transform -rotate-1 shadow-[2px_2px_0px_#1a1a2e]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              )}
            >
              <link.icon className={cn("h-4 w-4", isActive ? 'text-slate-900' : 'text-slate-400')} />
              {link.name}
            </Link>
          )
        })}

        <div className="my-6 border-t-2 border-slate-200 border-dashed" />

        {bottomLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold transition-all",
                isActive 
                  ? "bg-highlight-yellow text-slate-900 border-l-4 border-slate-900 transform -rotate-1 shadow-[2px_2px_0px_#1a1a2e]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              )}
            >
              <link.icon className={cn("h-4 w-4", isActive ? 'text-slate-900' : 'text-slate-400')} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {/* Plan / Usage Area */}
      <div className="p-4 border-t-2 border-slate-200">
        <div className="bg-white sketch-border p-4 shadow-[2px_2px_0px_#1a1a2e] flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Plan</span>
            <span className="text-xs font-bold text-slate-900 capitalize bg-highlight-yellow px-2 py-0.5 rounded-sm">{user?.plan || 'Free'}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reports</span>
            <span className="text-xs font-bold text-slate-900">{reportsUsed}/{reportsLimit}</span>
          </div>
          
          {/* Hand-drawn SVG progress bar */}
          <div className="h-4 w-full relative mt-1 overflow-hidden rounded">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 10">
              <rect x="0" y="0" width="100" height="10" fill="#f1f5f9" rx="2" ry="2" />
              {reportsUsed > 0 && (
                <rect x="0" y="0" width={Math.max(2, usagePercent)} height="10" fill="#1a1a2e" rx="2" ry="2" />
              )}
              {/* sketchy hatching over the unused part */}
              <path d="M10 -5 L15 15 M20 -5 L25 15 M30 -5 L35 15 M40 -5 L45 15 M50 -5 L55 15 M60 -5 L65 15 M70 -5 L75 15 M80 -5 L85 15 M90 -5 L95 15" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
            <span>{usagePercent}% Used</span>
          </div>

          {user?.plan !== 'pro' && (
             <Button 
               onClick={openUpgradeModal} 
               className="mt-3 w-full bg-highlight-yellow text-slate-900 hover:bg-yellow-300 sketch-border border-slate-900 shadow-[1px_1px_0px_#1a1a2e] h-8 text-xs font-bold"
             >
               Upgrade →
             </Button>
          )}
        </div>

        <button 
          onClick={handleSignOut}
          className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-3 w-3" /> Log Out
        </button>
      </div>
    </div>
  )
}
