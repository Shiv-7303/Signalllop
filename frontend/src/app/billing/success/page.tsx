'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, LayoutDashboard } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import api from '@/lib/api'

export default function BillingSuccessPage() {
  const router = useRouter()
  const { user, setUser, setUsage } = useUserStore()

  useEffect(() => {
    // Refresh user data to show updated plan
    const refreshData = async () => {
      try {
        const userResp = await api.get('/auth/me')
        setUser(userResp.data)
        const usageResp = await api.get('/usage/')
        setUsage(usageResp.data)
      } catch (err) {
        console.error('Failed to refresh user data after payment')
      }
    }
    refreshData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-200 text-slate-900 text-center shadow-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Payment Successful!</CardTitle>
          <p className="text-slate-500 mt-2 font-medium">
            You're now on the <span className="text-[#FF4500] font-bold capitalize">{user?.plan || 'Paid'}</span> plan.
          </p>
        </CardHeader>
        <CardContent className="py-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Your new features are now unlocked:</p>
            <div className="grid grid-cols-1 gap-2">
               {[
                 'Increased report limits',
                 'More competitor slots',
                 'Advanced AI opportunity scoring',
                 'Automated background scanning'
               ].map(f => (
                 <div key={f} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    <Sparkles className="h-3 w-3 text-[#FF4500]" />
                    {f}
                 </div>
               ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/dashboard')} className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 gap-2 font-bold h-12 text-lg">
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
