"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, ChefHat, MapPin } from "lucide-react"
import type { RecipeDetail } from "@/lib/api"
import { recipeImageSrc, RECIPE_IMAGE_QUALITY, shouldUseUnoptimizedImage } from "@/lib/recipe-image"
import { useRecipeTransition } from "@/components/motion/motion-provider"
import { RECIPE_HERO_FRAME_CLASS, RECIPE_HERO_WRAPPER_CLASS } from "@/components/recipe-detail/recipe-hero-layout"
import { duration, easeOut } from "@/lib/motion"

interface RecipeHeroProps {
  recipe: RecipeDetail
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const { phase, activeTransition } = useRecipeTransition()
  const imageSrc = recipeImageSrc(recipe.image)
  const alreadyShown =
    activeTransition?.recipeId === recipe.id && activeTransition.imageSrc === imageSrc
  const [imageLoaded, setImageLoaded] = useState(alreadyShown)

  const showHero = phase === "idle" || phase === "revealing"

  return (
    <motion.header
      className="relative overflow-hidden bg-neutral-900"
      initial={false}
      animate={{ opacity: showHero ? 1 : 0 }}
      transition={{ duration: duration.normal, ease: easeOut }}
    >
      <div className={RECIPE_HERO_WRAPPER_CLASS}>
        <div className={RECIPE_HERO_FRAME_CLASS}>
          {!imageLoaded && <div className="absolute inset-0 shimmer opacity-30" />}

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
          >
            <Image
              src={imageSrc}
              alt={recipe.title}
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={RECIPE_IMAGE_QUALITY.hero}
              priority
              unoptimized={shouldUseUnoptimizedImage(imageSrc, "hero")}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

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
      </div>
    </motion.header>
  )
}
