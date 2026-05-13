'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Loader2, Mail, Lock, User } from 'lucide-react'
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
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-[var(--paper-white)] text-slate-900 font-sans relative">
      
      {/* Background Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Decorative Scribbles */}
      <div className="absolute top-20 right-[15%] opacity-20 pointer-events-none z-0 hidden md:block">
         <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
           <path d="M10,90 Q50,10 90,90" />
         </svg>
      </div>
      <div className="absolute bottom-32 left-[10%] opacity-20 pointer-events-none z-0 hidden md:block">
         <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <circle cx="50" cy="50" r="40" strokeDasharray="10 10" />
         </svg>
      </div>
      
      {/* Left Side - Text & Branding */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative z-10 h-full">
        <div className="max-w-[480px] w-full mx-auto md:mx-0 flex flex-col gap-12">
          
          {/* Logo - Top */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-brand-orange p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1a1a2e] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="font-handdrawn text-3xl font-bold tracking-tight text-slate-900">SignalLoop</span>
            </Link>
          </div>

          {/* Hero Text - Middle */}
          <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 hidden sm:block">
            <div className="inline-block px-3 py-1 sketch-border bg-highlight-yellow text-slate-900 text-xs font-bold uppercase tracking-widest mb-6 transform -rotate-2">
              Join 500+ Founders
            </div>
            <h1 className="text-5xl lg:text-6xl font-handdrawn tracking-tight leading-[1.1] text-slate-900 mb-6">
              Your <span className="text-brand-orange">AI Cofounder</span> awaits.
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed max-w-md">
              Sign in to generate PRDs, coding prompts, and validation strategies for your next big idea.
            </p>
          </div>

          {/* Footer - Bottom */}
          <div className="flex items-center justify-start gap-6 text-sm text-slate-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-8 duration-1000">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-brand-orange transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-orange transition-colors">Terms</Link>
          </div>

        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-[500px] lg:w-[600px] flex flex-col justify-center items-center p-6 md:p-12 relative z-10 h-full">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="bg-white p-8 sketch-border minimal-shadow">
            <div className="space-y-2 mb-8 text-center">
              <h2 className="text-4xl font-handdrawn text-slate-900">Welcome back</h2>
              <p className="text-slate-500 font-medium text-sm">Let's build something awesome.</p>
            </div>

            <div className="space-y-6">
              <Button 
                variant="outline" 
                className="w-full bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 gap-3 h-14 sketch-border font-bold shadow-none transition-all duration-300 flex items-center justify-center text-base"
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
                  <span className="w-full border-t-2 border-dashed border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-white px-4 text-slate-400">Or use email</span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 sketch-border-sm mb-6 h-12">
                  <TabsTrigger value="login" className="rounded-lg font-bold data-[active]:bg-white data-[active]:text-slate-900 data-[active]:shadow-sm transition-all h-full text-slate-500 text-sm px-4">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg font-bold data-[active]:bg-white data-[active]:text-slate-900 data-[active]:shadow-sm transition-all h-full text-slate-500 text-sm px-4">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-5 outline-none animate-in fade-in zoom-in-95 duration-300">
                  <form onSubmit={handleEmailLogin} className="space-y-5 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-xs text-slate-700 ml-1 uppercase tracking-wider">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-brand-orange text-slate-900 h-12 transition-all font-medium text-base sketch-border-sm shadow-none focus:ring-0"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <Label htmlFor="password" className="font-bold text-xs text-slate-700 uppercase tracking-wider">Password</Label>
                        <Link href="#" className="text-[10px] text-brand-orange font-bold hover:underline transition-all">Forgot password?</Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-brand-orange text-slate-900 h-12 transition-all font-medium text-base sketch-border-sm shadow-none focus:ring-0"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full btn-primary h-14 mt-4 text-xl">
                      {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-5 outline-none animate-in fade-in zoom-in-95 duration-300">
                  <form onSubmit={handleEmailSignup} className="space-y-5 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-bold text-xs text-slate-700 ml-1 uppercase tracking-wider">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          className="pl-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-brand-orange text-slate-900 h-12 transition-all font-medium text-base sketch-border-sm shadow-none focus:ring-0"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-bold text-xs text-slate-700 ml-1 uppercase tracking-wider">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-brand-orange text-slate-900 h-12 transition-all font-medium text-base sketch-border-sm shadow-none focus:ring-0"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="font-bold text-xs text-slate-700 ml-1 uppercase tracking-wider">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-11 bg-slate-50 border-slate-300 focus:bg-white focus:border-brand-orange text-slate-900 h-12 transition-all font-medium text-base sketch-border-sm shadow-none focus:ring-0"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full btn-primary h-14 mt-4 text-xl">
                      {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
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
    <Suspense fallback={<div className="h-[100dvh] flex items-center justify-center bg-[var(--paper-white)]"><Loader2 className="animate-spin text-brand-orange w-8 h-8" /></div>}>
      <LoginContent />
    </Suspense>
  )
}