'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Rocket, Shield, CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: any
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUserStore()
  const router = useRouter()

  const planDetails = {
    starter: { name: 'Starter', price: '₹499', period: 'monthly' },
    pro: { name: 'Pro', price: '₹999', period: 'monthly' }
  }

  const details = planDetails[plan as keyof typeof planDetails] || planDetails.starter

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsLoading(true)
    const res = await loadRazorpay()

    if (!res) {
      toast.error('Razorpay SDK failed to load. Check your connection.')
      setIsLoading(false)
      return
    }

    try {
      const response = await api.post('/billing/create-subscription', { plan })
      const { subscription_id, key_id } = response.data

      const options = {
        key: key_id,
        subscription_id: subscription_id,
        name: 'SignalLoop',
        description: `${details.name} Subscription`,
        handler: async function (response: any) {
          try {
             await api.post('/billing/verify-payment', {
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_subscription_id: response.razorpay_subscription_id,
               razorpay_signature: response.razorpay_signature,
               plan: plan
             })
             toast.success('Subscription activated!')
             router.push('/billing/success')
          } catch (err: any) {
             toast.error('Verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#f97316',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
    }
  }

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
        <button onClick={() => router.back()} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-12 px-6 w-full max-w-5xl mx-auto mt-8 items-start">

        {/* Left Side - Text & Branding */}
        <div className="flex-1 flex flex-col max-w-[480px]">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-5xl lg:text-6xl font-handdrawn text-slate-900 mb-6 relative inline-block">
              Upgrade to {details.name}
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0,5 Q20,10 40,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </h1>
            <p className="text-lg text-slate-600 font-bold mb-10">
              Unlock advanced features, priority scanning, and deeper competitor insights to supercharge your growth.
            </p>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">You&apos;re unlocking:</p>
              {[
                'Advanced AI growth reports',
                'Priority opportunity scanning',
                'Competitor monitor alerts',
                'Cancel anytime'
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

        {/* Right Side - Checkout Form */}
        <div className="flex-1 w-full max-w-[500px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="sketch-border bg-white shadow-[8px_8px_0px_#1a1a2e] relative overflow-hidden flex flex-col p-8 transform rotate-1">
            
            <div className="border-b-2 border-slate-200 border-dashed pb-6 mb-6 relative z-10 flex items-center gap-4">
               <div className="h-14 w-14 bg-highlight-yellow sketch-border border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center transform -rotate-3">
                 <Rocket className="h-6 w-6 text-slate-900" />
               </div>
               <h2 className="text-3xl font-handdrawn text-slate-900">
                 Secure Checkout
               </h2>
            </div>

            <div className="space-y-6 relative z-10 flex-1">
              <div className="p-6 bg-slate-50 sketch-border-sm border-2 border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-handdrawn capitalize text-slate-900">{details.name} Plan</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Billed {details.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-handdrawn text-brand-orange">{details.price}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">per month</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-200 border-dashed relative z-10 flex flex-col gap-4">
              <Button 
                onClick={handlePayment} 
                className="w-full btn-primary h-14 text-lg"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : `Pay ${details.price}`}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <Shield className="w-3 h-3" />
                <span>Powered by Razorpay · 256-bit Encryption</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => router.back()} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Cancel & Go Back
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper-white)] flex items-center justify-center"><Loader2 className="h-12 w-12 text-brand-orange animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
