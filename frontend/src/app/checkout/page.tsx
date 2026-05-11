'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Rocket } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useUserStore } from '@/store/userStore'

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
          color: '#6366F1',
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
    <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
           <div className="h-12 w-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
             <Rocket className="h-6 w-6 text-indigo-500" />
           </div>
        </div>
        <CardTitle className="text-2xl font-bold">Secure Checkout</CardTitle>
        <CardDescription className="text-slate-400">Complete your {details.name} subscription.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{details.name} Plan</p>
            <p className="text-xs text-slate-500">Billed {details.period}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-500">{details.price}</p>
            <p className="text-xs text-slate-500">per month</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300">You're unlocking:</p>
          <ul className="space-y-2">
            {[
              'Advanced AI growth reports',
              'Priority opportunity scanning',
              'Competitor monitor alerts',
              'Cancel anytime'
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="h-3 w-3 text-green-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handlePayment} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : `Pay ${details.price}`}
        </Button>
        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
          Powered by Razorpay · 256-bit Encryption
        </p>
      </CardFooter>
    </Card>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />}>
        <CheckoutContent />
      </Suspense>
      <button onClick={() => router.back()} className="mt-8 text-sm text-slate-500 hover:text-white transition-colors">
        Go Back
      </button>
    </div>
  )
}
