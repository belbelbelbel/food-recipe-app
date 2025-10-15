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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Your <span className="text-primary">Meal Plan</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">A week of delicious meals planned just for you</p>
        </motion.div>

        {/* Meals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={meal.image || "/placeholder.svg"}
                    alt={meal.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-balance mb-2">{meal.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{meal.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => router.push(`/recipes/${meal.recipeId}`)}
                    >
                      View Recipe
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No meals found in this plan.</p>
          </div>
        )}
      </div>
    </main>
  )
}
