'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Sparkles, XCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function BillingManagePage() {
  const { user } = useUserStore()
  const queryClient = useQueryClient()

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const resp = await api.get('/billing/subscription')
      // If backend returns a list, take the first one, else return object
      return Array.isArray(resp.data) ? resp.data[0] : resp.data
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return await api.post('/billing/cancel')
    },
    onSuccess: () => {
      toast.success('Subscription cancelled successfully.')
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: () => {
      toast.error('Failed to cancel subscription.')
    }
  })

  if (isLoading) return <div className="p-8 text-white">Loading subscription...</div>

  const isFree = user?.plan === 'free'
  const isCancelled = subscription?.status === 'cancelled'
  const isPastDue = subscription?.status === 'past_due'

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-slate-400">Manage your plan and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold capitalize">{user?.plan}</h3>
                <p className="text-sm text-slate-500">
                  {isFree ? 'Limited access to growth insights' : 'Full access enabled'}
                </p>
              </div>
              <Badge className={
                subscription?.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                isPastDue ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'
              }>
                {subscription?.status || 'No Active Sub'}
              </Badge>
            </div>

            {!isFree && subscription?.renewal_date && (
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                <Calendar className="h-4 w-4" />
                Next billing date: {new Date(subscription.renewal_date).toLocaleDateString()}
              </div>
            )}

            {isPastDue && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle className="h-4 w-4" />
                Payment failed. Access will be limited soon.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            {isFree ? (
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 w-full">
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            ) : !isCancelled && (
              <Button 
                variant="outline" 
                className="border-slate-800 text-slate-400 hover:bg-red-400/10 hover:text-red-400 w-full"
                onClick={() => {
                  if (confirm('Are you sure? You will lose access at the end of your billing cycle.')) {
                    cancelMutation.mutate()
                  }
                }}
                disabled={cancelMutation.isPending}
              >
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Quick Actions / Stats */}
        <div className="space-y-6">
           <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Features Unlocked</CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3">
                    {[
                      'Reddit Opportunity Scanner',
                      'Competitor Monitoring',
                      'Weekly Growth Digests',
                      'Advanced AI Strategy'
                    ].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                         <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                         {f}
                      </li>
                    ))}
                 </ul>
              </CardContent>
           </Card>

           {user?.plan === 'starter' && (
              <Card className="bg-indigo-600/10 border-indigo-500/20 text-white">
                <CardContent className="p-6 space-y-4">
                   <div className="flex items-center gap-2 text-indigo-400">
                     <Sparkles className="h-5 w-5" />
                     <h4 className="font-bold">Need more power?</h4>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Upgrade to Pro for unlimited competitors, 50 reports per month, and daily opportunity refreshes.
                   </p>
                   <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                     <Link href="/checkout?plan=pro">Upgrade to Pro</Link>
                   </Button>
                </CardContent>
              </Card>
           )}
        </div>
      </div>
    </div>
  )
}
