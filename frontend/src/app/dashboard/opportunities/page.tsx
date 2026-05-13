'use client'

import { useQuery } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { 
  Filter, ArrowUpDown, RefreshCcw, Save, ExternalLink, Mail, Lock
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function OpportunitiesPage() {
  const { activeBusiness } = useBusinessStore()
  const { user } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const [activeFilter, setActiveFilter] = useState('All')

  const { data: opportunities, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['opportunities', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return []
      const resp = await api.get(`/opportunities/?business_id=${activeBusiness.id}`)
      return resp.data
    },
    enabled: !!activeBusiness?.id
  })

  const isPro = user?.plan === 'pro'

  // Mock data if API is empty for visual demonstration
  const mockOpps = [
    {
      id: '1',
      title: 'Looking for F5bot alternative with AI',
      source_platform: 'r/indiehackers',
      post_url: '#',
      score: 9.2,
      type: 'Buying Signal',
      content_snippet: "Direct competitor complaint thread. Users actively seeking paid alternative. High conversion potential.",
      suggested_action: "Reply with SignalLoop waitlist link",
      metrics: { comments: 47, age: '2h ago' }
    },
    {
      id: '2',
      title: 'How do you track brand mentions on Reddit?',
      source_platform: 'r/SaaS',
      post_url: '#',
      score: 8.5,
      type: 'Pain Point',
      content_snippet: "User asking for tooling recommendations to track brand mentions efficiently without manual searching.",
      suggested_action: "Share how SignalLoop automates this process",
      metrics: { comments: 12, age: '5h ago' }
    }
  ]

  const displayOpps = opportunities?.length ? opportunities : mockOpps

  const filters = [
    { name: 'All', icon: '' },
    { name: 'Buying Signal', icon: '🔥' },
    { name: 'Pain Point', icon: '😤' },
    { name: 'Comp Gap', icon: '🎯' },
    { name: 'Content', icon: '✍️' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
        <div>
          <h1 className="text-3xl font-handdrawn text-slate-900">Opportunities</h1>
          <p className="font-handdrawn text-xl text-slate-600 mt-1">
            <span className="bg-highlight-yellow px-2 py-0.5 transform -rotate-1 inline-block">18 new this week</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-9 px-3 hover:bg-slate-50 font-bold text-xs">
            <Filter className="h-3.5 w-3.5 mr-2" /> Filter ▾
          </Button>
          <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-9 px-3 hover:bg-slate-50 font-bold text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Sort ▾
          </Button>
          <Button 
            variant="outline" 
            className="sketch-border-sm bg-white text-slate-700 h-9 w-9 p-0 hover:bg-slate-50"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex flex-wrap gap-3">
        {filters.map(filter => (
          <button
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200",
              activeFilter === filter.name 
                ? "bg-highlight-yellow border-slate-900 shadow-[2px_2px_0px_#1a1a2e] text-slate-900 transform -rotate-1"
                : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
            )}
          >
            {filter.icon && <span className="mr-1.5">{filter.icon}</span>}
            {filter.name}
          </button>
        ))}
      </div>

      {/* OPPORTUNITY CARDS */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 w-full sketch-border bg-slate-100" />
            ))}
          </div>
        ) : (
          <>
            {displayOpps.map((opp, index) => {
              // Free plan users can only see the first opportunity clearly
              const isLocked = !isPro && index > 0;

              if (isLocked) {
                return (
                  <div key={opp.id || index} className="sketch-border bg-white p-6 relative overflow-hidden select-none">
                    <div className="flex items-center gap-2 mb-4 opacity-50 blur-sm">
                      <span className="text-lg">🔥</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">HIGH OPPORTUNITY</span>
                    </div>
                    <div className="space-y-4 opacity-50 blur-md pointer-events-none">
                      <div className="h-8 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-24 bg-slate-100 border-2 border-slate-200 rounded mt-4" />
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                       <div className="sketch-border bg-white border-slate-900 border-2 shadow-[4px_4px_0px_#1a1a2e] p-6 text-center transform -rotate-1 max-w-sm w-full mx-4">
                         <Lock className="h-8 w-8 text-brand-orange mx-auto mb-3" />
                         <h3 className="font-bold text-lg text-slate-900 mb-2">Upgrade to see this</h3>
                         <p className="text-sm font-medium text-slate-600 mb-6">Pro users get access to all AI-curated opportunities and automated response templates.</p>
                         <Button onClick={openUpgradeModal} className="w-full btn-primary h-10 text-sm">
                           Unlock All Opportunities →
                         </Button>
                       </div>
                    </div>
                  </div>
                )
              }

              // Unlocked Card
              return (
                <div key={opp.id || index} className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] p-6 relative group transition-transform hover:-translate-y-1">
                  
                  {/* Floating Score Badge */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white sketch-border border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] flex flex-col items-center justify-center transform rotate-6 group-hover:rotate-12 transition-transform z-10">
                    <span className="text-xl font-handdrawn text-slate-900 leading-none">{opp.score}</span>
                    <span className="text-xs font-bold text-slate-500 leading-none">/10</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                      {opp.type === 'Buying Signal' ? '🔥 BUYING SIGNAL' : 
                       opp.type === 'Pain Point' ? '😤 PAIN POINT' : '🎯 OPPORTUNITY'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 pr-12">{opp.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-slate-500 mb-6">
                    <span className="flex items-center gap-1 text-slate-700">📍 {opp.source_platform || 'Reddit'}</span>
                    <span>·</span>
                    <span>💬 {opp.metrics?.comments || 0} comments</span>
                    <span>·</span>
                    <span>⏰ {opp.metrics?.age || 'Recent'}</span>
                  </div>

                  {/* Notebook-style Insight Box */}
                  <div className="relative p-5 mb-6 bg-[#fcfbf9] border-2 border-slate-200 border-l-4 border-l-rose-500 font-handdrawn text-lg text-slate-800 leading-relaxed overflow-hidden">
                    {/* Ruled lines background */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', backgroundSize: '100% 32px', backgroundPosition: '0 8px' }} />
                    <div className="relative z-10">
                      <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
                        <span className="text-base">✏️</span> AI Insight
                      </p>
                      <p className="mt-1">{opp.content_snippet}</p>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-2">
                    <span className="text-brand-orange font-bold mt-0.5">→</span>
                    <p className="text-sm font-bold text-slate-700">
                      <span className="text-slate-500 mr-2 uppercase text-[10px] tracking-widest">Suggested Action:</span>
                      &quot;{opp.suggested_action}&quot;
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-slate-100">
                    <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-9 font-bold text-xs hover:bg-slate-50">
                      <Save className="h-3.5 w-3.5 mr-2" /> Save
                    </Button>
                    <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-9 font-bold text-xs hover:bg-slate-50" asChild>
                      <a href={opp.post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-2" /> Open Thread
                      </a>
                    </Button>
                    <Button className="sketch-border-sm bg-brand-orange text-white hover:bg-orange-600 h-9 font-bold text-xs shadow-[2px_2px_0px_#1a1a2e]">
                      <Mail className="h-3.5 w-3.5 mr-2" /> Get Template
                    </Button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
