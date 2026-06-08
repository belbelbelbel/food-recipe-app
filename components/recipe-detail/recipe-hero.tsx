"use client"

import Image from "next/image"
import { Clock, ChefHat, MapPin } from "lucide-react"
import type { RecipeDetail } from "@/lib/api"
import { isRemoteRecipeImage, recipeImageSrc } from "@/lib/recipe-image"

interface RecipeHeroProps {
  recipe: RecipeDetail
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const imageSrc = recipeImageSrc(recipe.image)
  const isRemote = isRemoteRecipeImage(imageSrc)

  return (
    <header className="relative overflow-hidden bg-neutral-900">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative aspect-[4/3] w-full sm:aspect-[21/9] sm:max-h-[min(52vh,480px)]">
          <Image
            src={imageSrc}
            alt={recipe.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={85}
            priority
            unoptimized={isRemote}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            {recipe.category}
          </p>
          <h1 className="max-w-4xl text-balance font-editorial text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {recipe.title}
          </h1>
          <ul className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90 sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              {recipe.duration}
            </li>
            {recipe.area && (
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90 sm:text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {recipe.area}
              </li>
            )}
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90 sm:text-sm">
              <ChefHat className="h-3.5 w-3.5" />
              {recipe.ingredients.length} ingredients
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
