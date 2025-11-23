"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Calendar, UtensilsCrossed } from "lucide-react"
import type { MealPlan } from "@/lib/api"
import type { UserMealPlan } from "@/lib/firebase/meal-plans"
import { MealPlanMenu } from "./meal-plan-menu"
import { formatDistanceToNow } from "date-fns"

interface MealPlanCardProps {
  plan: MealPlan | UserMealPlan
  index: number
  onUpdate?: () => void
}

export function MealPlanCard({ plan, index, onUpdate }: MealPlanCardProps) {
  const isUserPlan = "isCustom" in plan && plan.isCustom
  const mealCount = "meals" in plan ? plan.meals.length : 0
  const lastUpdated = "updatedAt" in plan ? plan.updatedAt : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full relative"
    >
      {/* Menu Button - Only for user plans - Always visible */}
      {isUserPlan && (
        <div 
          className="absolute top-2 right-2 z-30"
        >
          <MealPlanMenu plan={plan as UserMealPlan} onUpdate={onUpdate} />
        </div>
      )}

      <Link href={`/meal-plans/${plan.id}`} className="focus-enhanced rounded-2xl">
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3] overflow-hidden">
            <Image
              src={plan.image || "/placeholder.svg"}
              alt={plan.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index < 3} // Prioritize loading for first 3 images
            />
            
            {/* Recommended Badge */}
            {plan.recommended && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <div className="rounded-full bg-primary/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-primary-foreground flex items-center gap-1 border border-primary-foreground/10">
                  <Star className="h-3 w-3 fill-current flex-shrink-0" />
                  <span className="hidden sm:inline">Recommended</span>
                  <span className="sm:hidden">★</span>
                </div>
              </div>
            )}

            {/* User Plan Badge */}
            {isUserPlan && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <div className="rounded-full bg-secondary/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-secondary-foreground border border-secondary-foreground/10">
                  Your Plan
                </div>
              </div>
            )}
          </div>
          
          {/* Content Container */}
          <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-balance mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {plan.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-pretty line-clamp-2 leading-relaxed mb-3">
                {plan.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mt-auto pt-2 border-t border-border">
              {mealCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{mealCount} meal{mealCount !== 1 ? "s" : ""}</span>
                </div>
              )}
              {lastUpdated && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
