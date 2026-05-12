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
import { Check, X, Loader2, Rocket, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { useUserStore } from '@/store/userStore'
import { HaloBackground } from '@/components/HaloBackground'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const router = useRouter()
  const { usage } = useUserStore()

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
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to generate report')
      setStep(3) // Go back to platform selection
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 selection:bg-brand-orange selection:text-white relative overflow-hidden text-white">
      <HaloBackground />

      {/* Progress Header */}
      {step < 4 && (
        <div className="w-full max-w-2xl mb-12 flex justify-between items-center px-4 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-500 z-10 border-2 ${step >= i ? 'bg-brand-orange text-white shadow-brand-orange/20 border-brand-orange' : 'bg-slate-900/40 text-slate-500 border-white/10 backdrop-blur-md'}`}>
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              {i < 3 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${step > i ? 'bg-brand-orange shadow-[0_0_10px_rgba(64,150,255,0.5)]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Business Information */}
      {step === 1 && (
        <Card className="w-full max-w-lg bg-slate-900/60 backdrop-blur-3xl border-white/10 text-white shadow-premium rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500 relative z-10">
          <CardHeader className="p-10 border-b border-white/5 bg-black/20">
            <CardTitle className="text-3xl font-bold tracking-tight drop-shadow-sm">Tell us about your business</CardTitle>
            <CardDescription className="text-slate-400 font-medium pt-2">This helps us find the most relevant communities for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-10">
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Business Name *</Label>
              <Input 
                className="bg-white/5 border-white/10 focus:border-brand-orange text-white rounded-xl h-12 shadow-sm transition-colors" 
                placeholder="e.g. Acme AI" 
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Website URL (Optional)</Label>
              <Input 
                className="bg-white/5 border-white/10 focus:border-brand-orange text-white rounded-xl h-12 shadow-sm transition-colors" 
                placeholder="https://acme.ai" 
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || 'Other'})}>
                <SelectTrigger className="bg-white/5 border-white/10 focus:border-brand-orange text-white rounded-xl h-12 shadow-sm transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-2xl border-white/10 text-white rounded-xl shadow-xl">
                  {['SaaS', 'Creator Tool', 'Agency', 'AI Tool', 'Ecommerce', 'Local Business', 'Other'].map(c => (
                    <SelectItem key={c} value={c} className="hover:bg-white/10 focus:bg-white/10 rounded-lg cursor-pointer py-2.5">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Target Audience</Label>
              <Input 
                className="bg-white/5 border-white/10 focus:border-brand-orange text-white rounded-xl h-12 shadow-sm transition-colors" 
                placeholder="e.g. Marketing managers at B2B tech companies" 
                value={formData.target_audience}
                onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="p-10 pt-4 bg-black/20 border-t border-white/5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15} className="w-full">
              <Button onClick={handleStep1} className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full font-bold h-14 text-lg shadow-lg shadow-brand-orange/20 border border-white/10" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Continue"}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Competitors */}
      {step === 2 && (
        <Card className="w-full max-w-lg bg-slate-900/60 backdrop-blur-3xl border-white/10 text-white shadow-premium rounded-[2.5rem] overflow-hidden animate-in slide-in-from-right-8 duration-500 relative z-10">
          <CardHeader className="p-10 border-b border-white/5 bg-black/20">
            <CardTitle className="text-3xl font-bold tracking-tight drop-shadow-sm">Add Competitors</CardTitle>
            <CardDescription className="text-slate-400 font-medium pt-2">We&apos;ll monitor where they are being discussed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="flex gap-3">
              <Input 
                className="bg-white/5 border-white/10 focus:border-brand-orange text-white rounded-xl h-12 shadow-sm transition-colors flex-1" 
                placeholder="Competitor Name" 
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
              />
              <Button onClick={addCompetitor} variant="outline" className="h-12 px-6 rounded-xl font-bold border-white/10 bg-white/5 hover:bg-white/10 hover:text-brand-orange text-white shadow-sm">Add</Button>
            </div>
            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Added Competitors</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {competitors.length === 0 && <p className="text-sm text-slate-500 italic">No competitors added yet.</p>}
                {competitors.map((c, i) => (
                  <Badge key={i} className="bg-white/10 border border-white/10 text-white py-1.5 px-4 flex items-center gap-2 rounded-full font-bold shadow-sm backdrop-blur-md">
                    {c}
                    <X className="h-3.5 w-3.5 cursor-pointer text-slate-400 hover:text-rose-400 transition-colors" onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))} />
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium border-t border-white/10 pt-3">
                {competitors.length} of {usage?.competitors_limit || 1} used <Badge variant="outline" className="text-[9px] uppercase ml-1 border-brand-orange/30 text-brand-orange bg-brand-orange/5">{usage?.plan || 'Free'} plan</Badge>
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-10 pt-4 bg-black/20 border-t border-white/5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15} className="w-full">
              <Button onClick={handleStep2} className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full font-bold h-14 text-lg shadow-lg shadow-brand-orange/20 border border-white/10">
                Continue to Platforms
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Platform Selection */}
      {step === 3 && (
        <Card className="w-full max-w-lg bg-slate-900/60 backdrop-blur-3xl border-white/10 text-white shadow-premium rounded-[2.5rem] overflow-hidden animate-in slide-in-from-right-8 duration-500 relative z-10">
          <CardHeader className="p-10 border-b border-white/5 bg-black/20">
            <CardTitle className="text-3xl font-bold tracking-tight drop-shadow-sm">Select Platforms</CardTitle>
            <CardDescription className="text-slate-400 font-medium pt-2">Where should our AI look for your customers?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-10">
            <div className="flex items-center space-x-4 p-5 bg-brand-orange/10 rounded-2xl border border-brand-orange/30 shadow-sm relative overflow-hidden group">
              <Checkbox id="reddit" checked disabled className="border-brand-orange/50 data-[state=checked]:bg-brand-orange data-[state=checked]:text-white h-5 w-5 rounded" />
              <Label htmlFor="reddit" className="flex-1 font-bold text-lg text-white cursor-not-allowed drop-shadow-sm">Reddit</Label>
              <Badge className="bg-brand-orange text-white border-none rounded-md px-3 font-bold">Enabled</Badge>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {['LinkedIn', 'X (Twitter)', 'YouTube', 'IndieHackers'].map(p => (
              <div key={p} className="flex items-center space-x-4 p-5 bg-white/5 rounded-2xl border border-white/10 opacity-60 cursor-not-allowed">
                <Checkbox id={p} disabled className="h-5 w-5 rounded border-white/20" />
                <Label htmlFor={p} className="flex-1 font-medium text-lg text-slate-300">{p}</Label>
                <Badge variant="outline" className="border-white/10 text-slate-400 bg-white/5 rounded-md px-3">Coming Soon</Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-10 pt-4 bg-black/20 border-t border-white/5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15} className="w-full">
              <Button onClick={handleStep3} className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full font-bold h-14 text-lg shadow-lg shadow-brand-orange/20 border border-white/10">
                Generate Growth Report
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Progress Overlay */}
      {step === 4 && (
        <div className="text-center space-y-10 animate-in zoom-in-95 duration-700 bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[3rem] shadow-2xl border border-white/10 max-w-lg w-full relative z-50">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Rocket className="h-10 w-10 text-brand-orange animate-bounce" />
            </div>
            <Sparkles className="h-6 w-6 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div>
             <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Generating Intelligence</h2>
             <p className="text-slate-400 font-medium mt-3 leading-relaxed">Our AI is scanning communities and analysing competitors. This usually takes about 60 seconds.</p>
          </div>
          <div className="space-y-4 max-w-sm mx-auto bg-black/40 p-6 rounded-3xl border border-white/10 shadow-inner">
             {[
               { text: "Finding communities...", delay: 2000 },
               { text: "Analysing competitors...", delay: 20000 },
               { text: "Detecting opportunities...", delay: 40000 },
               { text: "Building growth strategy...", delay: 55000 }
             ].map((s, i) => (
               <ProgressStep key={i} text={s.text} delay={s.delay} />
             ))}
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold pt-4 border-t border-white/10">Powered by Llama 3.3</p>
        </div>
      )}
    </div>
  )
}

function ProgressStep({ text, delay }: { text: string, delay: number }) {
  const [complete, setComplete] = useState(false)
  
  useState(() => {
    setTimeout(() => setComplete(true), delay)
  })

  return (
    <div className="flex items-center gap-4 text-left p-2">
      {complete ? (
         <div className="h-6 w-6 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-in zoom-in shrink-0">
            <Check className="h-3 w-3 text-emerald-400" />
         </div>
      ) : (
         <div className="h-6 w-6 border-2 border-white/20 rounded-full shrink-0" />
      )}
      <span className={`text-sm font-bold transition-colors duration-300 ${complete ? "text-white drop-shadow-sm" : "text-slate-500"}`}>{text}</span>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
