'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorField, setErrorField] = useState<string | null>(null)
  
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorField(null)
    
    if (!email.includes('@')) {
      setErrorField('email')
      toast.error('Please enter a valid email')
      return
    }
    if (password.length < 6) {
      setErrorField('password')
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        setErrorField('password')
      } else {
        router.push(next)
      }
    } else {
      if (!name) {
        setErrorField('name')
        toast.error('Name is required')
        setIsLoading(false)
        return
      }
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
        setIsLogin(true)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center bg-[var(--paper-white)] text-slate-900 font-sans relative overflow-hidden">
      
      {/* Background Noise & Paper Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Scattered Doodles */}
      <div className="absolute top-20 left-20 opacity-20 pointer-events-none z-0">
         <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
         </svg>
      </div>
      <div className="absolute bottom-32 right-20 opacity-20 pointer-events-none z-0">
         <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <circle cx="50" cy="50" r="40" strokeDasharray="8 8" />
         </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-15 pointer-events-none z-0">
         <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 50 L90 50 M70 30 L90 50 L70 70" />
         </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-15 pointer-events-none z-0">
         <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 90 C 30 10, 70 10, 90 90" strokeDasharray="5 5" />
         </svg>
      </div>

      <div className="w-full max-w-[420px] p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 sketch-border minimal-shadow"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✦</span>
              <h1 className="font-bold text-xl tracking-tight uppercase">AI Distro Engine</h1>
            </div>
            <div className="w-full h-0.5 bg-slate-900/10 mb-6 rounded-full" />
            <h2 className="font-handdrawn text-4xl text-slate-800">
              {isLogin ? "Welcome back, founder." : "Ready to build, founder?"}
            </h2>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <span className="absolute left-0 top-3 text-slate-400 text-sm">👤</span>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-transparent border-0 border-b-2 ${errorField === 'name' ? 'border-red-500 border-dashed' : 'border-slate-200'} focus:ring-0 focus:outline-none pl-8 pr-0 py-3 text-slate-900 placeholder:text-slate-400 peer`}
                  />
                  <div className={`absolute bottom-0 left-0 h-[2px] ${errorField === 'name' ? 'bg-red-500' : 'bg-brand-orange'} w-0 peer-focus:w-full transition-all duration-300`} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <span className="absolute left-0 top-3 text-slate-400 text-sm">📧</span>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent border-0 border-b-2 ${errorField === 'email' ? 'border-red-500 border-dashed' : 'border-slate-200'} focus:ring-0 focus:outline-none pl-8 pr-0 py-3 text-slate-900 placeholder:text-slate-400 peer`}
              />
              <div className={`absolute bottom-0 left-0 h-[2px] ${errorField === 'email' ? 'bg-red-500' : 'bg-brand-orange'} w-0 peer-focus:w-full transition-all duration-300`} />
            </div>

            <div className="relative">
              <span className="absolute left-0 top-3 text-slate-400 text-sm">🔒</span>
              <input 
                type="password" 
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent border-0 border-b-2 ${errorField === 'password' ? 'border-red-500 border-dashed' : 'border-slate-200'} focus:ring-0 focus:outline-none pl-8 pr-0 py-3 text-slate-900 placeholder:text-slate-400 peer`}
              />
              <div className={`absolute bottom-0 left-0 h-[2px] ${errorField === 'password' ? 'bg-red-500' : 'bg-brand-orange'} w-0 peer-focus:w-full transition-all duration-300`} />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full btn-primary h-14 text-lg font-bold mt-2 group flex justify-between px-6">
              <span>{isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? 'Sign In' : 'Sign Up')}</span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
             <div className="flex-1 border-t-2 border-dashed border-slate-200" />
             <span className="text-slate-400 font-handdrawn text-lg">or</span>
             <div className="flex-1 border-t-2 border-dashed border-slate-200" />
          </div>

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

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 font-medium hover:text-brand-orange transition-colors inline-flex items-center gap-1 group"
            >
              {isLogin ? "New here? Start free" : "Already a founder? Sign in"} 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
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