"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRecipeTransition } from "./motion-provider"
import { RECIPE_HERO_FRAME_CLASS, RECIPE_HERO_WRAPPER_CLASS } from "@/components/recipe-detail/recipe-hero-layout"
import { RecipeDetailBodySkeleton } from "@/components/recipe-detail/recipe-detail-skeleton"
import { duration, easeOut, reducedMotion } from "@/lib/motion"

export function RecipeTransitionOverlay() {
  const { activeTransition, phase, onExpandComplete } = useRecipeTransition()
  const expandFired = useRef(false)
  const prefersReduced = reducedMotion()
  const [imageReady, setImageReady] = useState(false)

  useEffect(() => {
    expandFired.current = false
    setImageReady(false)
  }, [activeTransition?.recipeId])

  useEffect(() => {
    if (!activeTransition || phase !== "expanding" || expandFired.current) return
    if (!imageReady) return

    expandFired.current = true
    const timer = setTimeout(onExpandComplete, 120)
    return () => clearTimeout(timer)
  }, [activeTransition, phase, onExpandComplete, imageReady])

  useEffect(() => {
    if (!prefersReduced || phase !== "expanding" || expandFired.current) return
    expandFired.current = true
    onExpandComplete()
  }, [prefersReduced, phase, onExpandComplete])

  if (!activeTransition || phase === "idle") return null
  if (prefersReduced) return null

  const { imageSrc, title } = activeTransition
  const isRevealing = phase === "revealing"
  const showBodySkeleton = phase === "holding" || phase === "expanding"

  return (
    <AnimatePresence>
      <motion.div
        key="recipe-transition"
        className="fixed inset-0 z-[200] overflow-y-auto bg-canvas pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isRevealing ? 0.3 : 0.2, ease: easeOut }}
      >
        <header className="relative overflow-hidden bg-neutral-900">
          <div className={RECIPE_HERO_WRAPPER_CLASS}>
            <div className={RECIPE_HERO_FRAME_CLASS}>
              {!imageReady && <div className="absolute inset-0 shimmer opacity-30" />}

              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: imageReady ? 1 : 0 }}
                transition={{ duration: duration.normal, ease: easeOut }}
              >
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority
                  unoptimized={imageSrc.startsWith("http")}
                  onLoad={() => setImageReady(true)}
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

              <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                  Opening recipe
                </p>
                <h2 className="max-w-4xl text-balance font-editorial text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
                  {title}
                </h2>
              </div>
            </div>
          </div>
        </header>

        {showBodySkeleton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: duration.normal }}
          >
            <RecipeDetailBodySkeleton />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
