import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-[#f97316] animate-spin" />
    </div>
  )
}
