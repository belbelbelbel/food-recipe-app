"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, User, Mail, Shield, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/lib/firebase/auth"
import { handleError, showSuccess } from "@/lib/error-handler"
import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, userProfile, loading, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
    }
  }, [userProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      await updateUserProfile(user.uid, { displayName: displayName.trim() || undefined })
      await refreshProfile()
      showSuccess("Profile updated successfully", "Success")
    } catch (error) {
      handleError(error, "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const getUserInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas padding-y-responsive">
      <div className="container-responsive max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PageHeader
            eyebrow="Account"
            title={
              <>
                My <span className="text-primary">Profile</span>
              </>
            }
          />

          <div className="form-card space-y-6">
            <div className="flex flex-col items-center gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarFallback className="bg-primary text-xl text-primary-foreground sm:text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg font-bold uppercase tracking-[0.06em] sm:text-xl">
                  {userProfile?.displayName || "User"}
                </h2>
                <p className="mt-1 break-all text-sm text-muted-foreground">{user?.email}</p>
                {userProfile?.role && (
                  <Badge variant="secondary" className="mt-3 capitalize">
                    <Shield className="mr-1 h-3 w-3" />
                    {userProfile.role}
                  </Badge>
                )}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="displayName">
                  <User className="mr-2 inline h-4 w-4" />
                  Display name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-2 inline h-4 w-4" />
                  Email address
                </Label>
                <Input id="email" type="email" value={user?.email || ""} disabled className="bg-surface-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {userProfile?.role && (
                <div className="space-y-2">
                  <Label>
                    <Shield className="mr-2 inline h-4 w-4" />
                    Account role
                  </Label>
                  <Input value={userProfile.role} disabled className="bg-surface-muted capitalize" />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={saving} size="lg" className="w-full rounded-full sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
