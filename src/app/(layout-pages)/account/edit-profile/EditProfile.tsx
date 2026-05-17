"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, User, Upload, Shield } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function EditProfile() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Security Tab state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get("/admin/me")
        if (data) {
          setName(data.name || "")
          setEmail(data.email || "")
          setAvatar(data.avatar || "")
        }
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load profile details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const res = await api.upload(file)
      setAvatar(res.url)
      toast.success("Profile image uploaded successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    if (!email.trim()) {
      toast.error("Email is required")
      return
    }

    setIsSaving(true)
    try {
      await api.put("/admin/profile", { name, email, avatar })
      toast.success("Profile saved successfully!")
      
      // Fire custom event to notify Sidebar layout of profile update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin_profile_updated'));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (!currentPassword) {
      toast.error("Current password is required")
      return
    }
    if (!newPassword) {
      toast.error("New password is required")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSavingSecurity(true)
    try {
      await api.put("/admin/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      })
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.message || "Failed to update password")
    } finally {
      setIsSavingSecurity(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 bg-white rounded-3xl border border-dashed">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Admin Profile...</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center max-w-4xl mx-auto pb-10">
      <Card className="w-full p-8 rounded-3xl border border-slate-100 shadow-xl bg-white">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <Shield className="text-indigo-600 h-7 w-7" />
          Account Settings
        </h2>

        <Tabs defaultValue="profile" className="w-full">
          {/* Tabs Header */}
          <TabsList className="mb-8 bg-slate-100/80 p-1 rounded-full w-fit">
            <TabsTrigger value="profile" className="px-8 py-2.5 rounded-full font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="px-8 py-2.5 rounded-full font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
              Security
            </TabsTrigger>
          </TabsList>

          {/* ================= PROFILE TAB ================= */}
          <TabsContent value="profile" className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative group w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white flex items-center justify-center bg-slate-50">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                ) : avatar ? (
                  <img src={avatar} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-400" />
                )}
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 border-slate-200 hover:bg-slate-50 font-bold flex items-center gap-2"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  <Upload size={16} />
                  Upload new image
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  1200x1200 px • PNG or JPG
                </p>
              </div>
            </div>

            <div className="space-y-5 max-w-xl">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Name</Label>
                <Input 
                  className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="Admin User" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email Address</Label>
                <Input 
                  className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="admin@vjsgroups.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 rounded-full px-8 font-bold h-11"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : null}
              Save Profile
            </Button>
          </TabsContent>

          {/* ================= SECURITY TAB ================= */}
          <TabsContent value="security" className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-5 max-w-xl">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Current Password</Label>
                <Input 
                  type="password" 
                  className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">New Password</Label>
                <Input 
                  type="password" 
                  className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Confirm Password</Label>
                <Input 
                  type="password" 
                  className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 rounded-full px-8 font-bold h-11"
              onClick={handleSaveSecurity}
              disabled={isSavingSecurity}
            >
              {isSavingSecurity ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : null}
              Update Password
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}