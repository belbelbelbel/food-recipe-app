"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { MealCard } from "@/components/meal-card"
import { LoadingCard } from "@/components/loading-card"

export default function MealPlanDetailPage() {
  const params = useParams()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMeals() {
      if (params.id) {
        setLoading(true)
        const data = await fetchMealsByPlanId(params.id as string)
        setMeals(data)
        setLoading(false)
      }
    }
    loadMeals()
  }, [params.id])

  return (
    <main className="min-h-screen py-12">
      <div className="container max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Your <span className="text-primary">Weekly</span> Meals
          </h1>
          <p className="text-lg text-muted-foreground text-pretty mb-12">
            Here are the delicious meals planned for your week
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal, index) => (
              <MealCard key={meal.id} meal={meal} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No meals found for this plan.</p>
          </div>
        )}
      </div>
    </main>
  )
}
