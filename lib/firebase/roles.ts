"use client"

/**
 * Role-based access control utilities
 * 
 * This file provides helper functions for checking user permissions
 * based on their role in the system.
 */

import { getCurrentUserRole, isAdmin, isModeratorOrAdmin } from "./auth"
import type { UserRole } from "./auth"

export type Permission = 
  | "mealPlans.create"
  | "mealPlans.read.own"
  | "mealPlans.read.all"
  | "mealPlans.update.own"
  | "mealPlans.update.all"
  | "mealPlans.delete.own"
  | "mealPlans.delete.all"
  | "recipes.create"
  | "recipes.moderate"
  | "users.manage"
  | "admin.access"

// Permission matrix: role -> permissions
const PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    "mealPlans.create",
    "mealPlans.read.own",
    "mealPlans.update.own",
    "mealPlans.delete.own",
  ],
  moderator: [
    "mealPlans.create",
    "mealPlans.read.own",
    "mealPlans.read.all",
    "mealPlans.update.own",
    "mealPlans.delete.own",
    "recipes.create",
    "recipes.moderate",
  ],
  admin: [
    "mealPlans.create",
    "mealPlans.read.own",
    "mealPlans.read.all",
    "mealPlans.update.own",
    "mealPlans.update.all",
    "mealPlans.delete.own",
    "mealPlans.delete.all",
    "recipes.create",
    "recipes.moderate",
    "users.manage",
    "admin.access",
  ],
}

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const role = await getCurrentUserRole()
  return PERMISSIONS[role]?.includes(permission) || false
}

/**
 * Check if user can create meal plans
 */
export async function canCreateMealPlans(): Promise<boolean> {
  return hasPermission("mealPlans.create")
}

/**
 * Check if user can read all meal plans (not just their own)
 */
export async function canReadAllMealPlans(): Promise<boolean> {
  return hasPermission("mealPlans.read.all")
}

/**
 * Check if user can update any meal plan (not just their own)
 */
export async function canUpdateAllMealPlans(): Promise<boolean> {
  return hasPermission("mealPlans.update.all")
}

/**
 * Check if user can delete any meal plan (not just their own)
 */
export async function canDeleteAllMealPlans(): Promise<boolean> {
  return hasPermission("mealPlans.delete.all")
}

/**
 * Check if user can manage other users
 */
export async function canManageUsers(): Promise<boolean> {
  return hasPermission("users.manage")
}

/**
 * Check if user can access admin features
 */
export async function canAccessAdmin(): Promise<boolean> {
  return hasPermission("admin.access")
}

/**
 * Check if user can moderate recipes
 */
export async function canModerateRecipes(): Promise<boolean> {
  return hasPermission("recipes.moderate")
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<Permission[]> {
  const role = await getCurrentUserRole()
  return PERMISSIONS[role] || []
}

