"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { RecipeTransitionOverlay } from "./recipe-transition-overlay"

export type TransitionPhase = "idle" | "expanding" | "holding" | "revealing"

export interface RecipeTransitionPayload {
  recipeId: string
  imageSrc: string
  title: string
  href: string
}

interface MotionContextValue {
  activeTransition: RecipeTransitionPayload | null
  phase: TransitionPhase
  startTransition: (payload: Omit<RecipeTransitionPayload, "href"> & { href?: string }) => void
  onExpandComplete: () => void
  onDetailReady: (recipeId: string) => void
  clearTransition: () => void
  isTransitioning: boolean
}

const MotionContext = createContext<MotionContextValue | null>(null)

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [activeTransition, setActiveTransition] = useState<RecipeTransitionPayload | null>(null)
  const [phase, setPhase] = useState<TransitionPhase>("idle")

  // Lock background scroll during transition
  useEffect(() => {
    if (phase === "idle") {
      document.body.style.overflow = ""
      return
    }
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [phase])

  // Auto-finish reveal phase
  useEffect(() => {
    if (phase !== "revealing") return
    scrollToTop()
    const timer = setTimeout(() => {
      scrollToTop()
      setPhase("idle")
      setActiveTransition(null)
    }, 320)
    return () => clearTimeout(timer)
  }, [phase])

  // Safety: never stay stuck in expanding
  useEffect(() => {
    if (phase !== "expanding") return
    const timer = setTimeout(() => {
      setActiveTransition((current) => {
        if (current) router.push(current.href)
        return current
      })
      setPhase("holding")
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase, router])

  // Safety: never stay stuck in holding
  useEffect(() => {
    if (phase !== "holding") return
    const timer = setTimeout(() => setPhase("revealing"), 2500)
    return () => clearTimeout(timer)
  }, [phase])

  const startTransition = useCallback(
    (payload: Omit<RecipeTransitionPayload, "href"> & { href?: string }) => {
      const href = payload.href ?? `/recipes/${payload.recipeId}`
      setActiveTransition({
        recipeId: payload.recipeId,
        imageSrc: payload.imageSrc,
        title: payload.title,
        href,
      })
      setPhase("expanding")
    },
    []
  )

  const onExpandComplete = useCallback(() => {
    scrollToTop()
    setActiveTransition((current) => {
      if (current) {
        router.push(current.href)
        requestAnimationFrame(scrollToTop)
      }
      return current
    })
    setPhase("holding")
  }, [router])

  const onDetailReady = useCallback((recipeId: string) => {
    setPhase((currentPhase) => {
      if (currentPhase === "holding") {
        return "revealing"
      }
      return currentPhase
    })
  }, [])

  const clearTransition = useCallback(() => {
    setActiveTransition(null)
    setPhase("idle")
  }, [])

  const isTransitioning = phase !== "idle"

  return (
    <MotionContext.Provider
      value={{
        activeTransition,
        phase,
        startTransition,
        onExpandComplete,
        onDetailReady,
        clearTransition,
        isTransitioning,
      }}
    >
      {children}
      <RecipeTransitionOverlay />
    </MotionContext.Provider>
  )
}

export function useRecipeTransition() {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error("useRecipeTransition must be used within MotionProvider")
  }
  return context
}
