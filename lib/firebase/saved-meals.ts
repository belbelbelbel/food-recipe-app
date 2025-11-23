"use client"

import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore"
import { db } from "./config"
import { getCurrentUserId } from "./auth"
import type { Recipe, RecipeDetail } from "../api"

const SAVED_MEALS_COLLECTION = "savedMeals"

export interface SavedMeal {
  id: string
  userId: string
  recipeId: string
  recipe: RecipeDetail
  savedAt: string
}

// Save a meal/recipe
export async function saveMeal(recipe: RecipeDetail): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  const userId = getCurrentUserId()
  if (!userId) {
    throw new Error("You must be signed in to save meals")
  }

  // Ensure image is always set (use placeholder if missing)
  const imageUrl = recipe.image && recipe.image.trim() !== "" && recipe.image !== "null" 
    ? recipe.image 
    : "/placeholder.svg"

  const savedMealRef = doc(collection(db, SAVED_MEALS_COLLECTION))
  
  await setDoc(savedMealRef, {
    userId,
    recipeId: recipe.id,
    recipe: {
      id: recipe.id,
      title: recipe.title,
      image: imageUrl,
      category: recipe.category || "Unknown",
      duration: recipe.duration || "N/A",
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
    },
    savedAt: serverTimestamp(),
  })
}

// Remove a saved meal
export async function unsaveMeal(recipeId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  const userId = getCurrentUserId()
  if (!userId) {
    throw new Error("You must be signed in to unsave meals")
  }

  // Find the saved meal
  const q = query(
    collection(db, SAVED_MEALS_COLLECTION),
    where("userId", "==", userId),
    where("recipeId", "==", recipeId)
  )

  const querySnapshot = await getDocs(q)
  
  if (querySnapshot.empty) {
    throw new Error("Saved meal not found")
  }

  // Delete all matching saved meals (should only be one)
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref))
  await Promise.all(deletePromises)
}

// Check if a meal is saved
export async function isMealSaved(recipeId: string): Promise<boolean> {
  if (!db) return false

  const userId = getCurrentUserId()
  if (!userId) return false

  try {
    const q = query(
      collection(db, SAVED_MEALS_COLLECTION),
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    )

    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty
  } catch (error) {
    console.error("Error checking if meal is saved:", error)
    return false
  }
}

// Get all saved meals for current user
export async function getSavedMeals(): Promise<SavedMeal[]> {
  if (!db) return []

  const userId = getCurrentUserId()
  if (!userId) return []

  try {
    const q = query(
      collection(db, SAVED_MEALS_COLLECTION),
      where("userId", "==", userId)
    )

    const querySnapshot = await getDocs(q)
    const savedMeals: SavedMeal[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const recipe = data.recipe || {}
      
      // Normalize recipe data and ensure image is always set
      const normalizedRecipe = {
        id: recipe.id || data.recipeId,
        title: recipe.title || "Unknown Recipe",
        image: (recipe.image && recipe.image.trim() !== "" && recipe.image !== "null") 
          ? recipe.image 
          : "/placeholder.svg",
        category: recipe.category || "Unknown",
        duration: recipe.duration || "N/A",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
      }
      
      savedMeals.push({
        id: doc.id,
        userId: data.userId,
        recipeId: data.recipeId,
        recipe: normalizedRecipe,
        savedAt: data.savedAt?.toDate?.()?.toISOString() || data.savedAt || new Date().toISOString(),
      })
    })

    // Sort by savedAt descending (most recent first)
    savedMeals.sort((a, b) => {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    })

    return savedMeals
  } catch (error) {
    console.error("Error fetching saved meals:", error)
    return []
  }
}

