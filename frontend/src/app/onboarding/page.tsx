'use client'
import { Suspense, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, X, Rocket, BarChart } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { useUserStore } from '@/store/userStore'
import { useUIStore } from '@/store/uiStore'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function OnboardingContent() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const { usage, setUsage } = useUserStore()
  const { openUpgradeModal } = useUIStore()
  const router = useRouter()

  // Step 1 State
  const [formData, setFormData] = useState({
    business_name: '',
    website: '',
    category: 'SaaS',
    target_audience: '',
    project_brief: '',
    goal: 'Leads',
    region: 'Global'
  })

  // Step 2 State
  const [competitorName, setCompetitorName] = useState('')
  const [competitors, setCompetitors] = useState<string[]>([])

  // Step 1: Validate and move to Step 2
  const handleStep1 = () => {
    if (!formData.business_name) {
      toast.error('Business name is required')
      return
    }
    setStep(2)
  }

  // Step 2: Add Competitors
  const addCompetitor = () => {
    if (!competitorName) return
    
    // Check limit (Free: 1)
    const limit = usage?.competitors_limit || 1
    if (competitors.length >= limit) {
      toast.error(`Upgrade to add more than ${limit} competitors`)
      openUpgradeModal()
      return
    }

    setCompetitors([...competitors, competitorName])
    setCompetitorName('')
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
      const payload = {
        business_name: formData.business_name,
        description: formData.project_brief,
        category: formData.category,
        target_audience: formData.target_audience,
        goal: formData.goal,
        region: formData.region,
        competitors: competitors,
        platforms: ["reddit"]
      };

      const response = await api.post('/onboarding/submit', payload)
      const { job_id } = response.data;
      
      // Update usage in local store immediately so it reflects on dashboard
      if (usage) {
        setUsage({
          ...usage,
          reports_used: usage.reports_used + 1,
          reports_remaining: Math.max(0, usage.reports_remaining - 1)
        })
      }

      // Start polling
      const pollInterval = setInterval(async () => {
        try {
          const statusResp = await api.get(`/pipeline/status/${job_id}`)
          if (statusResp.data.status === 'completed') {
            clearInterval(pollInterval)
            router.push('/dashboard')
          } else if (statusResp.data.status === 'failed') {
            clearInterval(pollInterval)
            toast.error('Pipeline failed: ' + statusResp.data.message)
            setStep(3)
            setIsLoading(false)
          }
          // Optionally update UI with progress/message here
        } catch (pollErr) {
          console.error("Polling error", pollErr)
        }
      }, 2000)
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string }, status?: number } };
      if (error.response?.status === 402) {
         openUpgradeModal()
      } else {
        toast.error(error.response?.data?.error || 'Failed to submit onboarding')
      }
      setStep(3) // Go back to platform selection
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--paper-white)] selection:bg-highlight-yellow text-slate-900 font-sans relative overflow-x-hidden flex flex-col">
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 w-full max-w-2xl mx-auto">

        {/* PROGRESS INDICATOR */}
        {step < 4 && (
          <div className="w-full mb-16 mt-4 flex justify-between items-center px-2 sm:px-8 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative z-10">
                  <motion.div 
                    animate={{
                      scale: step === i ? 1.05 : 1,
                      y: step === i ? -4 : 0,
                    }}
                    className={`
                      relative flex md:flex-row items-center justify-center
                      md:px-5 md:py-3 md:rounded-2xl md:border-2 md:gap-3 transition-all duration-300
                      ${
                        step === i
                          ? 'md:bg-brand-orange md:text-white md:border-slate-900 md:shadow-[4px_4px_0px_#1a1a2e]'
                          : step > i
                          ? 'md:bg-slate-900 md:text-white md:border-slate-900 md:shadow-[2px_2px_0px_#1a1a2e]'
                          : 'md:bg-white md:text-slate-400 md:border-slate-200'
                      }
                    `}
                  >
                    {/* Mobile Circle / Desktop Icon Container */}
                    <div className={`
                      flex items-center justify-center w-10 h-10 md:w-7 md:h-7 rounded-full transition-colors duration-300
                      border-2 md:border-none z-10
                      ${
                        step === i 
                          ? 'bg-brand-orange text-white border-slate-900 shadow-[3px_3px_0px_#1a1a2e] md:bg-white md:text-brand-orange md:shadow-none' :
                        step > i 
                          ? 'bg-slate-900 text-white border-slate-900 md:bg-white/20 md:border-transparent' :
                          'bg-white text-slate-400 border-slate-300 md:bg-slate-50 md:border-slate-200'
                      }
                    `}>
                      {step > i ? (
                        <Check className="w-5 h-5 md:w-4 md:h-4" strokeWidth={3} />
                      ) : (
                        <span className="font-handdrawn text-xl md:text-base">{i}</span>
                      )}
                    </div>

                    {/* Label */}
                    <span className={`
                      absolute top-14 left-1/2 -translate-x-1/2 md:relative md:top-0 md:left-0 md:translate-x-0
                      whitespace-nowrap tracking-wide font-bold transition-all duration-300
                      ${
                        step === i 
                          ? 'text-slate-900 text-sm md:text-base md:text-white' : 
                        step > i 
                          ? 'text-slate-600 text-xs md:text-sm md:text-white' : 
                          'text-slate-400 text-xs md:text-sm md:text-slate-400'
                      }
                    `}>
                      {['Tell us', 'Competitors', 'Platforms'][i-1]}
                    </span>
                  </motion.div>
                </div>
                
                {/* Connecting Line */}
                {i < 3 && (
                  <div className="flex-1 mx-2 md:mx-4 relative h-[3px] flex items-center">
                    <div className="w-full border-t-[3px] border-dashed border-slate-200 absolute" />
                    <motion.div 
                      className="h-[3px] bg-slate-900 absolute left-0" 
                      initial={false}
                      animate={{ width: step > i ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="w-full">
          {/* Step 1: The Idea */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sketch-border bg-white p-6 md:p-10 minimal-shadow relative"
            >
              <div className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Step 1 of 3
              </div>
              <div className="mt-4 mb-8">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">
                  Tell us about your <span className="underline decoration-wavy decoration-brand-orange underline-offset-4">idea</span>.
                </h2>
              </div>
              <hr className="border-t-2 border-slate-100 mb-6" />

              <div className="space-y-6">
                <div>
                  <Label className="font-bold text-sm text-slate-700 mb-2 block">Business Name</Label>
                  <Input 
                    className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 h-12 font-medium text-base shadow-none" 
                    placeholder="SignalLoop" 
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="font-bold text-sm text-slate-700 mb-2 block">
                    What does it do? (describe freely)
                  </Label>
                  <Textarea 
                    className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 min-h-[120px] font-medium text-base shadow-none resize-none" 
                    placeholder="AI tool that monitors Reddit for buying signals and alerts founders in real-time..." 
                    value={formData.project_brief}
                    onChange={(e) => setFormData({...formData, project_brief: e.target.value})}
                  />
                  <p className="text-xs font-bold text-slate-400 mt-2">
                    ↑ This is the key field
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-bold text-sm text-slate-700 mb-2 block">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || 'SaaS'})}>
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
                    <Label className="font-bold text-sm text-slate-700 mb-2 block">Target Audience</Label>
                    <Input 
                      className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 h-12 font-medium text-base shadow-none" 
                      placeholder="SaaS founders, indie hackers" 
                      value={formData.target_audience}
                      onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-bold text-sm text-slate-700 mb-3 block">Primary Goal</Label>
                    <RadioGroup 
                      value={formData.goal} 
                      onValueChange={(v) => setFormData({...formData, goal: v})}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Leads" id="goal-leads" className="border-slate-300 text-brand-orange focus:ring-brand-orange" />
                        <Label htmlFor="goal-leads" className="font-medium cursor-pointer">Leads</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Traffic" id="goal-traffic" className="border-slate-300 text-brand-orange focus:ring-brand-orange" />
                        <Label htmlFor="goal-traffic" className="font-medium cursor-pointer">Traffic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Brand" id="goal-brand" className="border-slate-300 text-brand-orange focus:ring-brand-orange" />
                        <Label htmlFor="goal-brand" className="font-medium cursor-pointer">Brand</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="font-bold text-sm text-slate-700 mb-2 block">Region</Label>
                    <Select value={formData.region} onValueChange={(v) => setFormData({...formData, region: v || 'Global'})}>
                      <SelectTrigger className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange text-slate-900 h-12 font-medium text-base shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="sketch-border bg-white text-slate-900">
                        {['Global', 'North America', 'Europe', 'Asia', 'Latin America'].map(c => (
                          <SelectItem key={c} value={c} className="font-medium cursor-pointer">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <Button 
                  onClick={handleStep1} 
                  disabled={isLoading}
                  className="w-[160px] btn-primary h-12"
                >
                  {isLoading ? 'Thinking...' : 'Continue →'}
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
              className="sketch-border bg-white p-6 md:p-10 minimal-shadow relative"
            >
              <div className="mb-4">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">Who are you up against?</h2>
              </div>
              <hr className="border-t-2 border-slate-100 mb-8" />

              <div className="space-y-6">
                <Label className="font-bold text-sm text-slate-700 block">Add competitors or similar tools:</Label>
                
                <div className="flex flex-col gap-3">
                  {competitors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input 
                        readOnly
                        value={c}
                        className="sketch-border-sm bg-slate-100 border-slate-200 text-slate-600 h-12 font-medium text-base shadow-none flex-1" 
                      />
                      <Button 
                        variant="ghost" 
                        className="h-12 w-12 shrink-0 sketch-border-sm border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      className="sketch-border-sm bg-slate-50 border-slate-300 focus:border-brand-orange focus:ring-0 text-slate-900 h-12 font-medium text-base shadow-none flex-1" 
                      placeholder="+ Add another" 
                      value={competitorName}
                      onChange={(e) => setCompetitorName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                    />
                    <Button onClick={addCompetitor} className="h-12 px-6 sketch-border-sm bg-slate-900 text-white hover:bg-brand-orange transition-colors">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-8 space-y-1">
                  <p className="text-sm font-bold text-slate-700">FREE: 1 competitor max</p>
                  <button onClick={openUpgradeModal} className="text-sm font-medium text-brand-orange hover:underline">
                    💡 Upgrade for 5 competitors
                  </button>
                </div>
              </div>

              <div className="mt-10 flex gap-4 justify-between">
                <Button onClick={() => setStep(1)} variant="outline" className="w-[120px] sketch-border bg-white text-slate-900 border-2 border-slate-900 h-12 font-bold text-base hover:bg-slate-50">
                  ← Back
                </Button>
                <Button onClick={handleStep2} className="w-[160px] btn-primary h-12">
                  Continue →
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
              className="sketch-border bg-white p-6 md:p-10 minimal-shadow relative"
            >
              <div className="mb-4">
                <h2 className="text-3xl font-handdrawn text-slate-900 mb-2">Where should we look?</h2>
              </div>
              <hr className="border-t-2 border-slate-100 mb-8" />

              <div className="space-y-4">
                {/* Active Platform */}
                <div className="sketch-border bg-white border-brand-orange border-2 p-4 flex items-center justify-between shadow-[2px_2px_0px_#f97316]">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-sm bg-brand-orange flex items-center justify-center">
                      <Check className="w-4 h-4 text-white font-bold" />
                    </div>
                    <span className="font-bold text-slate-900 text-lg">Reddit</span>
                  </div>
                  <span className="text-brand-orange text-xs font-bold uppercase tracking-wider bg-orange-100 px-2 py-1 rounded">AI-powered ✓</span>
                </div>
                
                {/* Inactive Platforms */}
                <div className="flex items-center gap-3 opacity-50 px-4 py-2">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="font-medium text-slate-600 text-base">LinkedIn</span>
                </div>
                <div className="flex items-center gap-3 opacity-50 px-4 py-2">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="font-medium text-slate-600 text-base">X/Twitter</span>
                </div>
                <div className="flex items-center gap-3 opacity-50 px-4 py-2">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="font-medium text-slate-600 text-base">YouTube</span>
                </div>
                <div className="flex items-center gap-3 opacity-50 px-4 py-2">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  <span className="font-medium text-slate-600 text-base">IndieHackers</span>
                </div>

                <p className="text-xs font-bold text-slate-500 mt-6 px-4">
                  Coming soon — Reddit is the goldmine anyway 🎯
                </p>
              </div>

              <div className="mt-10 flex gap-4 justify-between items-start">
                <Button onClick={() => setStep(2)} variant="outline" className="w-[120px] sketch-border bg-white text-slate-900 border-2 border-slate-900 h-14 font-bold text-base hover:bg-slate-50 shrink-0">
                  ← Back
                </Button>
                <div className="flex flex-col items-end flex-1 ml-4">
                  <Button onClick={handleStep3} className="w-full sm:w-auto px-8 btn-primary h-14 text-lg shrink-0">
                    🚀 Generate My Report
                  </Button>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 mr-2">Takes 20-35 seconds. We&apos;ll show progress</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Progress Overlay */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-transparent py-10 text-center relative"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-brand-orange animate-pulse" />
                </div>
              </div>

              <h2 className="text-4xl font-handdrawn text-slate-900 mb-2">AI is thinking...</h2>
              <p className="text-slate-500 font-medium text-sm mb-8">Please don&apos;t close this window. This usually takes about 60 seconds.</p>

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
