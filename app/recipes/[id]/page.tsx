"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, ChefHat } from "lucide-react"
import { fetchRecipeById, type RecipeDetail } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { AddToMealPlanDialog } from "@/components/add-to-meal-plan-dialog"

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      if (params.id) {
        try {
          setLoading(true)
          const data = await fetchRecipeById(params.id as string)
          setRecipe(data)
        } catch (error) {
          console.error("Failed to load recipe:", error)
          // Error is handled by API fallback
        } finally {
          setLoading(false)
        }
      }
    }
    loadRecipe()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="container max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="aspect-[16/9] bg-muted rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="min-h-screen py-12">
        <div className="container max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Recipe not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Hero Image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl mb-8 shadow-sm">
            <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" priority />
          </div>

          {/* Recipe Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                <ChefHat className="h-4 w-4" />
                {recipe.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {recipe.duration}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">{recipe.title}</h1>
            <AddToMealPlanDialog recipe={recipe}>
              <Button size="lg" className="rounded-full">
                Add to Meal Plan
              </Button>
            </AddToMealPlanDialog>
          </div>

          {/* Ingredients */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
            <div className="bg-secondary/50 rounded-2xl p-6">
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                    {index + 1}
                  </div>
                  <p className="text-foreground pt-2 text-pretty">{instruction}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  )
}
