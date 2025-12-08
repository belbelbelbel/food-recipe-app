"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, ChefHat, LogIn } from "lucide-react"
import { fetchRecipeById, type RecipeDetail } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { AddToMealPlanDialog } from "@/components/add-to-meal-plan-dialog"
import { SaveMealButton } from "@/components/save-meal-button"
import { useAuth } from "@/contexts/auth-context"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      if (params.id) {
        try {
          setLoading(true)
          const data = await fetchRecipeById(params.id as string)
          setRecipe(data)
        } catch (error) {
          console.error("Failed to load recipe:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadRecipe()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen py-6 sm:py-8 md:py-12">
        <div className="container-responsive max-w-7xl">
          <div className="space-y-6 sm:space-y-8">
            <div className="aspect-[4/3] sm:aspect-[16/9] bg-muted rounded-xl sm:rounded-2xl md:rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 sm:h-10 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-5 sm:h-6 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="min-h-screen py-6 sm:py-8 md:py-12">
        <div className="container-responsive max-w-7xl text-center">
          <p className="text-sm sm:text-base text-muted-foreground">Recipe not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container-responsive max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Hero Image */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl mb-6 sm:mb-8 shadow-sm">
            <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" priority />
          </div>

          {/* Recipe Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-secondary-foreground">
                <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
                {recipe.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                {recipe.duration}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-4 sm:mb-6">{recipe.title}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {user ? (
                <>
                  <AddToMealPlanDialog recipe={recipe}>
                    <Button size="lg" className="rounded-full w-full sm:w-auto">
                      Add to Meal Plan
                    </Button>
                  </AddToMealPlanDialog>
                  <SaveMealButton recipe={recipe} variant="button" />
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full w-full sm:w-auto"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In to Add to Meal Plan
                </Button>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Ingredients</h2>
            <div className="bg-secondary/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <ul className="space-y-2 sm:space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-foreground pt-0.5 sm:pt-0">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Instructions</h2>
            <div className="space-y-4 sm:space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base sm:text-lg font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm sm:text-base text-foreground pt-1 sm:pt-2 text-pretty leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  )
}
