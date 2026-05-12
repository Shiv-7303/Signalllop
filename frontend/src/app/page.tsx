'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, MessageSquare, Rocket, Search, Shield, Target, Users, Zap, CheckCircle2, Plus, Sparkles, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'


const faqs = [
  {
    q: "How does SignalLoop scan Reddit?",
    a: "SignalLoop uses Reddit's official API (via PRAW) to continuously search across thousands of relevant subreddits. Our AI analyzes post titles, bodies, and comment threads to detect buying signals, pain points, competitor mentions, and content opportunities — all specific to your business. You don't need a Reddit account; just add your business details and we handle the rest."
  },
  {
    q: "What does the AI Growth Score mean?",
    a: "The Growth Score (0–100) is calculated by our AI based on the quality and quantity of Reddit signals found for your business in the last scan. A higher score means more active discussions, stronger buying signals, and more addressable opportunities. It's updated every time you generate a new report, so you can track momentum over time."
  },
  {
    q: "Can I track multiple businesses?",
    a: "Yes — depending on your plan. The Free plan supports 1 business profile. The Starter plan (Rs. 499/mo) supports up to 3 business profiles, and the Pro plan (Rs. 999/mo) gives you unlimited profiles. Each business gets its own report history, opportunity feed, and competitor tracking."
  },
  {
    q: "How often does the opportunity scanner run?",
    a: "It depends on your plan. Free plan users get a manual scan — you generate reports on demand (1 report/month). Starter plan gets auto-scanning every few days so fresh opportunities appear without you doing anything. Pro plan users get daily scans plus real-time background monitoring — you'll never miss a high-intent conversation."
  },
  {
    q: "Do you monitor competitor mentions automatically?",
    a: "Yes, on Starter and Pro plans. Add your competitors' names during onboarding and SignalLoop will track whenever they're mentioned on Reddit — what users love, what they complain about, and where they're losing ground. Free plan supports 1 competitor tracked manually. Pro plan users get unlimited competitors with daily automated monitoring."
  },
  {
    q: "Can I cancel my plan anytime?",
    a: "Absolutely. There are no lock-in contracts. You can cancel your subscription at any time from your Billing page. You'll continue to have access to your paid plan features until the end of your current billing period. After that, your account automatically moves to the Free plan — your data and reports are never deleted."
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="flex-1 w-full space-y-3">
      {faqs.map((item, i) => (
        <div
          key={i}
          className={`bg-white border rounded-sm shadow-sm transition-all duration-200 ${openIndex === i ? 'border-slate-900' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full p-5 flex justify-between items-center text-left gap-4"
          >
            <p className={`font-medium text-sm transition-colors ${openIndex === i ? 'text-slate-900' : 'text-slate-700'}`}>{item.q}</p>
            <div className={`w-6 h-6 shrink-0 rounded-sm flex items-center justify-center border transition-all duration-200 ${openIndex === i ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-100'}`}>
              {openIndex === i
                ? <span className="text-white text-lg leading-none font-light">−</span>
                : <Plus className="w-3.5 h-3.5 text-slate-400" />
              }
            </div>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5">
              <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-transparent text-slate-900 font-sans min-h-screen selection:bg-orange-100 overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 -z-50 bg-white" />
      <div className="fixed inset-0 -z-40 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 -z-30 bg-gradient-to-t from-orange-50/50 to-transparent" />

      {/* NAVBAR */}
      <nav className="fixed top-6 left-6 right-6 z-50 max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-white/50 px-5 py-2 rounded-sm flex items-center justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.4)_inset]">
        <Link className="flex items-center gap-2 pl-2 group" href="/">
          <div className="bg-orange-600 p-1.5 rounded-sm shadow-sm">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-sm text-slate-900">SignalLoop</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-600">
          <Link href="#" className="text-slate-900 hover:text-slate-950 transition-colors">Home</Link>
          <Link href="#about" className="hover:text-slate-900 transition-colors">About</Link>
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Blog</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:flex bg-[#FF4500] text-white text-[13px] font-medium px-4 py-1.5 rounded-sm items-center gap-2 transition-all hover:bg-slate-800 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
              Get free trial <ArrowRight className="h-3 w-3" />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-900 p-1">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-6 right-6 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-sm shadow-xl p-5 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-900">Home</Link>
          <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">About</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Pricing</Link>
          <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Blog</Link>
          <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Contact</Link>
          <div className="w-full h-px bg-slate-200 my-1" />
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-[#FF4500] text-white text-[13px] font-medium px-4 py-2.5 rounded-sm transition-all hover:bg-slate-800 shadow-sm">
            Get free trial
          </Link>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-white via-white to-[#ffebe0] mx-4 pt-32 md:pt-40 pb-24 md:pb-32 rounded-b-[3rem] shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-slate-200 text-[11px] font-medium text-slate-600 bg-white shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-sm bg-orange-500" />
              Now live — Reddit intelligence for your business
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-slate-900 max-w-xl">
              Find buyers hiding on <span className="relative inline-block"><span className="relative z-10">Reddit</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-orange-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              SignalLoop scans Reddit in real-time to surface buying signals, competitor mentions & market opportunities — so you never miss a lead again.
            </p>

            <div className="pt-6">
              <Link href="/login" className="w-fit bg-[#FF4500] text-white text-[15px] font-medium px-6 py-3 rounded-sm flex items-center gap-2 transition-all hover:bg-[#cc3700] shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
                Start searching now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Logo Cloud inside Hero */}
            <div className="pt-10 overflow-hidden w-full max-w-sm relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <motion.div 
                className="flex items-center gap-8 opacity-50 grayscale w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...['r/SaaS', 'r/startups', 'r/entrepreneur', 'r/marketing'], ...['r/SaaS', 'r/startups', 'r/entrepreneur', 'r/marketing']].map((logo, i) => (
                  <div key={i} className="flex items-center gap-2 font-bold text-sm tracking-tight shrink-0">
                    <div className="w-5 h-5 bg-slate-400 rounded-md" /> {logo}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex flex-col items-start gap-6 pl-24"
          >
             {/* Unboxed Video */}
             <div className="w-full aspect-[4/3] max-w-sm overflow-hidden">
                 <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                   <source src="/v1.mp4" type="video/mp4" />
                 </video>
             </div>
             
             {/* Separator */}
             <div className="w-full max-w-sm h-px bg-slate-200" />
             
             {/* Text and Rating */}
             <div className="text-left space-y-4 max-w-sm">
               <p className="text-sm text-slate-600">Scans Reddit 24/7 and classifies every post by buying intent, pain point, or competitor mention — automatically.</p>
               <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-slate-600">4.8 rated by 500+ founders</span>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
      </section>

      {/* DASHBOARD MOCKUP WITH BLUE BLOB & DOT GRID */}
      <motion.section 
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative w-full max-w-7xl mx-auto px-4 pb-20 pt-10 -mt-32 z-30"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[350px] bg-orange-100/40 rounded-sm blur-[80px]" />
        </div>

        {/* The Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl bg-white border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Mockup Header */}
          <div className="h-10 bg-slate-50/80 border-b border-slate-200 flex items-center px-4 gap-2 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            </div>
            <div className="mx-auto hidden sm:flex bg-white border border-slate-200 shadow-sm rounded-md px-24 py-1.5 text-[10px] text-slate-400 font-medium items-center gap-1.5">
              <Search className="w-3 h-3" /> Search insights...
            </div>
          </div>
          {/* Mockup Body */}
          <div className="flex flex-col sm:flex-row h-auto sm:h-[450px]">
            {/* Sidebar */}
            <div className="hidden sm:block w-48 bg-slate-50/30 border-r border-slate-100 p-3 space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-medium bg-orange-50/50 p-2 rounded-lg text-xs border border-orange-100/50">
                <BarChart3 className="w-3.5 h-3.5" /> Dashboard
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium p-2 text-xs hover:bg-slate-50 rounded-lg cursor-pointer">
                <Users className="w-3.5 h-3.5" /> Competitors
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium p-2 text-xs hover:bg-slate-50 rounded-lg cursor-pointer">
                <Target className="w-3.5 h-3.5" /> Opportunities
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-hidden space-y-6">
               <h3 className="font-bold text-lg">Overview</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Total Signals Found</p>
                     <p className="text-xl sm:text-2xl font-bold">150,000</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Competitor Mentions</p>
                     <p className="text-xl sm:text-2xl font-bold">1,250</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Growth Rate</p>
                     <p className="text-xl sm:text-2xl font-bold text-emerald-500">+5.80%</p>
                  </div>
               </div>
               <div className="h-40 sm:h-52 border border-slate-100 rounded-xl flex items-end px-4 sm:px-8 pb-6 gap-2 sm:gap-4 pt-8 relative overflow-hidden bg-slate-50/30">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-sm opacity-60 relative z-10" style={{ height: `${h}%` }} />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4-COLUMN FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:px-8">
          {[
          { icon: Sparkles, title: "AI buying signal detection", desc: "Identify Reddit posts where people are actively looking to buy what you sell — before your competitors do." },
            { icon: BarChart3, title: "Growth Score dashboard", desc: "Get a 0–100 growth score with key intelligence bullets, top subreddits, and recommended actions." },
            { icon: Zap, title: "Automated opportunity scanner", desc: "SignalLoop scans Reddit every 4 hours and surfaces new signals with zero manual effort." },
            { icon: Shield, title: "Competitor monitoring", desc: "Track when your competitors are mentioned on Reddit and get daily alerts on brand sentiment." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-100 p-6 rounded-sm shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-sm bg-orange-50 flex items-center justify-center border border-orange-100">
                <feature.icon className="w-5 h-5 text-orange-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-base tracking-tight text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* 3 STEPS SECTION */}
      <section className="bg-gradient-to-b from-white  to-[#ffebe0] mx-4 pt-20 pb-32 rounded-b-[3rem] shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16 sm:mb-24 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
              From signup to signals in <span className="relative inline-block"><span className="relative z-10">3 steps</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-orange-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span>
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">Set up your business profile and let SignalLoop do the Reddit scanning for you — in minutes.</p>
          </motion.div>
            
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-min">

               {/* Step 1 — slides in from LEFT */}
               <motion.div
                 className="md:col-span-4 flex flex-col gap-6"
                 initial={{ opacity: 0, x: -80 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-80px" }}
                 transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
               >
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-full text-[10px] text-slate-400 p-4 space-y-2">
                           <div className="flex justify-between"><span>Apple</span><span>340</span></div>
                           <div className="flex justify-between"><span>Tesla</span><span>243</span></div>
                           <div className="flex justify-between"><span>Google</span><span>3364</span></div>
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF4500] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">01</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">Add your business</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Enter your niche, target audience & goals. Our AI generates 10 targeted Reddit keywords instantly.</p>
                   </div>
               </motion.div>

               {/* Step 2 — slides in from BOTTOM */}
               <motion.div
                 className="md:col-span-5 md:mt-16 flex flex-col gap-6"
                 initial={{ opacity: 0, y: 80 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-80px" }}
                 transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
               >
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-[#FF4500] animate-spin" />
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF4500] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">02</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">We scan Reddit for you</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">SignalLoop searches subreddits, scores every post by engagement & opportunity, and classifies intent: buying, pain point, comparison, or discussion.</p>
                   </div>
               </motion.div>

               {/* Step 3 — slides in from RIGHT */}
               <motion.div
                 className="md:col-span-3 flex flex-col gap-6"
                 initial={{ opacity: 0, x: 80 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-80px" }}
                 transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
               >
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-full flex items-end gap-2 p-4 h-full">
                            <div className="w-full h-1/2 bg-orange-200 rounded-sm" />
                            <div className="w-full h-3/4 bg-orange-600 rounded-sm" />
                            <div className="w-full h-1/2 bg-orange-200 rounded-sm" />
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF4500] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">03</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">Act on your Growth Report</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Get your AI Growth Score, top communities to target, recommended actions & competitor Reddit mentions - delivered weekly.</p>
                   </div>
               </motion.div>

            </div>
        </div>
      </section>

      {/* WHERE SIGNALS COME FROM — SUBREDDITS */}
      <section className="py-24 px-4 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Where your signals come from</h2>
        <p className="text-sm md:text-base text-slate-500 mb-4 max-w-xl mx-auto">SignalLoop taps directly into Reddit&apos;s data — the most honest, unfiltered place where your customers talk.</p>
        <p className="text-xs text-slate-400 mb-12">Scanning millions of posts across the communities your buyers actually use</p>

        {/* Subreddit Grid */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
           {[
             { name: "r/SaaS", members: "180K" },
             { name: "r/entrepreneur", members: "1.8M" },
             { name: "r/indiehackers", members: "92K" },
             { name: "r/startups", members: "1.1M" },
             { name: "r/webdev", members: "1.9M" },
             { name: "r/marketing", members: "620K" },
             { name: "r/smallbusiness", members: "930K" },
             { name: "r/ecommerce", members: "340K" },
             { name: "r/digitalnomad", members: "410K" },
             { name: "r/freelance", members: "310K" },
             { name: "r/nocode", members: "78K" },
             { name: "r/forhire", members: "210K" },
           ].map((sub, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 12 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.06 }}
               whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
               className="bg-white border border-slate-200 rounded-full px-4 py-2 flex flex-col items-center cursor-pointer transition-all shadow-sm hover:border-orange-300 group"
             >
               <span className="text-sm font-bold text-slate-800 group-hover:text-orange-500 transition-colors">{sub.name}</span>
               <span className="text-[10px] text-slate-400">{sub.members} members</span>
             </motion.div>
           ))}
        </div>

        {/* Reddit badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
          <span>Powered by Reddit&apos;s live data · Updated every 4 hours</span>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="relative py-32 px-4 border-y border-slate-100 overflow-hidden bg-slate-50">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-400/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Simple, transparent pricing</h2>
             <p className="text-base text-slate-500 max-w-xl mx-auto">Start free. Upgrade when Reddit intelligence becomes your competitive edge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Free */}
            <motion.div 
               initial={{ opacity: 0, y: 80 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true, margin: "-50px" }} 
               transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0 }} 
               whileHover={{ y: -6, transition: { duration: 0.2 } }} 
               className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-lg relative overflow-hidden group"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
               <h3 className="font-bold text-xl mb-2">Free</h3>
               <p className="text-sm text-slate-500 mb-6 h-10">Try SignalLoop with no credit card required.</p>
               <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tighter">Free</span>
               </div>
               <button className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl mb-8 transition-all text-sm">
                 Get started
               </button>
               <ul className="space-y-4 text-sm text-slate-600">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>1 business profile</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>1 competitor tracked</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>1 AI growth report/month</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>3 opportunity cards</span></li>
               </ul>
            </motion.div>

            {/* Starter (Highlighted) */}
            <motion.div 
               initial={{ opacity: 0, y: 120 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true, margin: "-50px" }} 
               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} 
               whileHover={{ y: -8, transition: { duration: 0.2 } }} 
               className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-2xl relative z-10 md:-mt-8 transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
               
               <div className="absolute top-4 right-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">Most Popular</div>

               <h3 className="font-bold text-xl mb-2 text-white">Starter</h3>
               <p className="text-sm text-slate-400 mb-6 h-10">For founders who want to stay ahead of Reddit conversations.</p>
               <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tighter text-white">Rs. 499</span><span className="text-sm text-slate-400 font-medium">/mo</span>
               </div>
               <button className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold py-3 rounded-xl mb-8 transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] text-sm relative z-10">
                 Upgrade to Starter
               </button>
               <ul className="space-y-4 text-sm text-slate-300 font-medium">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" /> <span className="text-white">3 business profiles</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" /> <span className="text-white">Auto scan every 4 hours</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" /> <span className="text-white">5 competitors tracked</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" /> <span className="text-white">Weekly digest email</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" /> <span className="text-white">Priority support</span></li>
               </ul>
            </motion.div>

            {/* Pro */}
            <motion.div 
               initial={{ opacity: 0, y: 80 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true, margin: "-50px" }} 
               transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} 
               whileHover={{ y: -6, transition: { duration: 0.2 } }} 
               className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-lg relative overflow-hidden group"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
               <h3 className="font-bold text-xl mb-2">Pro</h3>
               <p className="text-sm text-slate-500 mb-6 h-10">For agencies and power users running multiple brands.</p>
               <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tighter">Rs. 999</span><span className="text-sm text-slate-500 font-medium">/mo</span>
               </div>
               <button className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl mb-8 transition-all text-sm">
                 Get started
               </button>
               <ul className="space-y-4 text-sm text-slate-600">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>Unlimited business profiles</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>Unlimited competitor tracking</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>50 AI growth reports/month</span></li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span>Daily background monitoring</span></li>
               </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
          <div className="w-48 sm:w-64 md:w-1/3 aspect-square mx-auto md:mx-0 bg-slate-50 rounded-sm overflow-hidden shadow-inner flex items-center justify-center border border-slate-100 shrink-0">
             {/* Photo Placeholder */}
             <Users className="w-16 h-16 text-slate-300" />
          </div>
          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
            <svg className="w-8 h-8 text-slate-300 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-[1.2]">
              &quot;Within a week of using SignalLoop, we found 3 Reddit threads where people were actively asking for our product. We closed 2 of them.&quot;
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
               <div>
                 <p className="font-bold text-sm">Rahul Mehta</p>
                 <p className="text-slate-500 text-xs">Founder, B2B SaaS</p>
               </div>
               <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
                 <div className="w-6 h-6 bg-slate-200 rounded-sm" /> NovaTech
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* HELP AND SUPPORT (FAQ) */}
      <section className="bg-slate-50/80 py-24 px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto lg:px-8 flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Help and <span className="relative inline-block"><span className="relative z-10">support</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-orange-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span></h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-sm">Answers to common questions about setup, pricing, and how everything works.</p>
            {/* Doodle Placeholder */}
            <div className="w-24 h-24 border-2 border-slate-900 rounded-sm flex items-center justify-center my-6 bg-white shadow-md">
               <MessageSquare className="w-10 h-10 text-slate-900" strokeWidth={1.5} />
            </div>
            <div className="pt-2">
              <p className="font-bold text-sm mb-2">Still got questions?</p>
              <button className="bg-[#FF4500] hover:bg-[#cc3700] text-white text-xs font-medium px-5 py-2.5 rounded-sm flex items-center gap-2 transition-colors shadow-sm">
                Contact us <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <FaqAccordion />
        </div>
      </section>


      {/* INSIGHTS AND RESOURCES */}
      <section className="py-24 px-4 max-w-7xl mx-auto lg:px-8">
        <div className="flex justify-between items-end mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter max-w-sm">Insights and resources</h2>
          <p className="text-sm text-slate-500 max-w-sm text-right hidden md:block">Practical guides and ideas to help modern teams improve their workflow.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           {[1, 2, 3].map((i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }} 
               transition={{ delay: i * 0.1 }} 
               whileHover={{ y: -6 }} 
               className="space-y-4 group cursor-pointer"
             >
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-sm overflow-hidden relative border border-slate-200 shadow-sm">
                  <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <h3 className="font-bold text-lg leading-snug group-hover:text-orange-600 transition-colors">How to find your first 10 customers on Reddit</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">A step-by-step guide to finding buying signals on Reddit before your competitors do.</p>
             </motion.div>
           ))}
        </div>
        
        <div className="text-center">
           <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold px-6 py-2.5 rounded-sm inline-flex items-center gap-2 transition-colors text-sm shadow-sm">
             Read more <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-slate-50/80 py-24 px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Get in <span className="relative inline-block"><span className="relative z-10">touch</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-orange-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span></h2>
           <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">Reach out to our team at any time for support or questions and we&apos;ll get back to you within 2 business days.</p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16">
           <div className="md:w-1/3 flex flex-col items-center text-center gap-6 pt-4">
              <div className="space-y-2">
                 <div className="w-10 h-10 mx-auto bg-white rounded-sm border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                   <Target className="w-4 h-4 text-slate-600" />
                 </div>
                 <p className="font-bold text-sm">415 483 8201</p>
              </div>
              <div className="w-full h-px bg-slate-200" />
              <div className="space-y-2">
                 <div className="w-10 h-10 mx-auto bg-white rounded-sm border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                   <MessageSquare className="w-4 h-4 text-slate-600" />
                 </div>
                 <p className="font-bold text-sm">support@signalloop.com</p>
              </div>
              <div className="w-full h-px bg-slate-200" />
              <div className="space-y-2">
                 <div className="w-10 h-10 mx-auto bg-white rounded-sm border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                   <Search className="w-4 h-4 text-slate-600" />
                 </div>
                 <p className="font-bold text-sm">250 Market St, Suite 400<br/>San Francisco, CA</p>
              </div>
              {/* Doodle */}
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="mt-6 w-40 h-40 rounded-sm bg-transparent flex items-center justify-center overflow-hidden mix-blend-multiply border border-slate-100 shadow-sm"
              >
                 <video autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-multiply">
                   <source src="/v2.mp4" type="video/mp4" />
                 </video>
              </motion.div>
           </div>

           <div className="flex-1 bg-white border border-slate-200 rounded-sm p-8 md:p-10 shadow-sm">
              <h3 className="font-bold text-2xl mb-8 tracking-tight">How can we help you today?</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input type="text" placeholder="John Smith" className="w-full bg-slate-50/50 border border-slate-200 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" placeholder="john@company.com" className="w-full bg-slate-50/50 border border-slate-200 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50/50 border border-slate-200 rounded-sm px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 transition-shadow text-sm">
                      <option>Select...</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows={4} placeholder="Enter your message" className="w-full bg-slate-50/50 border border-slate-200 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none transition-shadow text-sm" />
               </div>
                <button className="bg-[#FF4500] hover:bg-[#cc3700] text-white font-bold py-3 px-8 rounded-sm transition-all shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] text-sm">
                  Submit
                </button>
              </form>
           </div>
        </div>
      </section>

      <div className="px-4 md:px-8 pt-12">
        <div className="bg-[#FF4500] rounded-t-3xl overflow-hidden relative flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none"></div>
          
          {/* BOTTOM CTA & LOGO */}
          <section className="pt-24 relative overflow-hidden flex flex-col items-center w-full z-10">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center z-10 relative mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white leading-tight">Start listening to<br/>Reddit today</h2>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-[#FF4500] font-bold py-3 px-8 rounded-sm transition-all shadow-[0_4px_20px_rgba(255,255,255,0.4)] mt-6 text-sm">
                  Get Started Free
                </motion.button>
             </motion.div>
             
             {/* Big Logo Text */}
             <div className="relative w-full mx-auto px-4 flex justify-center translate-y-8 pb-12 overflow-hidden z-10">
                <h1 
                  className="text-[12vw] md:text-[14vw] font-black tracking-tighter leading-none text-white select-none"
                  style={{ textShadow: "0px 0px 40px rgba(255, 255, 255, 0.6)" }}
                >
                  SIGNALLOOP
                </h1>
             </div>
          </section>

          {/* FOOTER */}
          <footer className="w-full pt-16 pb-8 px-4 relative z-20 text-white">
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start mb-12 gap-10 lg:px-8">
                <div className="w-full max-w-md lg:max-w-xs">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="bg-white p-1.5 rounded-sm">
                        <Rocket className="h-4 w-4 text-[#FF4500]" />
                      </div>
                      <span className="font-bold tracking-tight text-lg text-white">SignalLoop</span>
                   </div>
                   <p className="font-bold mb-3 text-sm text-white">Stay connected</p>
                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                     <input type="email" placeholder="name@email.com" className="bg-white/10 border border-white/20 rounded-sm px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white w-full sm:w-56 transition-colors" />
                     <button className="bg-white hover:bg-slate-100 text-[#FF4500] text-xs font-bold px-4 py-3 sm:py-2.5 rounded-sm transition-colors shadow-sm">Subscribe</button>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 w-full lg:w-auto mt-8 lg:mt-0">
                   <div>
                     <p className="font-bold mb-4 text-sm text-white">Product</p>
                     <ul className="space-y-3 text-xs md:text-sm text-white/70">
                       <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                     </ul>
                   </div>
                   <div>
                     <p className="font-bold mb-4 text-sm text-white">Company</p>
                     <ul className="space-y-3 text-xs md:text-sm text-white/70">
                       <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                     </ul>
                   </div>
                   <div>
                     <p className="font-bold mb-4 text-sm text-white">More</p>
                     <ul className="space-y-3 text-xs md:text-sm text-white/70">
                       <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                       <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                     </ul>
                   </div>
                </div>
             </div>

             <div className="max-w-7xl mx-auto pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 lg:px-8">
                <div className="flex gap-4">
                   {/* Social Icons Placeholder */}
                   <div className="w-8 h-8 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"><div className="w-3 h-3 bg-white/80 rounded-sm" /></div>
                   <div className="w-8 h-8 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"><div className="w-3 h-3 bg-white/80 rounded-sm" /></div>
                   <div className="w-8 h-8 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"><div className="w-4 h-3 bg-white/80 rounded-sm" /></div>
                </div>
                <p>Designed by SignalLoop. All rights reserved.</p>
             </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
