'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, Rocket, Sparkles, Building2, Users, Target, Zap, Shield, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { useUserStore } from '@/store/userStore'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'
import Link from 'next/link'

import { useQueryClient } from '@tanstack/react-query'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const router = useRouter()
  const { usage } = useUserStore()
  const queryClient = useQueryClient()

  // Step 1 State
  const [formData, setFormData] = useState({
    business_name: '',
    website: '',
    category: 'SaaS',
    target_audience: '',
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
      return
    }

    try {
      await api.post(`/businesses/${businessId}/competitors`, { competitor_name: competitorName })
      setCompetitors([...competitors, competitorName])
      setCompetitorName('')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to add competitor')
    }
  }

  const handleStep2 = () => {
    setStep(3)
  }

  // Step 3: Generate Report
  const handleStep3 = async () => {
    setIsLoading(true)
    setStep(4) // Show progress overlay
    
    try {
      await api.post('/reports/generate', { business_id: businessId })
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to generate report')
      setStep(3) // Go back to platform selection
    } finally {
      setIsLoading(false)
    }
  }

  const stepIcons = [
    <Building2 key="s1" className="h-5 w-5" />,
    <Users key="s2" className="h-5 w-5" />,
    <Target key="s3" className="h-5 w-5" />
  ]

  const stepLabels = ['Business', 'Competitors', 'Platforms']

  return (
    <div className="h-[100dvh] w-full bg-white selection:bg-orange-100 text-slate-900 font-sans relative overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/8 via-white to-white pointer-events-none z-0" />

      {/* Dotted grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent_5%,black_20%,black_80%,transparent_95%)] opacity-35 pointer-events-none z-0" />

      {/* Subtle orange orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF4500]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-[10%] w-28 h-28 bg-[#FF4500]/5 rounded-full blur-2xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-[8%] w-36 h-36 bg-[#FF4500]/4 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 right-[5%] w-20 h-20 bg-[#FF4500]/3 rounded-full blur-2xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center h-full justify-center px-4 py-4">

        {/* Logo */}
        <div className="mb-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="bg-[#FF4500] p-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-slate-900">SignalLoop</span>
          </Link>
        </div>

        {/* Progress Header */}
        {step < 4 && (
          <div className="w-full max-w-lg mb-3 flex justify-between items-center px-2 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-500 z-10 border ${
                    step >= i 
                      ? 'bg-[#FF4500] text-white shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] border-[#FF4500]' 
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {step > i ? <Check className="h-4 w-4" /> : stepIcons[i-1]}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${step >= i ? 'text-[#FF4500]' : 'text-slate-400'}`}>
                    {stepLabels[i-1]}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`h-[1.5px] flex-1 mx-2 rounded-full transition-all duration-500 mb-4 ${
                    step > i ? 'bg-[#FF4500]' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Business Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]">
              {/* Background Decoration */}
              <div className="absolute -top-8 -right-8 opacity-[0.08] pointer-events-none transform rotate-12 z-0">
                <Building2 className="w-40 h-40 text-[#FF4500]" />
              </div>

              <div className="relative z-10">
                <CardHeader className="px-6 pt-5 pb-3 border-b border-white/40">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 shadow-sm border bg-white text-[#FF4500] border-white/80">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900">Tell us about your business</CardTitle>
                  <CardDescription className="text-slate-600 font-medium pt-0.5 text-xs">This helps us find the most relevant communities for you.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 px-7 py-5">
                  <div className="space-y-2">
                    <Label className="font-bold text-[11px] uppercase tracking-widest text-slate-500 ml-1">Business Name *</Label>
                    <Input 
                      className="bg-white/80 backdrop-blur-sm border-white/80 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-10 shadow-sm transition-all font-medium text-sm" 
                      placeholder="e.g. Acme AI" 
                      value={formData.business_name}
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-500 ml-1">Website URL (Optional)</Label>
                    <Input 
                      className="bg-white/80 backdrop-blur-sm border-white/80 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-9 shadow-sm transition-all font-medium text-sm" 
                      placeholder="https://acme.ai" 
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-500 ml-1">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || 'Other'})}>
                      <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-white/80 hover:border-[#FF4500]/50 focus:border-[#FF4500] text-slate-900 rounded-xl h-9 shadow-sm transition-all font-medium text-sm group/select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white backdrop-blur-xl border-slate-100 text-slate-900 rounded-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-1 z-[100]">
                        {['SaaS', 'Creator Tool', 'Agency', 'AI Tool', 'Ecommerce', 'Local Business', 'Other'].map(c => (
                          <SelectItem 
                            key={c} 
                            value={c} 
                            className="rounded-lg cursor-pointer py-2.5 px-3 font-medium text-sm text-slate-700 hover:bg-[#FF4500]/8 hover:text-[#FF4500] focus:bg-[#FF4500]/8 focus:text-[#FF4500] data-[highlighted]:bg-[#FF4500]/8 data-[highlighted]:text-[#FF4500] transition-colors"
                          >
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-[11px] uppercase tracking-widest text-slate-500 ml-1">Target Audience</Label>
                    <Input 
                      className="bg-white/80 backdrop-blur-sm border-white/80 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-10 shadow-sm transition-all font-medium text-sm" 
                      placeholder="e.g. Marketing managers" 
                      value={formData.target_audience}
                      onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    />
                  </div>
                </CardContent>

                <CardFooter className="px-7 pb-6 pt-1 border-none flex gap-3">
                  <Button variant="outline" onClick={() => router.push('/')} className="h-11 px-5 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition-all duration-200 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Home
                  </Button>
                  <Button onClick={handleStep1} className="flex-1 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-11 text-sm shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 group" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <span className="flex items-center gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Competitors */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]">
              {/* Background Decoration */}
              <div className="absolute -top-8 -right-8 opacity-[0.08] pointer-events-none transform rotate-12 z-0">
                <Users className="w-40 h-40 text-[#FF4500]" />
              </div>

              <div className="relative z-10">
                <CardHeader className="px-6 pt-5 pb-3 border-b border-white/40">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 shadow-sm border bg-white text-[#FF4500] border-white/80">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900">Add Competitors</CardTitle>
                  <CardDescription className="text-slate-600 font-medium pt-0.5 text-xs">We&apos;ll monitor where they are being discussed.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 px-7 py-5">
                  <div className="flex gap-3">
                    <Input 
                      className="bg-white/80 backdrop-blur-sm border-white/80 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-10 shadow-sm transition-all font-medium text-sm flex-1" 
                      placeholder="Competitor Name" 
                      value={competitorName}
                      onChange={(e) => setCompetitorName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                    />
                    <Button onClick={addCompetitor} variant="outline" className="h-10 px-5 rounded-xl font-bold border-[#FF4500]/20 bg-white/80 hover:bg-[#FF4500] hover:text-white text-slate-700 shadow-sm transition-all duration-200">Add</Button>
                  </div>

                  <div className="space-y-2 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Added Competitors</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                      {competitors.length === 0 && <p className="text-sm text-slate-400 italic font-medium">No competitors added yet.</p>}
                      {competitors.map((c, i) => (
                        <Badge key={i} className="bg-[#FF4500]/10 border border-[#FF4500]/20 text-slate-800 py-1.5 px-4 flex items-center gap-2 rounded-full font-bold shadow-sm">
                          {c}
                          <X className="h-3.5 w-3.5 cursor-pointer text-slate-400 hover:text-red-500 transition-colors" onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))} />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-16 h-16 text-[#FF4500]" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3.5 w-3.5 text-[#FF4500]" />
                          <span className="text-xs font-extrabold text-slate-900">Need more power?</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          Upgrade to Pro for <span className="text-[#FF4500] font-bold">unlimited competitors</span>, 50 reports, and daily opportunity refreshes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-5 pt-1 border-none flex gap-3">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-11 px-5 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition-all duration-200 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                  </Button>
                  <Button onClick={handleStep2} className="flex-[2] bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-11 text-sm shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 group">
                    <span className="flex items-center gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Platform Selection */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]">
              {/* Background Decoration */}
              <div className="absolute -top-8 -right-8 opacity-[0.08] pointer-events-none transform rotate-12 z-0">
                <Target className="w-40 h-40 text-[#FF4500]" />
              </div>

              <div className="relative z-10">
                <CardHeader className="px-6 pt-5 pb-3 border-b border-white/40">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 shadow-sm border bg-white text-[#FF4500] border-white/80">
                    <Target className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900">Select Platforms</CardTitle>
                  <CardDescription className="text-slate-600 font-medium pt-0.5 text-xs">Where should our AI look for your customers?</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2.5 px-7 py-5">
                  {/* Reddit - Enabled */}
                  <div className="flex items-center space-x-3 p-3 bg-[#FF4500]/10 rounded-xl border border-[#FF4500]/20 shadow-sm relative overflow-hidden group">
                    <Checkbox id="reddit" checked disabled className="border-[#FF4500]/50 data-[state=checked]:bg-[#FF4500] data-[state=checked]:text-white h-5 w-5 rounded" />
                    <Label htmlFor="reddit" className="flex-1 font-bold text-base text-slate-900 cursor-not-allowed">Reddit</Label>
                    <Badge className="bg-[#FF4500] text-white border-none rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">Enabled</Badge>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF4500]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Coming Soon Platforms */}
                  {['LinkedIn', 'X (Twitter)', 'YouTube', 'IndieHackers'].map(p => (
                    <div key={p} className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 opacity-60 cursor-not-allowed shadow-sm">
                      <Checkbox id={p} disabled className="h-5 w-5 rounded border-slate-200" />
                      <Label htmlFor={p} className="flex-1 font-medium text-base text-slate-500">{p}</Label>
                      <Badge variant="outline" className="border-slate-200 text-slate-400 bg-white rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">Coming Soon</Badge>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="px-6 pb-5 pt-1 border-none flex gap-3">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1 h-11 px-5 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition-all duration-200 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                  </Button>
                  <Button onClick={handleStep3} className="flex-[2] bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-11 text-sm shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 group">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Report
                    </span>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Progress Overlay */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 text-center">
              {/* Background Decoration */}
              <div className="absolute -top-8 -right-8 opacity-[0.08] pointer-events-none transform rotate-12 z-0">
                <Rocket className="w-48 h-48 text-[#FF4500]" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 border-4 border-slate-200 border-t-[#FF4500] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-white/80 shadow-sm">
                      <Rocket className="h-8 w-8 text-[#FF4500] animate-bounce" />
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-[#FF4500] absolute -top-1 -right-1 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Generating Intelligence</h2>
                  <p className="text-slate-600 font-medium mt-2 text-sm leading-relaxed">Our AI is scanning communities and analysing competitors. This usually takes about 60 seconds.</p>
                </div>

                <div className="space-y-2 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm text-left">
                  {[
                    { text: "Finding communities...", delay: 2000 },
                    { text: "Analysing competitors...", delay: 20000 },
                    { text: "Detecting opportunities...", delay: 40000 },
                    { text: "Building growth strategy...", delay: 55000 }
                  ].map((s, i) => (
                    <ProgressStep key={i} text={s.text} delay={s.delay} />
                  ))}
                </div>

                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold pt-2">Powered by Llama 3.3</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

function ProgressStep({ text, delay }: { text: string, delay: number }) {
  const [complete, setComplete] = useState(false)
  
  useState(() => {
    setTimeout(() => setComplete(true), delay)
  })

  return (
    <div className="flex items-center gap-3 p-2">
      {complete ? (
         <div className="h-6 w-6 bg-[#FF4500]/15 border border-[#FF4500]/30 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in shrink-0">
            <Check className="h-3 w-3 text-[#FF4500]" />
         </div>
      ) : (
         <div className="h-6 w-6 border-2 border-slate-200 rounded-full shrink-0" />
      )}
      <span className={`text-sm font-bold transition-colors duration-300 ${complete ? "text-slate-900" : "text-slate-400"}`}>{text}</span>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="h-12 w-12 text-[#FF4500] animate-spin" /></div>}>
      <OnboardingContent />
    </Suspense>
  )
}
