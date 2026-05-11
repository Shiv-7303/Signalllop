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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
          <p className="text-slate-400 mt-2">
            You're now on the <span className="text-indigo-400 font-bold capitalize">{user?.plan || 'Paid'}</span> plan.
          </p>
        </CardHeader>
        <CardContent className="py-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-300">Your new features are now unlocked:</p>
            <div className="grid grid-cols-1 gap-2">
               {[
                 'Increased report limits',
                 'More competitor slots',
                 'Advanced AI opportunity scoring',
                 'Automated background scanning'
               ].map(f => (
                 <div key={f} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    {f}
                 </div>
               ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/dashboard')} className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold h-12">
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
