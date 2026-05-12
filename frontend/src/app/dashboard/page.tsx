'use client'

import { useBusinesses } from '@/hooks/useBusinesses'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, TrendingUp, Users, Target, Search, BarChart3, 
  CheckCircle2, ChevronRight, Zap, Lightbulb, MapPin, 
  MessageSquare, Calendar, 
  Loader2, AlertCircle, PlayCircle, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { isLoading: bizLoading } = useBusinesses()
  const { activeBusiness } = useBusinessStore()
  const { usage } = useUserStore()
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

  const generateMutation = useMutation({
    mutationFn: async () => {
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
      toast.error(err.response?.data?.error || 'Generation failed')
    }
  })

  if (bizLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-6 w-6 text-brand-orange animate-spin" />
    </div>
  )

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-16 h-16 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center border border-brand-orange/20">
          <Rocket className="h-8 w-8 text-brand-orange" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No active business</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">Set up your first business profile to unlock growth intelligence.</p>
        </div>
        <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 h-10 font-bold shadow-md shadow-brand-orange/20">
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>
    )
  }

  const latestReport = reports?.[0]
  const data = latestReport?.report_data

  return (
    <div className="space-y-8 pb-32">
      {generateMutation.isPending && <AILoadingOverlay />}

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 hover:bg-brand-orange/20 font-bold uppercase tracking-widest text-[10px] px-3 py-1">
              Intelligence Report
            </Badge>
            {latestReport && (
              <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(latestReport.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Growth Strategy for <span className="text-brand-orange">{activeBusiness.business_name}</span>
          </h1>
          <p className="text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
            {activeBusiness.goal || `Deep market analysis for ${activeBusiness.category} targeting Reddit and AI search.`}
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0 mt-4 md:mt-0">
          <Button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl px-6 h-10 font-bold shadow-md shadow-brand-orange/20 transition-all active:scale-95"
          >
            {reports?.length > 0 ? "Regenerate Analysis" : "Generate Intelligence"}
          </Button>
        </div>
      </header>

      {reportsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-orange animate-spin" />
        </div>
      ) : !latestReport ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
           <div className="w-16 h-16 bg-slate-50 flex items-center justify-center text-slate-400 rounded-2xl border border-slate-100 shadow-inner">
             <Search className="h-8 w-8" />
           </div>
           <div className="space-y-2">
             <p className="text-slate-900 font-bold text-xl tracking-tight">No intelligence report found</p>
             <p className="text-sm text-slate-500 font-medium">Click generate above to begin the market analysis.</p>
           </div>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* SECTION 1: OVERVIEW BENTO GRID */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <TrendingUp className="h-5 w-5 text-brand-orange" /> Executive Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Main Summary Card */}
              <Card className="md:col-span-4 bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <p className="text-xl text-slate-800 leading-relaxed font-medium">
                    {data?.marketing_strategy?.executive_summary || data?.product_overview?.summary || "Comprehensive AI-generated growth strategy based on market signals and competitor gaps."}
                  </p>
                </CardContent>
              </Card>

              {/* 4 Key Metrics */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Opportunity Score</p>
                  <p className="text-4xl font-black text-emerald-500 tracking-tighter">{data?.report_meta?.confidence_score || '85'}<span className="text-xl text-emerald-200">/100</span></p>
                  <p className="text-xs font-medium text-slate-600 mt-2">High potential timing</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Target Subreddits</p>
                  <p className="text-4xl font-black text-brand-orange tracking-tighter">{data?.reddit_marketing_intelligence?.top_subreddits?.length || 0}</p>
                  <p className="text-xs font-medium text-slate-600 mt-2">Highly active communities</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Serviceable Market</p>
                  <p className="text-3xl font-black text-indigo-600 tracking-tighter truncate">{data?.market_scope?.sam?.value || 'High'}</p>
                  <p className="text-xs font-medium text-slate-600 mt-2">SAM Estimate</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Competitive Gap</p>
                  <p className="text-3xl font-black text-amber-500 tracking-tighter">High</p>
                  <p className="text-xs font-medium text-slate-600 mt-2">Unserved niche identified</p>
                </CardContent>
              </Card>

              {/* Personas */}
              <Card className="md:col-span-4 bg-slate-900 border-slate-800 shadow-lg rounded-3xl text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
                <CardHeader className="p-6 md:p-8 pb-0 z-10 relative">
                  <CardTitle className="text-xl font-extrabold flex items-center gap-3">
                    <Target className="h-5 w-5 text-brand-orange" /> Target Personas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 z-10 relative grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl backdrop-blur-sm">
                      <p className="font-bold text-base text-white mb-3">Target Persona {i}</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                            <span>Pain Level</span>
                            <span className="text-white">{10 - i}/10</span>
                          </div>
                          <Progress value={(10-i)*10} className="h-1.5 bg-slate-700 [&>div]:bg-brand-orange" />
                        </div>
                        <p className="text-xs text-slate-300 font-medium pt-1.5">Highly motivated buyer looking for distribution channels.</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SECTION 2: MARKETS */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" /> Market Opportunity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-5">
                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 font-bold px-3 py-1 mb-4">TAM</Badge>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{data?.market_scope?.tam?.value || 'N/A'}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Total Addressable Market</p>
                  </div>
                  <div className="mt-auto pt-5 border-t border-slate-100">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{data?.market_scope?.tam?.reasoning || 'Broad market calculation based on category.'}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-5">
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 font-bold px-3 py-1 mb-4">SAM</Badge>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{data?.market_scope?.sam?.value || 'N/A'}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Serviceable Available Market</p>
                  </div>
                  <div className="mt-auto pt-5 border-t border-slate-100">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{data?.market_scope?.sam?.reasoning || 'Realistic slice for your specific offering.'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-5">
                    <Badge className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 font-bold px-3 py-1 mb-4">SOM</Badge>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{data?.market_scope?.som?.value || 'N/A'}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Share of Market (Year 1)</p>
                  </div>
                  <div className="mt-auto pt-5 border-t border-slate-100">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{data?.market_scope?.som?.reasoning || 'Achievable target within 12-18 months.'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {data?.bonus_insights?.india_growth_hacks && Array.isArray(data.bonus_insights.india_growth_hacks) && (
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-sm rounded-3xl">
                <CardContent className="p-6 md:p-8">
                  <h4 className="text-lg font-bold text-emerald-900 mb-5 flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Regional Opportunities (India Focus)
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.bonus_insights.india_growth_hacks.map((hack: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start bg-white/60 p-4 rounded-2xl border border-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-sm text-emerald-900 font-medium leading-relaxed">{hack}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </section>

          {/* SECTION 3: COMPETITORS */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <Users className="h-5 w-5 text-rose-500" /> Competitor Matrix
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {data?.competitor_analysis?.direct_competitors?.map((c: any, i: number) => (
                <Card key={i} className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{c.name}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-1">{c.description || 'Direct competitor in your space.'}</p>
                    </div>
                    <Badge className="bg-rose-100 text-rose-700 border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1 shrink-0">High Threat</Badge>
                  </div>
                  
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                           <CheckCircle2 className="h-4 w-4" /> Their Strengths
                        </p>
                        <ul className="space-y-2.5">
                          {c.strengths?.map((s: string, idx: number) => (
                            <li key={idx} className="flex gap-2 items-start text-sm text-slate-700 font-medium">
                              <span className="text-emerald-500 font-bold mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">
                           <AlertCircle className="h-4 w-4" /> Exploitable Weaknesses
                        </p>
                        <ul className="space-y-2.5">
                          {c.weaknesses?.map((w: string, idx: number) => (
                            <li key={idx} className="flex gap-2 items-start text-sm text-slate-700 font-medium">
                              <span className="text-rose-500 font-bold mt-0.5">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-brand-orange/5 p-4 rounded-2xl border border-brand-orange/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2 flex items-center gap-2">
                         <Zap className="h-4 w-4" /> Your Advantage Over Them
                      </p>
                      <p className="text-sm text-slate-900 font-bold leading-relaxed">{c.your_advantage || "Focus on building a niche-specific, faster alternative."}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!data?.competitor_analysis?.direct_competitors || data.competitor_analysis.direct_competitors.length === 0) && (
                <Card className="col-span-full bg-slate-50 border-slate-200 border-dashed shadow-none rounded-3xl">
                  <CardContent className="p-10 text-center">
                    <p className="text-slate-500 font-medium text-sm">No specific competitor data generated.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* SECTION 4: REDDIT */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <MessageSquare className="h-5 w-5 text-[#FF4500]" /> Reddit Intelligence
            </h2>
            
            <Card className="bg-gradient-to-br from-[#FF4500] to-orange-600 border-none shadow-lg shadow-brand-orange/20 rounded-3xl text-white">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-5 items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold tracking-tight">Why Reddit is Your Distribution Channel</h3>
                  <p className="text-orange-50 leading-relaxed font-medium text-base">
                    {data?.reddit_marketing_intelligence?.reddit_strategy_overview || "Reddit communities are where your customers actively discuss their pain points unprompted. It's the highest intent channel."}
                  </p>
                </div>
                <div className="flex gap-4 shrink-0 bg-black/20 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="text-center">
                    <p className="text-3xl font-black">{data?.reddit_marketing_intelligence?.top_subreddits?.length || 0}</p>
                    <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest mt-1">Target Hubs</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl font-black">High</p>
                    <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest mt-1">Intent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {data?.reddit_marketing_intelligence?.top_subreddits?.map((sub: any, i: number) => (
                <Card key={i} className="bg-white border-slate-200 shadow-sm rounded-3xl hover:shadow-md hover:border-[#FF4500]/30 transition-all overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">r/{sub.subreddit.replace('r/', '')}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{sub.members} members</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1.5 rounded-xl border border-emerald-100 text-[10px] flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" /> {sub.opportunity_score}/100
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
                      <p className="text-sm text-slate-700 font-medium italic leading-relaxed">"{sub.why_relevant}"</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1.5 flex items-center gap-1.5"><Lightbulb className="h-3 w-3" /> Content Angle</p>
                        <p className="text-sm text-slate-800 font-medium">{sub.content_angle}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1.5 flex items-center gap-1.5"><AlertCircle className="h-3 w-3" /> Things to Avoid</p>
                        <p className="text-sm text-slate-800 font-medium">{sub.things_to_avoid}</p>
                      </div>
                      <div className="bg-[#FF4500]/5 p-3 rounded-xl border border-[#FF4500]/10 inline-block w-full">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500] mb-1">Best Time to Post</p>
                        <p className="text-sm text-slate-900 font-bold">{sub.best_time_to_post}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* SECTION 5: DISCOVERABILITY */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <Search className="h-5 w-5 text-blue-500" /> Discoverability Audit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* SEO */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="p-6 pb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">Traditional SEO</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-3">
                    {data?.seo_aeo_geo_audit?.seo_recommendations?.map((r: string, i: number) => (
                      <li key={i} className="flex gap-2.5 text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    )) || <li className="text-sm text-slate-500">No data available</li>}
                  </ul>
                </CardContent>
              </Card>

              {/* AEO */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="p-6 pb-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">AEO (AI Search)</CardTitle>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">ChatGPT & Perplexity</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-3">
                    {data?.seo_aeo_geo_audit?.aeo_recommendations?.map((r: string, i: number) => (
                      <li key={i} className="flex gap-2.5 text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    )) || <li className="text-sm text-slate-500">No data available</li>}
                  </ul>
                </CardContent>
              </Card>

              {/* GEO */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="p-6 pb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">GEO</CardTitle>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Generative Results</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-3">
                    {data?.seo_aeo_geo_audit?.geo_recommendations?.map((r: string, i: number) => (
                      <li key={i} className="flex gap-2.5 text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    )) || <li className="text-sm text-slate-500">No data available</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SECTION 6: CONTENT PLAYBOOK */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <PlayCircle className="h-5 w-5 text-amber-500" /> Content Playbook
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="p-6 pb-4 border-b border-slate-100">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                     <Lightbulb className="h-4 w-4 text-amber-500" /> Viral Hook Formulas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {data?.content_playbook?.viral_hook_formulas?.map((hook: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors group">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-brand-orange mb-2">{hook.formula_name || `Formula ${i+1}`}</p>
                      <p className="text-sm font-black text-slate-900 mb-3 leading-snug group-hover:text-brand-orange transition-colors">"{hook.pattern || hook.example || hook}"</p>
                      {hook.why_it_works && (
                        <div className="flex gap-2 items-start text-xs text-slate-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <p>{hook.why_it_works}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!data?.content_playbook?.viral_hook_formulas || data.content_playbook.viral_hook_formulas.length === 0) && <p className="text-sm text-slate-500">No hook formulas generated.</p>}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="p-6 pb-4 border-b border-slate-100">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-indigo-500" /> Content Calendar (Week 1)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {data?.content_playbook?.content_calendar_week_1?.map((cal: any, i: number) => (
                      <div key={i} className="p-5 md:p-6 flex flex-col sm:flex-row gap-4 hover:bg-slate-50 transition-colors">
                        <div className="w-20 shrink-0">
                          <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-xl inline-block text-center border border-indigo-100">
                            {cal.day}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">{cal.topic}</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-bold text-[9px] uppercase tracking-wider">{cal.post_type}</Badge>
                            <Badge className="bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 border-none font-bold text-[9px] uppercase tracking-wider">r/{cal.subreddit?.replace('r/', '')}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!data?.content_playbook?.content_calendar_week_1 || data.content_playbook.content_calendar_week_1.length === 0) && <p className="p-6 text-sm text-slate-500">No calendar data generated.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SECTION 7: ACTION PLAN */}
          <section className="space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 px-2">
              <Zap className="h-5 w-5 text-emerald-500" /> 30-Day Action Plan
            </h2>
            <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-0 divide-y divide-slate-100">
                {data?.bonus_insights?.quick_wins_next_30_days?.map((action: any, i: number) => (
                  <div key={i} className="p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start hover:bg-slate-50 transition-colors group">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-md group-hover:bg-brand-orange transition-colors">
                      {i + 1}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold uppercase tracking-widest text-[9px]">High Priority</Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Effort: {action.effort_hours || '?'} hrs
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{action.action}</h4>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 mt-3 inline-block shadow-sm group-hover:border-brand-orange/30 transition-colors">
                        <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-brand-orange" />
                          <span className="font-bold text-slate-900">Expected Outcome:</span> {action.expected_outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.bonus_insights?.quick_wins_next_30_days || data.bonus_insights.quick_wins_next_30_days.length === 0) && (
                  <p className="text-center p-10 text-slate-500 font-medium text-sm">No actions generated.</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* SECTION 8: SIGNAL STREAM */}
          <section className="space-y-5 pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2 mb-2">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  <Target className="h-5 w-5 text-brand-orange" /> Signal Stream
                </h2>
                <p className="text-xs text-slate-500 font-medium">Real-time buying signals extracted from the Reddit ecosystem.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities?.slice(0, 6).map((opt: any, i: number) => {
                const redditUrl = opt.url || `https://reddit.com/search/?q=${encodeURIComponent(opt.title)}`
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.1 }}
                  >
                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md rounded-3xl h-full flex flex-col hover:border-brand-orange/40 transition-all cursor-pointer group">
                      <CardHeader className="p-6 pb-3 space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge className={cn(
                            "text-[9px] uppercase px-2 py-0.5 rounded-lg font-bold tracking-widest border-none",
                            opt.intent_type?.toLowerCase() === 'buying' ? "bg-emerald-100 text-emerald-700" :
                            opt.intent_type?.toLowerCase() === 'pain_point' ? "bg-rose-100 text-rose-700" :
                            "bg-brand-orange/10 text-brand-orange"
                          )}>
                            {opt.intent_type || 'Discussion'}
                          </Badge>
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-600 shadow-sm">
                             <Sparkles className="h-3 w-3 text-amber-500" /> Score: {opt.opportunity_score}
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-3">{opt.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 p-6 pt-0 flex flex-col justify-between">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5">
                          <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-medium italic">
                            "{opt.ai_summary}"
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">r/{opt.subreddit || 'all'}</span>
                          <Button asChild variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-brand-orange hover:text-white bg-brand-orange/5 hover:bg-brand-orange rounded-lg transition-all">
                            <a href={redditUrl} target="_blank" rel="noopener noreferrer">Act Now <ChevronRight className="h-3 w-3 ml-1" /></a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
              {!opportunities && [1, 2, 3].map(i => <div key={i} className="h-64 bg-white border border-slate-100 rounded-3xl shadow-sm animate-pulse" />)}
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
    "Expanding search keywords...",
    "Deep-diving into niche subreddits...",
    "Scraping latest discussions...",
    "Filtering for buying signals...",
    "Analyzing competitor sentiment...",
    "Drafting your growth strategy..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-5 animate-in fade-in duration-500">
      <div className="max-w-sm w-full bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-10 text-center space-y-6">
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-slate-100 border-t-brand-orange rounded-full animate-spin" />
          <Rocket className="h-6 w-6 text-brand-orange animate-bounce" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Analyzing Market Data</h2>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl py-2 px-3 shadow-inner">
            <p className="text-xs text-brand-orange font-bold uppercase tracking-widest animate-pulse">
              {messages[messageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}