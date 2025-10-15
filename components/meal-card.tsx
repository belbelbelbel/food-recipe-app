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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={`/recipes/${meal.recipeId}`}>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-balance mb-2 group-hover:text-primary transition-colors">
              {meal.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{meal.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
