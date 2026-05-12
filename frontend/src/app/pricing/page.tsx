'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'
import { HaloBackground } from '@/components/HaloBackground'

type BillingPeriod = 'monthly' | 'yearly';
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'link' | 'destructive' | null | undefined;

interface Plan {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  variant: ButtonVariant;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    priceMonthly: 'Rs.0',
    priceYearly: 'Rs.0',
    description: 'Ideal for trying out the platform.',
    features: ['1 Growth report / mo', '1 Competitor', '3 Opportunity cards', 'Weekly refresh'],
    cta: 'Start Free',
    href: '/login',
    variant: 'outline'
  },
  {
    name: 'Starter',
    priceMonthly: 'Rs.499',
    priceYearly: 'Rs.4990',
    description: 'Best for founders and small projects.',
    features: ['20 Growth reports / mo', '5 Competitors', '20+ Opportunity cards', 'Every few days refresh', 'Email alerts'],
    cta: 'Upgrade to Starter',
    href: '/checkout?plan=starter',
    variant: 'default',
    popular: true
  },
  {
    name: 'Pro',
    priceMonthly: 'Rs.999',
    priceYearly: 'Rs.9990',
    description: 'For power users and agencies.',
    features: ['50 Growth reports / mo', 'Unlimited Competitors', 'All Opportunity cards', 'Daily opportunity refresh', 'Priority AI queue', 'Competitor spike alerts'],
    cta: 'Upgrade to Pro',
    href: '/checkout?plan=pro',
    variant: 'default'
  }
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription from your billing settings at any time without any hidden fees." },
  { q: "What happens when I hit the limit?", a: "You can still browse your existing reports and opportunities, but you'll need to upgrade to generate new intelligence." },
  { q: "Do reports reset monthly?", a: "Yes, your report allowance resets automatically on the first day of your billing cycle." },
  { q: "Is there a free trial?", a: "We offer a fully functional Free plan with 1 report per month so you can test the platform's capabilities." }
];

const BillingToggle = ({ billingPeriod, setBillingPeriod }: { billingPeriod: BillingPeriod, setBillingPeriod: (p: BillingPeriod) => void }) => (
  <div className="bg-black/20 p-1.5 rounded-full border border-white/10 flex items-center mb-16 relative z-10 w-fit mx-auto">
    {(['monthly', 'yearly'] as const).map((period) => (
      <button
        key={period}
        onClick={() => setBillingPeriod(period)}
        className={`px-8 py-3 rounded-full text-sm font-bold capitalize transition-all duration-300 relative ${billingPeriod === period ? 'text-white' : 'text-slate-400 hover:text-white'}`}
      >
        {billingPeriod === period && (
          <motion.div 
            layoutId="toggle" 
            className="absolute inset-0 bg-brand-orange rounded-full shadow-lg" 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
          />
        )}
        <span className="relative z-10">{period}</span>
      </button>
    ))}
  </div>
)

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center py-32 px-4 selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      <HaloBackground />
      
      <div className="text-center space-y-6 mb-20 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tightest leading-none drop-shadow-sm">Simple, transparent pricing.</h1>
        <p className="text-slate-400 text-xl font-medium">Choose the plan that fits your growth ambitions.</p>
      </div>

      <BillingToggle billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
        {plans.map((p) => (
          <motion.div 
            key={p.name}
            whileHover={{ scale: 1.02 }}
            transition={springConfig15}
            className={`flex flex-col ${p.popular ? 'z-20' : 'z-10'}`}
          >
            <Card aria-labelledby={`plan-title-${p.name}`} className={`bg-slate-900/60 backdrop-blur-2xl border h-full flex flex-col relative rounded-[2.5rem] overflow-hidden transition-all duration-300 ${p.popular ? 'border-brand-orange/50 shadow-2xl shadow-brand-orange/20 ring-1 ring-brand-orange/30' : 'border-white/10 shadow-premium hover:border-brand-orange/30'}`}>
              {p.popular && (
                <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                  <span aria-label="This is our most popular plan" className="bg-brand-orange text-white text-[10px] font-bold uppercase py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg shadow-brand-orange/20">
                    <Sparkles className="h-3.5 w-3.5" /> Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={`p-10 ${p.popular ? 'bg-brand-orange/10 border-b border-brand-orange/20' : 'bg-black/20 border-b border-white/5'}`}>
                <CardTitle id={`plan-title-${p.name}`} className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">{p.name}</CardTitle>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-md">
                    {billingPeriod === 'monthly' ? p.priceMonthly : p.priceYearly}
                  </span>
                  <span className="text-slate-400 font-medium">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <p className="text-sm text-slate-400 font-medium mt-3">{p.description}</p>
              </CardHeader>
              <CardContent className="p-10 pt-8 flex-1 bg-transparent">
                <ul className="space-y-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-4 text-sm font-medium text-slate-300">
                      <div className="bg-emerald-500/20 p-1 rounded-full shrink-0 mt-0.5 border border-emerald-500/30">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-10 bg-black/20 border-t border-white/5">
                <Button asChild className={`w-full h-14 rounded-full font-bold text-lg transition-transform active:scale-95 ${p.variant === 'default' ? 'bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/20 border border-white/10' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-brand-orange/50 backdrop-blur-md'}`} variant={p.variant}>
                  <Link href={p.href} aria-label={`${p.cta} plan`}>{p.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-40 max-w-4xl w-full space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative z-10">
        <h2 className="text-4xl font-bold text-center tracking-tightest drop-shadow-sm">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {faqs.map((faq, i) => (
             <div key={i} className="space-y-3 bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-premium">
                <h4 className="font-bold text-lg tracking-tight text-white">{faq.q}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{faq.a}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
