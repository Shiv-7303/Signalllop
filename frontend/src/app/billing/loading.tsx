import { Loader2 } from 'lucide-react'

export default function BillingLoading() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[var(--paper-white)]">
      <Loader2 className="h-12 w-12 text-[#f97316] animate-spin" />
      <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Loading billing...</p>
    </div>
  )
}
