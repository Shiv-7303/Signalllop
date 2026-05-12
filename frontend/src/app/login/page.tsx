'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Loader2, CheckCircle2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
      router.push('/dashboard')
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
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white bg-gradient-to-r from-[#FF4500]/10 via-white to-white selection:bg-orange-100 text-slate-900 font-sans relative">
      
      {/* Full Screen Decorative Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] opacity-40 z-0 pointer-events-none" />
      
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
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.77h2.64c1.55-1.42 2.43-3.5 2.43-6.19z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.77c-.73.49-1.66.78-2.64.78-2.04 0-3.77-1.38-4.38-3.26H4.07v2.81C5.89 20.11 8.75 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M7.62 15.09c-.15-.45-.24-.93-.24-1.42s.09-.97.24-1.42V9.44H4.07C3.58 10.42 3.3 11.51 3.3 12.65s.28 2.23.77 3.21l3.55-2.77z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 7.35c1.62 0 3.07.56 4.21 1.66l3.15-3.15C17.45 4.01 14.96 3 12 3 8.75 3 5.89 5.89 4.07 8.59l3.55 2.81c.61-1.88 2.34-3.26 4.38-3.26z"
                    fill="#EA4335"
                  />
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
