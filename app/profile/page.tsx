"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, User, Mail, Shield, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/lib/firebase/auth"
import { handleError, showSuccess } from "@/lib/error-handler"
import { ProtectedRoute } from "@/components/protected-route"
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-4 sm:mb-6">
            My <span className="text-primary">Profile</span>
          </h1>

          <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 md:p-8 shadow-sm space-y-4 sm:space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-border">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                  {userProfile?.displayName || "User"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 break-all">{user?.email}</p>
                {userProfile?.role && (
                  <Badge variant="secondary" className="capitalize text-xs">
                    <Shield className="mr-1 h-3 w-3" />
                    {userProfile.role}
                  </Badge>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm sm:text-base">
                  <User className="inline mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={saving}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  <Mail className="inline mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {userProfile?.role && (
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">
                    <Shield className="inline mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Account Role
                  </Label>
                  <Input
                    value={userProfile.role}
                    disabled
                    className="bg-muted capitalize text-sm sm:text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Role is managed by administrators
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  size="lg"
                  className="rounded-full w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
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

