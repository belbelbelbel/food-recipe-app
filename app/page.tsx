"use client"

import { useEffect, useState } from "react"
import {
  fetchRecipes,
  searchRecipes,
  fetchRecipesByCategory,
  fetchCategories,
  type Recipe,
} from "@/lib/api"
import { RecipeGrid } from "@/components/recipe-grid"
import { FilterBar } from "@/components/filter-bar"
import { HomeHero } from "@/components/hero/home-hero"
import { useDebounce } from "@/hooks/use-debounce"
export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(["All", ...data]))
      .catch(console.error)
  }, [])

  // Single fetch — avoids triple API storm on mount
  useEffect(() => {
    let cancelled = false

    async function loadRecipes() {
      setLoading(true)
      try {
        let data: Recipe[] = []
        if (debouncedSearchQuery.trim()) {
          data = await searchRecipes(debouncedSearchQuery)
        } else if (activeCategory !== "All") {
          data = await fetchRecipesByCategory(activeCategory)
        } else {
          data = await fetchRecipes()
        }
        if (!cancelled) setRecipes(data)
      } catch (error) {
        console.error("Failed to load recipes:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRecipes()
    return () => {
      cancelled = true
    }
  }, [debouncedSearchQuery, activeCategory])

  const emptyState = (
    <div className="py-20 text-center">
      <p className="font-editorial text-2xl text-foreground">Nothing here yet</p>
      <p className="mt-2 text-sm text-muted-foreground">Try another category or search.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HomeHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchLoading={loading}
      />

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-14">
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <RecipeGrid recipes={recipes} loading={loading} emptyState={emptyState} />
        </div>
      </section>
    </div>
  )
}
