"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Recipe } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { LoadingCard } from "@/components/loading-card"
import { RecipePagination, RECIPES_PER_PAGE } from "@/components/recipe-pagination"
import { duration, easeOut, stagger } from "@/lib/motion"

interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
  emptyState?: React.ReactNode
  pageSize?: number
  /** Resets to page 1 when filters/search change */
  resetKey?: string
}

export function RecipeGrid({
  recipes,
  loading = false,
  emptyState,
  pageSize = RECIPES_PER_PAGE,
  resetKey = "",
}: RecipeGridProps) {
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPage(1)
  }, [resetKey, recipes.length])

  const totalPages = Math.max(1, Math.ceil(recipes.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginatedRecipes = recipes.slice(start, start + pageSize)

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (loading) {
    return (
      <div className="grid-cinematic" aria-busy="true" aria-label="Loading recipes">
        {Array.from({ length: pageSize }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }

  if (recipes.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div ref={gridRef} className="scroll-mt-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={`page-${safePage}-${resetKey}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="grid-cinematic"
        >
          {paginatedRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.normal,
                ease: easeOut,
                delay: stagger(index, 0.35),
              }}
            >
              <RecipeCard recipe={recipe} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <RecipePagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
