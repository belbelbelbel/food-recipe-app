"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Plus, LogIn } from "lucide-react"
import { fetchMealPlans, fetchCredits, type MealPlan, type Credits } from "@/lib/api"
import { getUserMealPlans, type UserMealPlan } from "@/lib/firebase/meal-plans"
import { MealPlanCard } from "@/components/meal-plan-card"
import { CreateMealPlanDialog } from "@/components/create-meal-plan-dialog"
import { LoadingCard } from "@/components/loading-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { PageHeader, SectionTitle } from "@/components/page-header"
import { useAuth } from "@/contexts/auth-context"

export default function MealPlansPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [userPlans, setUserPlans] = useState<UserMealPlan[]>([])
  const [curatedPlans, setCuratedPlans] = useState<MealPlan[]>([])
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const [userPlansData, curatedPlansData, creditsData] = await Promise.all([
        getUserMealPlans(),
        fetchMealPlans(),
        fetchCredits(),
      ])
      setUserPlans(userPlansData)
      setCuratedPlans(curatedPlansData)
      setCredits(creditsData)
    } catch (error) {
      console.error("Failed to load meal plans:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(false)
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      loadData(true)
    }
  }, [user?.uid, authLoading])

  return (
    <div className="min-h-screen bg-canvas padding-y-responsive">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            eyebrow="Weekly planning"
            title={
              <>
                My <span className="text-primary">Meal Plans</span>
              </>
            }
            description="Create and manage your meal plans. Add recipes to build your perfect weekly menu."
            action={
              user ? (
                <CreateMealPlanDialog onSuccess={() => loadData(true)}>
                  <Button size="lg" className="w-full rounded-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Plan
                  </Button>
                </CreateMealPlanDialog>
              ) : undefined
            }
          />
        </motion.div>

        {!authLoading && !user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="rounded-2xl border border-border/40 bg-white p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                    <LogIn className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-foreground sm:text-base">
                      Sign in to create meal plans
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground text-pretty">
                      You need an account to create and manage your weekly meal plans.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
                  <Button size="lg" className="w-full rounded-full sm:w-auto" onClick={() => router.push("/login")}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-border/60 sm:w-auto"
                    onClick={() => router.push("/signup")}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && credits && user && credits.creditsLeft <= 0 && (
          <Alert variant="destructive" className="mb-8 border-destructive/20 bg-white p-4 sm:p-6">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <AlertTitle className="text-sm font-bold uppercase tracking-[0.06em] sm:text-base">
              No credits remaining
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              You&apos;ve used all your free meal plans. Explore a sample plan below to get inspired.
            </AlertDescription>
          </Alert>
        )}

        {userPlans.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <SectionTitle>Your plans</SectionTitle>
            <div className="grid-cinematic">
              {userPlans.map((plan, index) => (
                <MealPlanCard key={plan.id} plan={plan} index={index} onUpdate={() => loadData(true)} />
              ))}
            </div>
          </section>
        )}

        {curatedPlans.length > 0 && (
          <section>
            <SectionTitle>{userPlans.length > 0 ? "Curated plans" : "Featured meal plans"}</SectionTitle>
            {loading ? (
              <div className="grid-cinematic">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid-cinematic">
                {curatedPlans.map((plan, index) => (
                  <MealPlanCard key={plan.id} plan={plan} index={index} onUpdate={() => loadData(true)} />
                ))}
              </div>
            )}
          </section>
        )}

        {!loading && userPlans.length === 0 && curatedPlans.length === 0 && (
          <div className="py-16 text-center sm:py-24">
            <p className="font-editorial text-2xl text-foreground sm:text-3xl">No meal plans yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              {user
                ? "Create your first meal plan to start organizing your weekly meals."
                : "Sign in to create and manage your meal plans."}
            </p>
            {user && (
              <CreateMealPlanDialog onSuccess={() => loadData(true)}>
                <Button size="lg" className="mt-6 rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Plan
                </Button>
              </CreateMealPlanDialog>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
