"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, Plus, LogIn } from "lucide-react"
import { fetchMealPlans, fetchCredits, type MealPlan, type Credits } from "@/lib/api"
import { getUserMealPlans, type UserMealPlan } from "@/lib/firebase/meal-plans"
import { MealPlanCard } from "@/components/meal-plan-card"
import { CreateMealPlanDialog } from "@/components/create-meal-plan-dialog"
import { LoadingCard } from "@/components/loading-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function MealPlansPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [userPlans, setUserPlans] = useState<UserMealPlan[]>([])
  const [curatedPlans, setCuratedPlans] = useState<MealPlan[]>([])
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Loading meal plans data...")
      const [userPlansData, curatedPlansData, creditsData] = await Promise.all([
        getUserMealPlans(),
        fetchMealPlans(),
        fetchCredits(),
      ])
      console.log("User plans loaded:", userPlansData.length)
      console.log("Curated plans loaded:", curatedPlansData.length)
      setUserPlans(userPlansData)
      setCuratedPlans(curatedPlansData)
      setCredits(creditsData)
    } catch (error) {
      console.error("Failed to load meal plans:", error)
      // Show error to user
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Reload when user changes (e.g., after sign in)
  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    }
  }, [user, authLoading])

  return (
    <div className="min-h-screen padding-y-responsive">
      <div className="container-responsive">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-responsive-hero text-balance mb-2 sm:mb-4">
                My <span className="text-primary">Meal Plans</span>
              </h1>
              <p className="text-responsive-subtitle text-muted-foreground text-pretty max-w-3xl">
                Create and manage your meal plans. Add recipes to build your perfect weekly menu.
              </p>
            </div>
            {user ? (
              <CreateMealPlanDialog onSuccess={loadData}>
                <Button size="lg" className="rounded-full w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Meal Plan
                </Button>
              </CreateMealPlanDialog>
            ) : (
              <Button 
                size="lg" 
                className="rounded-full w-full sm:w-auto"
                onClick={() => router.push("/login")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Create Plans
              </Button>
            )}
          </div>
        </motion.div>

        {/* Sign In Prompt */}
        {!authLoading && !user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 lg:mb-12"
          >
            <Alert className="border-primary/20 bg-primary/5 p-4 sm:p-6">
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <div className="ml-2 sm:ml-3">
                <AlertTitle className="text-primary text-sm sm:text-base font-semibold">
                  Sign In Required
                </AlertTitle>
                <AlertDescription className="text-xs sm:text-sm mt-1">
                  You need to be signed in to create and manage meal plans.{" "}
                  <Link href="/login" className="font-semibold underline hover:no-underline">
                    Sign in
                  </Link>{" "}
                  or{" "}
                  <Link href="/signup" className="font-semibold underline hover:no-underline">
                    create an account
                  </Link>{" "}
                  to get started!
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Credits Alert - Only show if signed in */}
        {!loading && credits && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 lg:mb-12"
          >
            {credits.creditsLeft > 0 ? (
              <Alert className="border-primary/20 bg-primary/5 p-4 sm:p-6">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="ml-2 sm:ml-3">
                  <AlertTitle className="text-primary text-sm sm:text-base font-semibold">
                    Credits Available
                  </AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm mt-1">
                    You have <strong>{credits.creditsLeft}</strong> free meal plan{credits.creditsLeft !== 1 ? "s" : ""}{" "}
                    remaining. Start planning your delicious week!
                  </AlertDescription>
                </div>
              </Alert>
            ) : (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 p-4 sm:p-6">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <div className="ml-2 sm:ml-3">
                  <AlertTitle className="text-sm sm:text-base font-semibold">
                    No Credits Remaining
                  </AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm mt-1">
                    You've used all your free meal plans. Here's a sample plan to explore and get inspired!
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </motion.div>
        )}

        {/* Your Meal Plans */}
        {userPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Plans</h2>
            <div className="grid-responsive-large">
              {userPlans.map((plan, index) => (
                <MealPlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  onUpdate={loadData}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Curated Meal Plans */}
        {curatedPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {userPlans.length > 0 ? "Curated Plans" : "Featured Meal Plans"}
            </h2>
            {loading ? (
              <div className="grid-responsive-large">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid-responsive-large">
                {curatedPlans.map((plan, index) => (
                  <MealPlanCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && userPlans.length === 0 && curatedPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 lg:py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl sm:text-8xl mb-4 opacity-20">📅</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No meal plans yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {user 
                  ? "Create your first meal plan to start organizing your weekly meals!"
                  : "Sign in to create and manage your meal plans!"}
              </p>
              {user ? (
                <CreateMealPlanDialog onSuccess={loadData}>
                  <Button size="lg" className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Meal Plan
                  </Button>
                </CreateMealPlanDialog>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="rounded-full" onClick={() => router.push("/login")}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full" onClick={() => router.push("/signup")}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
