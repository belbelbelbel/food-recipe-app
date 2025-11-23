"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type DocumentData,
  type QuerySnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { getUserProfile } from "./auth"
import { db } from "./config"
import { getCurrentUserId, getCurrentUserRole, isAdmin } from "./auth"
import type { Meal, RecipeDetail } from "../api"

// Re-export getCurrentUserId for use in this file
const getCurrentUserIdFromAuth = getCurrentUserId

export interface UserMealPlan {
  id: string
  userId: string
  title: string
  description: string
  image: string
  meals: Meal[]
  createdAt: string
  updatedAt: string
  isCustom: boolean
  collaborators?: string[] // Array of user IDs who have access
}

const MEAL_PLANS_COLLECTION = "mealPlans"
const MEALS_COLLECTION = "meals"

// Get current user ID with fallback
function getCurrentUserIdWithFallback(): string {
  if (typeof window === "undefined") return ""
  
  // Try to get from Firebase Auth first
  const authUserId = getCurrentUserIdFromAuth()
  if (authUserId) return authUserId
  
  // Fallback to session-based user ID for demo
  let userId = sessionStorage.getItem("flavoriz_user_id")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("flavoriz_user_id", userId)
  }
  return userId
}

// Create a new meal plan
export async function createMealPlan(
  title: string,
  description: string = "",
  image: string = "/healthy-meal-prep.png"
): Promise<UserMealPlan> {
  if (!db) throw new Error("Firestore not initialized")

  const userId = getCurrentUserIdWithFallback()
  if (!userId) {
    throw new Error("User must be authenticated to create meal plans")
  }

  const planRef = doc(collection(db, MEAL_PLANS_COLLECTION))
  const now = new Date().toISOString()

  const newPlan: Omit<UserMealPlan, "id"> = {
    userId,
    title,
    description,
    image,
    meals: [],
    createdAt: now,
    updatedAt: now,
    isCustom: true,
  }

  await setDoc(planRef, {
    ...newPlan,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: planRef.id,
    ...newPlan,
  }
}

// Get all meal plans for current user
export async function getUserMealPlans(): Promise<UserMealPlan[]> {
  if (!db) {
    // Fallback to localStorage if Firestore not initialized
    return getLocalStorageMealPlans()
  }

  try {
    const userId = getCurrentUserIdWithFallback()
    if (!userId) {
      console.log("No user ID found, returning empty array")
      return []
    }

    console.log("Fetching meal plans for user:", userId)

    // Get plans where user is owner
    let ownerPlansSnapshot
    try {
      const ownerQuery = query(
        collection(db, MEAL_PLANS_COLLECTION),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      )
      ownerPlansSnapshot = await getDocs(ownerQuery)
    } catch (orderByError: any) {
      // If orderBy fails (likely missing index), try without it
      console.warn("orderBy failed, trying without it:", orderByError)
      const ownerQuery = query(
        collection(db, MEAL_PLANS_COLLECTION),
        where("userId", "==", userId)
      )
      ownerPlansSnapshot = await getDocs(ownerQuery)
    }

    // Get plans where user is a collaborator
    // Note: Firestore doesn't support array-contains in where clauses easily,
    // so we'll fetch all plans and filter in code (for small datasets this is fine)
    let collaboratorPlansSnapshot
    try {
      const allPlansQuery = query(collection(db, MEAL_PLANS_COLLECTION))
      collaboratorPlansSnapshot = await getDocs(allPlansQuery)
    } catch (error) {
      console.warn("Failed to fetch collaborator plans:", error)
      collaboratorPlansSnapshot = { forEach: () => {} } as any
    }

    const plans: UserMealPlan[] = []
    const planIds = new Set<string>()

    // Add owner plans
    ownerPlansSnapshot.forEach((doc) => {
      const data = doc.data()
      const plan: UserMealPlan = {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description || "",
        image: data.image || "/healthy-meal-prep.png",
        meals: data.meals || [],
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        isCustom: data.isCustom ?? true,
        collaborators: data.collaborators || [],
      }
      plans.push(plan)
      planIds.add(doc.id)
    })

    // Add collaborator plans (where user is in collaborators array)
    collaboratorPlansSnapshot.forEach((doc) => {
      // Skip if already added as owner plan
      if (planIds.has(doc.id)) return

      const data = doc.data()
      const collaborators = data.collaborators || []
      
      // Check if current user is a collaborator
      if (Array.isArray(collaborators) && collaborators.includes(userId)) {
        const plan: UserMealPlan = {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description || "",
          image: data.image || "/healthy-meal-prep.png",
          meals: data.meals || [],
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
          isCustom: data.isCustom ?? true,
          collaborators: collaborators,
        }
        plans.push(plan)
        planIds.add(doc.id)
      }
    })

    // Sort by updatedAt manually if we couldn't use orderBy
    plans.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return dateB - dateA // Descending
    })

    console.log(`Found ${plans.length} meal plans for user ${userId}`)
    return plans
  } catch (error: any) {
    console.error("Error fetching user meal plans:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    
    // If it's a permission error, the user might not have a profile yet
    if (error.code === "permission-denied") {
      console.warn("Permission denied - user might need to create profile first")
    }
    
    // Fallback to localStorage
    return getLocalStorageMealPlans()
  }
}

