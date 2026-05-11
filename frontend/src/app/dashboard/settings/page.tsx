'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/userStore'
import { useBusinessStore } from '@/store/businessStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Building, Save, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { springConfig15 } from '@/lib/animations'

export default function SettingsPage() {
  const { user, setUser } = useUserStore()
  const { activeBusiness, setActiveBusiness } = useBusinessStore()
  const [userName, setUserName] = useState(user?.name || '')
  const [bizName, setBizName] = useState(activeBusiness?.business_name || '')
  const [isSavingUser, setIsSavingUser] = useState(false)
  const [isSavingBiz, setIsSavingBiz] = useState(false)
  const supabase = createClient()

  const handleUpdateProfile = async () => {
    setIsSavingUser(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: userName }
      })
      if (error) throw error
      
      setUser({ ...user!, name: userName })
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsSavingUser(false)
    }
  }

  const handleUpdateBusiness = async () => {
    if (!activeBusiness) return
    setIsSavingBiz(true)
    try {
      const resp = await api.put(`/businesses/${activeBusiness.id}`, {
        business_name: bizName
      })
      setActiveBusiness(resp.data)
      toast.success('Business settings updated!')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update business')
    } finally {
      setIsSavingBiz(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Type "DELETE" to confirm account deletion. This action is irreversible.')
    if (confirmText === 'DELETE') {
       toast.error('Account deletion requested. Please contact support to finalize.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tightest drop-shadow-sm">Settings</h1>
        <p className="text-slate-400 font-medium mt-2">Manage your account and business preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Profile Section */}
        <Card className="bg-slate-900/60 backdrop-blur-2xl border-white/10 shadow-premium rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-black/20">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              <div className="bg-brand-blue/10 border border-brand-blue/20 p-2 rounded-xl">
                <User className="h-5 w-5 text-brand-blue" />
              </div>
              Personal Profile
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium pt-2">Your account identity across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Email Address</Label>
              <Input value={user?.email || ''} disabled className="bg-white/5 border-white/10 text-slate-500 cursor-not-allowed rounded-xl h-12" />
              <p className="text-[10px] text-slate-500 font-bold tracking-tight">Email cannot be changed directly.</p>
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Full Name</Label>
              <Input 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm" 
              />
            </div>
          </CardContent>
          <CardFooter className="bg-black/20 border-t border-white/5 p-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15} className="ml-auto w-full md:w-auto">
              <Button onClick={handleUpdateProfile} disabled={isSavingUser} className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full font-bold h-12 px-8 shadow-lg shadow-brand-blue/20 gap-2 border border-white/10">
                {isSavingUser ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>

        {/* Business Section */}
        <Card className="bg-slate-900/60 backdrop-blur-2xl border-white/10 shadow-premium rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-black/20">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl">
                <Building className="h-5 w-5 text-indigo-400" />
              </div>
              Active Business
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium pt-2">Configuration for {activeBusiness?.business_name}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Business Name</Label>
              <Input 
                value={bizName} 
                onChange={(e) => setBizName(e.target.value)} 
                className="bg-white/5 border-white/10 focus:border-brand-blue text-white rounded-xl h-12 shadow-sm" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Category</Label>
                <Input value={activeBusiness?.category || ''} disabled className="bg-white/5 border-white/10 text-slate-500 cursor-not-allowed rounded-xl h-12" />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Target Region</Label>
                <Input value={activeBusiness?.region || ''} disabled className="bg-white/5 border-white/10 text-slate-500 cursor-not-allowed rounded-xl h-12" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-black/20 border-t border-white/5 p-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15} className="ml-auto w-full md:w-auto">
              <Button onClick={handleUpdateBusiness} disabled={isSavingBiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold h-12 px-8 shadow-lg shadow-indigo-500/20 gap-2 border border-white/10">
                {isSavingBiz ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4" /> Save Business</>}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-rose-950/20 border-rose-500/20 backdrop-blur-2xl shadow-premium rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-rose-500/10 bg-rose-500/5">
            <CardTitle className="text-rose-500 flex items-center gap-3 text-xl font-bold tracking-tight">
              <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
                <Trash2 className="h-5 w-5" />
              </div>
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm font-medium text-rose-200/70">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </CardContent>
          <CardFooter className="p-8 border-t border-rose-500/10 bg-rose-500/5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springConfig15}>
              <Button onClick={handleDeleteAccount} variant="destructive" className="rounded-full font-bold h-12 px-8 shadow-lg shadow-rose-500/20 border border-rose-500/50 gap-2">
                Delete My Account
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
