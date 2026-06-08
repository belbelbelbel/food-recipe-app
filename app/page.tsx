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

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(["All", ...data]))
      .catch(console.error)
  }, [])

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
    <div className="py-24 text-center">
      <p className="font-editorial text-2xl text-foreground sm:text-3xl">Nothing here yet</p>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Try another category or search term.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas">
      <HomeHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchLoading={loading}
      />

      <section className="border-b border-border/20 bg-canvas py-8 sm:py-10">
        <div className="container-responsive">
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      <section id="recipes" className="container-responsive py-10 sm:py-14 lg:py-16">
        <RecipeGrid
          recipes={recipes}
          loading={loading}
          emptyState={emptyState}
          resetKey={`${activeCategory}-${debouncedSearchQuery}`}
        />
      </section>
    </div>
  )
}
