'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Rocket, LayoutDashboard, Target, Users, 
  BarChart3, Bookmark, CreditCard, Settings, 
  LogOut, Plus, ChevronDown, Check, Building 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/userStore'
import { useBusinessStore } from '@/store/businessStore'
import { createClient } from '@/lib/supabase/client'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUserStore()
  const { businesses, activeBusiness, setActiveBusiness } = useBusinessStore()
  const supabase = createClient()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/dashboard/opportunities', icon: Target },
    { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Saved', href: '/dashboard/saved', icon: Bookmark },
    { name: 'Billing', href: '/billing/manage', icon: CreditCard },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="fixed left-6 top-6 bottom-6 w-72 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-premium z-40 hidden md:flex flex-col overflow-hidden">
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl shadow-lg shadow-black/20 group-hover:bg-brand-orange transition-colors duration-500 border border-white/10">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white drop-shadow-sm">SignalLoop</span>
        </Link>
      </div>

      {/* Business Switcher - Double Bezel Look */}
      <div className="px-6 mb-8 mt-4">
        <div className="p-1.5 bg-black/20 rounded-[1.5rem] border border-white/5 shadow-inner">
           <DropdownMenu>
             <DropdownMenuTrigger className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 px-4 rounded-[1.25rem] transition-all shadow-sm outline-none focus:ring-2 focus:ring-brand-orange/50">
               <div className="flex items-center gap-3 truncate">
                 <div className="w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center border border-brand-orange/30">
                    <Building className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                 </div>
                 <span className="truncate text-xs font-bold tracking-tight">
                   {activeBusiness?.business_name || 'Select Business'}
                 </span>
               </div>
               <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-64 bg-slate-900/90 backdrop-blur-2xl border-white/10 shadow-2xl rounded-2xl p-2 mt-2 text-white">
               <DropdownMenuGroup>
                 <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 px-3 py-2 font-bold tracking-widest">Your Businesses</DropdownMenuLabel>
                 {businesses.map((biz) => (
                   <DropdownMenuItem 
                     key={biz.id} 
                     onClick={() => setActiveBusiness(biz)}
                     className="flex items-center justify-between cursor-pointer rounded-xl hover:bg-white/10 focus:bg-white/10 px-3 py-3 transition-colors"
                   >
                     <span className="truncate text-sm font-bold">{biz.business_name}</span>
                     {activeBusiness?.id === biz.id && <Check className="h-4 w-4 text-brand-orange" />}
                   </DropdownMenuItem>
                 ))}
               </DropdownMenuGroup>
               <DropdownMenuSeparator className="bg-white/10 my-2" />
               <DropdownMenuItem asChild className="cursor-pointer rounded-xl hover:bg-brand-orange focus:bg-brand-orange group px-3 py-3 transition-all">
                 <Link href="/onboarding" className="flex items-center gap-3 w-full text-brand-orange group-hover:text-white">
                   <Plus className="h-4 w-4" />
                   <span className="text-sm font-bold">Add New Business</span>
                 </Link>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={springConfig15}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] text-sm font-bold transition-colors duration-300 ${
                  isActive 
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 border border-brand-orange/50" 
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <link.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.name}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-black/20 rounded-[2rem] border border-white/5 p-5 space-y-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[1rem] bg-brand-orange flex items-center justify-center text-sm font-bold text-white uppercase shadow-lg shadow-brand-orange/20 border border-white/20">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                 <p className="text-[10px] text-slate-400 capitalize font-bold tracking-tight">{user?.plan} Plan</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex gap-2">
             <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <Link href="/dashboard/settings"><Settings className="h-4 w-4" /></Link>
             </Button>
             <Button 
               variant="ghost" 
               size="sm"
               className="flex-1 justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-2 h-10 rounded-xl font-bold px-4 transition-all"
               onClick={handleSignOut}
             >
               <LogOut className="h-4 w-4" />
               <span className="text-[10px] uppercase tracking-wider">Log Out</span>
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
