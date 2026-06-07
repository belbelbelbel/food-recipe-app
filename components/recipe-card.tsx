"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import type { Recipe, RecipeDetail } from "@/lib/api"
import { AddToMealPlanButton } from "./add-to-meal-plan-button"
import { SaveMealButton } from "./save-meal-button"
import { fetchRecipeById } from "@/lib/api"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { duration, easeOut } from "@/lib/motion"

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  const { startTransition, activeTransition } = useRecipeTransition()
  const imageRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [recipeDetail, setRecipeDetail] = useState<RecipeDetail | null>(null)
  const [fetchStarted, setFetchStarted] = useState(false)

  const isFlying =
    activeTransition?.recipeId === recipe.id && activeTransition !== null

  const imageSrc =
    recipe.image && recipe.image.trim() !== "" && recipe.image !== "null"
      ? recipe.image
      : "/placeholder.svg"

  const loadDetailsOnHover = useCallback(async () => {
    if (fetchStarted) return
    setFetchStarted(true)
    try {
      const detail = await fetchRecipeById(recipe.id)
      setRecipeDetail(detail)
    } catch (error) {
      console.error("Failed to load recipe details:", error)
    }
  }, [recipe.id, fetchStarted])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    startTransition({
      recipeId: recipe.id,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      imageSrc,
      title: recipe.title,
    })
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.45, ease: easeOut },
        opacity: { duration: duration.normal },
      }}
      onMouseEnter={loadDetailsOnHover}
      className="group w-full"
    >
      <Link
        href={`/recipes/${recipe.id}`}
        onClick={handleClick}
        className="focus-enhanced block"
      >
        <div
          ref={imageRef}
          className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-[#f4f1ec] shadow-sm transition-shadow duration-500 ease-out group-hover:shadow-xl"
        >
          {!imageLoaded && !isFlying && <div className="absolute inset-0 shimmer" />}
          <motion.div
            animate={{ opacity: isFlying ? 0 : imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc}
              alt={recipe.title || "Recipe"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              priority={index < 3}
              loading={index < 3 ? "eager" : "lazy"}
              onLoad={() => setImageLoaded(true)}
              quality={90}
            />
          </motion.div>

          <div
            className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToMealPlanButton recipe={recipe} variant="icon" />
            {recipeDetail && <SaveMealButton recipe={recipeDetail} variant="icon" />}
          </div>
        </div>

        <div className="space-y-2 px-1">
          <h3 className="font-editorial text-lg font-medium uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
            {recipe.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              {recipe.duration}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-foreground transition-transform duration-300 group-hover:translate-x-0.5 sm:text-sm">
              View recipe
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
