"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { PageHeader } from "@/components/page-header"
import { LoadingCard } from "@/components/loading-card"
import { duration, easeOut, stagger } from "@/lib/motion"

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
    <main className="min-h-screen bg-canvas padding-y-responsive">
      <div className="container-responsive max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PageHeader
            eyebrow="Meal plan"
            title={
              <>
                Your <span className="text-primary">Meals</span>
              </>
            }
            description="A week of delicious meals planned just for you."
          />
        </motion.div>

        {loading ? (
          <div className="grid-cinematic">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="grid-cinematic">
            {meals.map((meal, index) => (
              <motion.article
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.normal, ease: easeOut, delay: stagger(index, 0.35) }}
                className="group w-full"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/recipes/${meal.recipeId}`)}
                  className="focus-enhanced block w-full text-left"
                >
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl bg-surface-muted sm:mb-6 sm:rounded-3xl">
                    <Image
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2.5 px-0.5">
                    <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-foreground sm:text-[15px]">
                      {meal.title}
                    </h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">{meal.duration}</p>
                    <span className="inline-flex items-center gap-1.5 pt-0.5 text-xs font-medium text-foreground transition-transform duration-300 group-hover:translate-x-0.5 sm:text-sm">
                      View recipe
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-editorial text-2xl text-foreground">No meals found</p>
            <p className="mt-2 text-sm text-muted-foreground">This plan doesn&apos;t have any meals yet.</p>
          </div>
        )}
      </div>
    </main>
  )
}
