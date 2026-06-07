"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSavedMeals } from "@/lib/firebase/saved-meals"

interface SavedMealsContextValue {
  savedCount: number
  incrementCount: () => void
  decrementCount: () => void
  refreshCount: () => Promise<void>
}

const SavedMealsContext = createContext<SavedMealsContextValue | null>(null)

export function SavedMealsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [savedCount, setSavedCount] = useState(0)

  const refreshCount = useCallback(async () => {
    if (!user) {
      setSavedCount(0)
      return
    }
    try {
      const meals = await getSavedMeals()
      setSavedCount(meals.length)
    } catch {
      setSavedCount(0)
    }
  }, [user])

  useEffect(() => {
    refreshCount()
  }, [refreshCount])

  const incrementCount = useCallback(() => {
    setSavedCount((c) => c + 1)
  }, [])

  const decrementCount = useCallback(() => {
    setSavedCount((c) => Math.max(0, c - 1))
  }, [])

  return (
    <SavedMealsContext.Provider value={{ savedCount, incrementCount, decrementCount, refreshCount }}>
      {children}
    </SavedMealsContext.Provider>
  )
}

export function useSavedMeals() {
  const context = useContext(SavedMealsContext)
  if (!context) {
    throw new Error("useSavedMeals must be used within SavedMealsProvider")
  }
  return context
}