// Get a single meal plan by ID
export async function getMealPlanById(planId: string): Promise<UserMealPlan | null> {
  if (!db) {
    const localPlans = getLocalStorageMealPlans()
    return localPlans.find((p) => p.id === planId) || null
  }

  try {
    const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
    const planSnap = await getDoc(planRef)

    if (!planSnap.exists()) {
      return null
    }

    const data = planSnap.data()
    const currentUserId = getCurrentUserIdWithFallback()
    
    // Check if user has access (owner, collaborator, or admin)
    // For curated plans (isCustom = false), allow access
    if (data.isCustom !== false) {
      const isOwner = data.userId === currentUserId
      const collaborators = data.collaborators || []
      const isCollaborator = Array.isArray(collaborators) && collaborators.includes(currentUserId)
      
      // If user is not owner, collaborator, or admin, check admin status
      if (!isOwner && !isCollaborator) {
        try {
          const userIsAdmin = await isAdmin()
          if (!userIsAdmin) {
            // User doesn't have access
            console.warn(`User ${currentUserId} doesn't have access to plan ${planId}`)
            return null
          }
        } catch (adminError) {
          // Admin check failed, deny access
          console.warn(`Admin check failed for plan ${planId}:`, adminError)
          return null
        }
      }
    }

    return {
      id: planSnap.id,
      userId: data.userId,
      title: data.title,
      description: data.description || "",
      image: data.image || "/healthy-meal-prep.png",
      meals: data.meals || [],
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      isCustom: data.isCustom ?? true,
      collaborators: data.collaborators || [],
    }
  } catch (error: any) {
    console.error("Error fetching meal plan:", error)
    // If it's a permission error, return null (user doesn't have access)
    if (error.code === "permission-denied") {
      console.warn("Permission denied accessing meal plan:", planId)
      return null
    }
    return null
  }
}

// Update meal plan
export async function updateMealPlan(
  planId: string,
  updates: Partial<Pick<UserMealPlan, "title" | "description" | "image">>
): Promise<void> {
  if (!db) {
    // Fallback to localStorage
    updateLocalStorageMealPlan(planId, updates)
    return
  }

  try {
    // Check ownership or admin role
    const plan = await getMealPlanById(planId)
    if (!plan) {
      throw new Error("Meal plan not found")
    }

    const currentUserId = getCurrentUserIdWithFallback()
    if (!currentUserId) {
      throw new Error("You must be signed in to update meal plans")
    }

    console.log("Updating meal plan:", {
      planId,
      planUserId: plan.userId,
      currentUserId,
      match: plan.userId === currentUserId
    })

    // Check if user owns the plan
    if (plan.userId !== currentUserId) {
      // Try to check if user is admin, but don't fail if profile doesn't exist
      try {
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          throw new Error("You don't have permission to update this meal plan")
        }
      } catch (adminError: any) {
        // If admin check fails (e.g., profile doesn't exist), check ownership only
        if (adminError.message?.includes("permission")) {
          throw adminError
        }
        throw new Error("You don't have permission to update this meal plan")
      }
    }

    const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
    await updateDoc(planRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    console.error("Error updating meal plan:", error)
    // Re-throw with a more user-friendly message
    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Make sure you own this meal plan and Firestore rules are deployed.")
    }
    throw error
  }
}

