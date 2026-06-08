"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRecipeTransition } from "./motion-provider"
import { duration, easeOut, reducedMotion } from "@/lib/motion"

type SheetStep = "rise" | "expand" | "hold"

export function RecipeTransitionOverlay() {
  const { activeTransition, phase, onExpandComplete } = useRecipeTransition()
  const [sheetStep, setSheetStep] = useState<SheetStep>("rise")
  const expandFired = useRef(false)
  const prefersReduced = reducedMotion()

  useEffect(() => {
    expandFired.current = false
    setSheetStep("rise")
  }, [activeTransition?.recipeId])

  useEffect(() => {
    if (!prefersReduced || phase !== "expanding" || expandFired.current) return
    expandFired.current = true
    onExpandComplete()
  }, [prefersReduced, phase, onExpandComplete])

  if (!activeTransition || phase === "idle") return null
  if (prefersReduced) return null

  const { imageSrc, title } = activeTransition
  const isRevealing = phase === "revealing"
  const isFullscreen = sheetStep === "expand" || sheetStep === "hold" || phase === "holding"

  const handleRiseComplete = () => {
    if (phase === "expanding" && sheetStep === "rise") {
      setSheetStep("expand")
    }
  }

  const handleExpandComplete = () => {
    if (phase === "expanding" && sheetStep === "expand" && !expandFired.current) {
      expandFired.current = true
      setSheetStep("hold")
      onExpandComplete()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="recipe-transition"
        className="fixed inset-0 z-[200]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isRevealing ? 0.35 : 0.2, ease: easeOut }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealing ? 0 : isFullscreen ? 0.7 : 0.4 }}
          transition={{ duration: duration.normal, ease: easeOut }}
        />

        <motion.div
          className="fixed left-0 right-0 flex flex-col overflow-hidden bg-background shadow-2xl"
          initial={{
            bottom: 0,
            y: "100%",
            height: "78vh",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
          animate={
            isFullscreen
              ? {
                  bottom: 0,
                  top: 0,
                  y: 0,
                  height: "100%",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }
              : {
                  bottom: 0,
                  top: "auto",
                  y: 0,
                  height: "78vh",
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                }
          }
          transition={{
            duration: isFullscreen ? 0.4 : 0.36,
            ease: easeOut,
          }}
          onAnimationComplete={() => {
            if (sheetStep === "rise") handleRiseComplete()
            else if (sheetStep === "expand") handleExpandComplete()
          }}
        >
          <motion.div
            className="flex shrink-0 justify-center overflow-hidden"
            animate={{ height: isFullscreen ? 0 : 28, opacity: isFullscreen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
          </motion.div>

          <motion.div
            className="relative w-full shrink-0 overflow-hidden bg-neutral-900"
            animate={{ height: isFullscreen ? "min(52vh, 480px)" : 200 }}
            transition={{ duration: 0.4, ease: easeOut }}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-8 sm:pb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: duration.normal, ease: easeOut }}
          >
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Opening recipe
            </p>
            <h2 className="text-balance font-editorial text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h2>

            {phase === "holding" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 space-y-3"
              >
                <div className="h-3 w-4/5 rounded-full shimmer" />
                <div className="h-3 w-3/5 rounded-full shimmer" />
                <div className="h-3 w-2/5 rounded-full shimmer" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
