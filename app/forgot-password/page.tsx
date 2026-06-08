"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { handleError, showSuccess } from "@/lib/error-handler"
import { AuthPageShell } from "@/components/page-header"
import { FlavorizLogo } from "@/components/flavoriz-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!auth) throw new Error("Firebase Auth not initialized")

      await sendPasswordResetEmail(auth, email.trim())
      setSuccess(true)
      showSuccess("Password reset email sent!", "Check your inbox")
    } catch (error: unknown) {
      let errorMessage = "Failed to send reset email. Please try again."
      const code = (error as { code?: string })?.code

      if (code === "auth/user-not-found") errorMessage = "No account found with this email address."
      else if (code === "auth/invalid-email") errorMessage = "Invalid email address."
      else if (code === "auth/too-many-requests") errorMessage = "Too many requests. Please try again later."

      setError(errorMessage)
      handleError(error, errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AuthPageShell title="Check your email" description={`We sent a reset link to ${email}`}>
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <p className="mb-6 text-sm text-muted-foreground">
              Click the link in the email to reset your password. Check spam if you don&apos;t see it.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full rounded-full">
                <Link href="/login">Back to sign in</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full border-border/60"
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
              >
                Send another email
              </Button>
            </div>
          </div>
        </AuthPageShell>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AuthPageShell
        title={
          <>
            Reset <span className="text-primary">password</span>
          </>
        }
        description="Enter your email and we'll send you a reset link."
      >
        <div className="mb-6 flex justify-center">
          <FlavorizLogo wordmarkOnly size="md" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
                autoFocus
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading || !email.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </AuthPageShell>
    </motion.div>
  )
}
