'use client'

import { Bookmark, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SavedOpportunitiesPage() {
  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-8">
      <div>
        <h1 className="text-3xl font-handdrawn text-slate-900 flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-brand-orange" fill="currentColor" /> Saved
        </h1>
        <p className="font-medium text-slate-600 mt-2">Opportunities you have bookmarked for later.</p>
      </div>

      <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] p-16 text-center flex flex-col items-center">
        <div className="h-20 w-20 bg-slate-50 sketch-border border-2 border-slate-200 flex items-center justify-center mb-6 transform -rotate-3">
          <Bookmark className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Nothing saved yet</h2>
        <p className="text-slate-600 font-medium mb-8 max-w-sm">When you see an interesting opportunity in your feed, click the Save button to keep it here.</p>
        <Button asChild className="btn-primary">
          <Link href="/dashboard/opportunities"><Search className="h-4 w-4 mr-2" /> Browse Opportunities</Link>
        </Button>
      </div>
    </div>
  )
}
