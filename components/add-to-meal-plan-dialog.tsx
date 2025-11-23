"use client"

import { useState, useEffect } from "react"
import { Loader2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { fetchMealPlans, type MealPlan } from "@/lib/api"
import { getUserMealPlans, addRecipeToMealPlan as addRecipeToFirestorePlan, type UserMealPlan } from "@/lib/firebase/meal-plans"
import type { RecipeDetail } from "@/lib/api"
import { handleError, showSuccess } from "@/lib/error-handler"
import Image from "next/image"

interface AddToMealPlanDialogProps {
  recipe: RecipeDetail
  children: React.ReactNode
}

export function AddToMealPlanDialog({ recipe, children }: AddToMealPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [plans, setPlans] = useState<(MealPlan | UserMealPlan)[]>([])
  const [loading, setLoading] = useState(false)
  const [addingToPlan, setAddingToPlan] = useState<string | null>(null)


  useEffect(() => {
    if (open) {
      loadPlans()
    }
  }, [open])

  async function loadPlans() {
    try {
      setLoading(true)
      const [userPlansData, curatedPlansData] = await Promise.all([
        getUserMealPlans(),
        fetchMealPlans(),
      ])
      // Combine user plans and curated plans
      setPlans([...userPlansData, ...curatedPlansData])
    } catch (error) {
      handleError(error, "Failed to load meal plans")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToPlan(planId: string) {
    try {
      setAddingToPlan(planId)
      // Check if it's a user plan (from Firestore) or curated plan
      const userPlan = plans.find((p) => p.id === planId && "isCustom" in p && p.isCustom)
      
      if (userPlan) {
        // Use Firestore function for user plans
        await addRecipeToFirestorePlan(planId, recipe)
      } else {
        // For curated plans, we might need to create a user copy first
        // For now, try Firestore - it will handle it
        await addRecipeToFirestorePlan(planId, recipe)
      }
      showSuccess(`${recipe.title} added to meal plan!`, "Success")
      setOpen(false)
    } catch (error) {
      handleError(error, "Failed to add recipe to meal plan")
    } finally {
      setAddingToPlan(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Meal Plan</DialogTitle>
          <DialogDescription>
            Select a meal plan to add "{recipe.title}" to
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No meal plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {plans.map((plan) => {
              const isAdding = addingToPlan === plan.id
              const isUserPlan = "createdAt" in plan
              
              return (
                <button
                  key={plan.id}
                  onClick={() => handleAddToPlan(plan.id)}
                  disabled={isAdding}
                  className="relative group rounded-lg border border-border bg-card p-4 text-left hover:border-primary hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-enhanced"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={plan.image || "/placeholder.svg"}
                        alt={plan.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">
                        {plan.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                        {plan.description}
                      </p>
                      {isUserPlan && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          Your Plan
                        </span>
                      )}
                    </div>
                    {isAdding && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

