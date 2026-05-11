'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, ChevronRight, MessageSquare, Rocket, Search, Shield, Target, TrendingUp, Users, Zap, CheckCircle2, Plus, Sparkles, ChevronDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'


export default function LandingPage() {
  return (
    <div className="bg-transparent text-slate-900 font-sans min-h-screen selection:bg-blue-100 overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 -z-50 bg-white" />
      <div className="fixed inset-0 -z-40 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 -z-30 bg-gradient-to-t from-blue-50/50 to-transparent" />

      {/* NAVBAR */}
      <nav className="fixed top-6 left-6 right-6 z-50 max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-white/50 px-5 py-2 rounded-sm flex items-center justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.4)_inset]">
        <Link className="flex items-center gap-2 pl-2 group" href="/">
          <div className="bg-blue-600 p-1.5 rounded-sm shadow-sm">
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
            <Link href="/login" className="bg-black text-white text-[13px] font-medium px-4 py-1.5 rounded-sm flex items-center gap-2 transition-all hover:bg-slate-800 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
              Get free trial <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-white via-white to-[#e0fbfc] mx-4 pt-40 pb-32 rounded-b-[3rem] relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-slate-200 text-[11px] font-medium text-slate-600 bg-white shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-sm bg-blue-500" />
              Now available for early access
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-slate-900 max-w-xl">
              Real-time insight for <span className="relative inline-block"><span className="relative z-10">modern finance</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-blue-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Unify your financial data and extract actionable insights instantly. We help fast-growing startups scale their operations with confidence.
            </p>

            {/* Logo Cloud inside Hero */}
            <div className="pt-10 overflow-hidden w-full max-w-sm relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <motion.div 
                className="flex items-center gap-8 opacity-50 grayscale w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...['Pluto Inc', 'NovaTech', 'VitaHealth', 'BoxMedia'], ...['Pluto Inc', 'NovaTech', 'VitaHealth', 'BoxMedia']].map((logo, i) => (
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
               <p className="text-sm text-slate-600">Powerful AI platform simplifying reporting and delivering forecasts for faster decisions.</p>
               <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-slate-600">4.8 rated by 3K+ users</span>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/40 rounded-sm blur-[80px]" />
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
            <div className="mx-auto bg-white border border-slate-200 shadow-sm rounded-md px-24 py-1.5 text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
              <Search className="w-3 h-3" /> Search insights...
            </div>
          </div>
          {/* Mockup Body */}
          <div className="flex h-[450px]">
            {/* Sidebar */}
            <div className="w-48 bg-slate-50/30 border-r border-slate-100 p-3 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50/50 p-2 rounded-lg text-xs border border-blue-100/50">
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
            <div className="flex-1 p-8 bg-white overflow-hidden space-y-6">
               <h3 className="font-bold text-lg">Overview</h3>
               <div className="grid grid-cols-3 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Total Signals Found</p>
                     <p className="text-2xl font-bold">150,000</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Competitor Mentions</p>
                     <p className="text-2xl font-bold">1,250</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm">
                     <p className="text-xs text-slate-500 font-medium mb-1">Growth Rate</p>
                     <p className="text-2xl font-bold text-emerald-500">+5.80%</p>
                  </div>
               </div>
               <div className="h-52 border border-slate-100 rounded-xl flex items-end px-8 pb-6 gap-4 pt-8 relative overflow-hidden bg-slate-50/30">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-200 to-blue-100 rounded-t-sm opacity-60 relative z-10" style={{ height: `${h}%` }} />
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
            { icon: Sparkles, title: "AI driven forecasting", desc: "See the exact subreddits and posts driving competitor churn." },
            { icon: BarChart3, title: "Unified dashboard", desc: "Track key metrics in one clean, customizable view." },
            { icon: Zap, title: "Automated reporting", desc: "Create clear reports instantly with zero manual effort." },
            { icon: Shield, title: "Risk detection", desc: "Spot unaddressed pain points and gaps in your industry." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-100 p-6 rounded-sm shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center border border-blue-100">
                <feature.icon className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-base tracking-tight text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* 3 STEPS SECTION */}
      <section className="bg-gradient-to-b from-white  to-[#e0fbfc] mx-4 pt-20 pb-32 rounded-b-[3rem] shadow-lg relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Get started in <span className="relative inline-block"><span className="relative z-10">3 steps</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-2 md:h-3 bg-blue-300/60 -z-10 origin-left -rotate-1 rounded-sm" /></span>
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">A simple flow that brings clarity to your growth data in minutes.</p>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-min">
               {/* Step 1 */}
               <div className="md:col-span-4 flex flex-col gap-6">
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-full text-[10px] text-slate-400 p-4 space-y-2">
                           <div className="flex justify-between"><span>Apple</span><span>340</span></div>
                           <div className="flex justify-between"><span>Tesla</span><span>243</span></div>
                           <div className="flex justify-between"><span>Google</span><span>3364</span></div>
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">01</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">Connect your data</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Import financial sources with quick and secure integrations.</p>
                   </div>
               </div>

               {/* Step 2 */}
               <div className="md:col-span-5 md:mt-16 flex flex-col gap-6">
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">02</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">Let AI analyze</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Your data is processed instantly to reveal trends and patterns.</p>
                   </div>
               </div>

               {/* Step 3 */}
               <div className="md:col-span-3 flex flex-col gap-6">
                   <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-sm shadow-sm p-3">
                      <div className="h-64 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                         <div className="w-full flex items-end gap-2 p-4 h-full">
                            <div className="w-full h-1/2 bg-blue-200 rounded-sm" />
                            <div className="w-full h-3/4 bg-blue-600 rounded-sm" />
                            <div className="w-full h-1/2 bg-blue-200 rounded-sm" />
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">03</div>
                      </div>
                   </motion.div>
                   <div className="space-y-2 px-2">
                      <h3 className="font-bold text-lg">View clear insights</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">See forecasts, reports, and metrics in one intuitive workspace.</p>
                   </div>
               </div>
            </div>
        </div>
      </section>

      {/* INTEGRATIONS / LOGOS */}
      <section className="py-24 px-4 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Connect your entire stack</h2>
        <p className="text-sm md:text-base text-slate-500 mb-12 max-w-xl mx-auto">Sync data directly from your favorite tools and keep every workflow unified in one centralized place.</p>
        
        {/* Doodle Illustration Placeholder */}
        <div className="mb-10 flex justify-center">
           <div className="w-20 h-20 border-2 border-slate-900 rounded-sm flex items-center justify-center bg-white shadow-md">
             <Zap className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
           </div>
        </div>

        {/* Integration Grid */}
        <div className="flex flex-wrap justify-center gap-5 max-w-3xl mx-auto">
           {[...Array(10)].map((_, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.8 }} 
               whileInView={{ opacity: 1, scale: 1 }} 
               viewport={{ once: true }} 
               transition={{ delay: i * 0.05 }} 
               whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }} 
               className="w-14 h-14 bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-sm flex items-center justify-center cursor-pointer transition-shadow"
             >
                <div className="w-6 h-6 bg-slate-200 rounded" />
             </motion.div>
           ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="bg-slate-50/80 py-24 px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tighter max-w-xs">Simple pricing for every team</h2>
             <p className="text-sm md:text-base text-slate-500 max-w-xs md:text-right">Choose a plan that supports your workflow and scales as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Starter */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -6 }} className="bg-white rounded-sm p-6 md:p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-bold text-lg mb-2">Starter</h3>
               <p className="text-xs text-slate-500 mb-6 h-8">For individuals and early teams getting started.</p>
               <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl md:text-4xl font-bold tracking-tighter">Free</span>
               </div>
               <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold py-2.5 rounded-sm mb-6 transition-colors text-sm shadow-sm">
                 Get started
               </button>
               <ul className="space-y-3 text-xs md:text-sm text-slate-600">
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Connect up to 3 data sources</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Basic dashboard views</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Standard forecasting</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Automated weekly reports</li>
               </ul>
            </motion.div>

            {/* Growth (Highlighted) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -16 }} className="bg-white rounded-sm p-6 md:p-8 border-2 border-slate-900 shadow-xl relative z-10 transform md:-translate-y-4 transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
               <h3 className="font-bold text-lg mb-2">Growth</h3>
               <p className="text-xs text-slate-500 mb-6 h-8">For growing teams needing deeper insights.</p>
               <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl md:text-4xl font-bold tracking-tighter">$49</span><span className="text-xs text-slate-500 font-medium">/mo</span>
               </div>
               <button className="w-full bg-black text-white font-bold py-2.5 rounded-sm mb-6 transition-all hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.15)] text-sm">
                 Get started
               </button>
               <ul className="space-y-3 text-xs md:text-sm text-slate-700 font-medium">
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited data sources</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced customization</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time forecasting</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated daily reports</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority support</li>
                 </ul>
                 </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ y: -6 }} className="bg-white rounded-sm p-6 md:p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-bold text-lg mb-2">Pro</h3>
               <p className="text-xs text-slate-500 mb-6 h-8">For established teams looking for full visibility.</p>
               <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl md:text-4xl font-bold tracking-tighter">$99</span><span className="text-xs text-slate-500 font-medium">/mo</span>
               </div>
               <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold py-2.5 rounded-sm mb-6 transition-colors text-sm shadow-sm">
                 Get started
               </button>
               <ul className="space-y-3 text-xs md:text-sm text-slate-600">
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Full tool integrations</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Custom reporting and exports</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Team collaboration</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Anomaly detection alerts</li>
               </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-square bg-slate-50 rounded-sm overflow-hidden shadow-inner flex items-center justify-center border border-slate-100">
             {/* Photo Placeholder */}
             <Users className="w-16 h-16 text-slate-300" />
          </div>
          <div className="flex-1 space-y-6">
            <svg className="w-8 h-8 text-slate-300" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.2]">
              "This platform gives us instant clarity. Our forecasts are more accurate and team makes decisions faster than ever."
            </h3>
            <div className="flex justify-between items-center pt-2">
               <div>
                 <p className="font-bold text-sm">John Smith</p>
                 <p className="text-slate-500 text-xs">Operations Lead</p>
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Help and support</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-sm">Answers to common questions about setup, pricing, and how everything works.</p>
            {/* Doodle Placeholder */}
            <div className="w-24 h-24 border-2 border-slate-900 rounded-sm flex items-center justify-center my-6 bg-white shadow-md">
               <MessageSquare className="w-10 h-10 text-slate-900" strokeWidth={1.5} />
            </div>
            <div className="pt-2">
              <p className="font-bold text-sm mb-2">Still got questions?</p>
              <button className="bg-black hover:bg-slate-800 text-white text-xs font-medium px-5 py-2.5 rounded-sm flex items-center gap-2 transition-colors shadow-sm">
                Contact us <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-3">
             {[
               "How do I connect my data sources?",
               "Can I change or cancel my plan at any time?",
               "How secure is my data?",
               "Does the platform support multiple team members?",
               "What integrations are included?",
               "Do you offer onboarding support?"
             ].map((q, i) => (
               <div key={i} className="bg-white border border-slate-200 rounded-sm p-5 flex justify-between items-center cursor-pointer hover:border-slate-300 transition-colors shadow-sm hover:shadow-md">
                 <p className="font-medium text-sm text-slate-700">{q}</p>
                 <div className="w-6 h-6 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                   <Plus className="w-3.5 h-3.5 text-slate-400" />
                 </div>
               </div>
             ))}
          </div>
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
                <h3 className="font-bold text-lg leading-snug group-hover:text-blue-600 transition-colors">The new era of intelligent automation (2026)</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">How modern teams leverage operations with actionable insights and workflows to move faster.</p>
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
           <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Get in touch</h2>
           <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">Reach out to our team at any time for support or questions and we'll get back to you within 2 business days.</p>
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
                <button className="bg-black hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-sm transition-all shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] text-sm">
                  Submit
                </button>
              </form>
           </div>
        </div>
      </section>

      {/* BOTTOM CTA & MOCKUP */}
      <section className="pt-24 relative overflow-hidden flex flex-col items-center">
         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center z-10 relative mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-slate-900 leading-tight">Bring clarity to your<br/>numbers today</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black text-white font-bold py-3 px-8 rounded-sm transition-all shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] mt-6 text-sm border border-slate-800">
              Get Started Free
            </motion.button>
         </motion.div>
         
         {/* Partial Mockup Peek */}
         <div className="relative w-full max-w-5xl mx-auto px-4 translate-y-12">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/80 rounded-sm blur-[80px] -z-10" />
            <div className="bg-white border border-slate-200 shadow-2xl rounded-t-3xl h-64 overflow-hidden relative">
               <div className="h-10 bg-slate-50/80 border-b border-slate-200 flex items-center px-4 gap-2 backdrop-blur-sm">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                   <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                   <div className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                 </div>
               </div>
               <div className="flex p-6 gap-6">
                 <div className="w-40 bg-slate-50 border border-slate-100 rounded-sm h-36" />
                 <div className="flex-1 bg-slate-50 border border-slate-100 rounded-sm h-36" />
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-4 relative z-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-12 gap-10 lg:px-8">
            <div className="max-w-xs">
               <div className="flex items-center gap-2 mb-6">
                  <div className="bg-blue-600 p-1.5 rounded-sm">
                    <Rocket className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold tracking-tight text-lg">SignalLoop</span>
               </div>
               <p className="font-bold mb-3 text-sm">Stay connected</p>
               <div className="flex items-center gap-2">
                 <input type="email" placeholder="name@email.com" className="bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-slate-400 w-56 transition-colors" />
                 <button className="bg-black hover:bg-slate-800 text-white text-xs font-medium px-4 py-2.5 rounded-sm transition-colors shadow-sm">Subscribe</button>
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-10 lg:gap-16">
               <div>
                 <p className="font-bold mb-4 text-sm">Product</p>
                 <ul className="space-y-3 text-xs md:text-sm text-slate-500">
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Home</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Features</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">FAQ</Link></li>
                 </ul>
               </div>
               <div>
                 <p className="font-bold mb-4 text-sm">Company</p>
                 <ul className="space-y-3 text-xs md:text-sm text-slate-500">
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">About</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Blog</Link></li>
                 </ul>
               </div>
               <div>
                 <p className="font-bold mb-4 text-sm">More</p>
                 <ul className="space-y-3 text-xs md:text-sm text-slate-500">
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                   <li><Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link></li>
                 </ul>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 lg:px-8">
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 rounded-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors"><div className="w-3 h-3 bg-slate-400 rounded-sm" /></div>
               <div className="w-8 h-8 rounded-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors"><div className="w-3 h-3 bg-slate-400 rounded-sm" /></div>
               <div className="w-8 h-8 rounded-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors"><div className="w-4 h-3 bg-slate-400 rounded-sm" /></div>
            </div>
            <p>Designed by SignalLoop. All rights reserved.</p>
         </div>
      </footer>
    </div>
  )
}
