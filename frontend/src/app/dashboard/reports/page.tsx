'use client'

import { useQuery } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/businessStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function ReportsListPage() {
  const { activeBusiness } = useBusinessStore()

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return []
      const resp = await api.get(`/reports/?business_id=${activeBusiness.id}`)
      return resp.data
    },
    enabled: !!activeBusiness?.id
  })

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-32">
        <h1 className="text-3xl font-handdrawn text-slate-900 mb-8">Your Reports</h1>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full sketch-border bg-slate-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-handdrawn text-slate-900">Your Reports</h1>
        <Button asChild className="sketch-border bg-brand-orange text-white hover:bg-orange-600 shadow-[2px_2px_0px_#1a1a2e] font-bold">
          <Link href="/dashboard">Generate New Report</Link>
        </Button>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] p-12 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-highlight-yellow sketch-border border-2 flex items-center justify-center mb-4 transform -rotate-2">
            <Search className="h-8 w-8 text-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No reports yet</h2>
          <p className="text-slate-600 font-medium mb-6">Generate your first strategy report from the main dashboard.</p>
          <Button asChild className="btn-primary">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: { id: string, created_at: string, report_data?: { report_meta?: { confidence_score?: number } } }) => (
            <Link 
              key={report.id} 
              href={`/dashboard/reports/${report.id}`}
              className="block sketch-border bg-white shadow-[2px_2px_0px_#1a1a2e] p-6 hover:-translate-y-1 transition-transform group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 border-2 border-slate-200 rounded flex items-center justify-center group-hover:bg-highlight-yellow transition-colors">
                    <FileText className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Growth Intelligence Report
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="text-brand-orange">Score: {report.report_data?.report_meta?.confidence_score || 'N/A'}/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-8 w-8 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
