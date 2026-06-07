"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { getMealPlanById } from "@/lib/firebase/meal-plans"
import { WeeklyBoard } from "@/components/meal-board/weekly-board"
import { LoadingCard } from "@/components/loading-card"
import { useAuth } from "@/contexts/auth-context"

export default function MealPlanDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [planTitle, setPlanTitle] = useState<string | null>(null)

  const loadMeals = useCallback(async () => {
    if (!params.id) return
    try {
      setLoading(true)
      const userPlan = await getMealPlanById(params.id as string)
      if (userPlan) {
        setMeals(userPlan.meals || [])
        setPlanTitle(userPlan.title)
      } else {
        const data = await fetchMealsByPlanId(params.id as string)
        const realMeals = data.filter(
          (meal) =>
            meal.id !== "meal1" &&
            meal.title !== "Meal Not Found" &&
            meal.recipeId !== "r1"
        )
        setMeals(realMeals)
      }
    } catch (error) {
      console.error("Failed to load meals:", error)
      setMeals([])
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadMeals()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadMeals()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    const interval = setInterval(loadMeals, 5000)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
    }
  }, [loadMeals, user])

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-3 sm:mb-4">
            {planTitle ? (
              <span className="text-primary">{planTitle}</span>
            ) : (
              <>
                Your <span className="text-primary">Weekly</span> Meals
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-pretty mb-8 sm:mb-10">
            {meals.length > 0
              ? "Drag meals onto days to plan your week"
              : "This meal plan is empty. Add recipes to get started!"}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <WeeklyBoard
            planId={params.id as string}
            meals={meals}
            onUpdate={loadMeals}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 md:py-16 lg:py-20"
          >
            <div className="max-w-md mx-auto px-4">
              <div className="text-5xl sm:text-6xl md:text-8xl mb-3 sm:mb-4 opacity-20">🍽️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                No meals in this plan yet
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6">
                Start adding recipes to build your meal plan!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
