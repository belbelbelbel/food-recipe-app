"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRecipeTransition } from "./motion-provider"
import { reducedMotion } from "@/lib/motion"

const HERO_HEIGHT = "min(58vh, 520px)"

export function RecipeTransitionOverlay() {
  const { activeTransition, phase, onExpandComplete } = useRecipeTransition()
  const [show, setShow] = useState(false)
  const expandFired = useRef(false)
  const prefersReduced = reducedMotion()

  useEffect(() => {
    expandFired.current = false
  }, [activeTransition?.recipeId])

  useEffect(() => {
    if (activeTransition && phase !== "idle") {
      setShow(true)
    } else if (phase === "idle") {
      setShow(false)
    }
  }, [activeTransition, phase])

  if (!activeTransition || !show) return null

  const { rect, imageSrc, title } = activeTransition
  const isRevealing = phase === "revealing"

  return (
    <AnimatePresence>
      {(phase === "expanding" || phase === "holding" || phase === "revealing") && (
        <motion.div
          key="recipe-transition"
          className="fixed inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : isRevealing ? 0.38 : 0.2 }}
        >
          {/* Cinematic backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "expanding" ? 0.55 : 0.92 }}
            transition={{ duration: prefersReduced ? 0 : 0.35 }}
          />

          {/* Expanding image */}
          <motion.div
            className="absolute overflow-hidden bg-neutral-900 shadow-2xl"
            initial={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: 24,
            }}
            animate={{
              top: 0,
              left: 0,
              width: "100%",
              height: HERO_HEIGHT,
              borderRadius: 0,
            }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 140,
                    damping: 22,
                    mass: 0.85,
                  }
            }
            onAnimationComplete={() => {
              if (phase === "expanding" && !expandFired.current) {
                expandFired.current = true
                onExpandComplete()
              }
            }}
          >
            <motion.div
              className="relative h-full w-full"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                unoptimized={imageSrc.startsWith("http")}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            />

            {/* Title emerges as image expands */}
            <motion.div
              className="absolute inset-x-0 bottom-0 p-6 sm:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase !== "expanding" ? 1 : 0.6, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Recipe
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                {title}
              </h2>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
