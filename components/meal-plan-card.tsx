"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Calendar, UtensilsCrossed } from "lucide-react"
import type { MealPlan } from "@/lib/api"
import type { UserMealPlan } from "@/lib/firebase/meal-plans"
import { MealPlanMenu } from "./meal-plan-menu"
import { formatDistanceToNow } from "date-fns"
import { duration, easeOut } from "@/lib/motion"

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
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, ease: easeOut, delay: Math.min(index * 0.04, 0.2) }}
      className="group relative w-full"
    >
      {isUserPlan && (
        <div className="absolute right-2 top-2 z-30">
          <MealPlanMenu plan={plan as UserMealPlan} onUpdate={onUpdate} />
        </div>
      )}

      <Link href={`/meal-plans/${plan.id}`} className="focus-enhanced block rounded-2xl">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/2]">
            <Image
              src={plan.image || "/placeholder.svg"}
              alt={plan.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={index < 3}
            />

            {plan.recommended && (
              <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground sm:px-3 sm:py-1">
                  <Star className="h-3 w-3 fill-current" />
                  Recommended
                </span>
              </div>
            )}

            {isUserPlan && (
              <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                <span className="rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm sm:px-3 sm:py-1">
                  Your plan
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
            <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:text-primary sm:text-lg md:text-xl">
              {plan.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{plan.description}</p>

            <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground sm:text-sm">
              {mealCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {mealCount} meal{mealCount !== 1 ? "s" : ""}
                </span>
              )}
              {lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
