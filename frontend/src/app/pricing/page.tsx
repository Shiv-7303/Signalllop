'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  CheckCircle2, Rocket, Star,
  ChevronDown, ArrowRight, MoveDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Best for curious users.',
    features: [
      '1 Growth reports/month',
      '1 Competitor tracked',
      'Limited opportunities',
      'Weekly digest',
    ],
    cta: 'Get Started Free',
    href: '/login',
  },
  {
    name: 'Starter',
    monthlyPrice: 499,
    yearlyPrice: 399,
    description: 'Best for indie hackers & creators.',
    features: [
      '20 Reports/month',
      '5 Competitors tracked',
      'Weekly opportunity feed',
      'Saved opportunities',
    ],
    cta: 'Upgrade to Starter',
    href: '/checkout?plan=starter',
    popular: true,
  },
  {
    name: 'Pro',
    monthlyPrice: 999,
    yearlyPrice: 799,
    description: 'Best for SaaS founders & agencies.',
    features: [
      '50 Reports/month',
      'Competitor tracking',
      'Priority AI analysis',
      'Advanced opportunities',
      'Weekly growth intelligence',
    ],
    cta: 'Upgrade to Pro',
    href: '/checkout?plan=pro',
  }
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, no questions asked. Your plan stays active until the end of the billing cycle." },
  { q: "What if I exceed limits?", a: "We show upgrade modal, never surprise charge. You can always see your usage on the dashboard." },
  { q: "Do reports reset monthly?", a: "Yes. Your report allowance resets automatically on the first day of every billing cycle." },
  { q: "Is there a free trial?", a: "Free plan forever. You get 1 report per month to test the core capabilities." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white sketch-border border-2 border-slate-200 p-1 mb-4 shadow-[2px_2px_0px_#1a1a2e] cursor-pointer group"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between p-4 gap-4">
        <h4 className="font-bold text-slate-900 text-lg leading-snug">{q}</h4>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 group-hover:text-brand-orange transition-colors">
          <ChevronDown className="h-6 w-6 stroke-[3]" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
               <div className="h-0.5 bg-slate-100 w-full mb-4" />
               <p className="text-base text-slate-600 font-medium leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const { user, isLoading } = useUser()
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen w-full bg-[var(--paper-white)] text-slate-900 relative overflow-x-hidden flex flex-col">

      {/* BACKGROUND NOISE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex flex-col items-center flex-1">

        {/* ─── Nav ─── */}
        <nav className="w-full max-w-5xl flex items-center justify-between px-6 pt-8 pb-0">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="bg-brand-orange p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-handdrawn text-2xl font-bold tracking-tight text-slate-900 mt-1">SignalLoop</span>
          </Link>
          {!isLoading && (
            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="outline" className="sketch-border-sm bg-white border-2 border-slate-900 text-slate-900 hover:bg-highlight-yellow font-bold h-10 px-6 text-sm transition-all shadow-[2px_2px_0px_#1a1a2e] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#1a1a2e]">
                {user ? "Dashboard" : "Sign in"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </nav>

        {/* ─── Hero ─── */}
        <section className="flex flex-col items-center text-center pt-24 pb-12 px-4 max-w-3xl mx-auto">
          <h1 className="text-[60px] md:text-[80px] font-handdrawn text-slate-900 leading-tight mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-bold mb-12">
            Start free. Upgrade when you&apos;re ready.
          </p>

          <div className="flex flex-col items-center mb-8 relative">
            <MoveDown className="h-10 w-10 text-brand-orange animate-bounce" strokeWidth={3} />
            <svg className="absolute -right-12 top-6 w-8 h-8 text-slate-400 transform -rotate-12" viewBox="0 0 100 100">
               <path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>

          {/* Billing Toggle */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute -top-8 -right-12 transform rotate-6 z-20">
               <span className="bg-emerald-100 text-emerald-700 border-2 border-emerald-700 sketch-border-sm font-handdrawn text-lg px-3 py-1 shadow-[2px_2px_0px_#047857]">
                 Save 20%
               </span>
            </div>
            <div className="flex items-center gap-4 bg-white sketch-border border-2 border-slate-900 p-2 shadow-[4px_4px_0px_#1a1a2e]">
              <button 
                onClick={() => setIsYearly(false)}
                className={cn("px-6 py-2 font-bold text-sm transition-colors", !isYearly ? "bg-highlight-yellow text-slate-900 sketch-border-sm border-2 border-slate-900" : "text-slate-500 hover:text-slate-900")}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={cn("px-6 py-2 font-bold text-sm transition-colors", isYearly ? "bg-highlight-yellow text-slate-900 sketch-border-sm border-2 border-slate-900" : "text-slate-500 hover:text-slate-900")}
              >
                Yearly
              </button>
            </div>
          </div>
        </section>

        {/* ─── Pricing Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6 mb-32 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={cn(
                "sketch-border bg-white flex flex-col relative w-full transition-transform hover:-translate-y-2 duration-300 md:rotate-0",
                plan.popular 
                  ? "border-4 border-slate-900 shadow-[8px_8px_0px_#1a1a2e] md:-translate-y-4 md:-rotate-1 z-10 scale-100 md:scale-105" 
                  : "border-2 border-slate-300 shadow-[4px_4px_0px_#cbd5e1] rotate-1"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 -right-4 z-20">
                  <span className="bg-highlight-yellow text-slate-900 border-2 border-slate-900 sketch-border-sm font-bold text-xs uppercase tracking-widest px-4 py-1.5 shadow-[2px_2px_0px_#1a1a2e] transform rotate-3 inline-block">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 pb-6 flex-1 flex flex-col">
                <h3 className="font-handdrawn text-4xl text-slate-900 mb-2">{plan.name}</h3>
                <p className="font-bold text-slate-500 text-sm mb-6">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-slate-900">
                    {plan.monthlyPrice === 0 ? 'Free' : `₹${isYearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                  </span>
                  {plan.monthlyPrice > 0 && <span className="text-slate-500 font-bold text-sm">/mo</span>}
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" strokeWidth={3} />
                      <span className="font-bold text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  asChild
                  className={cn(
                    "w-full h-14 text-base sketch-border-sm border-2 shadow-[2px_2px_0px_#1a1a2e] active:shadow-none active:translate-y-[2px] transition-all",
                    plan.popular 
                      ? "bg-brand-orange hover:bg-orange-600 text-white border-slate-900" 
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-900"
                  )}
                >
                  <Link href={user && plan.monthlyPrice === 0 ? "/dashboard" : plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ─── FAQ ─── */}
        <section className="w-full max-w-3xl px-6 pb-32">
          <div className="text-center mb-12 relative">
            <h2 className="text-4xl font-handdrawn text-slate-900">
              Questions?
            </h2>
            <svg className="absolute -top-6 left-1/2 ml-20 w-12 h-12 text-highlight-yellow transform -rotate-12" viewBox="0 0 100 100">
               <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="currentColor" stroke="#1a1a2e" strokeWidth="3" />
            </svg>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA BANNER ─── */}
        <section className="w-full bg-slate-900 py-24 relative overflow-hidden mt-auto">
          {/* Hand-drawn stars in background */}
          <div className="absolute top-10 left-10 opacity-20"><Star className="w-16 h-16 text-white" strokeWidth={1} /></div>
          <div className="absolute bottom-10 right-20 opacity-20"><Star className="w-12 h-12 text-white" strokeWidth={1} /></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
             <h2 className="text-4xl md:text-5xl font-handdrawn text-white mb-10 leading-tight">
               Still thinking?<br />Start free — no card needed.
             </h2>
             <Button asChild className="bg-highlight-yellow hover:bg-yellow-300 text-slate-900 h-16 px-10 text-lg sketch-border border-2 border-slate-900 shadow-[4px_4px_0px_#f97316] font-bold active:translate-y-1 active:shadow-none transition-all">
               <Link href="/onboarding">✦ Analyze My Business — Free →</Link>
             </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
