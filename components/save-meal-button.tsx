"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveMeal, unsaveMeal, isMealSaved } from "@/lib/firebase/saved-meals"
import { handleError } from "@/lib/error-handler"
import { useAuth } from "@/contexts/auth-context"
import { useSavedMeals } from "@/contexts/saved-meals-context"
import { SaveCelebration } from "@/components/save-celebration"
import type { RecipeDetail } from "@/lib/api"

interface SaveMealButtonProps {
  recipe: RecipeDetail
  variant?: "button" | "icon"
}

export function SaveMealButton({ recipe, variant = "button" }: SaveMealButtonProps) {
  const { user } = useAuth()
  const { incrementCount, decrementCount } = useSavedMeals()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    if (user) {
      checkSavedStatus()
    } else {
      setChecking(false)
    }
  }, [user, recipe.id])

  async function checkSavedStatus() {
    try {
      setChecking(true)
      const isSaved = await isMealSaved(recipe.id)
      setSaved(isSaved)
    } catch (error) {
      console.error("Error checking saved status:", error)
    } finally {
      setChecking(false)
    }
  }

  async function handleToggleSave(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!user) {
      handleError(new Error("Please sign in to save meals"), "Authentication Required")
      return
    }

    try {
      setLoading(true)
      if (saved) {
        await unsaveMeal(recipe.id)
        setSaved(false)
        decrementCount()
      } else {
        await saveMeal(recipe)
        setSaved(true)
        incrementCount()
        setCelebrating(true)
      }
    } catch (error) {
      handleError(error, saved ? "Failed to unsave meal" : "Failed to save meal")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (variant === "icon") {
    return (
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleToggleSave}
          disabled={loading || checking}
          aria-label={saved ? "Unsave meal" : "Save meal"}
        >
          {checking || loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={`h-4 w-4 transition-colors ${saved ? "text-primary fill-primary" : ""}`}
            />
          )}
        </Button>
        <SaveCelebration show={celebrating} onComplete={() => setCelebrating(false)} />
      </div>
    )
  }

  return (
    <div className="relative inline-flex">
      <Button
        size="lg"
        variant={saved ? "default" : "outline"}
        className="rounded-full"
        onClick={handleToggleSave}
        disabled={loading || checking}
      >
        {loading || checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {checking ? "Checking..." : "Saving..."}
          </>
        ) : saved ? (
          <>
            <Heart className="mr-2 h-4 w-4 fill-current" />
            Saved
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Save Meal
          </>
        )}
      </Button>
      <SaveCelebration show={celebrating} onComplete={() => setCelebrating(false)} />
    </div>
  )
}
