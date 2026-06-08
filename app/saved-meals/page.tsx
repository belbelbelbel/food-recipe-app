"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { getSavedMeals, type SavedMeal } from "@/lib/firebase/saved-meals"
import { RecipeGrid } from "@/components/recipe-grid"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SavedMealsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else {
        loadSavedMeals()
      }
    }
  }, [user, authLoading, router])

  async function loadSavedMeals() {
    try {
      setLoading(true)
      const meals = await getSavedMeals()
      setSavedMeals(meals)
    } catch (error) {
      console.error("Failed to load saved meals:", error)
    } finally {
      setLoading(false)
    }
  }

  const recipes = savedMeals.map((savedMeal) => {
    const imageUrl =
      savedMeal.recipe?.image &&
      savedMeal.recipe.image.trim() !== "" &&
      savedMeal.recipe.image !== "null"
        ? savedMeal.recipe.image
        : "/placeholder.svg"

    return {
      id: savedMeal.recipe?.id || savedMeal.recipeId,
      title: savedMeal.recipe?.title || "Unknown Recipe",
      image: imageUrl,
      category: savedMeal.recipe?.category || "Unknown",
      duration: savedMeal.recipe?.duration || "N/A",
    }
  })

  const emptyState = (
    <div className="py-20 text-center">
      <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40 sm:h-14 sm:w-14" />
      <p className="font-editorial text-2xl text-foreground sm:text-3xl">No saved meals yet</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Start saving your favorite recipes to access them anytime.
      </p>
      <Button size="lg" className="mt-6 rounded-full" asChild>
        <Link href="/">Browse recipes</Link>
      </Button>
    </div>
  )

  return (
    <main className="min-h-screen bg-canvas padding-y-responsive">
      <div className="container-responsive">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PageHeader
            eyebrow="Your collection"
            title={
              <>
                Saved <span className="text-primary">Meals</span>
              </>
            }
            description="Your favorite recipes saved for later."
          />
        </motion.div>

        <RecipeGrid
          recipes={recipes}
          loading={authLoading || loading}
          emptyState={emptyState}
          resetKey="saved-meals"
        />
      </div>
    </main>
  )
}
