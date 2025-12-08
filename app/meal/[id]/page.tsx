"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, ArrowRight } from "lucide-react"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-card"

export default function MealDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMeals() {
      if (params.id) {
        try {
          setLoading(true)
          const data = await fetchMealsByPlanId(params.id as string)
          setMeals(data)
        } catch (error) {
          console.error("Failed to load meals:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadMeals()
  }, [params.id])

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-3 sm:mb-4">
            Your <span className="text-primary">Meal Plan</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-pretty">A week of delicious meals planned just for you</p>
        </motion.div>

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group overflow-hidden rounded-xl sm:rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={meal.image || "/placeholder.svg"}
                    alt={meal.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-balance mb-2">{meal.title}</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{meal.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-primary hover:text-primary hover:bg-primary/10 w-full sm:w-auto justify-start sm:justify-center"
                      onClick={() => router.push(`/recipes/${meal.recipeId}`)}
                    >
                      View Recipe
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-muted-foreground">No meals found in this plan.</p>
          </div>
        )}
      </div>
    </main>
  )
}
