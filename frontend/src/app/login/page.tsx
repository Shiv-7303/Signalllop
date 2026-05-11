'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { HaloBackground } from '@/components/HaloBackground'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'

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
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 selection:bg-brand-blue selection:text-white relative overflow-hidden text-white">
      <HaloBackground />

      <Card className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border-white/10 shadow-premium rounded-[2.5rem] relative z-10 animate-in zoom-in-95 duration-500 overflow-hidden">
        <CardHeader className="text-center space-y-4 p-10 pb-6 border-b border-white/5 bg-black/20">
          <div className="flex justify-center mb-2">
            <div className="bg-brand-blue p-2.5 rounded-2xl shadow-lg shadow-brand-blue/20 border border-white/10">
              <Rocket className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
             <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Welcome to SignalLoop</CardTitle>
             <CardDescription className="text-slate-400 font-medium">
               Sign in to start finding your customers.
             </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15}>
            <Button 
              variant="outline" 
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 gap-3 h-14 rounded-full font-bold shadow-sm transition-all"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-slate-900 px-4 text-slate-400 border border-white/5 rounded-full backdrop-blur-md">Or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 p-1.5 rounded-full border border-white/5 shadow-inner mb-6">
              <TabsTrigger value="login" className="rounded-full font-bold data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all h-10 text-slate-400">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full font-bold data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all h-10 text-slate-400">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 pt-2">
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-slate-400">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-slate-400">Password</Label>
                    <Link href="#" className="text-[10px] uppercase tracking-widest text-brand-blue font-bold hover:text-white transition-colors">Forgot password?</Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15}>
                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full font-bold h-14 text-lg shadow-lg shadow-brand-blue/20 border border-white/10" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-2">
              <form onSubmit={handleEmailSignup} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="font-bold text-xs uppercase tracking-widest text-slate-400">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="font-bold text-xs uppercase tracking-widest text-slate-400">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" className="font-bold text-xs uppercase tracking-widest text-slate-400">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15}>
                  <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full font-bold h-14 text-lg shadow-lg shadow-brand-blue/20 border border-white/10" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Create Account"}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/5 py-6 bg-black/20">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            By continuing, you agree to our <Link href="/terms" className="text-brand-blue hover:text-white transition-colors">Terms</Link> and <Link href="/privacy" className="text-brand-blue hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
