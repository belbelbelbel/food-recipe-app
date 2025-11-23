"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveMeal, unsaveMeal, isMealSaved } from "@/lib/firebase/saved-meals"
import { handleError, showSuccess } from "@/lib/error-handler"
import { useAuth } from "@/contexts/auth-context"
import type { RecipeDetail } from "@/lib/api"

interface SaveMealButtonProps {
  recipe: RecipeDetail
  variant?: "button" | "icon"
}

export function SaveMealButton({ recipe, variant = "button" }: SaveMealButtonProps) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

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

  async function handleToggleSave() {
    if (!user) {
      handleError(new Error("Please sign in to save meals"), "Authentication Required")
      return
    }

    try {
      setLoading(true)
      if (saved) {
        await unsaveMeal(recipe.id)
        setSaved(false)
        showSuccess("Meal removed from saved", "Success")
      } else {
        await saveMeal(recipe)
        setSaved(true)
        showSuccess("Meal saved!", "Success")
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
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={handleToggleSave}
        disabled={loading || checking}
        aria-label={saved ? "Unsave meal" : "Save meal"}
      >
        {checking || loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant={saved ? "default" : "outline"}
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
          <BookmarkCheck className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="mr-2 h-4 w-4" />
          Save Meal
        </>
      )}
    </Button>
  )
}

