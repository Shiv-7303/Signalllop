import { Loader2 } from 'lucide-react'
import { HaloBackground } from '@/components/HaloBackground'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <HaloBackground />
      <Loader2 className="h-10 w-10 text-[#f97316] animate-spin relative z-10" />
    </div>
  )
}
