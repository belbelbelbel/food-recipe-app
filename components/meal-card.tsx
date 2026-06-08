"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { Meal } from "@/lib/api"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { duration, easeOut } from "@/lib/motion"

interface MealCardProps {
  meal: Meal
  index: number
}

export function MealCard({ meal, index }: MealCardProps) {
  const { startTransition } = useRecipeTransition()
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition({
      recipeId: meal.recipeId,
      imageSrc: meal.image || "/placeholder.svg",
      title: meal.title,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, ease: easeOut, delay: Math.min(index * 0.04, 0.2) }}
      className="group w-full"
    >
      <Link
        href={`/recipes/${meal.recipeId}`}
        onClick={handleClick}
        className="focus-enhanced block rounded-2xl"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={index < 4}
            />
          </div>
          <div className="flex flex-1 flex-col p-3 sm:p-4">
            <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:text-primary sm:text-lg">
              {meal.title}
            </h3>
            <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              <span>{meal.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
