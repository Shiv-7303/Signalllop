'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Rocket, Shield, CheckCircle2 } from 'lucide-react'
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
    starter: { name: 'Starter', price: 'Rs.499', period: 'monthly' },
    pro: { name: 'Pro', price: 'Rs.999', period: 'monthly' }
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
          } catch (err) {
             toast.error('Verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#FF4500',
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
        <div className="max-w-[480px] w-full mx-auto md:mx-0 flex flex-col gap-12">
          
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
          <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 hidden sm:block">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 mb-6">
              Upgrade to <span className="relative inline-block"><span className="relative z-10 text-[#FF4500]">{details.name}</span><div className="absolute -bottom-1 left-0 w-full h-3 bg-orange-400/30 -z-10 origin-left rounded-full" /></span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10">
              Unlock advanced features, priority scanning, and deeper competitor insights to supercharge your growth.
            </p>

            <div className="space-y-4 flex flex-col items-start">
              {[
                'Advanced AI growth reports',
                'Priority opportunity scanning',
                'Competitor monitor alerts'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/80 shadow-sm w-fit hover:bg-white/80 transition-colors">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4500]" />
                  </div>
                  <span className="text-slate-800 font-semibold text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Bottom */}
          <div className="flex items-center justify-start gap-6 text-[13px] text-slate-500 font-medium animate-in fade-in slide-in-from-left-8 duration-1000">
            <span>© {new Date().getFullYear()} SignalLoop.</span>
            <Link href="/privacy" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Terms</Link>
          </div>

        </div>
      </div>

      {/* Right Side - Checkout Form */}
      <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col justify-center items-center p-6 md:p-12 relative z-10 bg-white/40 backdrop-blur-sm border-l border-white/50">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          <Card className="w-full bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border-[#FF4500]/20 text-slate-900 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-[2rem] relative overflow-hidden flex flex-col shrink-0">
            <div className="absolute -top-10 -right-10 p-4 opacity-10 pointer-events-none transform rotate-12 z-0">
              <Rocket className="w-48 h-48 text-[#FF4500]" />
            </div>

            <CardHeader className="text-center pt-8 pb-4 relative z-10 border-b border-white/30">
              <div className="flex justify-center mb-6">
                 <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-white/80 shadow-sm">
                   <Rocket className="h-8 w-8 text-[#FF4500]" />
                 </div>
              </div>
              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">Secure Checkout</CardTitle>
              <CardDescription className="text-slate-600 font-medium mt-2">Complete your {details.name} subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8 relative z-10 pt-6">
              <div className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-extrabold text-xl text-slate-900">{details.name} Plan</p>
                  <p className="text-xs text-slate-600 font-medium">Billed {details.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-[#FF4500] tracking-tight">{details.price}</p>
                  <p className="text-xs text-slate-600 font-medium">per month</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-800">You're unlocking:</p>
                <ul className="space-y-3">
                  {[
                    'Advanced AI growth reports',
                    'Priority opportunity scanning',
                    'Competitor monitor alerts',
                    'Cancel anytime'
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="bg-white p-0.5 rounded-full shadow-sm border border-slate-100/50">
                        <Check className="h-3 w-3 text-[#FF4500]" strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 px-8 pb-8 pt-2 border-none relative z-10">
              <Button 
                onClick={handlePayment} 
                className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-12 shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 text-lg group"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : `Pay ${details.price}`}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <Shield className="w-3 h-3" />
                <span>Powered by Razorpay · 256-bit Encryption</span>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <button onClick={() => router.back()} className="text-sm font-medium text-slate-500 hover:text-[#FF4500] transition-colors">
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
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><Loader2 className="h-12 w-12 text-[#FF4500] animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
