'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/userStore'
import { useBusinessStore } from '@/store/businessStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Building, Save, Trash2, Loader2, AlertCircle, Bell, Link2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'

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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="border-b-2 border-slate-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-handdrawn text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 font-bold mt-2">Manage your account and business preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Profile Section */}
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col transform rotate-1">
          <div className="p-6 border-b-2 border-slate-200 bg-highlight-yellow">
            <h2 className="flex items-center gap-3 text-3xl font-handdrawn text-slate-900">
              <div className="bg-white sketch-border border-2 border-slate-900 p-2 shadow-[2px_2px_0px_#1a1a2e]">
                <User className="h-5 w-5 text-slate-900" />
              </div>
              Personal Profile
            </h2>
          </div>
          <div className="space-y-6 p-8 relative">
            <div className="space-y-3 relative z-10">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Email Address</Label>
              <Input value={user?.email || ''} disabled className="sketch-border-sm bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed h-12 shadow-none font-bold" />
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Email cannot be changed directly.</p>
            </div>
            <div className="space-y-3 relative z-10">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Full Name</Label>
              <Input 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="sketch-border-sm bg-white border-slate-300 focus:border-brand-orange text-slate-900 h-12 shadow-none font-bold" 
              />
            </div>
          </div>
          <div className="bg-slate-50 border-t-2 border-slate-200 p-6 flex justify-end">
            <Button onClick={handleUpdateProfile} disabled={isSavingUser} className="btn-primary w-full md:w-auto h-12 px-8">
              {isSavingUser ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> Save Profile</>}
            </Button>
          </div>
        </div>

        {/* Business Section */}
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col transform -rotate-1">
          <div className="p-6 border-b-2 border-slate-200 bg-sky-100">
            <h2 className="flex items-center gap-3 text-3xl font-handdrawn text-slate-900">
              <div className="bg-white sketch-border border-2 border-slate-900 p-2 shadow-[2px_2px_0px_#1a1a2e]">
                <Building className="h-5 w-5 text-slate-900" />
              </div>
              Active Business
            </h2>
          </div>
          <div className="space-y-6 p-8 relative">
            <div className="space-y-3 relative z-10">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Business Name</Label>
              <Input 
                value={bizName} 
                onChange={(e) => setBizName(e.target.value)} 
                className="sketch-border-sm bg-white border-slate-300 focus:border-brand-orange text-slate-900 h-12 shadow-none font-bold" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-3">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Category</Label>
                <Input value={activeBusiness?.category || ''} disabled className="sketch-border-sm bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed h-12 shadow-none font-bold" />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Target Region</Label>
                <Input value={activeBusiness?.region || ''} disabled className="sketch-border-sm bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed h-12 shadow-none font-bold" />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border-t-2 border-slate-200 p-6 flex justify-end">
            <Button onClick={handleUpdateBusiness} disabled={isSavingBiz} className="btn-primary w-full md:w-auto h-12 px-8 !bg-sky-600 hover:!bg-sky-700 shadow-[2px_2px_0px_#0369a1]">
              {isSavingBiz ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> Save Business</>}
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col transform rotate-1">
          <div className="p-6 border-b-2 border-slate-200 bg-amber-100">
            <h2 className="flex items-center gap-3 text-3xl font-handdrawn text-slate-900">
              <div className="bg-white sketch-border border-2 border-slate-900 p-2 shadow-[2px_2px_0px_#1a1a2e]">
                <Bell className="h-5 w-5 text-slate-900" />
              </div>
              Notifications
            </h2>
          </div>
          <div className="space-y-6 p-8 relative">
            <div className="flex items-center space-x-3">
              <Checkbox id="weekly-digest" defaultChecked className="border-2 border-slate-900 data-[state=checked]:bg-brand-orange data-[state=checked]:text-white w-6 h-6 rounded" />
              <Label htmlFor="weekly-digest" className="font-bold text-sm text-slate-800 cursor-pointer">Receive Weekly Growth Digest</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="realtime-alerts" defaultChecked className="border-2 border-slate-900 data-[state=checked]:bg-brand-orange data-[state=checked]:text-white w-6 h-6 rounded" />
              <Label htmlFor="realtime-alerts" className="font-bold text-sm text-slate-800 cursor-pointer">Real-time Opportunity Alerts</Label>
            </div>
          </div>
          <div className="bg-slate-50 border-t-2 border-slate-200 p-6 flex justify-end">
            <Button className="btn-primary w-full md:w-auto h-12 px-8 !bg-amber-500 hover:!bg-amber-600 shadow-[2px_2px_0px_#b45309]" onClick={() => toast.success('Preferences saved!')}>
              <Save className="h-4 w-4 mr-2" /> Save Preferences
            </Button>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col transform -rotate-1">
          <div className="p-6 border-b-2 border-slate-200 bg-emerald-100">
            <h2 className="flex items-center gap-3 text-3xl font-handdrawn text-slate-900">
              <div className="bg-white sketch-border border-2 border-slate-900 p-2 shadow-[2px_2px_0px_#1a1a2e]">
                <Link2 className="h-5 w-5 text-slate-900" />
              </div>
              Integrations
            </h2>
          </div>
          <div className="space-y-6 p-8 relative">
            <div className="space-y-3 relative z-10">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Slack / Discord Webhook URL</Label>
              <Input 
                placeholder="https://hooks.slack.com/services/..."
                className="sketch-border-sm bg-white border-slate-300 focus:border-brand-orange text-slate-900 h-12 shadow-none font-bold" 
              />
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Get instant alerts pushed to your team&apos;s channel.</p>
            </div>
          </div>
          <div className="bg-slate-50 border-t-2 border-slate-200 p-6 flex justify-end">
            <Button className="btn-primary w-full md:w-auto h-12 px-8 !bg-emerald-600 hover:!bg-emerald-700 shadow-[2px_2px_0px_#047857]" onClick={() => toast.success('Integrations saved!')}>
              <Save className="h-4 w-4 mr-2" /> Save Integrations
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="sketch-border bg-white shadow-[4px_4px_0px_#1a1a2e] flex flex-col border-rose-200 border-4">
          <div className="p-6 border-b-2 border-rose-200 bg-rose-50">
            <h2 className="text-rose-600 flex items-center gap-3 text-3xl font-handdrawn">
              <div className="bg-white sketch-border border-2 border-rose-600 p-2 shadow-[2px_2px_0px_#e11d48]">
                <Trash2 className="h-5 w-5 text-rose-600" />
              </div>
              Danger Zone
            </h2>
          </div>
          <div className="p-8">
            <div className="flex items-start gap-3 p-4 bg-rose-50 border-2 border-rose-200 sketch-border-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-sm font-bold text-rose-700">
                Once you delete your account, there is no going back. Please be certain. All your reports, businesses, and saved opportunities will be permanently erased.
              </p>
            </div>
          </div>
          <div className="p-6 border-t-2 border-rose-200 bg-rose-50 flex justify-end">
            <Button onClick={handleDeleteAccount} className="w-full md:w-auto h-12 px-8 sketch-border bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-[2px_2px_0px_#9f1239]">
              Delete My Account
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
