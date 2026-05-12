'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, ChevronRight, Search, Loader2, Users, Sparkles, BookOpen, Lightbulb, TrendingUp, Rocket } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { springConfig10, springConfig15 } from '@/lib/animations'

export default function ReportsPage() {
  const { activeBusiness } = useBusinessStore()
  const { usage } = useUserStore()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/reports/?business_id=${activeBusiness?.id}`)
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
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Generation failed')
    }
  })

  if (!activeBusiness) return <div className="p-8 text-slate-900 font-bold text-center">Please select a business.</div>

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
    </div>
  )

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Loading Overlay with Rotating Messages */}
      {generateMutation.isPending && <AILoadingOverlay />}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="border-brand-orange/30 text-brand-orange uppercase text-[10px] font-bold tracking-widest px-3 mb-2 bg-brand-orange/5">Strategy Hub</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tightest drop-shadow-sm">Growth Reports</h1>
          <p className="text-slate-500 font-medium">Deep-intelligence strategies based on Reddit conversations.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 backdrop-blur-md border border-slate-200 p-2 rounded-full shadow-sm pr-2 pl-6">
          <div className="text-right">
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Plan Usage</p>
             <p className="text-xs font-bold text-slate-700">{usage?.reports_used || 0} / {usage?.reports_limit || 1}</p>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
            <Button 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 font-bold h-10 shadow-lg shadow-brand-orange/20 transition-transform border border-transparent"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              New Intelligence
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports?.map((report: any, index: number) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ ...springConfig10, delay: index * 0.05 }}
          >
            <Card 
              className="bg-white border-slate-200 shadow-sm rounded-[2rem] hover:border-brand-orange/30 hover:shadow-md transition-all cursor-pointer group overflow-hidden border"
              onClick={() => setSelectedReport(report)}
            >
              <CardContent className="p-0 flex flex-col md:flex-row items-stretch justify-between h-auto md:h-24">
                <div className="flex items-center gap-6 px-8 py-6 md:py-0 flex-1">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-brand-orange group-hover:text-white transition-colors border border-slate-200 group-hover:border-transparent">
                     <FileText className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg tracking-tight drop-shadow-sm group-hover:text-brand-orange transition-colors">Growth Strategy #{reports.length - index}</h3>
                     <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.created_at).toLocaleDateString()}
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 px-8 py-6 md:py-0 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100">
                   <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Growth Score</p>
                      <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 px-4 py-1 font-bold text-sm backdrop-blur-md">
                         {report.report_data?.growth_score || '??'}
                      </Badge>
                   </div>
                   <div className="text-center hidden sm:block">
                      <p className="text-[10px] text-slate-500 uppercase mb-1 font-bold">Signals</p>
                      <p className="text-sm font-bold text-slate-700">{report.report_data?.opportunities?.length || 0}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:translate-x-1 group-hover:text-brand-orange shadow-sm transition-all">
                      <ChevronRight className="h-5 w-5" />
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {reports?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm">
             <Search className="h-10 w-10" />
           </div>
           <div className="space-y-1">
             <p className="text-slate-900 font-bold text-2xl tracking-tight drop-shadow-sm">No reports generated yet</p>
             <p className="text-sm text-slate-500 font-medium">Generate your first AI-powered strategy to unlock growth.</p>
           </div>
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
             <Button 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-8 h-12 font-bold shadow-xl shadow-brand-orange/20 border border-transparent"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
             >
               Generate Strategy
             </Button>
           </motion.div>
        </div>
      )}

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl bg-white border-slate-200 text-slate-900 p-0 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl rounded-[2.5rem]">
          <DialogHeader className="px-10 py-10 border-b border-slate-200 bg-slate-50">
            <div className="flex justify-between items-start">
               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-brand-orange font-bold uppercase text-[10px] tracking-widest mb-2">
                    <BookOpen className="h-4 w-4" /> Market Intelligence Report
                 </div>
                 <DialogTitle className="text-4xl font-bold tracking-tightest drop-shadow-sm text-slate-900">Growth Strategy Overview</DialogTitle>
                 <DialogDescription className="text-slate-500 font-medium italic">
                    Analysis conducted on {selectedReport && new Date(selectedReport.created_at).toLocaleString()}
                 </DialogDescription>
               </div>
               <div className="p-1 bg-brand-orange rounded-2xl shadow-xl shadow-brand-orange/20 border border-brand-orange/20">
                  <div className="bg-white rounded-[calc(1rem-0.25rem)] px-5 py-3 text-center border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Growth Score</p>
                     <p className="text-3xl font-bold text-brand-orange leading-none mt-1 drop-shadow-sm">{selectedReport?.report_data?.growth_score}</p>
                  </div>
               </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-16 bg-transparent scrollbar-hide">
             {/* Strategy Summary */}
             <div className="space-y-6">
                <h4 className="text-sm font-bold flex items-center gap-3 text-slate-400 uppercase tracking-[0.2em]">
                   <TrendingUp className="h-4 w-4 text-brand-orange" /> The Strategy
                </h4>
                <div className="bg-slate-50 border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
                   <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      {selectedReport?.report_data?.strategy_summary}
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Best Communities */}
                <div className="space-y-8">
                   <h4 className="text-sm font-bold flex items-center gap-3 text-slate-400 uppercase tracking-[0.2em]">
                      <Users className="h-4 w-4 text-indigo-500" /> Target Hubs
                   </h4>
                   <div className="space-y-4">
                      {selectedReport?.report_data?.best_communities?.map((c: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] space-y-3 hover:bg-slate-100 transition-colors relative overflow-hidden group shadow-sm">
                           <div className="flex justify-between items-center relative z-10">
                              <Badge className="bg-white text-slate-700 font-bold rounded-lg border border-slate-200 px-3 shadow-sm">r/{c.subreddit}</Badge>
                              <span className="text-[10px] text-slate-500 font-bold uppercase">{c.members} members</span>
                           </div>
                           <p className="text-xs text-slate-600 font-medium leading-relaxed relative z-10 italic">"{c.why_it_matters}"</p>
                           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl group-hover:bg-indigo-200/50 transition-colors" />
                        </div>
                      ))}
                   </div>
                </div>

                {/* Content Ideas */}
                <div className="space-y-8">
                   <h4 className="text-sm font-bold flex items-center gap-3 text-slate-400 uppercase tracking-[0.2em]">
                      <Lightbulb className="h-4 w-4 text-amber-500" /> Content Hooks
                   </h4>
                   <div className="space-y-3">
                      {selectedReport?.report_data?.content_ideas?.map((idea: string, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl group hover:border-amber-300 transition-colors hover:bg-amber-50/50 shadow-sm">
                           <div className="h-6 w-6 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 group-hover:text-amber-500 group-hover:border-amber-200">
                              {i+1}
                           </div>
                           <p className="text-xs text-slate-700 font-medium leading-relaxed">{idea}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Footer of report */}
             <div className="pt-10 border-t border-slate-200 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-1 bg-slate-200 rounded-full" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">End of Intelligence Report</p>
                <Button onClick={() => setSelectedReport(null)} variant="outline" className="rounded-full px-8 font-bold border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-700 shadow-sm">Close Analysis</Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AILoadingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = [
    "Expanding search keywords with Gemini 3.1...",
    "Deep-diving into relevant niche subreddits...",
    "Scraping latest Reddit discussions...",
    "Filtering for high-intent buying signals...",
    "Analyzing competitor sentiment and gaps...",
    "Identifying pain points in target communities...",
    "Crafting your personalized growth strategy...",
    "Finalizing report insights and content ideas...",
    "Optimizing strategy for maximum traction..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-12 text-center p-6 animate-in fade-in duration-700">
      <div className="relative">
        <div className="h-32 w-32 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
           <Rocket className="h-10 w-10 text-brand-orange animate-bounce" />
        </div>
        <Sparkles className="h-8 w-8 text-amber-500 absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      <div className="space-y-4 max-w-md relative">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tightest drop-shadow-sm">AI Strategy Engine</h2>
        <p className="text-slate-600 text-lg font-medium leading-relaxed">
          We are performing a multi-step deep analysis of your market. 
          This takes about 60 seconds to ensure high-quality insights.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 px-8 py-6 rounded-[2.5rem] min-w-[360px] flex flex-col items-center gap-4 shadow-md relative overflow-hidden">
         <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-2 w-2 rounded-full bg-brand-orange animate-bounce shadow-[0_0_8px_rgba(255,107,0,0.4)]`} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
         </div>
         <p className="text-brand-orange font-bold text-base animate-in slide-in-from-bottom-2 fade-in duration-500 tracking-tight drop-shadow-sm">
           {messages[messageIndex]}
         </p>
         <div className="absolute bottom-0 left-0 h-1 bg-brand-orange shadow-[0_0_10px_rgba(255,107,0,0.4)] animate-[progress_60s_linear]" style={{ width: '100%' }} />
      </div>

      <div className="flex flex-col items-center gap-2 mt-8">
         <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">SignalLoop Intelligence Core</p>
      </div>
    </div>
  )
}