// Delete meal plan
export async function deleteMealPlan(planId: string): Promise<void> {
  if (!db) {
    // Fallback to localStorage
    deleteLocalStorageMealPlan(planId)
    return
  }

  try {
    // Check ownership or admin role
    const plan = await getMealPlanById(planId)
    if (!plan) {
      throw new Error("Meal plan not found")
    }

    const currentUserId = getCurrentUserIdWithFallback()
    if (!currentUserId) {
      throw new Error("You must be signed in to delete meal plans")
    }

    console.log("Deleting meal plan:", {
      planId,
      planUserId: plan.userId,
      currentUserId,
      match: plan.userId === currentUserId
    })

    // Check if user owns the plan
    if (plan.userId !== currentUserId) {
      // Try to check if user is admin, but don't fail if profile doesn't exist
      try {
        const userIsAdmin = await isAdmin()
        if (!userIsAdmin) {
          throw new Error("You don't have permission to delete this meal plan")
        }
      } catch (adminError: any) {
        // If admin check fails (e.g., profile doesn't exist), check ownership only
        if (adminError.message?.includes("permission")) {
          throw adminError
        }
        throw new Error("You don't have permission to delete this meal plan")
      }
    }

    const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
    await deleteDoc(planRef)
  } catch (error: any) {
    console.error("Error deleting meal plan:", error)
    // Re-throw with a more user-friendly message
    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Make sure you own this meal plan and Firestore rules are deployed.")
    }
    throw error
  }
}

