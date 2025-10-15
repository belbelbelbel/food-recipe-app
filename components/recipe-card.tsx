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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={`/recipes/${recipe.id}`}>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {recipe.category}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-balance mb-2 group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{recipe.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
