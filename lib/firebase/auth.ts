"use client"

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./config"

export type UserRole = "user" | "admin" | "moderator"

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

const USERS_COLLECTION = "users"

// Get current authenticated user
export function getCurrentUser(): User | null {
  if (!auth) return null
  return auth.currentUser
}

// Get current user ID
export function getCurrentUserId(): string | null {
  const user = getCurrentUser()
  return user?.uid || null
}

// Get user profile with role
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) return null

  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId))
    if (!userDoc.exists()) {
      return null
    }

    const data = userDoc.data()
    return {
      uid: userDoc.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role || "user",
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Get current user's role
export async function getCurrentUserRole(): Promise<UserRole> {
  const userId = getCurrentUserId()
  if (!userId) return "user"

  const profile = await getUserProfile(userId)
  return profile?.role || "user"
}

// Check if user has specific role
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin")
}

// Check if user is moderator or admin
export async function isModeratorOrAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole()
  return role === "moderator" || role === "admin"
}

// Sign up new user
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  if (!auth) throw new Error("Firebase Auth not initialized")

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Create user profile with default role
  if (db && userCredential.user) {
    await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: displayName || userCredential.user.displayName || null,
      role: "user", // Default role
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  return userCredential
}

// Sign in user
export async function signIn(email: string, password: string): Promise<UserCredential> {
  if (!auth) throw new Error("Firebase Auth not initialized")
  return signInWithEmailAndPassword(auth, email, password)
}

// Sign out user
export async function signOutUser(): Promise<void> {
  if (!auth) throw new Error("Firebase Auth not initialized")
  await signOut(auth)
}

// Auth state observer
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) return () => {}
  return onAuthStateChanged(auth, callback)
}

// Update user role (admin only)
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  // Check if current user is admin
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new Error("Only admins can update user roles")
  }

  const userRef = doc(db, USERS_COLLECTION, userId)
  await setDoc(
    userRef,
    {
      role: newRole,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, "displayName">>
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")

  const currentUserId = getCurrentUserId()
  if (currentUserId !== userId) {
    // Check if user is admin (admins can update any profile)
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      throw new Error("You can only update your own profile")
    }
  }

  const userRef = doc(db, USERS_COLLECTION, userId)
  await setDoc(
    userRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

