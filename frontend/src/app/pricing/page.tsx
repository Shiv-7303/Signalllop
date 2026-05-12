'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  CheckCircle2, Sparkles, Rocket, Zap, Shield, Star,
  ChevronDown, ArrowRight, Users, TrendingUp, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/hooks/useUser'

interface Plan {
  name: string;
  price: number;
  description: string;
  features: { text: string; highlight?: boolean }[];
  cta: string;
  href: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for exploring what SignalLoop can do.',
    icon: <Rocket className="h-5 w-5" />,
    features: [
      { text: '1 Growth report / month' },
      { text: '1 Competitor tracked' },
      { text: '3 Opportunity cards' },
      { text: 'Weekly data refresh' },
    ],
    cta: 'Get Started Free',
    href: '/login',
  },
  {
    name: 'Starter',
    price: 499,
    description: 'For founders who want an unfair advantage.',
    icon: <Zap className="h-5 w-5" />,
    features: [
      { text: '20 Growth reports / month', highlight: true },
      { text: '5 Competitors tracked', highlight: true },
      { text: '20+ Opportunity cards' },
      { text: 'Every-few-days refresh' },
      { text: 'Email alerts & digests' },
    ],
    cta: 'Upgrade to Starter',
    href: '/checkout?plan=starter',
    popular: true,
  },
  {
    name: 'Pro',
    price: 999,
    description: 'For power users and growing teams.',
    icon: <Shield className="h-5 w-5" />,
    features: [
      { text: '50 Growth reports / month', highlight: true },
      { text: 'Unlimited competitors', highlight: true },
      { text: 'All Opportunity cards' },
      { text: 'Daily opportunity refresh' },
      { text: 'Priority AI queue' },
      { text: 'Competitor spike alerts' },
    ],
    cta: 'Upgrade to Pro',
    href: '/checkout?plan=pro',
  }
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime from your billing settings — no hidden fees, no questions asked. Your plan stays active until the end of the billing cycle." },
  { q: "What happens when I hit the report limit?", a: "You can still browse existing reports and opportunities. To generate fresh intelligence, simply upgrade your plan or wait for the next billing cycle." },
  { q: "Do reports reset monthly?", a: "Yes. Your report allowance resets automatically on the first day of every billing cycle, so you always start fresh." },
  { q: "Is there a free trial for paid plans?", a: "We offer a fully functional Free plan with 1 report per month so you can test the platform's core capabilities before upgrading." },
  { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
  { q: "Do you offer team or agency pricing?", a: "Yes! Reach out to us at hello@signalloop.in and we'll put together a custom plan that fits your team's needs." },
];

