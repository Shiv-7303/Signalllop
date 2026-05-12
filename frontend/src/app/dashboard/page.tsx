'use client'

import { useBusinesses } from '@/hooks/useBusinesses'
import { useBusinessStore } from '@/store/businessStore'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rocket, TrendingUp, Users, Target, ArrowRight, MessageSquare, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { springConfig10, springConfig15 } from '@/lib/animations'

export default function DashboardPage() {
  const { isLoading: bizLoading } = useBusinesses()
  const { activeBusiness } = useBusinessStore()

  const { data: reports } = useQuery({
    queryKey: ['reports', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/reports/?business_id=${activeBusiness?.id}`)
      return resp.data
    },
    enabled: !!activeBusiness
  })

  const { data: opportunities } = useQuery({
    queryKey: ['opportunities', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/opportunities/?business_id=${activeBusiness?.id}`)
      return resp.data
    },
    enabled: !!activeBusiness
  })

  const latestReport = reports?.[0]
  const reportData = latestReport?.report_data

  if (bizLoading) return (
    <div className="flex flex-col gap-8">
      <div className="h-12 w-64 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-64 bg-slate-100 border border-slate-200 rounded-[3rem] animate-pulse lg:col-span-1" />
        <div className="h-64 bg-slate-100 border border-slate-200 rounded-[3rem] animate-pulse lg:col-span-2" />
      </div>
    </div>
  )

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-brand-orange/10 rounded-3xl flex items-center justify-center border border-brand-orange/20">
          <Rocket className="h-10 w-10 text-brand-orange" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">No active business</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">Set up your first business profile to start unlocking growth intelligence.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
          <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-8 h-12 font-bold shadow-sm border border-brand-orange/20">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="border-brand-orange/30 text-brand-orange uppercase text-[10px] font-bold tracking-widest px-3 mb-2 bg-brand-orange/5">Growth Dashboard</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tightest drop-shadow-sm">{activeBusiness.business_name}</h1>
          <p className="text-slate-500 font-medium">Analyzing market shifts in <span className="text-slate-900">{activeBusiness.category}</span></p>
        </div>
        <div className="flex gap-3">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
             <Button asChild variant="outline" className="rounded-full border-slate-200 text-slate-600 font-bold px-6 h-11 bg-white hover:bg-slate-50 hover:text-slate-900">
               <Link href="/dashboard/settings">Settings</Link>
             </Button>
           </motion.div>
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
             <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 h-11 font-bold shadow-sm border border-brand-orange/20">
               <Link href="/dashboard/reports" className="gap-2">
                 View Strategy <ArrowRight className="h-4 w-4" />
               </Link>
             </Button>
           </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Score - Double Bezel Look */}
        <div className="lg:col-span-1 p-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm group transition-all">
           <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full space-y-8 flex flex-col items-center text-center shadow-inner border border-slate-200">
              <div className="flex items-center gap-2 text-brand-orange font-bold uppercase text-[10px] tracking-widest">
                 <TrendingUp className="h-4 w-4" /> Growth Score
              </div>
              
              <div className="relative h-44 w-44 flex items-center justify-center">
                <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                  <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * (reportData?.growth_score || 0)) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-brand-orange" 
                    strokeWidth="8" 
                    strokeDasharray={264} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="42" cx="50" cy="50" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                   <span className="text-5xl font-bold tracking-tight text-slate-900 drop-shadow-sm">{reportData?.growth_score || '0'}</span>
                   <span className="text-[10px] uppercase text-slate-500 font-bold">Potential</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 w-full text-left">
                <p className="text-xs font-bold text-slate-900">Key Intelligence</p>
                <ul className="space-y-3">
                  {(reportData?.growth_score_insights?.slice(0, 3) || ["No recent analysis found."]).map((insight: string, i: number) => (
                    <li key={i} className="text-[11px] text-slate-500 leading-relaxed flex gap-3">
                       <div className="h-1.5 w-1.5 rounded-full bg-brand-orange/50 shrink-0 mt-1 shadow-[0_0_8px_rgba(64,150,255,0.8)]" />
                       {insight}
                    </li>
                  ))}
                </ul>
              </div>
           </div>
        </div>

        {/* Communities Bento */}
        <div className="lg:col-span-2 p-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
           <div className="bg-slate-50 rounded-[2.5rem] p-8 h-full flex flex-col shadow-inner border border-slate-200 space-y-6">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest">
                    <Users className="h-4 w-4" /> Top Communities
                 </div>
                 <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-brand-orange hover:bg-slate-200/50 h-6 transition-colors">Explore all</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {reportData?.best_communities?.slice(0, 4).map((community: any, i: number) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={springConfig10}
                    key={i} 
                    className="p-6 bg-white border border-slate-200 rounded-[1.5rem] space-y-4 relative overflow-hidden group cursor-pointer hover:bg-slate-50 shadow-sm transition-colors"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <Badge className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 font-bold rounded-lg px-3 py-1">r/{community.subreddit}</Badge>
                      <div className="flex gap-1">
                         <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                         <span className="text-[10px] text-slate-500 uppercase font-bold">{community.activity}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{community.why_it_matters}</p>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors duration-500" />
                  </motion.div>
                ))}
                {!reportData && [1, 2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[1.5rem] animate-pulse border border-slate-200" />)}
              </div>
           </div>
        </div>
      </div>

      {/* Opportunity Gallery */}
      <div className="space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div className="space-y-1">
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 drop-shadow-sm">
               <Target className="h-6 w-6 text-brand-orange" />
               Signal Stream
             </h2>
             <p className="text-sm text-slate-500 font-medium">Real-time buying signals extracted from the Reddit ecosystem.</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
            <Button asChild variant="ghost" className="text-brand-orange font-bold hover:bg-brand-orange/10 hover:text-brand-orange rounded-full px-6">
              <Link href="/dashboard/opportunities">View Stream →</Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities?.slice(0, 3).map((opt: any, i: number) => {
            const redditUrl = opt.url || `https://reddit.com/search/?q=${encodeURIComponent(opt.title)}`
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ ...springConfig10, delay: i * 0.1 }}
                className="group relative"
              >
                <Card className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] h-full flex flex-col hover:border-brand-orange/40 transition-colors cursor-pointer overflow-hidden">
                  <CardHeader className="pb-3 space-y-4 p-8">
                    <div className="flex justify-between items-start">
                      <Badge className={cn(
                        "text-[10px] uppercase px-3 py-1 rounded-full font-bold tracking-wider border",
                        opt.intent_type?.toLowerCase() === 'buying' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        opt.intent_type?.toLowerCase() === 'pain_point' ? "bg-rose-50 text-rose-600 border-rose-200" :
                        "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
                      )}>
                        {opt.intent_type || 'Discussion'}
                      </Badge>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 shadow-sm">
                         <Sparkles className="h-3 w-3 text-amber-500" /> Score: {opt.opportunity_score}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-2 drop-shadow-sm">{opt.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-20 px-8">
                    <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed font-medium italic">
                      <MessageSquare className="h-3 w-3 inline mr-1.5 text-slate-400" />
                      "{opt.ai_summary}"
                    </p>
                  </CardContent>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter pl-2">r/{opt.subreddit || 'all'}</span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
                      <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-bold text-brand-orange hover:text-brand-orange p-0 px-4 hover:bg-slate-200/50 rounded-xl transition-colors">
                        <a href={redditUrl} target="_blank" rel="noopener noreferrer">Act Now</a>
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
          {!opportunities && [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] border border-slate-200 animate-pulse" />)}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
