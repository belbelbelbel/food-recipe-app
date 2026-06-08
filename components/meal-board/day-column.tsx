"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import type { Meal } from "@/lib/api"
import { DraggableMealCard } from "./draggable-meal-card"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface DayColumnProps {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6
  meals: Meal[]
  isOver?: boolean
  droppedMealId?: string | null
  dragEnabled?: boolean
  onTapAssign?: (mealId: string) => void
  selectedMealId?: string | null
}

export function DayColumn({
  day,
  meals,
  isOver,
  droppedMealId,
  dragEnabled = true,
  onTapAssign,
  selectedMealId,
}: DayColumnProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: `day-${day}`,
    data: { day },
  })

  const sortedMeals = [...meals].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  return (
    <div className="flex flex-col min-w-[140px] sm:min-w-[160px] flex-1">
      <h3 className="text-xs sm:text-sm font-semibold text-center mb-2 text-muted-foreground uppercase tracking-wide">
        {DAY_LABELS[day]}
      </h3>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[120px] flex-1 rounded-2xl border border-dashed p-2 transition-colors duration-200",
          isOver || isDroppableOver
            ? "border-primary/50 bg-primary/[0.04]"
            : "border-border/40 bg-white"
        )}
      >
        <SortableContext items={sortedMeals.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedMeals.map((meal) => (
              <DraggableMealCard
                key={meal.id}
                meal={meal}
                justDropped={droppedMealId === meal.id}
                dragEnabled={dragEnabled}
              />
            ))}
            {sortedMeals.length === 0 && (
              <p className="text-[10px] text-muted-foreground text-center py-4">
                {onTapAssign && selectedMealId ? "Tap to assign" : "Drop meals here"}
              </p>
            )}
          </div>
        </SortableContext>
        {onTapAssign && selectedMealId && (
          <button
            onClick={() => onTapAssign(selectedMealId)}
            className="w-full mt-2 text-[10px] text-primary hover:underline py-1"
          >
            + Assign here
          </button>
        )}
      </div>
    </div>
  )
}