// Add recipe to meal plan
export async function addRecipeToMealPlan(planId: string, recipe: RecipeDetail): Promise<void> {
  if (!db) {
    // Fallback to localStorage
    addRecipeToLocalStorageMealPlan(planId, recipe)
    return
  }

  try {
    const plan = await getMealPlanById(planId)
    if (!plan) {
      throw new Error("Meal plan not found")
    }

    // Check ownership, admin role, or collaborator
    const currentUserId = getCurrentUserIdWithFallback()
    if (!currentUserId) {
      throw new Error("You must be signed in to add recipes to meal plans")
    }

    const userIsAdmin = await isAdmin().catch(() => false)
    const isOwner = plan.userId === currentUserId
    const isCollaborator = plan.collaborators?.includes(currentUserId) || false

    if (!isOwner && !userIsAdmin && !isCollaborator) {
      throw new Error("You don't have permission to modify this meal plan")
    }

    // Check if recipe already exists
    const existingMeal = plan.meals.find((m) => m.recipeId === recipe.id)
    if (existingMeal) {
      throw new Error("Recipe already in this meal plan")
    }

    const newMeal: Meal = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: recipe.title,
      image: recipe.image,
      duration: recipe.duration,
      recipeId: recipe.id,
    }

    const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
    await updateDoc(planRef, {
      meals: [...plan.meals, newMeal],
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error adding recipe to meal plan:", error)
    throw error
  }
}

// Remove meal from meal plan
export async function removeMealFromPlan(planId: string, mealId: string): Promise<void> {
  if (!db) {
    // Fallback to localStorage
    removeMealFromLocalStorageMealPlan(planId, mealId)
    return
  }

  try {
    const plan = await getMealPlanById(planId)
    if (!plan) {
      throw new Error("Meal plan not found")
    }

    const updatedMeals = plan.meals.filter((m) => m.id !== mealId)
    const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
    await updateDoc(planRef, {
      meals: updatedMeals,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error removing meal from plan:", error)
    throw error
  }
}

// Duplicate meal plan
export async function duplicateMealPlan(planId: string): Promise<UserMealPlan> {
  const plan = await getMealPlanById(planId)
  if (!plan) {
    throw new Error("Meal plan not found")
  }

  return createMealPlan(
    `${plan.title} (Copy)`,
    plan.description,
    plan.image
  ).then(async (newPlan) => {
    // Copy all meals to new plan
    if (plan.meals.length > 0) {
      const planRef = doc(db!, MEAL_PLANS_COLLECTION, newPlan.id)
      await updateDoc(planRef, {
        meals: plan.meals.map((meal) => ({
          ...meal,
          id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
        updatedAt: serverTimestamp(),
      })
      newPlan.meals = plan.meals
    }
    return newPlan
  })
}

// LocalStorage fallback functions
function getLocalStorageMealPlans(): UserMealPlan[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("flavoriz_user_meal_plans")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load meal plans from localStorage:", error)
  }
  return []
}

function updateLocalStorageMealPlan(
  planId: string,
  updates: Partial<Pick<UserMealPlan, "title" | "description" | "image">>
): void {
  const plans = getLocalStorageMealPlans()
  const planIndex = plans.findIndex((p) => p.id === planId)
  if (planIndex !== -1) {
    plans[planIndex] = {
      ...plans[planIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("flavoriz_user_meal_plans", JSON.stringify(plans))
  }
}

function deleteLocalStorageMealPlan(planId: string): void {
  const plans = getLocalStorageMealPlans()
  const filtered = plans.filter((p) => p.id !== planId)
  localStorage.setItem("flavoriz_user_meal_plans", JSON.stringify(filtered))
}

function addRecipeToLocalStorageMealPlan(planId: string, recipe: RecipeDetail): void {
  const plans = getLocalStorageMealPlans()
  const plan = plans.find((p) => p.id === planId)
  if (plan) {
    const existingMeal = plan.meals.find((m) => m.recipeId === recipe.id)
    if (existingMeal) {
      throw new Error("Recipe already in this meal plan")
    }

    const newMeal: Meal = {
      id: `meal_${Date.now()}`,
      title: recipe.title,
      image: recipe.image,
      duration: recipe.duration,
      recipeId: recipe.id,
    }

    plan.meals.push(newMeal)
    plan.updatedAt = new Date().toISOString()
    localStorage.setItem("flavoriz_user_meal_plans", JSON.stringify(plans))
  }
}

function removeMealFromLocalStorageMealPlan(planId: string, mealId: string): void {
  const plans = getLocalStorageMealPlans()
  const plan = plans.find((p) => p.id === planId)
  if (plan) {
    plan.meals = plan.meals.filter((m) => m.id !== mealId)
    plan.updatedAt = new Date().toISOString()
    localStorage.setItem("flavoriz_user_meal_plans", JSON.stringify(plans))
  }
}


// Add collaborator to meal plan
export async function addCollaboratorToMealPlan(planId: string, collaboratorUserId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  const currentUserId = getCurrentUserIdWithFallback()
  if (!currentUserId) {
    throw new Error("You must be signed in to add collaborators")
  }

  const plan = await getMealPlanById(planId)
  if (!plan) {
    throw new Error("Meal plan not found")
  }

  if (plan.userId !== currentUserId) {
    throw new Error("Only the plan owner can add collaborators")
  }

  if (collaboratorUserId === currentUserId) {
    throw new Error("You cannot add yourself as a collaborator")
  }

  const currentCollaborators = plan.collaborators || []
  if (currentCollaborators.includes(collaboratorUserId)) {
    throw new Error("User is already a collaborator")
  }

  const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
  await updateDoc(planRef, {
    collaborators: [...currentCollaborators, collaboratorUserId],
    updatedAt: serverTimestamp(),
  })
}

// Remove collaborator from meal plan
export async function removeCollaboratorFromMealPlan(planId: string, collaboratorUserId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  const currentUserId = getCurrentUserIdWithFallback()
  if (!currentUserId) {
    throw new Error("You must be signed in to remove collaborators")
  }

  const plan = await getMealPlanById(planId)
  if (!plan) {
    throw new Error("Meal plan not found")
  }

  if (plan.userId !== currentUserId) {
    throw new Error("Only the plan owner can remove collaborators")
  }

  const currentCollaborators = plan.collaborators || []
  const updatedCollaborators = currentCollaborators.filter((id) => id !== collaboratorUserId)

  const planRef = doc(db, MEAL_PLANS_COLLECTION, planId)
  await updateDoc(planRef, {
    collaborators: updatedCollaborators,
    updatedAt: serverTimestamp(),
  })
}

// Search users by email
export async function searchUsersByEmail(emailQuery: string): Promise<Array<{ uid: string; email: string; displayName?: string }>> {
  if (!db) return []

  if (!emailQuery || emailQuery.trim().length < 2) {
    return []
  }

  try {
    const usersRef = collection(db, "users")
    const querySnapshot = await getDocs(usersRef)
    const results: Array<{ uid: string; email: string; displayName?: string }> = []

    const queryLower = emailQuery.toLowerCase().trim()

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const email = data.email?.toLowerCase() || ""
      const displayName = data.displayName?.toLowerCase() || ""

      if (email.includes(queryLower) || displayName.includes(queryLower)) {
        results.push({
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
        })
      }
    })

    return results.slice(0, 10)
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}
