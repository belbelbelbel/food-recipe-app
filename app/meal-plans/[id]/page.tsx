"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { fetchMealsByPlanId, type Meal } from "@/lib/api"
import { getMealPlanById } from "@/lib/firebase/meal-plans"
import { WeeklyBoard } from "@/components/meal-board/weekly-board"
import { WeeklyBoardSkeleton } from "@/components/meal-board/weekly-board-skeleton"
import { useAuth } from "@/contexts/auth-context"

export default function MealPlanDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [planTitle, setPlanTitle] = useState<string | null>(null)
  const hasLoadedOnce = useRef(false)

  const loadMeals = useCallback(
    async (silent = false) => {
      if (!params.id) return
      try {
        if (silent) {
          setRefreshing(true)
        } else {
          setInitialLoading(true)
        }

        const userPlan = await getMealPlanById(params.id as string)
        if (userPlan) {
          setMeals(userPlan.meals || [])
          setPlanTitle(userPlan.title)
        } else {
          const data = await fetchMealsByPlanId(params.id as string)
          const realMeals = data.filter(
            (meal) =>
              meal.id !== "meal1" &&
              meal.title !== "Meal Not Found" &&
              meal.recipeId !== "r1"
          )
          setMeals(realMeals)
        }
        hasLoadedOnce.current = true
      } catch (error) {
        console.error("Failed to load meals:", error)
        if (!silent) setMeals([])
      } finally {
        setInitialLoading(false)
        setRefreshing(false)
      }
    },
    [params.id]
  )

  useEffect(() => {
    loadMeals(false)
  }, [loadMeals])

  // Re-fetch silently when auth becomes available
  useEffect(() => {
    if (user && hasLoadedOnce.current) {
      loadMeals(true)
    }
  }, [user?.uid, loadMeals])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasLoadedOnce.current) {
        loadMeals(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [loadMeals])

  const showBoard = !initialLoading && meals.length > 0
  const showEmpty = !initialLoading && meals.length === 0

  return (
    <main className="min-h-screen bg-canvas padding-y-responsive">
      <div className="container-responsive max-w-7xl">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Weekly board
              </p>
              <h1 className="font-editorial text-balance text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl">
                {planTitle ? (
                  <span className="text-primary">{planTitle}</span>
                ) : initialLoading ? (
                  <span className="inline-block h-9 w-48 rounded-lg shimmer sm:h-11 sm:w-64" />
                ) : (
                  <>
                    Your <span className="text-primary">Weekly</span> Meals
                  </>
                )}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground text-pretty sm:text-base">
                {initialLoading
                  ? "Loading your plan..."
                  : meals.length > 0
                    ? "Drag meals onto days to plan your week"
                    : "This meal plan is empty. Add recipes to get started!"}
              </p>
            </div>
            {refreshing && (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" aria-label="Updating" />
            )}
          </div>
        </div>

        {initialLoading ? (
          <WeeklyBoardSkeleton />
        ) : showBoard ? (
          <div className={refreshing ? "pointer-events-none opacity-70 transition-opacity" : "transition-opacity"}>
            <WeeklyBoard
              planId={params.id as string}
              meals={meals}
              onUpdate={() => loadMeals(true)}
            />
          </div>
        ) : showEmpty ? (
          <div className="py-12 text-center sm:py-16 md:py-20">
            <div className="mx-auto max-w-md px-4">
              <div className="mb-4 text-5xl opacity-20 sm:text-6xl">🍽️</div>
              <h3 className="mb-2 text-base font-semibold sm:text-lg md:text-xl">
                No meals in this plan yet
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm md:text-base">
                Browse recipes and tap &quot;Add to Meal Plan&quot; to fill this board.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
