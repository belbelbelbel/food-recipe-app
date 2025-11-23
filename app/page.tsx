"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { fetchRecipes, searchRecipes, fetchRecipesByCategory, fetchCategories, type Recipe } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { LoadingCard } from "@/components/loading-card"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"
import { useDebounce } from "@/hooks/use-debounce"

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])
  const [searchLoading, setSearchLoading] = useState(false)

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Load initial recipes and categories
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

  // Search recipes when search query changes
  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchQuery.trim()) {
        // If search is empty, load default recipes
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

  // Filter by category
  useEffect(() => {
    async function loadCategoryRecipes() {
      if (activeCategory === "All") {
        // If "All" is selected and no search query, load default recipes
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

      // Don't filter by category if there's a search query
      if (searchQuery.trim()) {
        return
      }

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

  // Filter recipes locally (for category filter when search is active)
  const filteredRecipes = recipes.filter((recipe) => {
    // If searching, don't filter by category (API handles it)
    if (searchQuery.trim()) {
      return true
    }
    // If category filter is active, filter locally
    return activeCategory === "All" || recipe.category === activeCategory
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary/30 to-background padding-y-responsive">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-responsive-hero text-balance mb-4 sm:mb-6">
              Explore <span className="text-primary">Culinary</span> Insights
            </h1>
            <p className="text-responsive-subtitle text-muted-foreground text-pretty max-w-2xl">
              Discover delicious recipes from around the world, curated just for you. Perfect for every skill level and dietary preference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 border-b bg-background/95 backdrop-blur-sm">
        <div className="container-responsive">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col  gap-4 sm:gap-6 items-start sm:items-center justify-between">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterBar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="padding-y-responsive">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-responsive-title mb-2 sm:mb-4">
              What to <span className="text-primary">Cook</span>?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Browse our collection of {recipes.length} carefully curated recipes
              {activeCategory !== "All" && ` in ${activeCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </motion.div>

          {(loading || searchLoading) ? (
            <div className="grid-responsive">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid-responsive"
            >
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16 lg:py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl sm:text-8xl mb-4 opacity-20">🍽️</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No recipes found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  Try adjusting your search terms or selecting a different category to find delicious recipes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors focus-enhanced"
                    >
                      Clear search
                    </button>
                  )}
                  {activeCategory !== "All" && (
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="px-4 py-2 text-sm border border-border rounded-full hover:bg-accent hover:text-accent-foreground transition-colors focus-enhanced"
                    >
                      Show all categories
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
