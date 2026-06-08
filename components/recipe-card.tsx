"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { Recipe } from "@/lib/api"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { recipeImageSrc } from "@/lib/recipe-image"

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
          className={`relative mb-4 aspect-square overflow-hidden rounded-3xl bg-[#f4f1ec] shadow-sm transition-[opacity,shadow] duration-300 ease-out group-hover:shadow-xl ${
            isOpening ? "opacity-0" : "opacity-100"
          }`}
        >
          {!imageLoaded && !isOpening && <div className="absolute inset-0 shimmer" />}
          <Image
            src={imageSrc}
            alt={recipe.title || "Recipe"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover ${imageLoaded && !isOpening ? "opacity-100" : "opacity-0"}`}
            priority={index < 3}
            loading={index < 3 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            quality={80}
          />
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
    </article>
  )
}
