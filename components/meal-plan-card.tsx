"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, UtensilsCrossed } from "lucide-react"
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, ease: easeOut, delay: Math.min(index * 0.05, 0.35) }}
      className="group relative w-full"
    >
      {isUserPlan && (
        <div className="absolute right-2 top-2 z-30 sm:right-3 sm:top-3">
          <MealPlanMenu plan={plan as UserMealPlan} onUpdate={onUpdate} />
        </div>
      )}

      <Link href={`/meal-plans/${plan.id}`} className="focus-enhanced block">
        <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted sm:mb-6 sm:rounded-3xl">
          <Image
            src={plan.image || "/placeholder.svg"}
            alt={plan.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority={index < 3}
          />

          {plan.recommended && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary-foreground sm:text-xs">
                Featured
              </span>
            </div>
          )}

          {isUserPlan && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground backdrop-blur-sm sm:text-xs">
                Your plan
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 px-0.5">
          <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-foreground sm:text-[15px]">
            {plan.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {plan.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            {mealCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                {mealCount} meal{mealCount !== 1 ? "s" : ""}
              </span>
            )}
            {lastUpdated && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 pt-0.5 text-xs font-medium text-foreground transition-transform duration-300 group-hover:translate-x-0.5 sm:text-sm">
            View plan
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
