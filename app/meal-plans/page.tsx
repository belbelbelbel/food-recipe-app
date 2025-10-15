"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { fetchMealPlans, fetchCredits, type MealPlan, type Credits } from "@/lib/api"
import { MealPlanCard } from "@/components/meal-plan-card"
import { LoadingCard } from "@/components/loading-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MealPlansPage() {
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [plansData, creditsData] = await Promise.all([fetchMealPlans(), fetchCredits()])
      setPlans(plansData)
      setCredits(creditsData)
      setLoading(false)
    }
    loadData()
  }, [])

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
          <h1 className="text-responsive-hero text-balance mb-4 sm:mb-6">
            Curated <span className="text-primary">Meal Plans</span>
          </h1>
          <p className="text-responsive-subtitle text-muted-foreground text-pretty max-w-3xl">
            Discover weekly meal plans designed to make your cooking journey easier and more delicious.
            Perfect for busy lifestyles and diverse dietary needs.
          </p>
        </motion.div>

        {/* Credits Alert */}
        {!loading && credits && (
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

        {/* Meal Plans Grid */}
        {loading ? (
          <div className="grid-responsive-large">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : plans.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid-responsive-large"
          >
            {plans.map((plan, index) => (
              <MealPlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 lg:py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl sm:text-8xl mb-4 opacity-20">📅</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No meal plans available</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Check back soon for new curated meal plans designed to make your week delicious and stress-free.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
