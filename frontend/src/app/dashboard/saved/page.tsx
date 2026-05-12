'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, Trash2, Info, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useUserStore } from '@/store/userStore'
import { motion } from 'framer-motion'
import { springConfig10, springConfig15 } from '@/lib/animations'

export default function SavedOpportunitiesPage() {
  const { user } = useUserStore()
  
  const { data: saved, isLoading, refetch } = useQuery({
    queryKey: ['saved-opportunities'],
    queryFn: async () => {
      const resp = await api.get('/opportunities/saved')
      return resp.data
    },
  })

  const handleUnsave = async (id: string) => {
    try {
      await api.delete(`/opportunities/save/${id}`)
      toast.success('Removed from bookmarks.')
      refetch()
    } catch (err: any) {
      toast.error('Failed to remove.')
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
    </div>
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tightest">Saved Insights</h1>
        <p className="text-slate-500 font-medium mt-2">Your bookmarked opportunities and buying signals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {saved?.map((item: any, index: number) => {
          const opt = item.opportunities
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig10, delay: index * 0.1 }}
            >
              <SavedCard opt={opt} savedAt={item.saved_at} onUnsave={() => handleUnsave(opt.id)} />
            </motion.div>
          )
        })}
      </div>

      {saved?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 border border-slate-200">
             <Bookmark className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <p className="text-slate-900 font-bold text-2xl tracking-tight">No saved opportunities yet</p>
              <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Browse the opportunity feed and bookmark high-value signals to see them here.</p>
           </div>
        </div>
      )}
    </div>
  )
}

function SavedCard({ opt, savedAt, onUnsave }: { opt: any, savedAt: string, onUnsave: () => void }) {
  const redditUrl = opt.url || `https://reddit.com/search/?q=${encodeURIComponent(opt.title)}`

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] h-full flex flex-col hover:border-brand-orange/40 transition-colors group overflow-hidden border">
      <CardHeader className="pb-3 p-8">
        <div className="flex justify-between items-start mb-4">
          <Badge className={cn(
            "text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border-none backdrop-blur-md",
            opt.intent_type?.toLowerCase() === 'buying' ? "bg-emerald-50 text-emerald-600" :
            opt.intent_type?.toLowerCase() === 'pain_point' ? "bg-rose-50 text-rose-600" :
            "bg-brand-orange/10 text-brand-orange"
          )}>
            {opt.intent_type || 'Discussion'}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            onClick={onUnsave}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-xl font-bold leading-[1.3] text-slate-900 group-hover:text-brand-orange transition-colors tracking-tight">{opt.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 px-8">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group/text">
          <p className="text-xs text-slate-600 line-clamp-4 font-medium italic relative z-10 leading-relaxed">
            "{opt.ai_summary}"
          </p>
          <div className="absolute top-0 right-0 w-12 h-12 bg-slate-200/50 blur-xl opacity-0 group-hover/text:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Info className="h-3 w-3 text-brand-orange" />
           Saved on {new Date(savedAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="p-8 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
        <Badge variant="outline" className="bg-white border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-3 py-1">
          r/{opt.subreddit || 'all'}
        </Badge>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
          <Button asChild variant="outline" size="sm" className="h-9 border-slate-200 bg-white hover:bg-brand-orange hover:text-white hover:border-brand-orange text-slate-700 text-xs font-bold gap-2 px-4 rounded-full transition-all">
             <a href={redditUrl} target="_blank" rel="noopener noreferrer">
               View Thread <ExternalLink className="h-3 w-3" />
             </a>
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
