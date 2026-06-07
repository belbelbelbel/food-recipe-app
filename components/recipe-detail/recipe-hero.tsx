"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, ChefHat, MapPin } from "lucide-react"
import type { RecipeDetail } from "@/lib/api"
import { duration, easeOut } from "@/lib/motion"

interface RecipeHeroProps {
  recipe: RecipeDetail
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  return (
    <div className="relative -mx-4 mb-8 w-[calc(100%+2rem)] overflow-hidden sm:mx-0 sm:mb-10 sm:w-full">
      <div className="relative aspect-[4/3] max-h-[58vh] sm:aspect-[21/9]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="absolute inset-0"
        >
          <Image
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={(recipe.image || "").startsWith("http")}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: easeOut, delay: 0.1 }}
          className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            {recipe.category}
          </p>
          <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {recipe.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.duration}
            </span>
            {recipe.area && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {recipe.area}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ChefHat className="h-4 w-4" />
              {recipe.ingredients.length} ingredients
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
