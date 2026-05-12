'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Loader2, CheckCircle2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      router.push(next)
    }
    setIsLoading(false)
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email to confirm signup!')
    }
    setIsLoading(false)
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white selection:bg-orange-100 text-slate-900 font-sans relative">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/8 via-white to-white pointer-events-none z-0" />

      {/* Dotted grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent_5%,black_20%,black_80%,transparent_95%)] opacity-35 pointer-events-none z-0" />

      {/* Subtle orange orb */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF4500]/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-[15%] w-24 h-24 bg-[#FF4500]/5 rounded-full blur-2xl pointer-events-none z-0" />
      <div className="absolute bottom-32 left-[10%] w-32 h-32 bg-[#FF4500]/4 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Left Side - Text & Branding */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative z-10 h-full">
        <div className="max-w-[480px] w-full mx-auto md:mx-0 flex flex-col gap-12">
          
          {/* Logo - Top */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[#FF4500] p-1.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-2xl text-slate-900">SignalLoop</span>
            </Link>
          </div>

          {/* Hero Text - Middle */}
          <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 hidden sm:block">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 mb-6">
              Find buyers hiding on <span className="relative inline-block"><span className="relative z-10 text-[#FF4500]">Reddit</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0.5, 1], opacity: [0.5, 1, 0.8, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-full h-3 bg-orange-400/30 -z-10 origin-left rounded-full" /></span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10">
              SignalLoop scans Reddit in real-time to surface buying signals, competitor mentions & market opportunities.
            </p>

            <div className="space-y-4 flex flex-col items-start">
              {[
                'Track competitor mentions in real-time',
                'Identify pain points and feature requests',
                'Automate lead generation from subreddits'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/80 shadow-sm w-fit hover:bg-white/80 transition-colors">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4500]" />
                  </div>
                  <span className="text-slate-800 font-semibold text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Bottom */}
          <div className="flex items-center justify-start gap-6 text-[13px] text-slate-500 font-medium animate-in fade-in slide-in-from-left-8 duration-1000">
            <span>© {new Date().getFullYear()} SignalLoop.</span>
            <Link href="/privacy" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FF4500] transition-colors underline-offset-4 hover:underline">Terms</Link>
          </div>

        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col justify-center items-center p-6 md:p-12 relative z-10 h-full">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
            <div className="space-y-1 mb-6 text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome</h2>
              <p className="text-slate-500 font-medium text-sm">Sign in or create an account.</p>
            </div>

            <div className="space-y-5">
              <Button 
                variant="outline" 
                className="w-full bg-white border-slate-200 hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500] text-slate-700 gap-3 h-11 rounded-xl font-bold shadow-sm transition-all duration-300 group"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-white px-4 text-slate-400">Or continue with email</span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-50/80 p-1 rounded-xl border border-slate-100 mb-4 shadow-inner h-11">
                  <TabsTrigger value="login" className="rounded-lg font-bold hover:bg-[#FF4500] hover:text-white data-[active]:!bg-white data-[active]:!text-[#FF4500] data-[active]:shadow-sm transition-all h-full text-slate-500 text-[13px] px-4">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg font-bold hover:bg-[#FF4500] hover:text-white data-[active]:!bg-white data-[active]:!text-[#FF4500] data-[active]:shadow-sm transition-all h-full text-slate-500 text-[13px] px-4">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 outline-none animate-in fade-in zoom-in-95 duration-300">
                  <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="font-bold text-[11px] text-slate-700 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF4500] transition-colors" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 bg-white border-slate-200 focus:bg-white focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-11 transition-all font-medium text-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <Label htmlFor="password" className="font-bold text-[11px] text-slate-700">Password</Label>
                        <Link href="#" className="text-[10px] text-[#FF4500] font-bold hover:text-[#FF4500]/80 transition-all">Forgot password?</Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF4500] transition-colors" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••"
                          className="pl-10 bg-white border-slate-200 focus:bg-white focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-11 transition-all font-medium text-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-11 shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 mt-2 group" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                        <span className="flex items-center gap-2 text-sm">
                          Sign In
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 outline-none animate-in fade-in zoom-in-95 duration-300">
                  <form onSubmit={handleEmailSignup} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="font-bold text-[11px] text-slate-700 ml-1">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF4500] transition-colors" />
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          className="pl-10 bg-white border-slate-200 focus:bg-white focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-11 transition-all font-medium text-sm"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="font-bold text-[11px] text-slate-700 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF4500] transition-colors" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 bg-white border-slate-200 focus:bg-white focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-11 transition-all font-medium text-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="font-bold text-[11px] text-slate-700 ml-1">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF4500] transition-colors" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••"
                          className="pl-10 bg-white border-slate-200 focus:bg-white focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 text-slate-900 rounded-xl h-11 transition-all font-medium text-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-xl font-bold h-11 shadow-[0_4px_14px_0_rgba(255,69,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 mt-2 group" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                        <span className="flex items-center gap-2 text-sm">
                          Create Account
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
