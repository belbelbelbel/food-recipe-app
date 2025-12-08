"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { getMealPlanById, type UserMealPlan } from "@/lib/firebase/meal-plans"
import { MealCard } from "@/components/meal-card"
import { LoadingCard } from "@/components/loading-card"
import { useAuth } from "@/contexts/auth-context"

export default function MealPlanDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [planTitle, setPlanTitle] = useState<string | null>(null)

  useEffect(() => {
    async function loadMeals() {
      if (params.id) {
        try {
          setLoading(true)
          // First try to get from Firestore (user plans)
          const userPlan = await getMealPlanById(params.id as string)
          if (userPlan) {
            // Use the meals from the plan, even if empty
            setMeals(userPlan.meals || [])
            setPlanTitle(userPlan.title)
          } else {
            // Fall back to API/mock data for curated plans
            const data = await fetchMealsByPlanId(params.id as string)
            // Filter out dummy/placeholder meals
            const realMeals = data.filter(meal => 
              meal.id !== "meal1" && 
              meal.title !== "Meal Not Found" &&
              meal.recipeId !== "r1"
            )
            setMeals(realMeals)
          }
        } catch (error) {
          console.error("Failed to load meals:", error)
          setMeals([]) // Set empty array on error
        } finally {
          setLoading(false)
        }
      }
    }
    loadMeals()
    
    // Reload when user changes (e.g., after login) or when plan ID changes
    // Also reload when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadMeals()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Set up interval to refresh meals every 5 seconds (for real-time updates)
    const interval = setInterval(() => {
      loadMeals()
    }, 5000)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [params.id, user])

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-3 sm:mb-4">
            {planTitle ? (
              <>
                <span className="text-primary">{planTitle}</span>
              </>
            ) : (
              <>
                Your <span className="text-primary">Weekly</span> Meals
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-pretty mb-8 sm:mb-10 md:mb-12">
            {meals.length > 0 
              ? "Here are the delicious meals planned for your week"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {meals.map((meal, index) => (
              <MealCard key={meal.id} meal={meal} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 md:py-16 lg:py-20"
          >
            <div className="max-w-md mx-auto px-4">
              <div className="text-5xl sm:text-6xl md:text-8xl mb-3 sm:mb-4 opacity-20">🍽️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">No meals in this plan yet</h3>
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
