'use client'

import { useQuery } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import api from '@/lib/api'
import { Users, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CompetitorsPage() {
  const { activeBusiness } = useBusinessStore()

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return []
      const resp = await api.get(`/competitors/?business_id=${activeBusiness.id}`)
      return resp.data
    },
    enabled: !!activeBusiness?.id
  })

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-8">
      <div>
        <h1 className="text-3xl font-handdrawn text-slate-900">Competitors</h1>
        <p className="font-medium text-slate-600 mt-2">Track the competitors you are monitoring.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full sketch-border bg-slate-100" />
          ))}
        </div>
      ) : !competitors || competitors.length === 0 ? (
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] p-12 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-highlight-yellow sketch-border border-2 flex items-center justify-center mb-4 transform rotate-2">
            <Users className="h-8 w-8 text-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No competitors tracked</h2>
          <p className="text-slate-600 font-medium">Add competitors during the onboarding flow or update them in settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((comp: { id: string, competitor_name: string }) => (
            <div key={comp.id} className="sketch-border bg-white shadow-[2px_2px_0px_#1a1a2e] p-6 flex items-center justify-between">
              <span className="font-bold text-lg text-slate-900">{comp.competitor_name}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Tracking Active</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 sketch-border bg-blue-50 border-blue-200 p-6 flex gap-4 items-start">
        <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Coming Soon</h3>
          <p className="text-sm font-medium text-slate-700">Detailed competitor intelligence dashboards, feature comparisons, and real-time gap analysis are under development.</p>
        </div>
      </div>
    </div>
  )
}
