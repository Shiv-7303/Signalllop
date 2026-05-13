'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, FileText, Bookmark, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileTabBar() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Home', href: '/dashboard', icon: Home, exact: true },
    { name: 'Opps', href: '/dashboard/opportunities', icon: Target },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Saved', href: '/dashboard/saved', icon: Bookmark },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fffdfa] border-t-2 border-slate-200 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {tabs.map((tab) => {
          const isActive = tab.exact 
            ? pathname === tab.href 
            : pathname.startsWith(tab.href)

          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className="flex flex-col items-center justify-center w-16 h-full relative"
            >
              <tab.icon className={cn("h-5 w-5 mb-1 transition-colors", isActive ? "text-brand-orange" : "text-slate-400")} />
              <span className={cn("text-[10px] font-bold transition-colors", isActive ? "text-slate-900" : "text-slate-500")}>
                {tab.name}
              </span>
              
              {/* Hand-drawn underline for active state */}
              {isActive && (
                <svg className="absolute bottom-1 w-8 h-1 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
