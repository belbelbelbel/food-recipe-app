"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { fetchRecipeById, type RecipeDetail } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { AddToMealPlanDialog } from "@/components/add-to-meal-plan-dialog"
import { SaveMealButton } from "@/components/save-meal-button"
import { useAuth } from "@/contexts/auth-context"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { RecipeHero } from "@/components/recipe-detail/recipe-hero"
import { IngredientsPanel } from "@/components/recipe-detail/ingredients-panel"
import { InstructionsTimeline } from "@/components/recipe-detail/instructions-timeline"
import { ReadingProgress } from "@/components/recipe-detail/reading-progress"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { onDetailReady, phase } = useRecipeTransition()
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const recipeId = params.id as string

  useEffect(() => {
    async function loadRecipe() {
      if (recipeId) {
        try {
          setLoading(true)
          const data = await fetchRecipeById(recipeId)
          setRecipe(data)
        } catch (error) {
          console.error("Failed to load recipe:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadRecipe()
  }, [recipeId])

  // Signal overlay to fade once recipe data is ready
  useEffect(() => {
    if (recipe && !loading && phase === "holding") {
      onDetailReady(recipe.id)
    }
  }, [recipe, loading, phase, onDetailReady])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="aspect-[21/9] max-h-[58vh] shimmer" />
        <div className="container-responsive max-w-7xl space-y-6 py-8">
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="min-h-screen py-12">
        <div className="container-responsive max-w-7xl text-center">
          <p className="text-muted-foreground">Recipe not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ReadingProgress />
      <RecipeHero recipe={recipe} />

      <div className="container-responsive max-w-7xl pb-12 sm:pb-16">
        <div className="mb-8 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:gap-3">
          {user ? (
            <>
              <AddToMealPlanDialog recipe={recipe}>
                <Button size="lg" className="w-full rounded-full sm:w-auto">
                  Add to Meal Plan
                </Button>
              </AddToMealPlanDialog>
              <SaveMealButton recipe={recipe} variant="button" />
            </>
          ) : (
            <Button
              size="lg"
              className="w-full rounded-full sm:w-auto"
              onClick={() => router.push("/login")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Add to Meal Plan
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          <IngredientsPanel ingredients={recipe.ingredients} />
          <InstructionsTimeline instructions={recipe.instructions} />
        </div>
      </div>
    </main>
  )
}
