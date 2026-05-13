'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Share2, RefreshCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'

export default function ReportDetailPage() {
  const params = useParams()
  const reportId = params.id as string
  const [currentDate, setCurrentDate] = useState<number | null>(null)

  useEffect(() => {
    setCurrentDate(Date.now())
  }, [])

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: async () => {
      if (reportId === 'latest') {
        // Fallback or demo handling
        return null;
      }
      const resp = await api.get(`/reports/${reportId}`)
      return resp.data
    },
    enabled: !!reportId && reportId !== 'latest'
  })

  // Mock data for display if API fails or is loading 'latest'
  const mockReportData = {
    report_meta: { confidence_score: 78, market_verdict: 'STRONG' },
    product_overview: {
      real_pain_points: [
        { text: "Manual monitoring = 2-3 hrs/day", evidence: "\"I spend my mornings ctrl+F-ing Reddit...\" — r/SaaS (143 upvotes)", severity: "HIGH" },
        { text: "Alert fatigue from F5bot", evidence: "\"50 alerts a day, none useful\"", severity: "HIGH" },
        { text: "Always late to the thread", evidence: "8 threads, timing complaints", severity: "MEDIUM" }
      ]
    }
  }

  const data = report?.report_data || mockReportData

  if (isLoading && reportId !== 'latest') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        <Skeleton className="h-40 w-full sketch-border bg-slate-100" />
        <Skeleton className="h-64 w-full sketch-border bg-slate-100" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      
      <Link href="/dashboard/reports" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
      </Link>

      {/* TOP HEADER CARD */}
      <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          📋 SignalLoop — Growth Intelligence Report
        </h1>
        <p className="text-sm font-bold text-slate-500 mb-6">Generated: {new Date(report?.created_at || currentDate || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="h-0.5 bg-slate-200 w-full mb-6" />

        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Overall Score:</span>
            <span className="text-2xl font-handdrawn text-brand-orange">{data.report_meta?.confidence_score}/100</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Market:</span>
            <span className="text-xl font-handdrawn text-emerald-600">{data.report_meta?.market_verdict || 'STRONG'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-10 font-bold text-sm hover:bg-slate-50">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-10 font-bold text-sm hover:bg-slate-50">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button variant="outline" className="sketch-border-sm bg-white text-slate-700 h-10 font-bold text-sm hover:bg-slate-50 ml-auto">
            <RefreshCcw className="h-4 w-4 mr-2" /> Regenerate
          </Button>
        </div>
      </div>

      {/* NOTEBOOK TABS */}
      <Tabs defaultValue="research" className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-[-2px] relative z-10 justify-start w-full bg-transparent border-none p-0 h-auto">
          {[
            { id: 'research', label: '📊 Research' },
            { id: 'prd', label: '📋 PRD' },
            { id: 'roadmap', label: '🗺️ Roadmap' },
            { id: 'marketing', label: '🚀 Marketing' },
            { id: 'stack', label: '🛠️ Stack' },
            { id: 'prompts', label: '⚡ Prompts' },
            { id: 'validation', label: '✅ Validation' },
          ].map(tab => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="px-6 py-3 font-bold text-sm border-2 border-b-0 rounded-t-xl transition-colors data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 data-[state=active]:z-10 relative shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="sketch-border bg-[#fdfcf8] shadow-[4px_4px_0px_#1a1a2e] relative overflow-hidden min-h-[500px]">
          {/* NOTEBOOK PAPER STYLING */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', backgroundSize: '100% 32px', backgroundPosition: '0 8px' }} />
          <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-rose-400/50 z-0" />
          <div className="absolute top-0 bottom-0 left-14 w-0.5 bg-rose-400/50 z-0" />

          {/* TAB CONTENTS */}
          <div className="relative z-10 p-8 pl-24">
            
            <TabsContent value="research" className="m-0 mt-2 focus:outline-none">
               <div className="mb-8 relative inline-block">
                 <h2 className="text-3xl font-handdrawn text-slate-900 uppercase tracking-widest relative z-10">Pain Points</h2>
                 {/* Hand-drawn underline SVG */}
                 <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                 </svg>
               </div>

               <div className="space-y-10">
                 {data.product_overview?.real_pain_points?.map((pp: { severity?: string, text?: string, evidence?: string, frequency?: string }, i: number) => (
                   <div key={i} className="font-handdrawn text-xl text-slate-800">
                     <div className="flex items-start gap-3">
                       <span className="text-2xl leading-none mt-1">
                         {pp.severity === 'HIGH' ? '🔴' : pp.severity === 'MEDIUM' ? '🟡' : '🟢'}
                       </span>
                       <div className="flex-1">
                         <p className="font-bold border-b border-slate-400 border-dashed inline-block pb-1 mb-3">{pp.text || pp}</p>
                         {pp.evidence && (
                           <div className="pl-4 space-y-2 text-lg text-slate-600">
                             <p><span className="font-bold text-slate-500">Evidence:</span> {pp.evidence}</p>
                             {pp.frequency && <p><span className="font-bold text-slate-500">Frequency:</span> {pp.frequency}</p>}
                             {pp.severity && <p><span className="font-bold text-slate-500">Severity:</span> {pp.severity}</p>}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </TabsContent>

            <TabsContent value="prd" className="m-0 mt-2 focus:outline-none">
              <div className="mb-8 relative inline-block">
                 <h2 className="text-3xl font-handdrawn text-slate-900 uppercase tracking-widest relative z-10">Product Requirements</h2>
                 <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                 </svg>
               </div>
               <div className="font-handdrawn text-xl text-slate-800 leading-relaxed max-w-2xl">
                 <p className="mb-6">This section contains the generated PRD structure based on the research.</p>
                 <p className="text-slate-500 italic">(Content will be populated from the specific report data)</p>
               </div>
            </TabsContent>

            {/* Other tabs follow similar structure... */}
            {['roadmap', 'marketing', 'stack', 'prompts', 'validation'].map(tabId => (
               <TabsContent key={tabId} value={tabId} className="m-0 mt-2 focus:outline-none">
                 <div className="mb-8 relative inline-block">
                   <h2 className="text-3xl font-handdrawn text-slate-900 uppercase tracking-widest relative z-10">{tabId}</h2>
                   <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                     <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                   </svg>
                 </div>
                 <p className="font-handdrawn text-xl text-slate-500 italic">Section content for {tabId} goes here.</p>
               </TabsContent>
            ))}

          </div>
        </div>
      </Tabs>
    </div>
  )
}
