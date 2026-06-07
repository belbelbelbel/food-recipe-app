"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fetchRecipes, searchRecipes, fetchRecipesByCategory, fetchCategories, type Recipe } from "@/lib/api"
import { RecipeGrid } from "@/components/recipe-grid"
import { FilterBar } from "@/components/filter-bar"
import { HomeHero } from "@/components/hero/home-hero"
import { useDebounce } from "@/hooks/use-debounce"
import { duration, easeOut } from "@/lib/motion"

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])
  const [searchLoading, setSearchLoading] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        const [recipesData, categoriesData] = await Promise.all([
          fetchRecipes(),
          fetchCategories(),
        ])
        setRecipes(recipesData)
        setCategories(["All", ...categoriesData])
      } catch (error) {
        console.error("Failed to load recipes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchQuery.trim()) {
        if (activeCategory === "All") {
          try {
            setSearchLoading(true)
            const data = await fetchRecipes()
            setRecipes(data)
          } catch (error) {
            console.error("Failed to load recipes:", error)
          } finally {
            setSearchLoading(false)
          }
        }
        return
      }

      try {
        setSearchLoading(true)
        const searchResults = await searchRecipes(debouncedSearchQuery)
        setRecipes(searchResults)
      } catch (error) {
        console.error("Failed to search recipes:", error)
      } finally {
        setSearchLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery, activeCategory])

  useEffect(() => {
    async function loadCategoryRecipes() {
      if (activeCategory === "All") {
        if (!searchQuery.trim()) {
          try {
            setLoading(true)
            const data = await fetchRecipes()
            setRecipes(data)
          } catch (error) {
            console.error("Failed to load recipes:", error)
          } finally {
            setLoading(false)
          }
        }
        return
      }

      if (searchQuery.trim()) return

      try {
        setLoading(true)
        const categoryRecipes = await fetchRecipesByCategory(activeCategory)
        setRecipes(categoryRecipes)
      } catch (error) {
        console.error("Failed to load category recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryRecipes()
  }, [activeCategory, searchQuery])

  const filteredRecipes = recipes.filter((recipe) => {
    if (searchQuery.trim()) return true
    return activeCategory === "All" || recipe.category === activeCategory
  })

  const isGridLoading = loading || searchLoading

  const emptyState = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-20 text-center"
    >
      <p className="font-editorial text-2xl text-foreground">Nothing here yet</p>
      <p className="mt-2 text-sm text-muted-foreground">Try another category or search.</p>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HomeHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchLoading={searchLoading}
      />

      {/* Menu section — Sweetgreen-style category + grid */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="mb-10 sm:mb-14"
          >
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </motion.div>

          <RecipeGrid
            recipes={filteredRecipes}
            loading={isGridLoading}
            emptyState={emptyState}
          />
        </div>
      </section>
    </div>
  )
}
