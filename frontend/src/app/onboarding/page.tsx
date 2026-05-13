'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Check, X, Rocket, Target, Users, ArrowRight, ArrowLeft, PenTool, BarChart } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { motion } from 'framer-motion'
import Link from 'next/link'

function OnboardingContent() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const router = useRouter()
  const { usage, setUsage } = useUserStore()
  const { openUpgradeModal } = useUIStore()

  // Step 1 State
  const [formData, setFormData] = useState({
    business_name: '',
    website: '',
    category: 'SaaS',
    project_brief: '',
    goal: 'Leads',
    region: 'Global'
  })

  // Step 2 State
  const [competitorName, setCompetitorName] = useState('')
  const [competitors, setCompetitors] = useState<string[]>([])

  // Step 1: Create Business
  const handleStep1 = async () => {
    if (!formData.business_name) {
      toast.error('Business name is required')
      return
    }
    setIsLoading(true)
    try {
      const response = await api.post('/businesses/', formData)
      setBusinessId(response.data.id)
      setStep(2)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to create business')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Add Competitors
  const addCompetitor = async () => {
    if (!competitorName) return
    
    // Check limit (Free: 1)
    const limit = usage?.competitors_limit || 1
    if (competitors.length >= limit) {
      toast.error(`Upgrade to add more than ${limit} competitors`)
      openUpgradeModal()
      return
    }

    try {
      await api.post(`/businesses/${businessId}/competitors`, { competitor_name: competitorName })
      setCompetitors([...competitors, competitorName])
      setCompetitorName('')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      if (error.response?.status === 402) {
         openUpgradeModal()
      } else {
         toast.error(error.response?.data?.error || 'Failed to add competitor')
      }
    }
  }

  const handleStep2 = () => {
    setStep(3)
  }

  // Step 3: Generate Report
  const handleStep3 = async () => {
    // Check if quota available
    if (usage && usage.reports_remaining <= 0) {
      toast.error("Quota exhausted. Upgrade to generate more reports.")
      openUpgradeModal()
      return
    }

    setIsLoading(true)
    setStep(4) // Show progress overlay
    
    try {
      await api.post('/reports/generate', { business_id: businessId })
      
      // Update usage in local store immediately so it reflects on dashboard
      if (usage) {
        setUsage({
          ...usage,
          reports_used: usage.reports_used + 1,
          reports_remaining: Math.max(0, usage.reports_remaining - 1)
        })
      }
      
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      if (error.response?.status === 402) {
         openUpgradeModal()
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate report')
      }
      setStep(3) // Go back to platform selection
    } finally {
      setIsLoading(false)
    }
  }

  const stepIcons = [
    <PenTool key="s1" className="h-5 w-5" />,
    <Users key="s2" className="h-5 w-5" />,
    <Target key="s3" className="h-5 w-5" />
  ]

  const stepLabels = ['The Idea', 'Competitors', 'Generate']

  return (
    <div className="h-[100dvh] w-full bg-[var(--paper-white)] selection:bg-highlight-yellow text-slate-900 font-sans relative overflow-hidden flex flex-col">

      {/* BACKGROUND NOISE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* TOP HEADER */}
      <div className="relative z-10 p-6 shrink-0 flex justify-between items-center w-full max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-brand-orange p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="font-handdrawn text-2xl font-bold tracking-tight text-slate-900 mt-1">SignalLoop</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-colors">
          Skip to Dashboard
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12 w-full max-w-4xl mx-auto">

        {/* PROGRESS INDICATOR */}
        {step < 4 && (
          <div className="w-full max-w-2xl mb-12 flex justify-between items-center px-4 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                    step >= i 
                      ? 'bg-brand-orange text-white sketch-border minimal-shadow' 
                      : 'bg-white text-slate-400 border-2 border-slate-200 rounded-xl'
                  }`}>
                    {step > i ? <Check className="h-5 w-5" /> : stepIcons[i-1]}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= i ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stepLabels[i-1]}
                  </span>
                </div>
                {i < 3 && (
                  <div className="flex-1 mx-4 relative h-0">
                     <svg className={`absolute inset-0 w-full h-4 -top-2 ${step > i ? 'text-brand-orange' : 'text-slate-200'}`} preserveAspectRatio="none" viewBox="0 0 100 10">
                       <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray={step > i ? "none" : "4 4"} />
                     </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="w-full max-w-xl">
          {/* Step 1: The Idea */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sketch-border bg-white p-8 minimal-shadow transform rotate-1"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">Tell us your idea</h2>
                <p className="text-slate-500 font-medium text-sm">Don't overthink it. Just brain-dump what you want to build.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2 block">Project Name *</Label>
                  <Input 
                    className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 h-12 font-medium text-base shadow-none" 
                    placeholder="e.g. SignalLoop" 
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2 block">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || 'Other'})}>
                    <SelectTrigger className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange text-slate-900 h-12 font-medium text-base shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="sketch-border bg-white text-slate-900">
                      {['SaaS', 'Creator Tool', 'Agency', 'AI Tool', 'Ecommerce', 'Local Business', 'Other'].map(c => (
                        <SelectItem key={c} value={c} className="font-medium cursor-pointer">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2 block flex justify-between">
                    Project Brief *
                    <span className="text-brand-orange font-handdrawn capitalize text-sm tracking-normal">The most important part!</span>
                  </Label>
                  <Textarea 
                    className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 min-h-[140px] font-medium text-base shadow-none resize-none" 
                    placeholder="E.g. I want to build a tool that helps startup founders find leads on Reddit. It should scan subreddits automatically and score posts based on buying intent..." 
                    value={formData.project_brief}
                    onChange={(e) => setFormData({...formData, project_brief: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <Button 
                  onClick={handleStep1} 
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Thinking...' : 'Next Step →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Competitors */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="sketch-border bg-white p-8 minimal-shadow transform -rotate-1"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">Who's already doing this?</h2>
                <p className="text-slate-500 font-medium text-sm">Add competitors so the AI can figure out how you can beat them.</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <Input 
                    className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 h-12 font-medium text-base shadow-none flex-1" 
                    placeholder="e.g. Stripe, Shopify, AcmeCorp" 
                    value={competitorName}
                    onChange={(e) => setCompetitorName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                  />
                  <Button onClick={addCompetitor} className="btn-primary px-6 h-12 text-base">Add</Button>
                </div>

                <div className="bg-slate-50 sketch-border-sm p-6 min-h-[120px]">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-4 block">Tracked Competitors</Label>
                  <div className="flex flex-wrap gap-3">
                    {competitors.length === 0 && <p className="text-sm text-slate-500 font-handdrawn text-xl opacity-50">No competitors added yet...</p>}
                    {competitors.map((c, i) => (
                      <Badge key={i} className="bg-white border-2 border-slate-900 text-slate-900 py-2 px-4 flex items-center gap-2 rounded-xl font-bold shadow-[2px_2px_0px_#1a1a2e] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer group" onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))}>
                        {c}
                        <X className="h-3 w-3 group-hover:text-rose-600" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="w-1/3 sketch-border bg-white text-slate-900 border-2 border-slate-900 h-14 font-bold text-base hover:bg-slate-50">
                  ← Back
                </Button>
                <Button onClick={handleStep2} className="w-2/3 btn-primary">
                  Next Step →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Platform Selection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="sketch-border bg-white p-8 minimal-shadow transform rotate-1"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">Ready to generate?</h2>
                <p className="text-slate-500 font-medium text-sm">Your AI Cofounder is ready to analyze the market and build your PRD.</p>
              </div>

              <div className="space-y-4">
                <div className="sketch-border bg-highlight-yellow/20 border-highlight-yellow p-4 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-highlight-yellow border-2 border-slate-900 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-slate-900 font-bold" />
                  </div>
                  <span className="font-bold text-slate-900 text-lg">Reddit Market Intelligence</span>
                </div>
                <div className="sketch-border bg-slate-50 border-slate-200 p-4 flex items-center gap-4 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-400 shrink-0" />
                  <span className="font-bold text-slate-500 text-lg line-through">Twitter / X Analysis (Soon)</span>
                </div>
                <div className="sketch-border bg-slate-50 border-slate-200 p-4 flex items-center gap-4 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-400 shrink-0" />
                  <span className="font-bold text-slate-500 text-lg line-through">LinkedIn Strategy (Soon)</span>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="w-1/3 sketch-border bg-white text-slate-900 border-2 border-slate-900 h-14 font-bold text-base hover:bg-slate-50">
                  ← Back
                </Button>
                <Button onClick={handleStep3} className="w-2/3 btn-primary text-xl flex items-center justify-center gap-2">
                  <BarChart className="w-5 h-5" /> Generate Plan
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Progress Overlay */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="sketch-border bg-white p-10 minimal-shadow text-center transform -rotate-1"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 border-t-brand-orange rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-brand-orange animate-pulse" />
                </div>
              </div>

              <h2 className="text-4xl font-handdrawn text-slate-900 mb-2">AI is thinking...</h2>
              <p className="text-slate-500 font-medium text-sm mb-8">Please don't close this window. This usually takes about 60 seconds.</p>

              <div className="space-y-4 text-left max-w-sm mx-auto">
                {[
                  { text: "Structuring Product Requirements...", delay: 2000 },
                  { text: "Analyzing Competitor flaws...", delay: 20000 },
                  { text: "Writing AI Scaffold Prompts...", delay: 40000 },
                  { text: "Finalizing Launch Strategy...", delay: 55000 }
                ].map((s, i) => (
                  <ProgressStep key={i} text={s.text} delay={s.delay} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProgressStep({ text, delay }: { text: string, delay: number }) {
  const [complete, setComplete] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setComplete(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className="flex items-center gap-4 p-2">
      {complete ? (
         <div className="h-6 w-6 bg-brand-orange border-2 border-slate-900 rounded-full flex items-center justify-center shadow-[1px_1px_0px_#1a1a2e] animate-in zoom-in shrink-0">
            <Check className="h-3 w-3 text-white font-bold" strokeWidth={4} />
         </div>
      ) : (
         <div className="h-6 w-6 border-2 border-slate-300 rounded-full shrink-0" />
      )}
      <span className={`text-base font-handdrawn transition-colors duration-300 ${complete ? "text-slate-900 text-xl" : "text-slate-400"}`}>{text}</span>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--paper-white)]"><div className="animate-spin h-8 w-8 border-4 border-slate-200 border-t-brand-orange rounded-full" /></div>}>
      <OnboardingContent />
    </Suspense>
  )
}
