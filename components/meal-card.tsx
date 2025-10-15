"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { Meal } from "@/lib/api"

interface MealCardProps {
  meal: Meal
  index: number
}

export function MealCard({ meal, index }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full"
    >
      <Link href={`/recipes/${meal.recipeId}`} className="focus-enhanced rounded-2xl">
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index < 4} // Prioritize loading for first 4 images
            />
          </div>
          
          {/* Content Container */}
          <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-balance mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {meal.title}
              </h3>
            </div>
            
            {/* Duration */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-auto">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{meal.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
