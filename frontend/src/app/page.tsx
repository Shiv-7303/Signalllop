'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, LayoutDashboard, MessageSquare, Rocket, Search, Shield, Target, Users, Zap, CheckCircle2, Plus, Sparkles, ChevronDown, Menu, X, Lightbulb, PenTool, BarChart, Megaphone, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'

const faqs = [
  {
    q: "Is it really an AI Cofounder?",
    a: "Yes. Instead of just giving you a blank canvas or generic advice, SignalLoop acts as a Technical Product Manager. You give it a 1-2 sentence idea, and it generates a deep Product Requirements Document, target personas, a 3-phase roadmap, and exact AI coding prompts (for Cursor, v0) to build the MVP."
  },
  {
    q: "How does the Go-To-Market strategy work?",
    a: "We don't just help you build; we help you launch. SignalLoop identifies the best Reddit communities for your niche, gives you exact content angles, generates pricing strategies, and writes your landing page wireframe copy so you can validate your idea instantly."
  },
  {
    q: "What do I get on the Free plan?",
    a: "The Free plan gives you 1 full AI Cofounder report. This includes the PRD, Roadmap, Tech Stack, AI Prompts, and Go-To-Market strategy. You can use this to instantly validate and start building your first idea."
  },
  {
    q: "How are the AI coding prompts generated?",
    a: "Based on the technical stack our AI selects for your specific product (e.g., Next.js + Supabase), we generate highly detailed, context-rich prompts. You can paste these directly into AI editors like Cursor, v0.dev, or Bolt.new to instantly scaffold your application."
  },
  {
    q: "Do you monitor competitor mentions?",
    a: "Yes! On our paid plans, you can add direct competitors. We'll analyze their strengths, their exploitable weaknesses, and give you the exact 'wedge' or advantage you need to beat them in the market."
  },
  {
    q: "Can I cancel my plan anytime?",
    a: "Absolutely. There are no lock-in contracts. You can cancel your subscription at any time. You'll continue to have access to your paid plan features until the end of your current billing period."
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="flex-1 w-full space-y-4">
      {faqs.map((item, i) => (
        <div
          key={i}
          className={`bg-white sketch-border minimal-shadow transition-all duration-200 ${openIndex === i ? 'border-brand-orange shadow-none translate-y-1' : 'border-slate-900 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1a1a2e]'}`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full p-6 flex justify-between items-center text-left gap-4"
          >
            <p className={`font-bold text-lg transition-colors ${openIndex === i ? 'text-brand-orange' : 'text-slate-900'}`}>{item.q}</p>
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${openIndex === i ? 'bg-brand-orange border-brand-orange text-white' : 'bg-slate-50 border-slate-900 text-slate-900'}`}>
              {openIndex === i
                ? <span className="text-xl leading-none font-bold">−</span>
                : <Plus className="w-4 h-4 font-bold" />
              }
            </div>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-6">
              <div className="w-full h-px bg-slate-200 mb-4" />
              <p className="text-base text-slate-600 font-medium leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const testimonials = [
  {
    quote: "I used to spend hours guessing what features to build. SignalLoop handed me a complete PRD and a launch strategy that actually worked. It's like having a brilliant technical cofounder who doesn't sleep.",
    name: "Rahul Mehta",
    title: "Solo Founder, AI Startup",
    icon: Users,
    color: "bg-highlight-yellow/20"
  },
  {
    quote: "The Reddit intelligence blew my mind. Within minutes, I had 10 real complaints from my competitors' users, which I turned directly into my MVP's core features.",
    name: "Sarah Jenkins",
    title: "Product Builder",
    icon: Target,
    color: "bg-blue-500/20"
  },
  {
    quote: "I pasted the Cursor scaffold prompt it generated, and 5 minutes later I had a working Next.js dashboard with Supabase auth perfectly wired up. Insane time saver.",
    name: "David Chen",
    title: "Indie Hacker",
    icon: Zap,
    color: "bg-emerald-500/20"
  },
  {
    quote: "The Go-To-Market playbook is gold. It didn't just tell me to 'post on Reddit'—it gave me the exact subreddits, angles, and things to avoid so I wouldn't get banned.",
    name: "Priya Sharma",
    title: "Marketing Lead",
    icon: Megaphone,
    color: "bg-highlight-pink/20"
  }
]

function TestimonialCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-12 group">
       {/* Gradients to hide edges */}
       <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[var(--paper-white)] to-transparent z-10 pointer-events-none" />
       <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[var(--paper-white)] to-transparent z-10 pointer-events-none" />
       
       <div className="flex gap-8 whitespace-nowrap ticker-scroll hover:[animation-play-state:paused] w-max px-4">
         {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="inline-flex sketch-card bg-white p-8 minimal-shadow flex-col md:flex-row items-center gap-8 w-[800px] whitespace-normal" style={{ rotate: `${[-1, 1.5, -0.5, 2][i % 4]}deg` }}>
              <div className={`w-24 h-24 shrink-0 sketch-border ${t.color} flex items-center justify-center transform -rotate-3 relative`}>
                 <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center transform rotate-12">
                    <Sparkles className="w-4 h-4 text-white" />
                 </div>
                 <t.icon className="w-10 h-10 text-slate-700" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <svg className="w-8 h-8 text-brand-orange mx-auto md:mx-0 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <h3 className="text-xl md:text-2xl font-handdrawn text-slate-900 leading-tight">"{t.quote}"</h3>
                <div>
                  <p className="font-bold text-base text-slate-900">{t.name}</p>
                  <p className="text-slate-500 font-medium text-xs">{t.title}</p>
                </div>
              </div>
            </div>
         ))}
       </div>
    </div>
  )
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [textIndex, setTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentFullText = texts[textIndex]
    let timer: NodeJS.Timeout

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }, 50)
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length + 1))
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      }, 100)
    }
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, textIndex, texts])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

const liveExamples = [
  {
    score: "9.2",
    title: '"Creators frustrated with CapCut limitations on desktop"',
    subreddit: "r/videoediting",
    comments: "128 comments",
    insight: "Users want easier subtitle workflows. High conversion potential for desktop tools.",
    suggested: "Create comparison content"
  },
  {
    score: "8.7",
    title: '"Agencies looking for automated Reddit outreach"',
    subreddit: "r/marketing",
    comments: "84 comments",
    insight: "Agencies need bulk messaging without bans. Good B2B SaaS opportunity.",
    suggested: "Build cold outreach guide"
  },
  {
    score: "9.5",
    title: '"GummySearch pricing too high for indie hackers"',
    subreddit: "r/SaaS",
    comments: "215 comments",
    insight: "Strong demand for a cheaper alternative with core features only.",
    suggested: "Launch LTD on AppSumo"
  }
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('PRD')
  const { user, isLoading } = useUser()

  return (
    <div className="bg-[var(--paper-white)] text-slate-900 font-sans min-h-screen selection:bg-highlight-yellow selection:text-ink-black overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND NOISE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* NAVBAR */}
      <nav className="fixed top-6 left-6 right-6 z-50 max-w-6xl mx-auto bg-white/90 backdrop-blur-md sketch-border minimal-shadow px-6 py-3 flex items-center justify-between">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="bg-brand-orange p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="font-handdrawn text-2xl font-bold tracking-tight text-slate-900 mt-1">SignalLoop</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
          <a href="#hero" className="text-slate-900 hover:text-brand-orange transition-colors">Home</a>
          <a href="#features" className="hover:text-brand-orange transition-colors">How it works</a>
          <Link href="/pricing" className="hover:text-brand-orange transition-colors">Pricing</Link>
          <a href="#faq" className="hover:text-brand-orange transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
            {!isLoading && (
              <Link href={user ? "/dashboard" : "/login"} className="hidden sm:flex bg-highlight-yellow text-slate-900 text-sm font-bold px-6 py-2.5 sketch-border minimal-shadow hover:translate-y-1 hover:shadow-none transition-all items-center gap-2">
                {user ? "Dashboard" : "Try for free"} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-900 p-1">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed top-24 left-6 right-6 z-40 bg-white sketch-border minimal-shadow p-6 md:hidden flex flex-col gap-6">
          <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900">Home</a>
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-600 hover:text-brand-orange">How it works</a>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-600 hover:text-brand-orange">Pricing</Link>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-600 hover:text-brand-orange">FAQ</a>
          <div className="w-full h-0.5 bg-slate-100 my-2" />
          {!isLoading && (
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-highlight-yellow text-slate-900 text-lg font-bold px-6 py-4 sketch-border minimal-shadow active:translate-y-1 active:shadow-none transition-all">
              {user ? "Go to Dashboard" : "Try for free"}
            </Link>
          )}
        </div>
      )}

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-40 md:pt-48 pb-20 md:pb-32 px-6 max-w-6xl mx-auto z-20">
        
        {/* DOODLES */}
        <div className="absolute top-32 left-10 opacity-20 hidden md:block">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <path d="M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M20 80 L80 20" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 opacity-30 hidden lg:block transform rotate-12">
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M20,150 Q100,50 180,100" />
            <path d="M160,70 L180,100 L140,110" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-6xl sm:text-7xl md:text-[80px] font-handdrawn text-slate-900 leading-[1.0] mb-6">
              Find where your <br />
              customers <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10"><TypewriterText texts={['already hang out.', 'beg for solutions.']} /></span>
                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-4 md:h-6 text-highlight-yellow -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="15" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
              Discover Reddit communities, growth opportunities, competitor strategies, and content ideas — automatically.
            </p>

            <div className="pt-6">
              {!isLoading && (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> Analyze My Business
                  </Link>
                  <a href="#how-it-works" className="text-slate-500 hover:text-brand-orange font-bold text-sm underline underline-offset-4 decoration-slate-300 hover:decoration-brand-orange transition-colors">
                    View Demo Report →
                  </a>
                </div>
              )}
            </div>

            <div className="pt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center font-bold text-blue-700 text-xs">P</div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center font-bold text-emerald-700 text-xs">K</div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-bold text-amber-700 text-xs">A</div>
              </div>
              <div className="font-handdrawn text-xl text-slate-600">
                — 340 founders using this week —
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
             <div className="absolute -top-10 -left-10 text-slate-400 transform -rotate-12">
               <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                 <path d="M20 50 Q 50 10 80 50 T 80 90" strokeDasharray="4 4" />
               </svg>
               <span className="font-handdrawn text-xl ml-4">LIVE EXAMPLE</span>
             </div>

             {/* LIVE EXAMPLE SIGNAL CARD */}
             <div className="sketch-card transform rotate-2 bg-white w-full max-w-md mx-auto">
                <div className="score-badge">{liveExamples[0].score}</div>
                <div className="flex items-center gap-2 mb-4 text-brand-orange font-bold text-xs uppercase tracking-widest border-b-2 border-slate-100 pb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" /> High Opportunity
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug h-16">
                  {liveExamples[0].title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-6">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {liveExamples[0].subreddit}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {liveExamples[0].comments}</span>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 relative">
                   <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">AI Insight</div>
                   <p className="text-sm font-medium text-slate-700 italic">
                     "{liveExamples[0].insight}"
                   </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600">
                  <ArrowRight className="w-4 h-4" /> Suggested: {liveExamples[0].suggested}
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* AUTO-SCROLLING TICKER */}
      <section className="py-10 relative overflow-hidden border-y-2 border-slate-900 bg-white">
        {/* Gradients to hide edges */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 whitespace-nowrap ticker-scroll-right hover:[animation-play-state:paused] w-max">
          {[
            { type: "Opportunity Found", text: "23 founders discussing AI video tools in r/SaaS", meta: "r/SaaS · 89 comments", color: "text-brand-orange" },
            { type: "Competitor Insight", text: "F5bot users frustrated with no AI context — gap found", meta: "47 complaints this week", color: "text-blue-500" },
            { type: "Growth Hack", text: "Offer free PRDs as a lead magnet in r/startups", meta: "High conversion probability", color: "text-emerald-500" },
            { type: "Opportunity Found", text: "Agencies looking for automated Reddit outreach", meta: "r/marketing · 112 comments", color: "text-brand-orange" },
            { type: "Competitor Insight", text: "GummySearch pricing too high for indie hackers", meta: "Pricing gap identified", color: "text-blue-500" }
          ].map((item, i) => (
            <div key={i} className="inline-block w-80 sketch-border-sm bg-white p-5 minimal-shadow transform transition-transform" style={{ rotate: `${[-0.5, 0.8, -1.2, 0.3, -0.9][i % 5]}deg` }}>
              <div className={`font-bold text-xs uppercase tracking-widest mb-3 border-b-2 border-slate-100 pb-2 ${item.color}`}>
                🔥 {item.type}
              </div>
              <p className="text-slate-800 font-medium text-sm whitespace-normal leading-relaxed mb-4">
                "{item.text}"
              </p>
              <p className="text-slate-400 text-xs font-bold">{item.meta}</p>
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {[
            { type: "Opportunity Found", text: "23 founders discussing AI video tools in r/SaaS", meta: "r/SaaS · 89 comments", color: "text-brand-orange" },
            { type: "Competitor Insight", text: "F5bot users frustrated with no AI context — gap found", meta: "47 complaints this week", color: "text-blue-500" },
            { type: "Growth Hack", text: "Offer free PRDs as a lead magnet in r/startups", meta: "High conversion probability", color: "text-emerald-500" },
            { type: "Opportunity Found", text: "Agencies looking for automated Reddit outreach", meta: "r/marketing · 112 comments", color: "text-brand-orange" },
            { type: "Competitor Insight", text: "GummySearch pricing too high for indie hackers", meta: "Pricing gap identified", color: "text-blue-500" }
          ].map((item, i) => (
            <div key={`dup-${i}`} className="inline-block w-80 sketch-border-sm bg-white p-5 minimal-shadow transform transition-transform" style={{ rotate: `${[-0.5, 0.8, -1.2, 0.3, -0.9][i % 5]}deg` }}>
              <div className={`font-bold text-xs uppercase tracking-widest mb-3 border-b-2 border-slate-100 pb-2 ${item.color}`}>
                🔥 {item.type}
              </div>
              <p className="text-slate-800 font-medium text-sm whitespace-normal leading-relaxed mb-4">
                "{item.text}"
              </p>
              <p className="text-slate-400 text-xs font-bold">{item.meta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section id="how-it-works" className="bg-[#1a1a2e] text-white py-32 relative overflow-hidden">
        {/* DOODLE OVERLAYS */}
        <div className="absolute top-20 right-20 opacity-10">
           <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M10,50 Q30,10 50,50 T90,50" />
           </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-handdrawn mb-6 text-white">
              How to build with <span className="text-highlight-yellow">SignalLoop</span>
            </h2>
            <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">Three steps to turn your napkin sketch into a real product.</p>
          </motion.div>
            
          <motion.div 
            className="relative max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.5
                }
              }
            }}
          >
             {/* Animated connecting line (Desktop) */}
             <div className="hidden md:block absolute top-[24px] left-[16.66%] right-[16.66%] h-1.5 z-0 pointer-events-none">
               <motion.div
                 className="h-full bg-slate-700/50 rounded-full"
                 variants={{
                   hidden: { width: "0%" },
                   visible: { width: "100%", transition: { duration: 1.5, ease: "easeInOut" } }
                 }}
               />
               {/* Moving glowing dot on the line */}
               <motion.div
                 className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-highlight-yellow rounded-full shadow-[0_0_20px_4px_rgba(253,224,71,0.6)] border-2 border-[#1a1a2e]"
                 variants={{
                   hidden: { left: "0%", opacity: 0 },
                   visible: { left: "100%", opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
                 }}
               />
             </div>

             {/* Animated connecting line (Mobile) */}
             <div className="md:hidden absolute top-[56px] bottom-[56px] left-6 w-1.5 z-0 pointer-events-none">
               <motion.div
                 className="w-full bg-slate-700/50 rounded-full"
                 variants={{
                   hidden: { height: "0%" },
                   visible: { height: "100%", transition: { duration: 1.5, ease: "easeInOut" } }
                 }}
               />
               <motion.div
                 className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-highlight-yellow rounded-full shadow-[0_0_20px_4px_rgba(253,224,71,0.6)] border-2 border-[#1a1a2e]"
                 variants={{
                   hidden: { top: "0%", opacity: 0 },
                   visible: { top: "100%", opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
                 }}
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 relative z-10 pl-12 md:pl-0">
               {/* Step 1 */}
               <motion.div
                 className="flex flex-col gap-6 relative"
                 variants={{
                   hidden: { opacity: 0, y: 40, scale: 0.9 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
                 }}
               >
                   <div className="absolute top-8 -left-12 md:static md:flex md:justify-center md:mb-0 z-20">
                     <div className="w-12 h-12 bg-highlight-pink text-white font-handdrawn text-3xl flex items-center justify-center rounded-full sketch-border border-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]">1</div>
                   </div>
                   <div className="bg-[#2d2b3d] sketch-border border-[#1a1a2e] p-8 relative transform -rotate-2 hover:rotate-0 transition-transform h-64 flex flex-col justify-center shadow-[6px_6px_0px_#1a1a2e]">
                      <Lightbulb className="w-10 h-10 text-highlight-pink mb-4" />
                      <h3 className="font-bold text-2xl mb-2 text-white">Drop your brief</h3>
                      <p className="text-slate-300 font-medium">Tell us what you want to build in plain English. We don't need a formal spec.</p>
                   </div>
               </motion.div>

               {/* Step 2 */}
               <motion.div
                 className="flex flex-col gap-6 relative"
                 variants={{
                   hidden: { opacity: 0, y: 40, scale: 0.9 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
                 }}
               >
                   <div className="absolute top-8 -left-12 md:static md:flex md:justify-center md:mb-0 z-20">
                     <div className="w-12 h-12 bg-highlight-yellow text-[#1a1a2e] font-handdrawn text-3xl flex items-center justify-center rounded-full sketch-border border-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]">2</div>
                   </div>
                   <div className="bg-[#2d2b3d] sketch-border border-[#1a1a2e] p-8 relative transform rotate-2 hover:rotate-0 transition-transform h-64 flex flex-col justify-center shadow-[6px_6px_0px_#1a1a2e]">
                      <BarChart className="w-10 h-10 text-highlight-yellow mb-4" />
                      <h3 className="font-bold text-2xl mb-2 text-white">AI generates strategy</h3>
                      <p className="text-slate-300 font-medium">Our engine builds your PRD, feature roadmap, tech stack, and landing page copy instantly.</p>
                   </div>
               </motion.div>

               {/* Step 3 */}
               <motion.div
                 className="flex flex-col gap-6 relative"
                 variants={{
                   hidden: { opacity: 0, y: 40, scale: 0.9 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
                 }}
               >
                   <div className="absolute top-8 -left-12 md:static md:flex md:justify-center md:mb-0 z-20">
                     <div className="w-12 h-12 bg-highlight-green text-[#1a1a2e] font-handdrawn text-3xl flex items-center justify-center rounded-full sketch-border border-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]">3</div>
                   </div>
                   <div className="bg-[#2d2b3d] sketch-border border-[#1a1a2e] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform h-64 flex flex-col justify-center shadow-[6px_6px_0px_#1a1a2e]">
                      <Rocket className="w-10 h-10 text-highlight-green mb-4" />
                      <h3 className="font-bold text-2xl mb-2 text-white">Start shipping</h3>
                      <p className="text-slate-300 font-medium">Copy our scaffold prompts into Cursor or v0 and watch your app build itself.</p>
                   </div>
               </motion.div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto overflow-hidden">
        <TestimonialCarousel />
      </section>

      {/* WHAT YOU GET PREVIEW (Notebook Style) */}
      <section className="bg-slate-900 text-white py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
         
         <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-6xl font-handdrawn text-white mb-16 text-center">
              Everything your idea needs to survive.
            </h2>

            <div className="max-w-4xl mx-auto">
               {/* Folder Tabs */}
               <div className="flex gap-2 mb-[-2px] relative z-10 overflow-x-auto pb-2 px-4 hide-scrollbar">
                 {['PRD', 'Roadmap', 'Marketing', 'Stack', 'Prompts'].map((tab) => {
                   const isActive = activeTab === tab;
                   const icons: Record<string, string> = { PRD: '📋', Roadmap: '🗺️', Marketing: '🚀', Stack: '🛠️', Prompts: '⚡' };
                   return (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-6 py-3 font-bold border-2 border-b-0 rounded-t-xl shrink-0 transition-colors ${
                         isActive 
                           ? 'bg-[var(--paper-white)] text-slate-900 border-slate-900' 
                           : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                       }`}
                     >
                       {icons[tab]} {tab}
                     </button>
                   );
                 })}
               </div>

               {/* Notebook Content */}
               <div className="bg-[var(--paper-white)] text-slate-900 border-2 border-slate-900 rounded-xl rounded-tl-none p-8 md:p-12 minimal-shadow relative shadow-[8px_8px_0px_#FF4500] min-h-[400px]">
                  {/* Notebook Lines */}
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 95%, #e2e8f0 95%)', backgroundSize: '100% 32px', backgroundPosition: '0 32px' }} />
                  {/* Red Margin */}
                  <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-rose-300 pointer-events-none" />

                  <div className="relative z-10 font-handdrawn text-2xl md:text-3xl leading-[32px] pl-6 md:pl-10 space-y-6">
                    {activeTab === 'PRD' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                          <span className="font-bold">PRODUCT:</span> SignalLoop
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">PROBLEM:</span> Founders miss buying signals on Reddit because manual monitoring = exhausting.
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">SOLUTION:</span> AI-powered signal detection that tells you what to do, not just what happened.
                        </div>
                        <div>
                          <span className="font-bold">MVP FEATURES:</span>
                          <ul className="pl-4 mt-2 space-y-2 text-slate-700">
                            <li>✅ Keyword monitoring (Reddit + HN)</li>
                            <li>✅ AI signal scoring</li>
                            <li>✅ Reply templates</li>
                            <li>✅ Real-time alerts</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'Roadmap' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                          <span className="font-bold">PHASE 1 (MVP - Weeks 1-2):</span>
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                          <ul className="pl-4 mt-2 space-y-2 text-slate-700">
                            <li>• Core keyword tracking engine</li>
                            <li>• Basic sentiment analysis</li>
                            <li>• Email digest alerts</li>
                          </ul>
                        </div>
                        <div className="mt-6">
                          <span className="font-bold">PHASE 2 (V1 - Weeks 3-4):</span>
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                          <ul className="pl-4 mt-2 space-y-2 text-slate-700">
                            <li>• Competitor tracking dashboard</li>
                            <li>• AI auto-reply suggestions</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'Marketing' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                          <span className="font-bold">GTM STRATEGY:</span> The "Helpful Expert" Playbook
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">REDDIT:</span> Don't spam links. Monitor r/SaaS and r/startups for "how do I find customers" and reply with genuine advice. Drop the link only if asked.
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">LINKEDIN:</span> Post tear-downs of how competitors missed 100+ leads on Reddit this week. Tag the competitors.
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">PRICING:</span> Freemium model. Give 1 free report. Charge ₹499/mo for automated tracking.
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'Stack' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                          <span className="font-bold">TECH STACK RECOMMENDATION:</span>
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                        </div>
                        <div className="text-slate-700">
                          <span className="font-bold text-slate-900">FRONTEND:</span> Next.js (App Router) + TailwindCSS + Shadcn/UI
                          <p className="pl-4 text-xl mt-1 opacity-80">→ Fastest way to ship beautiful, responsive dashboards.</p>
                        </div>
                        <div className="text-slate-700 mt-4">
                          <span className="font-bold text-slate-900">BACKEND:</span> Python (Flask/FastAPI)
                          <p className="pl-4 text-xl mt-1 opacity-80">→ Required for PRAW (Reddit API) and heavy text processing.</p>
                        </div>
                        <div className="text-slate-700 mt-4">
                          <span className="font-bold text-slate-900">DATABASE & AUTH:</span> Supabase
                          <p className="pl-4 text-xl mt-1 opacity-80">→ Handles user management, Postgres DB, and Row Level Security instantly.</p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'Prompts' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                          <span className="font-bold">CURSOR / v0 SCAFFOLD PROMPT:</span>
                          <div className="w-full border-b-2 border-slate-900 mt-1 opacity-20" />
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-300 font-mono text-lg text-slate-600 leading-snug">
                          "Build a modern SaaS dashboard in Next.js using Tailwind and Lucide icons. 
                          <br/><br/>
                          It needs a sidebar with 'Opportunities' and 'Settings'. 
                          The main view should have a 3-column grid showing 'Total Signals', 'Competitor Mentions', and 'Growth Rate'. 
                          <br/><br/>
                          Below that, create a list view of Reddit posts showing the title, subreddit, and an AI intent score badge."
                        </div>
                      </motion.div>
                    )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto scroll-mt-24">
        <div className="text-center mb-20 relative">
             <h2 className="text-5xl md:text-7xl font-handdrawn text-slate-900 mb-4">Simple pricing. No surprises.</h2>
             <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 font-handdrawn text-xl text-slate-500 whitespace-nowrap">
               <svg className="inline-block w-8 h-8 mr-2 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
               seriously, no hidden fees
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="sketch-card flex flex-col transform -rotate-1 hover:rotate-0"
          >
              <h3 className="font-bold text-2xl mb-4 text-slate-500 uppercase tracking-widest border-b-2 border-slate-100 pb-4">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-900">₹0</span>
                <span className="text-slate-500 font-bold">/month</span>
              </div>
              <ul className="space-y-4 text-slate-700 font-medium mb-10 flex-1">
                <li>1 report/mo</li>
                <li>1 competitor</li>
                <li>Basic intel</li>
              </ul>
              <Button asChild className="w-full bg-white text-slate-900 border-2 border-slate-900 text-base font-bold py-6 sketch-border-sm hover:bg-slate-50 minimal-shadow">
                <Link href="/login">Start Free</Link>
              </Button>
          </motion.div>

          {/* Starter */}
          <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1 }}
              className="sketch-card flex flex-col transform rotate-0 scale-105 z-10 border-brand-orange border-[3px]"
              style={{ boxShadow: '5px 5px 0px #1a1a2e' }}
          >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-highlight-yellow border-2 border-slate-900 font-handdrawn text-lg font-bold px-4 py-1 transform rotate-2">★ POPULAR ★</div>
              <h3 className="font-bold text-2xl mb-4 text-brand-orange uppercase tracking-widest border-b-2 border-slate-100 pb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-900">₹499</span>
                <span className="text-slate-500 font-bold">/mo</span>
              </div>
              <ul className="space-y-4 text-slate-700 font-bold mb-10 flex-1">
                <li>20 reports/mo</li>
                <li>5 competitors</li>
                <li>Opp feed</li>
                <li>Saved opps</li>
              </ul>
              <Button asChild className="w-full btn-primary text-base py-6">
                <Link href="/login">Get Starter</Link>
              </Button>
          </motion.div>

          {/* Pro */}
          <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2 }}
              className="sketch-card flex flex-col transform rotate-1 hover:rotate-0"
          >
              <h3 className="font-bold text-2xl mb-4 text-blue-600 uppercase tracking-widest border-b-2 border-slate-100 pb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-slate-900">₹999</span>
                <span className="text-slate-500 font-bold">/month</span>
              </div>
              <ul className="space-y-4 text-slate-700 font-medium mb-10 flex-1">
                <li>50 reports/mo</li>
                <li>Advanced AI</li>
                <li>Monitoring</li>
                <li>Priority queue</li>
              </ul>
              <Button asChild className="w-full bg-slate-900 text-white border-2 border-slate-900 text-base font-bold py-6 sketch-border-sm hover:bg-slate-800 minimal-shadow">
                <Link href="/login">Go Pro →</Link>
              </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 max-w-4xl mx-auto scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-handdrawn text-slate-900 mb-6">Got questions?</h2>
          <p className="text-lg text-slate-600 font-medium">Everything you need to know about your new AI Cofounder.</p>
        </div>
        <FaqAccordion />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a2e] text-white py-20 px-6 border-t-[6px] border-highlight-yellow mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl sketch-border">
              <Rocket className="h-6 w-6 text-brand-orange" />
            </div>
            <span className="font-handdrawn text-3xl font-bold">SignalLoop</span>
          </div>
          
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 text-center md:text-left text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} SignalLoop. Built for builders.
        </div>
      </footer>
    </div>
  )
}