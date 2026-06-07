"use client"

import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import type { Recipe } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { LoadingCard } from "@/components/loading-card"
interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
  emptyState?: React.ReactNode
}

export function RecipeGrid({ recipes, loading = false, emptyState }: RecipeGridProps) {
  if (loading) {
    return (
      <div className="grid-cinematic" aria-busy="true" aria-label="Loading recipes">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }

  if (recipes.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <LayoutGroup>
      <motion.div layout className="grid-cinematic">
        <AnimatePresence mode="popLayout" initial={false}>
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
