"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import Image from "next/image"
import { Clock } from "lucide-react"
import type { Meal } from "@/lib/api"
import { assignMealToDay, reorderMealsInDay } from "@/lib/firebase/meal-plans"
import { DayColumn } from "./day-column"
import { DraggableMealCard } from "./draggable-meal-card"
import { useIsMobile } from "@/hooks/use-mobile"

const DAYS = [0, 1, 2, 3, 4, 5, 6] as const

interface WeeklyBoardProps {
  planId: string
  meals: Meal[]
  onUpdate: () => void
}

export function WeeklyBoard({ planId, meals, onUpdate }: WeeklyBoardProps) {
  const isMobile = useIsMobile()
  const [activeMeal, setActiveMeal] = useState<Meal | null>(null)
  const [overDay, setOverDay] = useState<number | null>(null)
  const [droppedMealId, setDroppedMealId] = useState<string | null>(null)
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null)

  const unscheduled = meals.filter((m) => m.dayOfWeek === undefined)
  const scheduledByDay = (day: number) =>
    meals.filter((m) => m.dayOfWeek === day)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const meal = meals.find((m) => m.id === event.active.id)
    if (meal) setActiveMeal(meal)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id
    if (typeof overId === "string" && overId.startsWith("day-")) {
      setOverDay(parseInt(overId.replace("day-", ""), 10))
    } else {
      setOverDay(null)
    }
  }

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveMeal(null)
      setOverDay(null)

      if (!over) return

      const mealId = active.id as string
      const overId = over.id as string

      // Dropped on a day column
      if (overId.startsWith("day-")) {
        const day = parseInt(overId.replace("day-", ""), 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6
        try {
          await assignMealToDay(planId, mealId, day)
          setDroppedMealId(mealId)
          setTimeout(() => setDroppedMealId(null), 300)
          onUpdate()
        } catch (error) {
          console.error("Failed to assign meal:", error)
        }
        return
      }

      // Reorder within same day
      const activeMeal = meals.find((m) => m.id === mealId)
      const overMeal = meals.find((m) => m.id === overId)
      if (
        activeMeal &&
        overMeal &&
        activeMeal.dayOfWeek !== undefined &&
        activeMeal.dayOfWeek === overMeal.dayOfWeek
      ) {
        const day = activeMeal.dayOfWeek
        const dayMeals = scheduledByDay(day).sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        )
        const oldIndex = dayMeals.findIndex((m) => m.id === mealId)
        const newIndex = dayMeals.findIndex((m) => m.id === overId)
        if (oldIndex !== newIndex) {
          const reordered = arrayMove(dayMeals, oldIndex, newIndex)
          try {
            await reorderMealsInDay(
              planId,
              day,
              reordered.map((m) => m.id)
            )
            onUpdate()
          } catch (error) {
            console.error("Failed to reorder meals:", error)
          }
        }
      }
    },
    [meals, planId, onUpdate]
  )

  const handleTapAssign = async (day: number) => {
    if (!selectedMealId) return
    try {
      await assignMealToDay(planId, selectedMealId, day as 0 | 1 | 2 | 3 | 4 | 5 | 6)
      setDroppedMealId(selectedMealId)
      setSelectedMealId(null)
      setTimeout(() => setDroppedMealId(null), 300)
      onUpdate()
    } catch (error) {
      console.error("Failed to assign meal:", error)
    }
  }

  const dragEnabled = !isMobile

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Week columns */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 min-w-max sm:min-w-0 pb-2">
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                meals={scheduledByDay(day)}
                isOver={overDay === day}
                droppedMealId={droppedMealId}
                dragEnabled={dragEnabled}
                onTapAssign={isMobile ? () => handleTapAssign(day) : undefined}
                selectedMealId={selectedMealId}
              />
            ))}
          </div>
        </div>

        {/* Unscheduled pool */}
        {unscheduled.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Unscheduled {isMobile && "(tap a meal, then tap a day)"}
            </h3>
            <SortableContext
              items={unscheduled.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {unscheduled.map((meal) => (
                  <div
                    key={meal.id}
                    onClick={() => isMobile && setSelectedMealId(meal.id)}
                    className={isMobile && selectedMealId === meal.id ? "ring-2 ring-primary rounded-xl" : ""}
                  >
                    <DraggableMealCard meal={meal} dragEnabled={dragEnabled} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        )}

        <DragOverlay>
          {activeMeal && (
            <div className="rounded-xl bg-card border border-primary shadow-xl p-2 flex items-center gap-2 w-48">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={activeMeal.image || "/placeholder.svg"}
                  alt={activeMeal.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{activeMeal.title}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeMeal.duration}
                </p>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
