'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Sparkles, XCircle, Rocket } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

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
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 bg-white bg-gradient-to-b from-[#FF4500]/5 via-white to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4500]"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading subscription...</p>
    </div>
  )

  const isFree = !user?.plan || user?.plan === 'free'
  const isStarter = user?.plan === 'starter'
  const isCancelled = subscription?.status === 'cancelled'
  const isPastDue = subscription?.status === 'past_due'

  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row overflow-y-auto bg-white selection:bg-orange-100 text-slate-900 font-sans relative">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/8 via-white to-white pointer-events-none z-0" />

      {/* Dotted grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent_5%,black_20%,black_80%,transparent_95%)] opacity-35 pointer-events-none z-0" />

      {/* Subtle orange orb */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF4500]/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-[15%] w-24 h-24 bg-[#FF4500]/5 rounded-full blur-2xl pointer-events-none z-0" />
      <div className="absolute bottom-32 left-[10%] w-32 h-32 bg-[#FF4500]/4 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Left Side - Text & Branding */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative z-10">
        <div className="max-w-[480px] w-full mx-auto md:mx-0 flex flex-col gap-8">
          
          {/* Logo - Top */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[#FF4500] p-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-2xl text-slate-900">SignalLoop</span>
            </Link>
          </div>

          {/* Hero Text - Middle */}
          <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 mb-6">
              Manage your <span className="relative inline-block"><span className="relative z-10 text-[#FF4500]">Subscription</span><div className="absolute -bottom-1 left-0 w-full h-3 bg-orange-400/30 -z-10 origin-left rounded-full" /></span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10">
              View your current plan, update payment methods, and manage your access to SignalLoop's premium tools.
            </p>

            <div className="space-y-4 flex flex-col items-start">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Features Unlocked</p>
              {[
                'Reddit Opportunity Scanner',
                'Competitor Monitoring',
                'Weekly Growth Digests',
                'Advanced AI Strategy'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/80 shadow-sm w-fit hover:bg-white/80 transition-colors">
                  <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4500]" />
                  </div>
                  <span className="text-slate-800 font-semibold text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Bottom */}
          <div className="flex items-center justify-start gap-6 text-[13px] text-slate-500 font-medium animate-in fade-in slide-in-from-left-8 duration-1000 pt-8">
            <span>© {new Date().getFullYear()} SignalLoop.</span>
            <Link href="/privacy" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Terms</Link>
          </div>

        </div>
      </div>

      {/* Right Side - Billing Management */}
      <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col justify-center items-center p-6 md:p-12 relative z-10 bg-white/40 backdrop-blur-sm border-l border-white/50">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-700 flex flex-col gap-6 py-4">
          
          <Card className="bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border-[#FF4500]/20 text-slate-900 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-[2rem] relative overflow-hidden flex flex-col shrink-0">
            <div className="absolute -top-10 -right-10 p-4 opacity-10 pointer-events-none transform rotate-12 z-0">
              <CreditCard className="w-40 h-40 text-[#FF4500]" />
            </div>
            
            <CardHeader className="border-b border-white/30 pb-4 pt-6 px-8 text-center relative z-10">
              <div className="flex justify-center mb-4">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border border-white/80 shadow-sm">
                   <CreditCard className="h-6 w-6 text-[#FF4500]" />
                 </div>
              </div>
              <CardTitle className="text-xl font-extrabold tracking-tight">
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 flex-1 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm">
                <div>
                  <h3 className="text-xl font-extrabold capitalize tracking-tight text-slate-900">{user?.plan || 'Free'}</h3>
                  <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                    {isFree ? 'Limited access to insights' : 'Full access enabled'}
                  </p>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  subscription?.status === 'active' ? 'bg-green-100/80 text-green-700 border-none' : 
                  isPastDue ? 'bg-red-100/80 text-red-700 border-none' : 'bg-slate-100/80 text-slate-600 border-none'
                }`}>
                  {subscription?.status || 'No Active Sub'}
                </Badge>
              </div>

              {!isFree && subscription?.renewal_date && (
                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white/60 backdrop-blur-md shadow-sm p-3 rounded-xl border border-white/80 font-medium">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100/50">
                    <Calendar className="h-4 w-4 text-[#FF4500]" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[8px] uppercase tracking-wider font-bold mb-0.5">Next billing date</p>
                    <p className="text-slate-900 font-bold text-xs">{new Date(subscription.renewal_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}

              {isPastDue && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50/80 backdrop-blur-md p-3 rounded-xl border border-red-100/50 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Payment failed. Update payment method.
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-auto border-none relative z-10">
              {isFree ? (
                <Button asChild className="bg-[#FF4500] hover:bg-[#FF4500]/90 shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 w-full text-white font-bold h-11 text-sm rounded-xl">
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              ) : !isCancelled && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 w-full hover:border-red-200 font-bold h-11 text-sm rounded-xl transition-colors"
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md !rounded-[2rem] border border-red-100 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(255,69,0,0.2)] p-8">
                    <DialogHeader>
                      <div className="mx-auto w-14 h-14 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <DialogTitle className="text-center text-2xl font-extrabold text-slate-900 tracking-tight">Are you sure?</DialogTitle>
                      <DialogDescription className="text-center text-slate-500 font-medium pt-2 text-[15px] leading-relaxed">
                        You will lose access to premium features at the end of your billing cycle. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center flex flex-row gap-3 pt-8 w-full">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex-1 rounded-xl h-12 font-bold text-slate-600 border-slate-200 hover:bg-slate-50 text-[15px]">
                          Keep Plan
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          className="flex-1 rounded-xl h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.25)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] text-[15px]"
                          onClick={() => cancelMutation.mutate()}
                        >
                          Yes, Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>

          {user && (isFree || isStarter) && (
            <Card className="bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border-[#FF4500]/20 text-slate-900 shadow-sm rounded-[2rem] relative overflow-hidden shrink-0">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none transform rotate-12">
                <Sparkles className="w-20 h-20 text-[#FF4500]" />
              </div>
              <CardContent className="p-5 space-y-3 relative z-10">
                 <div className="flex items-center gap-2 text-[#FF4500]">
                   <div className="bg-white p-1.5 rounded-lg shadow-sm border border-[#FF4500]/10">
                     <Sparkles className="h-4 w-4" />
                   </div>
                   <h4 className="font-extrabold text-base tracking-tight text-slate-900">Need more power?</h4>
                 </div>
                 <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                   Upgrade to Pro for unlimited competitors, 50 reports, and daily opportunity refreshes.
                 </p>
                 <Button asChild className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 text-white font-bold h-9 rounded-xl text-xs">
                   <Link href="/checkout?plan=pro">Upgrade to Pro</Link>
                 </Button>
              </CardContent>
            </Card>
          )}

          <div className="text-right">
            <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-[#FF4500] transition-colors">
              Back to Dashboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
