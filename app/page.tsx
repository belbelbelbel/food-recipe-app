"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fetchRecipes, type Recipe } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { LoadingCard } from "@/components/loading-card"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true)
      const data = await fetchRecipes()
      setRecipes(data)
      setLoading(false)
    }
    loadRecipes()
  }, [])

  const categories = ["All", ...Array.from(new Set(recipes.map((r) => r.category)))]

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || recipe.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-16 md:py-24">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Explore <span className="text-primary">Culinary</span> Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Discover delicious recipes from around the world, curated just for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold mb-8">
            What to <span className="text-primary">Cook</span>?
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recipes found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
