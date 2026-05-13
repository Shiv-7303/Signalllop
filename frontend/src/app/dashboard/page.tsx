'use client'

import { useBusinesses } from '@/hooks/useBusinesses'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, Search, Target, LayoutDashboard, AlertCircle, 
  Building, Megaphone, Zap, MessageSquare, MapPin, PlayCircle, 
  Lightbulb, Calendar, CheckCircle2, ChevronRight, Users, CreditCard, X, TrendingUp, Clock, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { isLoading: bizLoading } = useBusinesses()
  const { activeBusiness } = useBusinessStore()
  const { usage } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const queryClient = useQueryClient()

  const { data: reports, isLoading: reportsLoading } = useQuery({
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

  const { checkReportQuota } = useQuotaGate()

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!checkReportQuota()) return Promise.reject(new Error("QUOTA_EXCEEDED"));
      const resp = await api.post('/reports/generate', { business_id: activeBusiness?.id })
      return resp.data
    },
    onSuccess: () => {
      toast.success('New report generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onError: (err: any) => {
      if (err.message === "QUOTA_EXCEEDED") return;
      if (err.response?.status === 402) {
        openUpgradeModal()
        return
      }
      toast.error(err.response?.data?.error || 'Generation failed')
    }
  })

  if (bizLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
    </div>
  )

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-md mx-auto">
        <div className="sketch-border p-6 bg-white minimal-shadow transform -rotate-2">
          <Rocket className="h-12 w-12 text-slate-900 mb-4 mx-auto" />
          <h2 className="text-3xl font-handdrawn text-slate-900 tracking-tight">Let's build something.</h2>
          <p className="text-slate-600 mt-2 font-medium">Set up your first project brief to unlock your AI Cofounder.</p>
        </div>
        <Button asChild className="sketch-border bg-brand-orange hover:bg-brand-orange/90 text-white px-8 h-12 font-bold minimal-shadow transition-transform active:translate-y-1 active:shadow-none text-lg">
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>
    )
  }

  const latestReport = reports?.[0]
  const data = latestReport?.report_data

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-24 pb-32">
      {generateMutation.isPending && <AILoadingOverlay />}

      {/* Hero Section - Clean, Typography Focus */}
      <header className="flex flex-col items-start gap-8 border-b-2 border-slate-900 pb-12 relative">
        <div className="absolute top-0 right-0 -z-10 opacity-10">
           <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
             <path d="M45,-76.3C57.9,-69.3,67.6,-54.6,75.9,-40.1C84.3,-25.6,91.3,-11.3,90.4,2.5C89.5,16.2,80.7,29.4,70.9,41.1C61.1,52.8,50.3,63,37.3,70.3C24.3,77.5,9.1,81.8,-5.5,82.8C-20.1,83.7,-34.2,81.4,-47.1,74.3C-60,67.3,-71.7,55.5,-80.1,41.5C-88.5,27.4,-93.6,11.2,-91.3,-3.9C-89,-19,-79.3,-33,-68.1,-44.6C-56.9,-56.2,-44.2,-65.4,-30.7,-71.6C-17.2,-77.7,-3,-80.8,11.5,-82.3C26,-83.8,40,-83.7,45,-76.3Z" transform="translate(100 100)" fill="#FF4500" />
           </svg>
        </div>
        
        <div className="space-y-4 max-w-4xl">
          <Badge className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs px-4 py-1.5 sketch-border rounded-none">
            AI Cofounder Report
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-handdrawn text-slate-900 leading-[1.1]">
            Strategy for <span className="text-brand-orange relative whitespace-nowrap">
              {activeBusiness.business_name}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mt-4 leading-relaxed">
            {activeBusiness.project_brief || `Deep market and product analysis for ${activeBusiness.category}.`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full justify-between mt-4">
           <div className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <Calendar className="w-4 h-4" />
             {latestReport ? new Date(latestReport.created_at).toLocaleDateString() : 'Draft Mode'}
           </div>
           <Button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="sketch-border bg-white text-slate-900 hover:bg-slate-50 px-8 h-12 font-bold minimal-shadow transition-transform active:translate-y-1 active:shadow-none text-base"
          >
            {reports?.length > 0 ? "↻ Redraw Strategy" : "Generate Strategy"}
          </Button>
        </div>
      </header>

      {reportsLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
        </div>
      ) : !latestReport ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
           <div className="sketch-border p-4 bg-slate-50 transform rotate-3">
             <Search className="h-10 w-10 text-slate-400" />
           </div>
           <div className="space-y-2">
             <p className="text-slate-900 font-handdrawn text-3xl">Blank Canvas</p>
             <p className="text-base text-slate-500 font-medium">Click generate above to map out your product.</p>
           </div>
        </div>
      ) : (
        <div className="space-y-24">
          
          {/* SECTION 1: THE PLAN (Executive) */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-handdrawn text-slate-900">The Core Idea</h2>
              <div className="h-0.5 bg-slate-900 flex-1 opacity-10 rounded-full" />
            </div>
            
            <div className="sketch-border p-6 md:p-10 bg-[#fffdfa] minimal-shadow">
              <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-medium">
                {data?.product_overview?.what_it_is || data?.marketing_strategy?.executive_summary || "Comprehensive AI-generated growth strategy."}
              </p>
              
              {data?.product_overview?.core_promise && (
                <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Core Promise</p>
                  <p className="text-lg font-bold text-brand-orange">"{data.product_overview.core_promise}"</p>
                </div>
              )}
            </div>

            {/* Clean Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Confidence</p>
                <p className="text-4xl font-handdrawn text-slate-900">{data?.report_meta?.confidence_score || '85'}%</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Market (SAM)</p>
                <p className="text-4xl font-handdrawn text-slate-900 truncate">{data?.market_scope?.sam?.value || 'High'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Timing</p>
                <p className="text-4xl font-handdrawn text-slate-900">{data?.market_scope?.timing_score?.verdict || 'Good'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Category</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{data?.product_overview?.product_category || 'SaaS'}</p>
              </div>
            </div>
          </section>

          {/* SECTION 2: WHO IT'S FOR */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-handdrawn text-slate-900">Who & Why</h2>
              <div className="h-0.5 bg-slate-900 flex-1 opacity-10 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Personas */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Target Personas
                </h3>
                <div className="space-y-6">
                  {data?.product_overview?.target_personas?.map((p: any, i: number) => (
                    <div key={i} className="sketch-border p-6 bg-white relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-orange text-white font-handdrawn text-xl flex items-center justify-center rounded-full sketch-border">
                        {i+1}
                      </div>
                      <h4 className="font-bold text-xl text-slate-900 mb-2">{p.persona_name}</h4>
                      <p className="text-slate-600 font-medium mb-4 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-sm text-xs font-bold">
                          Pain: {p.pain_level}/10
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-sm text-xs font-bold border border-emerald-200">
                          Willing to pay: {p.willingness_to_pay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pain Points */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Real Pain Points
                </h3>
                <ul className="space-y-4">
                  {data?.product_overview?.real_pain_points?.map((pp: string, idx: number) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 shrink-0 bg-rose-100 text-rose-600 rounded flex items-center justify-center font-bold mt-0.5 border border-rose-200">!</div>
                      <span className="text-lg text-slate-800 font-medium leading-relaxed">{pp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRODUCT BUILD */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-handdrawn text-slate-900">The Build</h2>
              <div className="h-0.5 bg-slate-900 flex-1 opacity-10 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PRD & Features */}
              <div className="lg:col-span-2 space-y-8">
                <div className="sketch-border p-6 md:p-8 bg-slate-900 text-white minimal-shadow">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">PRD Summary</h3>
                  <p className="text-lg leading-relaxed font-medium text-slate-200">
                    {data?.product_management?.prd_summary || "Build a focused, high-performance tool."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Core MVP Features
                  </h3>
                  <div className="space-y-4">
                    {data?.product_management?.core_features?.map((feat: any, i: number) => (
                      <div key={i} className="flex gap-4 items-start border-b-2 border-dashed border-slate-100 pb-4 last:border-0">
                        <CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                            {feat.name}
                            <span className={cn(
                              "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold",
                              feat.priority?.toLowerCase() === 'high' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                            )}>{feat.priority}</span>
                          </h4>
                          <p className="text-slate-600 font-medium mt-1">{feat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stack & Tasks */}
              <div className="space-y-8">
                <div className="sketch-border p-6 bg-blue-50/50 border-blue-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Recommended Stack</h3>
                  <div className="space-y-4">
                    {data?.engineering?.tech_stack_suggestions?.map((stack: any, i: number) => (
                      <div key={i}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stack.layer}</p>
                        <p className="font-black text-slate-900 text-lg">{stack.technology}</p>
                        <p className="text-sm text-slate-600 mt-1">{stack.why}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">First 3 Tasks</h3>
                  <ul className="space-y-3">
                    {data?.engineering?.initial_tasks?.slice(0,3).map((task: any, i: number) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="font-bold text-brand-orange">{(i+1).toString().padStart(2, '0')}</span>
                        <span className="text-slate-700 font-medium">{task.task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Prompts block */}
            <div className="mt-8">
              <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI Scaffold Prompts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['cursor', 'v0'].map((editor) => {
                  const prompt = data?.engineering?.ai_coding_prompts?.[`${editor}_prompt`];
                  if (!prompt) return null;
                  return (
                    <div key={editor} className="sketch-border bg-slate-50 flex flex-col">
                      <div className="flex justify-between items-center p-3 border-b-2 border-slate-900 bg-white rounded-t-[14px]">
                        <span className="font-bold text-xs uppercase tracking-widest">{editor} Prompt</span>
                        <button onClick={() => { navigator.clipboard.writeText(prompt); toast.success('Copied!'); }} className="text-xs font-bold text-brand-orange hover:underline">COPY</button>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-48 text-sm font-mono text-slate-700">
                        {prompt}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* SECTION 4: GTM & VALIDATION */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-handdrawn text-slate-900">Go-To-Market</h2>
              <div className="h-0.5 bg-slate-900 flex-1 opacity-10 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Wireframe */}
              <div className="sketch-border p-6 md:p-10 bg-white minimal-shadow flex flex-col justify-center text-center">
                <div className="inline-block mx-auto border-2 border-slate-900 px-3 py-1 text-xs font-bold mb-8 transform -rotate-2">LANDING PAGE WIREFRAME</div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{data?.validation_and_marketing?.landing_page_copy?.hero_headline || "Headline"}</h1>
                <p className="text-lg text-slate-600 font-medium mb-8 max-w-md mx-auto">{data?.validation_and_marketing?.landing_page_copy?.hero_subheadline || "Subheadline"}</p>
                <div className="inline-block mx-auto sketch-border bg-slate-900 text-white font-bold px-8 py-3 transform rotate-1">
                  {data?.validation_and_marketing?.landing_page_copy?.cta_button || "CTA Button"}
                </div>
              </div>

              {/* Strategies */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pricing</h3>
                  <p className="text-slate-800 font-medium leading-relaxed">{data?.validation_and_marketing?.pricing_strategy || "Start with a simple freemium model."}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><Rocket className="w-4 h-4" /> Launch</h3>
                  <p className="text-slate-800 font-medium leading-relaxed">{data?.validation_and_marketing?.launch_strategy || "Launch on Product Hunt and relevant subreddits."}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Surveys</h3>
                  <ul className="space-y-3">
                    {data?.validation_and_marketing?.validation_surveys?.map((q: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                        <span className="font-handdrawn text-xl text-brand-orange">{i+1}.</span>
                        <span className="mt-1">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: COMPETITORS (Clean List) */}
          {data?.competitor_analysis?.direct_competitors && data.competitor_analysis.direct_competitors.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-handdrawn text-slate-900">Competitors</h2>
                <div className="h-0.5 bg-slate-900 flex-1 opacity-10 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.competitor_analysis.direct_competitors.map((c: any, i: number) => (
                  <div key={i} className="border-b-2 border-slate-200 pb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{c.name}</h3>
                    <p className="text-sm text-slate-600 font-medium mb-4">{c.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Strengths</p>
                        <ul className="space-y-1">
                          {c.strengths?.slice(0,2).map((s: string, idx: number) => <li key={idx} className="text-xs font-medium text-slate-700">• {s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2">Weaknesses</p>
                        <ul className="space-y-1">
                          {c.weaknesses?.slice(0,2).map((w: string, idx: number) => <li key={idx} className="text-xs font-medium text-slate-700">• {w}</li>)}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-1">Your Edge</p>
                      <p className="text-sm text-amber-900 font-medium leading-relaxed">{c.your_advantage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 6: REDDIT SIGNAL STREAM (Minimalist Cards) */}
          <section className="space-y-8 pt-12">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 <MessageSquare className="h-6 w-6 text-brand-orange" /> Live Signals
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities?.slice(0, 6).map((opt: any, i: number) => {
                const redditUrl = opt.url || `https://reddit.com/search/?q=${encodeURIComponent(opt.title)}`
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.1 }}
                    className="sketch-border bg-white p-5 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_#FF4500] transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange">{opt.intent_type || 'Discussion'}</span>
                        <span className="text-xs font-bold text-slate-400">Score: {opt.opportunity_score}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 line-clamp-2">{opt.title}</h4>
                      <p className="text-sm text-slate-600 font-medium italic line-clamp-3 mb-4">"{opt.ai_summary}"</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-100">
                      <span className="text-xs font-bold text-slate-500">r/{opt.subreddit || 'all'}</span>
                      <a href={redditUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                        View Post <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>

        </div>
      )}
    </div>
  )
}

function AILoadingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = [
    "Sketching out product ideas...",
    "Defining target personas...",
    "Drafting the PRD...",
    "Writing code generation prompts...",
    "Formulating launch strategy..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="fixed inset-0 bg-[#fdfbf7]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-5 animate-in fade-in duration-500">
      <div className="max-w-md w-full sketch-border bg-white p-12 text-center space-y-8 minimal-shadow transform rotate-1">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        </div>
        <div>
          <h2 className="text-3xl font-handdrawn text-slate-900 mb-4">AI Cofounder is thinking...</h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            {messages[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}
