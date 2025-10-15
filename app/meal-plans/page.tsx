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
    <main className="min-h-screen py-12">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Curated <span className="text-primary">Meal Plans</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            Discover weekly meal plans designed to make your cooking journey easier and more delicious
          </p>
        </motion.div>

        {/* Credits Alert */}
        {!loading && credits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            {credits.creditsLeft > 0 ? (
              <Alert className="border-primary/20 bg-primary/5">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Credits Available</AlertTitle>
                <AlertDescription>
                  You have <strong>{credits.creditsLeft}</strong> free meal plan{credits.creditsLeft !== 1 ? "s" : ""}{" "}
                  remaining
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Credits Remaining</AlertTitle>
                <AlertDescription>
                  You've used all your free meal plans. Here's a sample plan to explore!
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}

        {/* Meal Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <MealPlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