const trustStats = [
  { icon: <Users className="h-4 w-4" />, value: '2,400+', label: 'Founders using SignalLoop' },
  { icon: <TrendingUp className="h-4 w-4" />, value: '180K+', label: 'Buying signals surfaced' },
  { icon: <Clock className="h-4 w-4" />, value: '<5min', label: 'Average setup time' },
  { icon: <Star className="h-4 w-4" />, value: '4.9★', label: 'Average rating' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        <h4 className="font-bold text-slate-900 text-[15px] leading-snug">{q}</h4>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="h-5 w-5 text-slate-400" />
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
          >
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-6 pb-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const { user, isLoading } = useUser()

  return (
    <div className="min-h-screen w-full bg-white selection:bg-orange-100 text-slate-900 font-sans relative overflow-x-hidden">

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FF4500]/8 via-white to-white pointer-events-none z-0" />

      {/* Dotted grid */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent_5%,black_20%,black_80%,transparent_95%)] opacity-35 pointer-events-none z-0" />

      {/* Subtle orange orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF4500]/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center">

        {/* ─── Nav ─── */}
        <nav className="w-full max-w-6xl flex items-center justify-between px-6 pt-8 pb-0">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="bg-[#FF4500] p-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-slate-900">SignalLoop</span>
          </Link>
          {!isLoading && (
            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500] font-bold rounded-xl h-10 px-5 text-sm transition-all duration-300 group">
                {user ? "Dashboard" : "Sign in"} <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          )}
        </nav>

        {/* ─── Hero ─── */}
        <section className="flex flex-col items-center text-center pt-20 pb-16 px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-[#FF4500]/20 text-[#FF4500] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Pricing that scales with you
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 mb-6">
              Simple pricing.{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#FF4500]">Big results.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-0 w-full h-3 bg-[#FF4500]/15 -z-10 origin-left rounded-full"
                />
              </span>
            </h1>

            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Stop guessing where your next customer is. SignalLoop surfaces real buying signals from Reddit — so you can sell smarter, not harder.
            </p>
          </motion.div>
        </section>

        {/* ─── Trust Stats ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6 mb-16"
        >
          {trustStats.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 text-slate-500">
              <div className="text-[#FF4500]">{s.icon}</div>
              <span className="font-extrabold text-slate-900 text-sm">{s.value}</span>
              <span className="text-xs font-semibold">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ─── Pricing Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 mb-24 items-start">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * idx }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex"
            >
              <div
                className={`relative flex flex-col w-full rounded-[2rem] overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#FF4500] to-[#FF6A33] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.45)] ring-1 ring-[#FF4500]/20 md:scale-105'
                    : 'bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.12)]'
                }`}
              >
                {/* Background Decoration */}
                <div className="absolute -top-8 -right-8 p-4 opacity-[0.08] pointer-events-none transform rotate-12 z-0">
                  {plan.name === 'Starter' ? <Zap className={`w-40 h-40 ${plan.popular ? 'text-white' : 'text-[#FF4500]'}`} /> :
                   plan.name === 'Pro' ? <Shield className={`w-40 h-40 ${plan.popular ? 'text-white' : 'text-[#FF4500]'}`} /> :
                   <Rocket className={`w-40 h-40 ${plan.popular ? 'text-white' : 'text-[#FF4500]'}`} />}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-5 right-5">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1.5 border border-white/30 shadow-sm">
                        <Sparkles className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Card Header */}
                  <div className={`p-8 pb-6 ${plan.popular ? '' : 'border-b border-white/40'}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 shadow-sm border ${plan.popular ? 'bg-white/20 text-white border-white/30' : 'bg-white text-[#FF4500] border-white/80'}`}>
                      {plan.icon}
                    </div>

                    <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h2>
                    <p className={`text-sm font-medium leading-snug mb-8 ${plan.popular ? 'text-orange-100' : 'text-slate-600'}`}>
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-end gap-1.5">
                      <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className={`text-sm font-semibold pb-1.5 ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                          /month
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-8 pb-6 pt-6">
                    <Link href={user && plan.price === 0 ? "/dashboard" : plan.href} className="block">
                      <button
                        className={`w-full h-12 rounded-xl font-bold text-[15px] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group ${
                          plan.popular
                            ? 'bg-white text-[#FF4500] hover:bg-orange-50 shadow-lg'
                            : plan.price === 0
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                            : 'bg-[#FF4500] text-white hover:bg-[#FF4500]/90 shadow-[0_4px_14px_0_rgba(255,69,0,0.3)]'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className={`mx-8 mb-6 border-t ${plan.popular ? 'border-white/20' : 'border-white/40'}`} />

                  {/* Features */}
                  <div className="px-8 pb-8 flex-1">
                    <p className={`text-[11px] uppercase tracking-widest font-bold mb-5 ${plan.popular ? 'text-orange-200' : 'text-slate-500'}`}>
                      What's included
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-3">
                          {/* Check icon */}
                          <div className={`shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center ${
                            plan.popular ? 'bg-white/20 shadow-sm' : f.highlight ? 'bg-[#FF4500]/20 shadow-sm' : 'bg-white/60 border border-white/80 shadow-sm'
                          }`}>
                            <CheckCircle2 className={`h-3.5 w-3.5 ${plan.popular ? 'text-white' : 'text-[#FF4500]'}`} />
                          </div>

                          {/* Feature text + optional highlight tag */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm leading-snug ${
                              plan.popular
                                ? 'font-bold text-white'
                                : f.highlight
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-700'
                            }`}>
                              {f.text}
                            </span>
                            {f.highlight && !plan.popular && (
                              <span className="inline-flex items-center text-[10px] font-bold text-[#FF4500] bg-white border border-[#FF4500]/20 px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                                Key
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Social Proof Strip ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-4xl px-4 mb-24"
        >
          <div className="bg-gradient-to-r from-[#FF4500]/5 via-orange-50/60 to-[#FF4500]/5 border border-[#FF4500]/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FF4500] text-[#FF4500]" />
                ))}
              </div>
              <p className="text-slate-700 font-semibold text-[15px] leading-relaxed italic">
                "SignalLoop helped us find 3 warm leads in our first week — people already asking for what we built. It's like having a radar for buyers."
              </p>
              <p className="mt-3 text-sm font-bold text-slate-500">— Arjun M., Founder @ BuildrHQ</p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-5">
              <span className="text-4xl font-extrabold text-slate-900">3.2×</span>
              <span className="text-xs font-bold text-slate-500 text-center">avg. lead generation<br />improvement</span>
            </div>
          </div>
        </motion.div>

        {/* ─── FAQ ─── */}
        <section className="w-full max-w-3xl px-4 pb-28">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              Got questions?
            </h2>
            <p className="text-slate-500 font-medium">Everything you need to know before you commit.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 font-medium mb-5">Still have questions? We're here to help.</p>
            <a
              href="mailto:hello@signalloop.in"
              className="inline-flex items-center gap-2 bg-[#FF4500] text-white font-bold px-7 py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(255,69,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              Chat with us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-slate-100 py-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-400 font-medium">
          <span>© {new Date().getFullYear()} SignalLoop. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#FF4500] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FF4500] transition-colors">Terms</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}
