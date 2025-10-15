"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { Recipe } from "@/lib/api"

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full"
    >
      <Link href={`/recipes/${recipe.id}`} className="focus-enhanced rounded-2xl">
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden">
            <Image
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index < 4} // Prioritize loading for first 4 images
            />
            
            {/* Category Badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <div className="rounded-full bg-secondary/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-secondary-foreground border border-secondary-foreground/10">
                {recipe.category}
              </div>
            </div>
          </div>
          
          {/* Content Container */}
          <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-balance mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {recipe.title}
              </h3>
            </div>
            
            {/* Duration */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-auto">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{recipe.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
