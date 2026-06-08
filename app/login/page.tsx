"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "@/lib/firebase/auth"
import { handleError, showSuccess } from "@/lib/error-handler"
import { useAuth } from "@/contexts/auth-context"
import { AuthPageShell } from "@/components/page-header"
import { FlavorizLogo } from "@/components/flavoriz-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/meal-plans")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email.trim(), password)
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess("Welcome back!", "Login Successful")
      setEmail("")
      setPassword("")
      setTimeout(() => {
        setLoading(false)
        router.push("/meal-plans")
      }, 1000)
    } catch (error: unknown) {
      setLoading(false)
      let errorMessage = "Failed to sign in. Please check your credentials."
      const code = (error as { code?: string })?.code

      if (code === "auth/user-not-found") errorMessage = "No account found with this email address."
      else if (code === "auth/wrong-password") errorMessage = "Incorrect password. Please try again."
      else if (code === "auth/invalid-email") errorMessage = "Invalid email address."
      else if (code === "auth/too-many-requests") errorMessage = "Too many failed attempts. Please try again later."
      else if (code === "auth/user-disabled") errorMessage = "This account has been disabled."

      setError(errorMessage)
      handleError(error, errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AuthPageShell
        title={
          <>
            Welcome <span className="text-primary">back</span>
          </>
        }
        description="Sign in to access your meal plans and saved recipes."
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
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline sm:text-sm">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading || !email.trim() || !password}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Back to recipes
          </Link>
        </div>
      </AuthPageShell>
    </motion.div>
  )
}
