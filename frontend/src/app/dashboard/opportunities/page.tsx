'use client'

import { useQuery } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, Bookmark, BarChart3, MessageSquare, Flame, Loader2, Sparkles, Filter } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { springConfig10, springConfig15 } from '@/lib/animations'

export default function OpportunitiesPage() {
  const { activeBusiness } = useBusinessStore()
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState('all')

  const { data: opportunities, isLoading, refetch } = useQuery({
    queryKey: ['opportunities', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/opportunities/?business_id=${activeBusiness?.id}`)
      return resp.data
    },
    enabled: !!activeBusiness
  })

  const handleSave = async (id: string) => {
    try {
      await api.post('/opportunities/save', { opportunity_id: id })
      toast.success('Opportunity bookmarked!')
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save')
    }
  }

  const filteredOpportunities = opportunities?.filter((opt: any) => {
    if (activeTab === 'all') return true
    return opt.intent_type?.toLowerCase() === activeTab.toLowerCase()
  })

  if (!activeBusiness) return <div className="p-8 text-white font-bold">Please select a business.</div>

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
    </div>
  )

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tightest drop-shadow-sm">Opportunity Stream</h1>
          <p className="text-slate-400 font-medium">Real-time buying signals extracted for <span className="text-slate-200">{activeBusiness.business_name}</span></p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2">
           <Filter className="h-3 w-3 text-slate-400" />
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{filteredOpportunities?.length || 0} Signals Found</span>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full w-fit mb-8 shadow-inner">
          <TabsTrigger value="all" className="rounded-full px-6 py-2 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all tracking-tight text-slate-400">All Signals</TabsTrigger>
          <TabsTrigger value="buying" className="rounded-full px-6 py-2 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-emerald-400 transition-all tracking-tight text-slate-400">Buying Signals</TabsTrigger>
          <TabsTrigger value="pain_point" className="rounded-full px-6 py-2 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-rose-400 transition-all tracking-tight text-slate-400">Pain Points</TabsTrigger>
          <TabsTrigger value="comparison" className="rounded-full px-6 py-2 text-xs font-bold data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 transition-all tracking-tight text-slate-400">Comparisons</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredOpportunities?.map((opt: any, index: number) => (
                <div key={opt.id}>
                  <OpportunityCard opt={opt} onSave={handleSave} index={index} />
                </div>
              ))}
            </motion.div>
            
            {filteredOpportunities?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-premium space-y-4">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                    <Search className="h-8 w-8" />
                 </div>
                 <p className="text-slate-300 font-bold tracking-tight">No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} signals found yet.</p>
                 <Button variant="ghost" onClick={() => setActiveTab('all')} className="text-brand-blue font-bold hover:bg-white/5">Show all signals</Button>
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function OpportunityCard({ opt, onSave, index }: { opt: any, onSave: (id: string) => void, index?: number }) {
  const redditUrl = opt.url || `https://reddit.com/search/?q=${encodeURIComponent(opt.title)}`

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ ...springConfig10, delay: (index || 0) * 0.1 }}
      className="group relative h-full"
    >
      <Card className="bg-slate-900/60 backdrop-blur-2xl border-white/10 shadow-premium rounded-[2.5rem] h-full flex flex-col hover:border-brand-blue/40 transition-colors group overflow-hidden border">
        <CardHeader className="pb-3 p-8">
          <div className="flex justify-between items-start mb-4">
            <Badge className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border-none backdrop-blur-md",
              opt.intent_type?.toLowerCase() === 'buying' ? "bg-emerald-500/10 text-emerald-400" :
              opt.intent_type?.toLowerCase() === 'pain_point' ? "bg-rose-500/10 text-rose-400" :
              opt.intent_type?.toLowerCase() === 'comparison' ? "bg-amber-500/10 text-amber-400" :
              "bg-brand-blue/10 text-brand-blue"
            )}>
              {opt.intent_type || 'Discussion'}
            </Badge>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-slate-300 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Score: {opt.opportunity_score}
            </div>
          </div>
          <CardTitle className="text-xl font-bold leading-[1.3] text-white group-hover:text-brand-blue transition-colors tracking-tight drop-shadow-sm">{opt.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-6 px-8">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group/text">
            <p className="text-xs text-slate-400 line-clamp-4 font-medium italic relative z-10 leading-relaxed">
              <MessageSquare className="h-3 w-3 inline mr-1.5 text-slate-500" />
              "{opt.ai_summary}"
            </p>
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 blur-xl opacity-0 group-hover/text:opacity-100 transition-opacity" />
          </div>
          
          {opt.recommended_action && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Flame className="h-3 w-3 text-rose-500" /> Strategic Action
              </p>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">{opt.recommended_action}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-8 pt-4 border-t border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                <Users className="h-3 w-3 text-slate-400" />
             </div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">r/{opt.subreddit || 'all'}</span>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-white/10 shadow-sm" onClick={() => onSave(opt.id)}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
              <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-5 font-bold h-9 shadow-lg shadow-brand-blue/20 text-xs transition-colors border border-white/10">
                 <a href={redditUrl} target="_blank" rel="noopener noreferrer">
                   Open Thread <ExternalLink className="ml-1.5 h-3 w-3" />
                 </a>
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
