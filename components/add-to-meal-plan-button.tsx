"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddToMealPlanDialog } from "./add-to-meal-plan-dialog"
import { fetchRecipeById, type Recipe } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { handleError } from "@/lib/error-handler"

interface AddToMealPlanButtonProps {
  recipe: Recipe
  variant?: "button" | "icon"
}

export function AddToMealPlanButton({ recipe, variant = "button" }: AddToMealPlanButtonProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [recipeDetail, setRecipeDetail] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch recipe details when dialog opens
  useEffect(() => {
    if (dialogOpen && !recipeDetail) {
      const loadRecipe = async () => {
        try {
          setLoading(true)
          const detail = await fetchRecipeById(recipe.id)
          setRecipeDetail(detail)
        } catch (error) {
          handleError(error, "Failed to load recipe details")
          setDialogOpen(false)
        } finally {
          setLoading(false)
        }
      }
      loadRecipe()
    }
  }, [dialogOpen, recipe.id, recipeDetail])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user && !authLoading) {
      handleError(new Error("Please sign in to add recipes to meal plans"), "Authentication Required")
      router.push("/login")
      return
    }

    if (!user) return

    // If we already have the detail, just open dialog
    if (recipeDetail) {
      setDialogOpen(true)
      return
    }

    // Otherwise, fetch it first
    try {
      setLoading(true)
      const detail = await fetchRecipeById(recipe.id)
      setRecipeDetail(detail)
      setDialogOpen(true)
    } catch (error) {
      handleError(error, "Failed to load recipe details")
    } finally {
      setLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <>
        <Button
          size="sm"
          className="h-8 w-8 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary border border-primary-foreground/10 shadow-lg p-0"
          onClick={handleClick}
          disabled={loading || authLoading}
          aria-label="Add to meal plan"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
        {recipeDetail && (
          <AddToMealPlanDialog
            recipe={recipeDetail}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={() => {
              setDialogOpen(false)
            }}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="w-full rounded-full text-xs sm:text-sm"
        onClick={handleClick}
        disabled={loading || authLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-3 w-3" />
            Add to Plan
          </>
        )}
      </Button>
      {recipeDetail && (
        <AddToMealPlanDialog
          recipe={recipeDetail}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => {
            setDialogOpen(false)
          }}
        />
      )}
    </>
  )
}

