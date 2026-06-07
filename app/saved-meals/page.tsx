"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { getSavedMeals, type SavedMeal } from "@/lib/firebase/saved-meals"
import { RecipeGrid } from "@/components/recipe-grid"
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
  }, [user, authLoading])

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 sm:py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-md mx-auto px-4">
        <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">No saved meals yet</h3>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
          Start saving your favorite recipes to access them anytime!
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full w-full sm:w-auto">
            Browse Recipes
          </Button>
        </Link>
      </div>
    </motion.div>
  )

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-3 sm:mb-4">
            My <span className="text-primary">Saved Meals</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-pretty">
            Your favorite recipes saved for later
          </p>
        </motion.div>

        <RecipeGrid recipes={recipes} loading={authLoading || loading} emptyState={emptyState} />
      </div>
    </main>
  )
}
