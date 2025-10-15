"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { MealPlan } from "@/lib/api"

interface MealPlanCardProps {
  plan: MealPlan
  index: number
}

export function MealPlanCard({ plan, index }: MealPlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={`/meal/${plan.id}`}>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={plan.image || "/placeholder.svg"}
              alt={plan.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {plan.recommended && (
              <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Recommended
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-balance mb-2 group-hover:text-primary transition-colors">
              {plan.title}
            </h3>
            <p className="text-sm text-muted-foreground text-pretty">{plan.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
