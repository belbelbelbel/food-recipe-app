"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Recipe } from "@/lib/api"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { recipeImageSrc, RECIPE_IMAGE_QUALITY } from "@/lib/recipe-image"

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  const { startTransition, activeTransition } = useRecipeTransition()
  const [imageLoaded, setImageLoaded] = useState(false)

  const isOpening = activeTransition?.recipeId === recipe.id
  const imageSrc = recipeImageSrc(recipe.image)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition({
      recipeId: recipe.id,
      imageSrc,
      title: recipe.title,
    })
  }

  return (
    <article className="group w-full">
      <Link
        href={`/recipes/${recipe.id}`}
        onClick={handleClick}
        className="focus-enhanced block"
      >
        <div
          className={`relative mb-5 aspect-square overflow-hidden rounded-2xl bg-surface-muted transition-opacity duration-300 sm:mb-6 sm:rounded-3xl ${
            isOpening ? "opacity-0" : "opacity-100"
          }`}
        >
          {!imageLoaded && !isOpening && <div className="absolute inset-0 shimmer" />}
          <Image
            src={imageSrc}
            alt={recipe.title || "Recipe"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-center transition-opacity duration-300 ${
              imageLoaded && !isOpening ? "opacity-100" : "opacity-0"
            }`}
            priority={index < 3}
            loading={index < 3 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            quality={RECIPE_IMAGE_QUALITY.card}
          />
        </div>

        <div className="space-y-2.5 px-0.5">
          <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-foreground sm:text-[15px]">
            {recipe.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {recipe.category}
            {recipe.duration ? ` · ${recipe.duration}` : ""}
          </p>
          <span className="inline-flex items-center gap-1.5 pt-0.5 text-xs font-medium text-foreground transition-transform duration-300 group-hover:translate-x-0.5 sm:text-sm">
            View recipe
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </article>
  )
}
