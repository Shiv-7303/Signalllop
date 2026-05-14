'use client'

import { useBusinesses } from '@/hooks/useBusinesses'
import { useBusinessStore } from '@/store/businessStore'
import { useUIStore } from '@/store/uiStore'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { 
  Rocket, Search, Target, AlertCircle, 
  Users, CheckCircle2, MessageSquare, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { isLoading: bizLoading, data: businesses } = useBusinesses()
  const { activeBusiness } = useBusinessStore()
  const { openUpgradeModal } = useUIStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    if (!bizLoading && (!businesses || businesses.length === 0)) {
      router.push('/onboarding')
    }
  }, [bizLoading, businesses, router])

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['reports', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/reports/?business_id=${activeBusiness?.id}`)
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-slate-900" />
    </div>
  )

  if (!businesses || businesses.length === 0) {
    // If no businesses, they should be redirected by the useEffect.
    // We show a loading state here to prevent flashing the empty state.
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-brand-orange mx-auto" />
        <p className="text-slate-500 font-bold text-sm animate-pulse">Redirecting to onboarding...</p>
      </div>
    )
  }

  if (!activeBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-slate-900" />
      </div>
    )
  }

  const latestReport = reports?.[0]
  const data = latestReport?.report_data

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-32">
      {generateMutation.isPending && <AILoadingOverlay />}

      {reportsLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-slate-900" />
        </div>
      ) : !latestReport ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
           <div className="sketch-border p-4 bg-highlight-yellow shadow-[4px_4px_0px_#1a1a2e] transform rotate-3">
             <Search className="h-12 w-12 text-slate-900" />
           </div>
           <div className="space-y-2">
             <p className="text-slate-900 font-handdrawn text-4xl">Blank Canvas</p>
             <p className="text-sm text-slate-600 font-bold">Generate your first strategy report to get started.</p>
           </div>
           <Button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="sketch-border bg-slate-900 text-white hover:bg-brand-orange px-8 h-12 font-bold shadow-[2px_2px_0px_#1a1a2e] transition-transform active:translate-y-1 active:shadow-none text-base"
          >
            Generate Strategy
          </Button>
        </div>
      ) : (
        <>
          {/* ROW 1 — GROWTH SCORE */}
          <div className="sketch-border p-8 bg-white shadow-[4px_4px_0px_#1a1a2e] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="absolute top-0 right-0 -z-10 opacity-10">
               <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <path d="M45,-76.3C57.9,-69.3,67.6,-54.6,75.9,-40.1C84.3,-25.6,91.3,-11.3,90.4,2.5C89.5,16.2,80.7,29.4,70.9,41.1C61.1,52.8,50.3,63,37.3,70.3C24.3,77.5,9.1,81.8,-5.5,82.8C-20.1,83.7,-34.2,81.4,-47.1,74.3C-60,67.3,-71.7,55.5,-80.1,41.5C-88.5,27.4,-93.6,11.2,-91.3,-3.9C-89,-19,-79.3,-33,-68.1,-44.6C-56.9,-56.2,-44.2,-65.4,-30.7,-71.6C-17.2,-77.7,-3,-80.8,11.5,-82.3C26,-83.8,40,-83.7,45,-76.3Z" transform="translate(100 100)" fill="#FF4500" />
               </svg>
            </div>
            
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-handdrawn text-slate-900">Your Growth Opportunity Score</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm font-bold text-slate-700">
                  <span className="text-lg">✅</span> Strong Reddit demand detected
                </li>
                <li className="flex gap-3 text-sm font-bold text-slate-700">
                  <span className="text-lg">✅</span> Competitor gap identified
                </li>
                <li className="flex gap-3 text-sm font-bold text-slate-700">
                  <span className="text-lg">⚡</span> 2 high-priority opportunities waiting
                </li>
              </ul>
            </div>

            <div className="shrink-0 flex flex-col items-center">
               <div className="h-32 w-32 rounded-full sketch-border border-brand-orange border-4 flex items-center justify-center bg-white shadow-[4px_4px_0px_#f97316] transform rotate-2">
                 <span className="text-5xl font-handdrawn text-slate-900">{data?.report_meta?.confidence_score || '78'}<span className="text-xl text-slate-500">/100</span></span>
               </div>
            </div>
          </div>

          {/* ROW 2 — 3 STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e] md:transform md:-rotate-1 flex flex-col items-center text-center hover:-translate-y-1 hover:rotate-0 transition-transform">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pain Points Found</span>
              <span className="text-5xl font-handdrawn text-brand-orange mb-2">{data?.product_overview?.real_pain_points?.length || '5'}</span>
              <div className="h-0.5 w-12 bg-slate-200 mb-2" />
              <span className="text-xs font-bold text-slate-400">this week</span>
            </div>
            
            <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e] md:transform md:rotate-1 flex flex-col items-center text-center hover:-translate-y-1 hover:rotate-0 transition-transform">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Demand Signal</span>
              <span className="text-4xl font-handdrawn text-emerald-600 mb-2 mt-2">{data?.market_scope?.timing_score?.verdict || 'HIGH'}</span>
              <div className="h-0.5 w-12 bg-slate-200 mb-2 mt-1" />
              <span className="text-xs font-bold text-slate-400">strong ✅</span>
            </div>

            <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e] md:transform md:-rotate-1 flex flex-col items-center text-center hover:-translate-y-1 hover:rotate-0 transition-transform">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Competitor Gaps</span>
              <span className="text-5xl font-handdrawn text-slate-900 mb-2">{data?.competitor_analysis?.direct_competitors?.length || '3'}</span>
              <div className="h-0.5 w-12 bg-slate-200 mb-2" />
              <span className="text-xs font-bold text-slate-400">identified</span>
            </div>
          </div>

          {/* ROW 3 — TABS */}
          <div className="w-full">
            <Tabs defaultValue="research" className="w-full">
              <TabsList className="flex gap-2 mb-[-2px] relative z-10 overflow-x-auto pb-2 px-4 hide-scrollbar justify-start w-full bg-transparent border-none p-0 h-auto">
                <TabsTrigger value="research" className="flex-none px-6 py-3 font-bold text-sm border-2 border-b-0 rounded-t-xl transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 data-[state=active]:z-10 relative shadow-none">
                  🔍 Research
                </TabsTrigger>
                <TabsTrigger value="prd" className="flex-none px-6 py-3 font-bold text-sm border-2 border-b-0 rounded-t-xl transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 data-[state=active]:z-10 relative shadow-none">
                  📋 PRD
                </TabsTrigger>
                <TabsTrigger value="marketing" className="flex-none px-6 py-3 font-bold text-sm border-2 border-b-0 rounded-t-xl transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 data-[state=active]:z-10 relative shadow-none">
                  🚀 Marketing
                </TabsTrigger>
                <TabsTrigger value="prompts" className="flex-none px-6 py-3 font-bold text-sm border-2 border-b-0 rounded-t-xl transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 data-[state=active]:z-10 relative shadow-none">
                  ⚡ Prompts
                </TabsTrigger>
              </TabsList>

              <div className="bg-white border-2 border-slate-900 rounded-xl md:rounded-tl-none p-6 md:p-8 minimal-shadow relative shadow-[8px_8px_0px_#1a1a2e] mb-12">
                {/* TAB CONTENT: RESEARCH */}
                <TabsContent value="research" className="m-0 space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Pain Points
                    </h3>
                    <ul className="space-y-4">
                      {data?.product_overview?.real_pain_points?.map((pp: string, idx: number) => (
                        <li key={idx} className="flex gap-4 items-start sketch-border p-4 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                          <div className="w-6 h-6 shrink-0 bg-brand-orange text-white rounded flex items-center justify-center font-bold mt-0.5">!</div>
                          <span className="text-sm text-slate-800 font-bold leading-relaxed">{pp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Target Personas
                    </h3>
                    <div className="space-y-4">
                      {data?.product_overview?.target_personas?.map((p: any, i: number) => (
                        <div key={i} className="sketch-border p-5 bg-white shadow-[2px_2px_0px_#1a1a2e] relative">
                          <h4 className="font-black text-lg text-slate-900 mb-1">{p.persona_name}</h4>
                          <p className="text-slate-600 font-medium text-sm mb-3">{p.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-rose-200">
                              Pain: {p.pain_level}/10
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                              WTP: {p.willingness_to_pay}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB CONTENT: PRD */}
              <TabsContent value="prd" className="space-y-8 animate-in fade-in duration-500">
                <div className="sketch-border p-6 bg-slate-900 text-white shadow-[4px_4px_0px_#f97316]">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">PRD Summary</h3>
                  <p className="text-lg leading-relaxed font-bold">
                    {data?.product_management?.prd_summary || "Build a focused, high-performance tool."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Core MVP Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.product_management?.core_features?.map((feat: any, i: number) => (
                      <div key={i} className="sketch-border p-5 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                        <h4 className="font-bold text-slate-900 text-base flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-orange" /> {feat.name}</span>
                          <span className={cn(
                            "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border",
                            feat.priority?.toLowerCase() === 'high' ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}>{feat.priority}</span>
                        </h4>
                        <p className="text-slate-600 font-medium text-sm">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB CONTENT: MARKETING */}
              <TabsContent value="marketing" className="space-y-8 animate-in fade-in duration-500">
                <div className="sketch-border p-8 bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col justify-center text-center">
                  <div className="inline-block mx-auto border-2 border-slate-900 px-3 py-1 text-xs font-bold mb-8 transform -rotate-2 bg-highlight-yellow">LANDING PAGE COPY</div>
                  <h1 className="text-4xl font-black text-slate-900 mb-4">{data?.validation_and_marketing?.landing_page_copy?.hero_headline || "Headline"}</h1>
                  <p className="text-lg text-slate-600 font-bold mb-8 max-w-lg mx-auto">{data?.validation_and_marketing?.landing_page_copy?.hero_subheadline || "Subheadline"}</p>
                  <div className="inline-block mx-auto sketch-border bg-brand-orange text-white font-bold px-8 py-3 transform rotate-1 text-sm shadow-[2px_2px_0px_#1a1a2e]">
                    {data?.validation_and_marketing?.landing_page_copy?.cta_button || "CTA Button"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Rocket className="w-4 h-4" /> Launch Strategy</h3>
                      <p className="text-slate-800 font-bold text-sm leading-relaxed">{data?.validation_and_marketing?.launch_strategy || "Launch on Product Hunt."}</p>
                   </div>
                   <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Validation Surveys</h3>
                      <ul className="space-y-3">
                        {data?.validation_and_marketing?.validation_surveys?.map((q: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700 font-bold">
                            <span className="text-brand-orange">{i+1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              </TabsContent>

              {/* TAB CONTENT: PROMPTS */}
              <TabsContent value="prompts" className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['cursor', 'v0'].map((editor) => {
                    const prompt = data?.engineering?.ai_coding_prompts?.[`${editor}_prompt`];
                    if (!prompt) return null;
                    return (
                      <div key={editor} className="sketch-border bg-slate-900 flex flex-col shadow-[4px_4px_0px_#1a1a2e]">
                        <div className="flex justify-between items-center p-4 border-b-2 border-slate-700">
                          <span className="font-bold text-xs uppercase tracking-widest text-white">{editor} Prompt</span>
                          <button onClick={() => { navigator.clipboard.writeText(prompt); toast.success('Copied!'); }} className="text-xs font-bold text-brand-orange hover:text-white transition-colors bg-white/10 px-3 py-1 rounded">COPY</button>
                        </div>
                        <div className="p-5 overflow-y-auto max-h-[400px] text-xs font-mono text-slate-300 whitespace-pre-wrap">
                          {prompt}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

          {/* ROW 4 — BEST COMMUNITIES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-handdrawn text-slate-900">Best Communities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                 <h4 className="font-bold text-xl text-slate-900 mb-2">r/SaaS</h4>
                 <div className="h-0.5 bg-slate-200 w-full mb-4" />
                 <div className="flex flex-wrap gap-4 mb-4">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-1"><Users className="w-4 h-4" /> 1.2M members</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Activity: HIGH</span>
                 </div>
                 <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Why</span>
                      <p className="text-sm font-bold text-slate-800">&quot;Founders discuss AI tools daily and share MRR growth.&quot;</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Strategy</span>
                      <ul className="text-sm font-bold text-slate-700 space-y-1">
                        <li>• Post case studies</li>
                        <li>• Reply to pain threads</li>
                      </ul>
                    </div>
                 </div>
                 <Button variant="link" className="mt-4 p-0 h-auto text-brand-orange font-bold text-sm hover:no-underline hover:text-slate-900">
                   View Opportunities →
                 </Button>
              </div>

              <div className="sketch-border p-6 bg-white shadow-[2px_2px_0px_#1a1a2e]">
                 <h4 className="font-bold text-xl text-slate-900 mb-2">r/indiehackers</h4>
                 <div className="h-0.5 bg-slate-200 w-full mb-4" />
                 <div className="flex flex-wrap gap-4 mb-4">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-1"><Users className="w-4 h-4" /> 400K members</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Activity: HIGH</span>
                 </div>
                 <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Why</span>
                      <p className="text-sm font-bold text-slate-800">&quot;Bootstrapped founders looking for edge over competitors.&quot;</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Strategy</span>
                      <ul className="text-sm font-bold text-slate-700 space-y-1">
                        <li>• Milestone posts</li>
                        <li>• Show don't tell</li>
                      </ul>
                    </div>
                 </div>
                 <Button variant="link" className="mt-4 p-0 h-auto text-brand-orange font-bold text-sm hover:no-underline hover:text-slate-900">
                   View Opportunities →
                 </Button>
              </div>

            </div>
          </div>

        </>
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
      <div className="max-w-md w-full sketch-border bg-white p-12 text-center space-y-8 shadow-[4px_4px_0px_#1a1a2e] transform rotate-1">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 border-t-brand-orange rounded-full animate-spin" />
        </div>
        <div>
          <h2 className="text-3xl font-handdrawn text-slate-900 mb-4">AI Cofounder is thinking...</h2>
          <p className="text-sm text-brand-orange font-bold uppercase tracking-widest animate-pulse">
            {messages[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}
