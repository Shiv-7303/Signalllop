'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Sparkles, Rocket, ArrowLeft } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function BillingManagePage() {
  const { user, isLoading: userLoading } = useUserStore()
  const queryClient = useQueryClient()

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const resp = await api.get('/billing/subscription')
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

  if (subLoading || userLoading) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--paper-white)]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-orange"></div>
      <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Loading subscription...</p>
    </div>
  )

  const isFree = !user?.plan || user?.plan === 'free'
  const isStarter = user?.plan === 'starter'
  const isCancelled = subscription?.status === 'cancelled'
  const isPastDue = subscription?.status === 'past_due'

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--paper-white)] selection:bg-highlight-yellow text-slate-900 font-sans relative overflow-x-hidden flex flex-col pb-32">
      
      {/* BACKGROUND NOISE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* TOP HEADER */}
      <div className="relative z-10 p-6 shrink-0 flex justify-between items-center w-full max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-brand-orange p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="font-handdrawn text-2xl font-bold tracking-tight text-slate-900 mt-1">SignalLoop</span>
        </Link>
        <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-12 px-6 w-full max-w-5xl mx-auto mt-8 items-start">
        
        {/* Left Side - Text & Branding */}
        <div className="flex-1 flex flex-col max-w-[480px]">
          
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-5xl lg:text-6xl font-handdrawn text-slate-900 mb-6 relative inline-block">
              Billing & Plan
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </h1>
            <p className="text-lg text-slate-600 font-bold mb-10">
              Manage your subscription, update payment methods, and handle your SignalLoop access.
            </p>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Benefits</p>
              {[
                'Reddit Opportunity Scanner',
                'Competitor Monitoring',
                'Weekly Growth Digests',
                'Advanced AI Strategy'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 sketch-border bg-white p-4 shadow-[2px_2px_0px_#1a1a2e]">
                  <div className="bg-brand-orange text-white p-1 rounded font-bold text-xs h-6 w-6 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Billing Management */}
        <div className="flex-1 w-full max-w-[500px] animate-in fade-in slide-in-from-right-8 duration-700 space-y-6">
          
          <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] relative overflow-hidden flex flex-col p-8">
            <div className="absolute top-0 right-0 -z-10 opacity-10 transform rotate-12 translate-x-4 -translate-y-4">
              <CreditCard className="w-40 h-40 text-brand-orange" />
            </div>
            
            <div className="border-b-2 border-slate-200 border-dashed pb-6 mb-6 relative z-10 flex items-center gap-4">
               <div className="h-14 w-14 bg-highlight-yellow sketch-border border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center transform -rotate-3">
                 <CreditCard className="h-6 w-6 text-slate-900" />
               </div>
               <h2 className="text-3xl font-handdrawn text-slate-900">
                 Current Plan
               </h2>
            </div>

            <div className="space-y-6 relative z-10 flex-1">
              <div className="flex items-center justify-between p-5 bg-slate-50 sketch-border-sm border-2 border-slate-200">
                <div>
                  <h3 className="text-2xl font-handdrawn capitalize text-slate-900">{user?.plan || 'Free'}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    {isFree ? 'Limited access to insights' : 'Full access enabled'}
                  </p>
                </div>
                <Badge className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-wider sketch-border-sm border-2",
                  subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 
                  isPastDue ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                )}>
                  {subscription?.status || 'No Active Sub'}
                </Badge>
              </div>

              {!isFree && subscription?.renewal_date && (
                <div className="flex items-center gap-4 text-xs text-slate-700 bg-white sketch-border-sm border-2 border-slate-200 p-4 font-medium">
                  <div className="bg-slate-100 p-2 sketch-border-sm">
                    <Calendar className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Next billing date</p>
                    <p className="text-slate-900 font-bold text-sm">{new Date(subscription.renewal_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}

              {isPastDue && (
                <div className="flex items-center gap-3 text-xs text-rose-700 bg-rose-50 sketch-border-sm border-2 border-rose-200 p-4 font-bold">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  Payment failed. Please update your payment method.
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-200 border-dashed relative z-10">
              {isFree ? (
                <Button asChild className="w-full btn-primary h-12 text-sm">
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              ) : !isCancelled && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full sketch-border bg-white text-rose-600 border-2 border-slate-900 h-12 font-bold text-sm hover:bg-rose-50 shadow-[2px_2px_0px_#1a1a2e]"
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-none bg-white sketch-border border-slate-900 shadow-[8px_8px_0px_#1a1a2e] p-8">
                    <DialogHeader>
                      <div className="mx-auto w-16 h-16 bg-rose-100 sketch-border border-2 border-slate-900 text-rose-600 flex items-center justify-center mb-6 transform rotate-3">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <DialogTitle className="text-center text-3xl font-handdrawn text-slate-900">Are you sure?</DialogTitle>
                      <DialogDescription className="text-center text-slate-600 font-bold pt-2 text-sm leading-relaxed">
                        You will lose access to premium features at the end of your billing cycle. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center flex flex-col sm:flex-row gap-4 pt-8 w-full">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex-1 sketch-border bg-white text-slate-900 border-2 border-slate-900 h-12 font-bold hover:bg-slate-50">
                          Keep Plan
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button 
                          type="button" 
                          className="flex-1 sketch-border bg-rose-600 hover:bg-rose-700 text-white h-12 font-bold shadow-[2px_2px_0px_#1a1a2e]"
                          onClick={() => cancelMutation.mutate()}
                        >
                          Yes, Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {user && (isFree || isStarter) && (
            <div className="sketch-border bg-highlight-yellow border-2 border-slate-900 text-slate-900 shadow-[4px_4px_0px_#1a1a2e] relative overflow-hidden shrink-0 transform rotate-1">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none transform -rotate-12">
                <Sparkles className="w-24 h-24 text-slate-900" />
              </div>
              <div className="p-6 space-y-4 relative z-10">
                 <div className="flex items-center gap-3 text-slate-900">
                   <div className="bg-white p-2 sketch-border-sm border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e]">
                     <Sparkles className="h-5 w-5 text-brand-orange" fill="currentColor" />
                   </div>
                   <h4 className="font-handdrawn text-2xl text-slate-900">Need more power?</h4>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed font-bold">
                   Upgrade to Pro for unlimited competitors, 50 reports, and daily opportunity refreshes.
                 </p>
                 <Button asChild className="w-full btn-primary h-12 mt-2">
                   <Link href="/checkout?plan=pro">Upgrade to Pro</Link>
                 </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
