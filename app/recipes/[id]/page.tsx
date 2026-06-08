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
import { RecipeDetailSkeleton } from "@/components/recipe-detail/recipe-detail-skeleton"
import { IngredientsPanel } from "@/components/recipe-detail/ingredients-panel"
import { InstructionsTimeline } from "@/components/recipe-detail/instructions-timeline"
import { ReadingProgress } from "@/components/recipe-detail/reading-progress"

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { onDetailReady, phase } = useRecipeTransition()
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const recipeId = params.id as string
  const isTransitioning = phase !== "idle"

  useEffect(() => {
    scrollToTop()
  }, [recipeId])

  useEffect(() => {
    let cancelled = false

    async function loadRecipe() {
      if (!recipeId) return
      try {
        setLoading(true)
        const data = await fetchRecipeById(recipeId)
        if (!cancelled) setRecipe(data)
      } catch (error) {
        console.error("Failed to load recipe:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRecipe()
    return () => {
      cancelled = true
    }
  }, [recipeId])

  useEffect(() => {
    if (recipe && !loading && phase === "holding") {
      scrollToTop()
      onDetailReady(recipe.id)
    }
  }, [recipe, loading, phase, onDetailReady])

  if (loading && !isTransitioning) {
    return <RecipeDetailSkeleton />
  }

  if (loading && isTransitioning) {
    return <main className="min-h-screen bg-canvas" aria-hidden="true" />
  }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-canvas py-16">
        <div className="container-responsive max-w-7xl text-center">
          <p className="font-editorial text-2xl text-foreground">Recipe not found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try browsing from the home page.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas">
      <ReadingProgress />
      <RecipeHero recipe={recipe} />

      <div className="container-responsive max-w-7xl">
        <div className="border-b border-border/30 py-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
        </div>

        <div className="grid grid-cols-1 gap-12 py-12 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20 lg:py-16">
          <IngredientsPanel ingredients={recipe.ingredients} />
          <InstructionsTimeline instructions={recipe.instructions} />
        </div>
      </div>
    </main>
  )
}
