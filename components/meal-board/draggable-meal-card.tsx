"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, GripVertical } from "lucide-react"
import type { Meal } from "@/lib/api"
import { cn } from "@/lib/utils"

interface DraggableMealCardProps {
  meal: Meal
  isDragging?: boolean
  justDropped?: boolean
  dragEnabled?: boolean
}

export function DraggableMealCard({
  meal,
  isDragging,
  justDropped,
  dragEnabled = true,
}: DraggableMealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: meal.id,
    disabled: !dragEnabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      animate={justDropped ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        isDragging && "z-50 opacity-60 shadow-md",
        justDropped && "ring-1 ring-primary/50"
      )}
    >
      <div className="flex items-center gap-2 p-2">
        {dragEnabled && (
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <Link href={`/recipes/${meal.recipeId}`} className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.title}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
              {meal.title}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {meal.duration}
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
