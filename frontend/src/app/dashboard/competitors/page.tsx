'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Users, AlertTriangle, Plus, Trash2, Loader2, Zap, Globe } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { springConfig10, springConfig15 } from '@/lib/animations'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function CompetitorsPage() {
  const { activeBusiness } = useBusinessStore()
  const { user } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const queryClient = useQueryClient()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newComp, setNewComp] = useState({ name: '', website: '' })

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors', activeBusiness?.id],
    queryFn: async () => {
      const resp = await api.get(`/${activeBusiness?.id}/competitors`)
      return resp.data
    },
    enabled: !!activeBusiness
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      return await api.post(`/${activeBusiness?.id}/competitors`, {
        competitor_name: newComp.name,
        website: newComp.website
      })
    },
    onSuccess: () => {
      toast.success('Competitor added!')
      setIsAddOpen(false)
      setNewComp({ name: '', website: '' })
      queryClient.invalidateQueries({ queryKey: ['competitors'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    },
    onError: (err: any) => {
      if (err.response?.status === 402) {
        openUpgradeModal('starter')
      } else {
        toast.error(err.response?.data?.error || 'Failed to add')
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/${activeBusiness?.id}/competitors/${id}`)
    },
    onSuccess: () => {
      toast.success('Competitor removed.')
      queryClient.invalidateQueries({ queryKey: ['competitors'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    }
  })

  const runAnalysisMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.post(`/businesses/${activeBusiness?.id}/competitors/${id}/analyse`)
    },
    onSuccess: () => {
      toast.success('Analysis complete! Check reports for details.')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: () => toast.error('Analysis failed.')
  })

  if (!activeBusiness) return <div className="p-8 text-slate-900 font-bold">Select a business first.</div>

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
    </div>
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="border-brand-orange/30 text-brand-orange uppercase text-[10px] font-bold tracking-widest px-3 mb-2 bg-brand-orange/5">Market Watch</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tightest drop-shadow-sm">Competitor Intelligence</h1>
          <p className="text-slate-500 font-medium">Track and analyse your competitors' Reddit presence.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springConfig15}>
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 font-bold h-10 shadow-lg shadow-brand-orange/20 border border-transparent gap-2">
                <Plus className="h-4 w-4" /> Add Competitor
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 text-slate-900 rounded-[2.5rem] shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Add New Competitor</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">We'll look for discussions about them on Reddit.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Competitor Name *</Label>
                <Input 
                  className="bg-slate-50 border-slate-200 focus:border-brand-orange text-slate-900 rounded-xl h-12" 
                  value={newComp.name} 
                  onChange={(e) => setNewComp({...newComp, name: e.target.value})}
                  placeholder="e.g. Competitor SaaS"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Website (Optional)</Label>
                <Input 
                  className="bg-slate-50 border-slate-200 focus:border-brand-orange text-slate-900 rounded-xl h-12" 
                  value={newComp.website} 
                  onChange={(e) => setNewComp({...newComp, website: e.target.value})}
                  placeholder="https://competitor.com"
                />
              </div>
            </div>
            <Button 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full h-12 font-bold shadow-lg shadow-brand-orange/20 border border-transparent" 
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Add'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {competitors?.map((comp: any, index: number) => (
          <motion.div 
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig10, delay: index * 0.1 }}
          >
            <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] h-full flex flex-col hover:border-brand-orange/40 hover:shadow-md transition-all group overflow-hidden border">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl shadow-sm">
                    <Users className="h-6 w-6 text-slate-500 group-hover:text-brand-orange transition-colors" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    onClick={() => {
                      if (confirm('Delete this competitor?')) deleteMutation.mutate(comp.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors tracking-tight drop-shadow-sm">{comp.competitor_name}</CardTitle>
                {comp.website && (
                  <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-brand-orange flex items-center gap-1.5 transition-colors">
                    <Globe className="h-3.5 w-3.5" /> {comp.website}
                  </a>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-2 flex-1 px-8">
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group/status">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest relative z-10">Intelligence Status</p>
                    <div className="flex items-center gap-2 relative z-10">
                       <Zap className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
                       <span className="text-sm text-slate-700 font-medium">Ready for analysis.</span>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="p-8 pt-4 border-t border-slate-100 bg-slate-50/50">
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                   <Button 
                      variant="outline"
                      className="w-full bg-white border-slate-200 hover:border-brand-orange hover:text-brand-orange hover:bg-slate-50 text-slate-700 rounded-full font-bold h-12 gap-2 shadow-sm transition-all"
                      onClick={() => runAnalysisMutation.mutate(comp.id)}
                      disabled={runAnalysisMutation.isPending}
                    >
                      {runAnalysisMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin text-brand-orange" /> : 'Run Full Analysis'}
                   </Button>
                 </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {competitors?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm">
             <AlertTriangle className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <p className="text-slate-900 font-bold text-2xl tracking-tight drop-shadow-sm">No competitors added</p>
              <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Add your competitors to see where they are winning on Reddit.</p>
           </div>
        </div>
      )}
    </div>
  )
}
