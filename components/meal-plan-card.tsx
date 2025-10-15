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
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full"
    >
      <Link href={`/meal/${plan.id}`} className="focus-enhanced rounded-2xl">
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
          </div>
          
          {/* Content Container */}
          <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-balance mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {plan.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-pretty line-clamp-3 leading-relaxed">
                {plan.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
